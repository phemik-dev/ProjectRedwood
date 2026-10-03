import { parseCsv, type CsvRow } from "./csv.js";
import { parseTsv } from "./tsv.js";
import { parseMoney } from "./money.js";

export type MigrationSourceSystem = "LEGACY_PM" | "NEW_RCM";
export interface MigrationCrosswalk { sourceSystem: MigrationSourceSystem; sourceProviderId: string; canonicalProviderId: string; sourceRowNumber: number; }
export interface MigrationSourceFile { name: string; content: string; }
export interface MigratedClaim { id: string; serviceDate: string; provider: string; sourceProviderId: string; location: string; payer?: string; serviceLine?: string; grossCharge?: bigint; allowedAmount?: bigint; lineageSource: string; sourceSystem: MigrationSourceSystem; }
export interface MigratedCash { id: string; claimId?: string; paymentDate: string; payer?: string; sourceEventType?: string; amount: bigint; lineageSource: string; sourceSystem: MigrationSourceSystem; }
export interface MigrationEvidence { crosswalk: MigrationCrosswalk[]; legacyClaims: MigratedClaim[]; newClaims: MigratedClaim[]; legacyCash: MigratedCash[]; newCash: MigratedCash[]; }

/** Parses the provider-key crosswalk; source identifiers remain system-qualified. */
export function parseMigrationCrosswalk(content: string): MigrationCrosswalk[] {
  const seen = new Map<string, string>();
  return parseCsv(content).map((row, index) => {
    const sourceSystem = row.Source_System as MigrationSourceSystem;
    const sourceProviderId = required(row, "Source_Provider_ID");
    const canonicalProviderId = required(row, "Canonical_Provider_ID");
    if (sourceSystem !== "LEGACY_PM" && sourceSystem !== "NEW_RCM") throw new Error(`Invalid migration source system at crosswalk row ${index + 2}`);
    const key = `${sourceSystem}:${sourceProviderId}`;
    const prior = seen.get(key);
    if (prior && prior !== canonicalProviderId) throw new Error(`Conflicting explicit crosswalk for ${key}`);
    if (prior) throw new Error(`Duplicate explicit crosswalk for ${key}`);
    seen.set(key, canonicalProviderId);
    return { sourceSystem, sourceProviderId, canonicalProviderId, sourceRowNumber: index + 2 };
  });
}
export function resolveMigrationProvider(crosswalk: MigrationCrosswalk[], system: MigrationSourceSystem, sourceProviderId: string): MigrationCrosswalk {
  const item = crosswalk.find((entry) => entry.sourceSystem === system && entry.sourceProviderId === sourceProviderId);
  if (!item) throw new Error(`Missing explicit crosswalk for ${system}:${sourceProviderId}`);
  return item;
}
export function normalizeLegacyChargeRow(row: CsvRow, crosswalk: MigrationCrosswalk[], lineageSource: string): MigratedClaim {
  const sourceProviderId = required(row, "rendering_provider");
  const match = resolveMigrationProvider(crosswalk, "LEGACY_PM", sourceProviderId);
  return { id: required(row, "legacy_claim_no"), serviceDate: required(row, "date_of_service"), provider: match.canonicalProviderId, sourceProviderId, location: required(row, "site"), payer: row.plan_name || undefined, serviceLine: row.Service_Line || undefined, grossCharge: money(row.charge_amt), allowedAmount: money(row.expected_amt), lineageSource, sourceSystem: "LEGACY_PM" };
}
export function normalizeNewChargeRow(row: CsvRow, crosswalk: MigrationCrosswalk[], lineageSource: string): MigratedClaim {
  const sourceProviderId = required(row, "ProviderKey");
  const match = resolveMigrationProvider(crosswalk, "NEW_RCM", sourceProviderId);
  return { id: required(row, "EncounterKey"), serviceDate: required(row, "SvcDate"), provider: match.canonicalProviderId, sourceProviderId, location: required(row, "DeptKey").replace(/^D-/, ""), payer: row.PrimaryPayer || undefined, serviceLine: row.Service_Line || undefined, grossCharge: money(row.GrossCharge), allowedAmount: money(row.ModeledAllowed), lineageSource, sourceSystem: "NEW_RCM" };
}
export function normalizeLegacyCashRow(row: CsvRow, lineageSource: string): MigratedCash { return { id: required(row, "cash_id"), claimId: row.legacy_claim_no || undefined, paymentDate: required(row, "post_date"), payer: row.payer || undefined, sourceEventType: row.cash_type || undefined, amount: requiredMoney(row.amount), lineageSource, sourceSystem: "LEGACY_PM" }; }
export function normalizeNewCashRow(row: CsvRow, lineageSource: string): MigratedCash { return { id: required(row, "TxnId"), claimId: row.EncounterKey || undefined, paymentDate: required(row, "PostedOn"), payer: row.Source || undefined, sourceEventType: row.TxnType || undefined, amount: requiredMoney(row.NetAmount), lineageSource, sourceSystem: "NEW_RCM" }; }
export function normalizeLegacyCharges(file: MigrationSourceFile, crosswalk: MigrationCrosswalk[]): MigratedClaim[] { return parseCsv(file.content).map((row) => normalizeLegacyChargeRow(row, crosswalk, file.name)); }
export function normalizeNewCharges(file: MigrationSourceFile, crosswalk: MigrationCrosswalk[]): MigratedClaim[] { return parseCsv(file.content).map((row) => normalizeNewChargeRow(row, crosswalk, file.name)); }
export function normalizeLegacyCash(file: MigrationSourceFile): MigratedCash[] { return parseCsv(file.content).map((row) => normalizeLegacyCashRow(row, file.name)); }
export function normalizeNewCash(file: MigrationSourceFile): MigratedCash[] { return parseTsv(file.content).map((row) => normalizeNewCashRow(row, file.name)); }
export function buildMigrationEvidence(files: Record<string, MigrationSourceFile>): MigrationEvidence { const crosswalk = parseMigrationCrosswalk(files.crosswalk.content); return { crosswalk, legacyClaims: normalizeLegacyCharges(files.legacyCharges, crosswalk), newClaims: normalizeNewCharges(files.newCharges, crosswalk), legacyCash: normalizeLegacyCash(files.legacyCash), newCash: normalizeNewCash(files.newCash) }; }
function required(row: CsvRow, field: string): string { const value = row[field]; if (!value) throw new Error(`Missing ${field}`); return value; }
function money(value: string | undefined): bigint | undefined { return parseMoney(value); }
function requiredMoney(value: string | undefined): bigint { const amount = parseMoney(value); if (amount === undefined) throw new Error("Missing amount"); return amount; }
