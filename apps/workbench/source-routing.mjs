import AdmZip from "adm-zip";
import { createHash } from "node:crypto";

const directSourceTypes = new Set([
  "claims", "payments", "adjustments", "ar_snapshot", "general_ledger", "bank_deposits", "provider_roster",
  "service_line_history", "payer_contract_reference", "ownership_site_history",
  "migration_crosswalk", "legacy_pm_charges", "rcm_new_charges", "legacy_cash", "new_cash"
]);
const nativeMigrationTypes = new Set(["migration_crosswalk", "legacy_pm_charges", "rcm_new_charges", "legacy_cash", "new_cash"]);
const nativePopulationTypes = new Set(["legacy_pm_charges", "rcm_new_charges", "legacy_cash", "new_cash"]);

export function classifyPackageEntry(name) {
  const lower = name.toLowerCase();
  if (lower.includes("migration_crosswalk")) return "migration_crosswalk";
  if (lower.includes("pm_legacy_charges")) return "legacy_pm_charges";
  if (lower.includes("rcm_new_charges")) return "rcm_new_charges";
  if (lower.includes("legacy_cash")) return "legacy_cash";
  if (lower.includes("new_cash")) return "new_cash";
  if (lower.includes("claims")) return "claims";
  if (lower.includes("payments")) return "payments";
  if (lower.includes("ar_snapshot")) return "ar_snapshot";
  if (lower.includes("gl_monthly") || lower.includes("gl_cash")) return "general_ledger";
  if (lower.includes("adjustment")) return "adjustments";
  if (lower.includes("bank_deposit")) return "bank_deposits";
  if (lower.includes("provider_roster")) return "provider_roster";
  if (lower.includes("service_line_history")) return "service_line_history";
  if (lower.includes("payer_contract_reference")) return "payer_contract_reference";
  if (lower.includes("ownership_site_history")) return "ownership_site_history";
  return null;
}

/**
 * Native PM/RCM claims and cash are authoritative only with their explicit
 * crosswalk. Supersede root claims/payments at that duplicated grain, while
 * retaining independent root A/R, GL, bank-deposit, and reference controls.
 */
export function selectCanonicalSources(candidates) {
  return candidates.some((source) => nativePopulationTypes.has(source.type))
    ? candidates.filter((source) => !["claims", "payments"].includes(source.type))
    : candidates;
}

export function directSources(files) {
  return selectCanonicalSources(files.filter((file) => directSourceTypes.has(file.type) && typeof file.content === "string"));
}

export function unpackChallengeZip(file) {
  const zip = new AdmZip(Buffer.from(file.content, "base64"));
  const inventory = [];
  const candidates = [];
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;
    const classification = classifyPackageEntry(entry.entryName);
    const bytes = entry.getData();
    const lower = entry.entryName.toLowerCase();
    const sourceHash = createHash("sha256").update(bytes).digest("hex");
    inventory.push({ name: entry.entryName, size: bytes.length, hash: sourceHash, classification: classification ?? (lower.includes("validation_truth") ? "truth_oracle_excluded" : "supporting"), format: lower.endsWith(".csv") ? "csv" : lower.endsWith(".tsv") ? "tsv" : "other" });
    if (classification && (lower.endsWith(".csv") || lower.endsWith(".tsv"))) candidates.push({ name: entry.entryName, type: classification, content: bytes.toString("utf8") });
  }
  return { sources: selectCanonicalSources(candidates), inventory };
}
