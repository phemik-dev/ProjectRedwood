/**
 * Data-estate registry validation only. This module neither acquires data nor
 * participates in canonical ingestion, analysis, reconciliation, or release.
 */
export type CustodyStatus = "PHYSICALLY_HELD" | "REPRODUCIBLY_ACQUIRABLE" | "REFERENCE_ONLY" | "LICENSE_REQUIRED" | "AUTHORED_REGRESSION" | "REAL_WORLD_REFERENCE" | "PRACTITIONER_BENCHMARK";
export type RightsStatus = "PUBLIC" | "PUBLIC_WITH_TERMS" | "ACCOUNT_REQUIRED" | "LICENSE_REQUIRED" | "RESTRICTED" | "INTERNAL" | "UNKNOWN";
export type AdapterStatus = "NOT_IMPLEMENTED" | "IMPLEMENTED" | "TESTED" | "SEMANTICALLY_VALIDATED" | "NOT_APPLICABLE";
export interface SourceRegistryEntry { source_id: string; source_authority: string; source_type: string; acquisition_mode: string; rights_status: RightsStatus; custody_status: CustodyStatus; canonical_location: string; semantic_role: string; adapter_status: AdapterStatus; verification: "VERIFIED" | "PARTIALLY_VERIFIED" | "UNVERIFIED" | "MISSING"; reacquisition_recipe: string | null; }
export interface SourceRegistry { registryVersion: string; estateRoot: string; sources: SourceRegistryEntry[]; }

const custody = new Set<CustodyStatus>(["PHYSICALLY_HELD", "REPRODUCIBLY_ACQUIRABLE", "REFERENCE_ONLY", "LICENSE_REQUIRED", "AUTHORED_REGRESSION", "REAL_WORLD_REFERENCE", "PRACTITIONER_BENCHMARK"]);
const rights = new Set<RightsStatus>(["PUBLIC", "PUBLIC_WITH_TERMS", "ACCOUNT_REQUIRED", "LICENSE_REQUIRED", "RESTRICTED", "INTERNAL", "UNKNOWN"]);
const adapters = new Set<AdapterStatus>(["NOT_IMPLEMENTED", "IMPLEMENTED", "TESTED", "SEMANTICALLY_VALIDATED", "NOT_APPLICABLE"]);
const verification = new Set<SourceRegistryEntry["verification"]>(["VERIFIED", "PARTIALLY_VERIFIED", "UNVERIFIED", "MISSING"]);
const requiredText = ["source_id", "source_authority", "source_type", "acquisition_mode", "canonical_location", "semantic_role"] as const;

export function validateSourceRegistry(registry: unknown): asserts registry is SourceRegistry {
  if (!registry || typeof registry !== "object" || Array.isArray(registry)) throw new Error("Source registry must be an object");
  const candidate = registry as Partial<SourceRegistry>;
  if (candidate.registryVersion !== "redwood-source-registry.v1") throw new Error("Unsupported source registry version");
  if (typeof candidate.estateRoot !== "string" || !candidate.estateRoot) throw new Error("Source registry requires estateRoot");
  if (!Array.isArray(candidate.sources) || !candidate.sources.length) throw new Error("Source registry requires at least one source");
  const ids = new Set<string>();
  for (const source of candidate.sources) {
    if (!source || typeof source !== "object") throw new Error("Source registry entry must be an object");
    for (const field of requiredText) if (typeof source[field] !== "string" || !source[field]) throw new Error(`Source registry entry incomplete: ${String(source.source_id ?? "unknown")} missing ${field}`);
    if (ids.has(source.source_id)) throw new Error(`Invalid or duplicate source id: ${source.source_id}`);
    ids.add(source.source_id);
    if (!rights.has(source.rights_status)) throw new Error(`Invalid rights status: ${source.source_id}`);
    if (!custody.has(source.custody_status)) throw new Error(`Invalid custody status: ${source.source_id}`);
    if (!adapters.has(source.adapter_status)) throw new Error(`Invalid adapter status: ${source.source_id}`);
    if (!verification.has(source.verification)) throw new Error(`Invalid verification status: ${source.source_id}`);
    if (source.reacquisition_recipe !== null && (typeof source.reacquisition_recipe !== "string" || !source.reacquisition_recipe)) throw new Error(`Invalid reacquisition recipe: ${source.source_id}`);
    if (source.custody_status === "REPRODUCIBLY_ACQUIRABLE" && !source.reacquisition_recipe) throw new Error(`Reacquirable source lacks recipe: ${source.source_id}`);
    if (source.rights_status === "LICENSE_REQUIRED" && source.acquisition_mode === "automated") throw new Error(`Licensed source cannot be automated: ${source.source_id}`);
  }
}
