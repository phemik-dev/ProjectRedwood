import { sha256 } from "./hash.js";
import { parseCsv, stableRowId, type CsvRow } from "./csv.js";
import { parseMoney } from "./money.js";
import { fieldForCanonical } from "./mapping.js";
import type { AdjustmentEvent, CanonicalDeal, CashEvent, Claim, GLRecord, LineageRecord, MappingDecision, QuarantineRecord, Receivable, SourceType } from "./types.js";

export interface SourceFile { name: string; type: SourceType; content: string; }
const field = (row: CsvRow, names: string[]) => names.map((name) => row[name]).find((value) => value !== undefined);
const validDate = (value: string | undefined) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{4}-\d{2}$/.test(value);
function classifyCashType(value: string | undefined): CashEvent["type"] { const normalized = (value ?? "").toLowerCase(); if (normalized.includes("unapplied")) return "unapplied_cash"; if (normalized.includes("patient")) return "patient_payment"; if (normalized.includes("refund")) return "refund"; if (normalized.includes("recoup")) return "recoupment"; if (normalized.includes("transfer")) return "transfer"; if (normalized.includes("secondary")) return "secondary_payer_payment"; return "payer_payment"; }
const forbiddenPhiHeaders = new Set(["patient_name", "patient name", "first_name", "last_name", "ssn", "social_security_number", "street_address", "address", "clinical_note", "clinical narrative"]);
function lineage(file: SourceFile, hash: string, index: number, raw: CsvRow): LineageRecord { return { sourceFileHash: hash, sourceFileName: file.name, sourceRowId: stableRowId(hash, index + 2), raw }; }
function unique<T extends { id: string }>(items: T[], item: T, type: SourceType, quarantine: QuarantineRecord): void { if (items.some((candidate) => candidate.id === item.id)) throw Object.assign(new Error("duplicate"), { quarantine }); items.push(item); }

