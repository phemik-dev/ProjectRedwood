import { sha256 } from "./hash.js";
import { parseCsv, stableRowId, type CsvRow } from "./csv.js";
import { parseMoney } from "./money.js";
import type { CanonicalDeal, CashEvent, Claim, GLRecord, LineageRecord, QuarantineRecord, Receivable, SourceType } from "./types.js";

export interface SourceFile { name: string; type: SourceType; content: string; }
const field = (row: CsvRow, names: string[]) => names.map((name) => row[name]).find((value) => value !== undefined);
const validDate = (value: string | undefined) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{4}-\d{2}$/.test(value);
function lineage(file: SourceFile, hash: string, index: number, raw: CsvRow): LineageRecord { return { sourceFileHash: hash, sourceFileName: file.name, sourceRowId: stableRowId(hash, index + 2), raw }; }
function unique<T extends { id: string }>(items: T[], item: T, type: SourceType, quarantine: QuarantineRecord): void { if (items.some((candidate) => candidate.id === item.id)) throw Object.assign(new Error("duplicate"), { quarantine }); items.push(item); }

export function ingestCsvSources(dealId: string, files: SourceFile[]): CanonicalDeal {
  const deal: CanonicalDeal = { dealId, claims: [], cashEvents: [], receivables: [], glRecords: [], quarantined: [] };
  const seenHashes = new Set<string>();
  for (const file of files) {
    const hash = sha256(file.content);
    if (seenHashes.has(hash)) { deal.quarantined.push({ sourceType: file.type, sourceRowId: `${hash}:file`, reason: "Duplicate file content", raw: {} }); continue; }
    seenHashes.add(hash);
    let rows: CsvRow[];
    try { rows = parseCsv(file.content); } catch (error) { deal.quarantined.push({ sourceType: file.type, sourceRowId: `${hash}:file`, reason: error instanceof Error ? error.message : "Invalid CSV", raw: {} }); continue; }
    rows.forEach((raw, index) => {
      const sourceRowId = stableRowId(hash, index + 2); const base = lineage(file, hash, index, raw);
      try {
        if (file.type === "claims") {
          const id = field(raw, ["claim_id", "Claim_ID", "Claim ID"]); if (!id) throw new Error("Missing claim ID");
          const serviceDate = field(raw, ["service_date", "DOS", "Date of Service"]); if (!validDate(serviceDate)) throw new Error("Invalid service date");
          const claim: Claim = { id, version: Number(field(raw, ["claim_version", "Claim_Version"]) ?? "1"), serviceDate, submissionDate: field(raw, ["claim_submission_date", "submission_date"]), payer: field(raw, ["payer", "Primary_Insurance"]), provider: field(raw, ["provider", "Provider_ID"]), location: field(raw, ["location", "Location"]), serviceLine: field(raw, ["service_line", "Service_Line"]), grossCharge: parseMoney(field(raw, ["gross_charge", "billed", "Billed"])), allowedAmount: parseMoney(field(raw, ["allowed_amount", "allowed", "Allowed"])), reportedRevenue: parseMoney(field(raw, ["reported_revenue", "revenue"])), lineage: base };
          unique(deal.claims, claim, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate claim/version", raw });
        } else if (file.type === "payments") {
          const id = field(raw, ["payment_id", "Payment_ID", "Payment ID"]); if (!id) throw new Error("Missing payment ID");
          const amount = parseMoney(field(raw, ["amount", "paid_amount", "Amt Paid"])); if (amount === undefined) throw new Error("Missing payment amount");
          const paymentDate = field(raw, ["payment_date", "Payment_Date"]); if (!validDate(paymentDate)) throw new Error("Invalid payment date");
          const cash: CashEvent = { id, claimId: field(raw, ["claim_id", "Claim_ID"]), type: (field(raw, ["cash_event_type", "type"]) as CashEvent["type"]) ?? "payer_payment", amount, paymentDate, payer: field(raw, ["payer", "Payer"]), lineage: base };
          unique(deal.cashEvents, cash, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate payment ID", raw });
        } else if (file.type === "ar_snapshot") {
          const id = field(raw, ["receivable_id", "ar_id", "Claim_ID", "claim_id"]); const snapshotDate = field(raw, ["snapshot_date", "Snapshot_Date"]); const balance = parseMoney(field(raw, ["balance", "open_ar", "Open AR"]));
          if (!id || !snapshotDate || balance === undefined) throw new Error("Missing receivable ID, snapshot date, or balance"); if (!validDate(snapshotDate)) throw new Error("Invalid A/R snapshot date");
          const receivable: Receivable = { id: `${id}:${snapshotDate}`, claimId: field(raw, ["claim_id", "Claim_ID"]) ?? id, snapshotDate, balance, ageBasis: (field(raw, ["age_basis"]) as Receivable["ageBasis"]) ?? "service_date", ageDays: Number(field(raw, ["age_days", "Age_Days"]) ?? "") || undefined, ageBucket: field(raw, ["age_bucket", "Age_Bucket"]), payer: field(raw, ["payer", "Payer"]), provider: field(raw, ["provider", "Provider_ID"]), location: field(raw, ["location", "Location"]), serviceLine: field(raw, ["service_line", "Service_Line"]), lineage: base };
          unique(deal.receivables, receivable, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate receivable snapshot row", raw });
        } else {
          const period = field(raw, ["period", "Month", "month"]); if (!period) throw new Error("Missing GL period");
          const record: GLRecord = { id: field(raw, ["gl_id", "GL_ID"]) ?? `${period}:${index + 2}`, period, netPatientRevenue: parseMoney(field(raw, ["net_patient_revenue", "revenue"])), cash: parseMoney(field(raw, ["cash", "gl_cash"])), matchedCash: parseMoney(field(raw, ["matched_cash", "gl_matched_cash"])), ar: parseMoney(field(raw, ["ar", "gl_ar"])), badDebt: parseMoney(field(raw, ["bad_debt", "GL Bad Debt"])), lineage: base };
          unique(deal.glRecords, record, file.type, { sourceType: file.type, sourceRowId, reason: "Duplicate GL record", raw });
        }
      } catch (error) { deal.quarantined.push({ sourceType: file.type, sourceRowId, reason: error instanceof Error ? error.message : "Invalid row", raw }); }
    });
  }
  return deal;
}