export function ingestCsvSources(dealId: string, files: SourceFile[], mappingSet: MappingDecision[] = []): CanonicalDeal {
  const mappedField = (raw: CsvRow, sourceType: SourceType, canonical: string, fallback: string[]) => { const decision = mappingSet.find((item) => item.sourceType === sourceType && item.canonicalField === canonical && item.reviewStatus !== "rejected"); return decision ? raw[decision.sourceField] : field(raw, fallback); };
  const deal: CanonicalDeal = { dealId, claims: [], cashEvents: [], adjustmentEvents: [], receivables: [], glRecords: [], quarantined: [] };
  const seenHashes = new Set<string>();
  for (const file of files) {
    const hash = sha256(file.content);
    if (seenHashes.has(hash)) { deal.quarantined.push({ sourceType: file.type, sourceRowId: `${hash}:file`, reason: "Duplicate file content", raw: {} }); continue; }
    seenHashes.add(hash);
    let rows: CsvRow[];
    try { rows = parseCsv(file.content); } catch (error) { deal.quarantined.push({ sourceType: file.type, sourceRowId: `${hash}:file`, reason: error instanceof Error ? error.message : "Invalid CSV", raw: {} }); continue; }
    const headers = rows[0] ? Object.keys(rows[0]).map((header) => header.trim().toLowerCase()) : []; const forbidden = headers.filter((header) => forbiddenPhiHeaders.has(header)); if (forbidden.length) { deal.quarantined.push({ sourceType: file.type, sourceRowId: `${hash}:file`, reason: `PHI-exclusion policy blocked headers: ${forbidden.join(", ")}`, raw: {} }); continue; }
    rows.forEach((raw, index) => {
      const sourceRowId = stableRowId(hash, index + 2); const base = lineage(file, hash, index, raw);
      try {
        if (file.type === "claims") {
          const id = mappedField(raw, file.type, "claim_id", ["claim_id", "Claim_ID", "Claim ID"]); if (!id) throw new Error("Missing claim ID");
          const serviceDate = mappedField(raw, file.type, "service_date", ["service_date", "DOS", "Date of Service"]); if (!validDate(serviceDate)) throw new Error("Invalid service date");
          const version = Number(field(raw, ["claim_version", "Claim_Version"]) ?? "1"); const versionStatus = (field(raw, ["version_status", "claim_status", "Version_Status"]) as Claim["versionStatus"]) ?? "original"; const supersedes = field(raw, ["supersedes_version", "Supersedes_Version"]); const claim: Claim = { id, familyId: field(raw, ["claim_family_id", "Claim_Family_ID"]) ?? id, version, versionStatus, supersedesVersion: supersedes === undefined || supersedes === "" ? undefined : Number(supersedes), serviceDate, submissionDate: field(raw, ["claim_submission_date", "submission_date"]), payer: field(raw, ["payer", "Primary_Insurance"]), provider: field(raw, ["provider", "Provider_ID"]), location: field(raw, ["location", "Location"]), serviceLine: field(raw, ["service_line", "Service_Line"]), grossCharge: parseMoney(mappedField(raw, file.type, "gross_charge", ["gross_charge", "billed", "Billed", "Billed_Amount"])), allowedAmount: parseMoney(mappedField(raw, file.type, "allowed_amount", ["allowed_amount", "allowed", "Allowed", "Expected_Allowed_Amount"])),  reportedRevenue: parseMoney(field(raw, ["reported_revenue", "revenue"])), lineage: base };
          if (deal.claims.some((candidate) => candidate.id === claim.id && candidate.version === claim.version)) throw new Error("Duplicate claim/version"); deal.claims.push(claim);
        } else if (file.type === "payments") {
          const id = mappedField(raw, file.type, "payment_id", ["payment_id", "Payment_ID", "Payment ID"]); if (!id) throw new Error("Missing payment ID");
          const amount = parseMoney(mappedField(raw, file.type, "cash_amount", ["amount", "paid_amount", "Amt Paid", "Paid_Amount"])); if (amount === undefined) throw new Error("Missing payment amount");
          const paymentDate = mappedField(raw, file.type, "payment_date", ["payment_date", "Payment_Date"]); if (!validDate(paymentDate)) throw new Error("Invalid payment date");
          const cash: CashEvent = { id, claimId: mappedField(raw, file.type, "claim_id", ["claim_id", "Claim_ID"]), type: classifyCashType(mappedField(raw, file.type, "payment_type", ["cash_event_type", "type", "Payment_Type"])), amount, paymentDate, payer: mappedField(raw, file.type, "payer", ["payer", "Payer", "Payer_Raw"]), lineage: base };
          unique(deal.cashEvents, cash, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate payment ID", raw });
        } else if (file.type === "adjustments") {
          const id = field(raw, ["adjustment_id", "Adjustment_ID", "Adjustment ID"]); if (!id) throw new Error("Missing adjustment ID");
          const amount = parseMoney(field(raw, ["amount", "adjustment_amount", "Amt"])); if (amount === undefined) throw new Error("Missing adjustment amount");
          const postingDate = field(raw, ["posting_date", "Posting_Date"]); if (!validDate(postingDate)) throw new Error("Invalid adjustment posting date");
          const adjustment: AdjustmentEvent = { id, claimId: field(raw, ["claim_id", "Claim_ID"]), type: (field(raw, ["adjustment_type", "type"]) as AdjustmentEvent["type"]) ?? "other", amount, postingDate, payer: field(raw, ["payer", "Payer"]), lineage: base };
          unique(deal.adjustmentEvents, adjustment, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate adjustment ID", raw });
        } else if (file.type === "ar_snapshot") {
          const id = field(raw, ["receivable_id", "ar_id", "Claim_ID", "claim_id"]); const snapshotDate = mappedField(raw, file.type, "snapshot_date", ["snapshot_date", "Snapshot_Date"]); const balance = parseMoney(mappedField(raw, file.type, "ar_balance", ["balance", "open_ar", "Open AR", "Open_AR"]));
          if (!id || !snapshotDate || balance === undefined) throw new Error("Missing receivable ID, snapshot date, or balance"); if (!validDate(snapshotDate)) throw new Error("Invalid A/R snapshot date");
          const receivable: Receivable = { id: `${id}:${snapshotDate}`, claimId: field(raw, ["claim_id", "Claim_ID"]) ?? id, snapshotDate, balance, ageBasis: (field(raw, ["age_basis"]) as Receivable["ageBasis"]) ?? "service_date", ageDays: Number(field(raw, ["age_days", "Age_Days"]) ?? "") || undefined, ageBucket: field(raw, ["age_bucket", "Age_Bucket"]), payer: field(raw, ["payer", "Payer"]), provider: field(raw, ["provider", "Provider_ID"]), location: field(raw, ["location", "Location"]), serviceLine: field(raw, ["service_line", "Service_Line"]), lineage: base };
          unique(deal.receivables, receivable, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate receivable snapshot row", raw });
        } else {
          const period = mappedField(raw, file.type, "accounting_period", ["period", "Month", "month"]); if (!period) throw new Error("Missing GL period");
          const payerCash = parseMoney(field(raw, ["Payer_Cash_Collections"])); const patientCash = parseMoney(field(raw, ["Patient_Collections"])); const record: GLRecord = { id: field(raw, ["gl_id", "GL_ID"]) ?? `${period}:${index + 2}`, period, netPatientRevenue: parseMoney(field(raw, ["net_patient_revenue", "revenue", "Net_Patient_Revenue"])), cash: parseMoney(field(raw, ["cash", "gl_cash"])) ?? (payerCash === undefined && patientCash === undefined ? undefined : (payerCash ?? 0n) + (patientCash ?? 0n)), matchedCash: parseMoney(field(raw, ["matched_cash", "gl_matched_cash"])), ar: parseMoney(mappedField(raw, file.type, "gl_ar", ["ar", "gl_ar", "Ending_AR_Model"])),  badDebt: parseMoney(field(raw, ["bad_debt", "GL Bad Debt"])), lineage: base };
          unique(deal.glRecords, record, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate GL record", raw });
        }
      } catch (error) { deal.quarantined.push({ sourceType: file.type, sourceRowId, reason: error instanceof Error ? error.message : "Invalid row", raw }); }
    });
  }
  return deal;
}
