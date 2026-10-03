import { createHash } from "node:crypto";

const sourceTypes = new Set(["claims", "payments", "adjustments", "ar_snapshot", "general_ledger", "bank_deposits", "provider_roster", "service_line_history", "payer_contract_reference", "ownership_site_history", "migration_crosswalk", "legacy_pm_charges", "rcm_new_charges", "legacy_cash", "new_cash"]);
const custodyStatuses = new Set(["PHYSICALLY_HELD", "DERIVED_REPRODUCIBLE", "REACQUIRE_ON_DEMAND", "LICENSE_REQUIRED", "CONSENT_REQUIRED", "REFERENCE_ONLY", "NOT_YET_ACQUIRED"]);
const sourceUse = new Set(["permitted", "license_required", "consent_required", "reference_only"]);
const formats = new Set(["csv", "tsv", "xlsx", "json", "zip", "other"]);

export class SourceRegistryValidationError extends Error {
  constructor(errors) { super(`Invalid source registry:\n${errors.map((error) => `- ${error}`).join("\n")}`); this.name = "SourceRegistryValidationError"; this.errors = errors; }
}

function object(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function ids(items, label, errors) {
  const seen = new Set();
  for (const [index, item] of items.entries()) {
    if (!object(item) || typeof item.id !== "string" || !item.id) { errors.push(`${label}[${index}].id must be a non-empty string`); continue; }
    if (seen.has(item.id)) errors.push(`${label} has duplicate id ${item.id}`);
    seen.add(item.id);
  }
  return seen;
}
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (object(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
function assertKnown(fields, value, label, errors) {
  for (const key of Object.keys(value)) if (!fields.has(key)) errors.push(`${label} has unknown property ${key}`);
}

/** Offline validation only. This module does not acquire, fetch, or parse source bytes. */
export function validateSourceRegistry(registry) {
  const errors = [];
  if (!object(registry)) return ["registry must be an object"];
  assertKnown(new Set(["schemaVersion", "snapshotId", "sourceVersions", "artifacts", "adapters", "routingPolicies"]), registry, "registry", errors);
  if (registry.schemaVersion !== "redwood.source-registry/v1") errors.push("schemaVersion must equal redwood.source-registry/v1");
  if (typeof registry.snapshotId !== "string" || !registry.snapshotId) errors.push("snapshotId must be a non-empty string");
  for (const key of ["sourceVersions", "artifacts", "adapters", "routingPolicies"]) if (!Array.isArray(registry[key])) errors.push(`${key} must be an array`);
  if (errors.length) return errors;

  const sourceIds = ids(registry.sourceVersions, "sourceVersions", errors);
  const artifactIds = ids(registry.artifacts, "artifacts", errors);
  const adapterIds = ids(registry.adapters, "adapters", errors);
  ids(registry.routingPolicies, "routingPolicies", errors);

  for (const source of registry.sourceVersions) {
    if (!object(source)) continue;
    assertKnown(new Set(["id", "sourceId", "version", "provenanceClass", "rights", "custody", "reacquisition"]), source, `sourceVersion ${source.id}`, errors);
    if (typeof source.sourceId !== "string" || !source.sourceId) errors.push(`sourceVersion ${source.id} requires sourceId`);
    if (typeof source.version !== "string" || !source.version) errors.push(`sourceVersion ${source.id} requires version`);
    if (!object(source.rights) || !sourceUse.has(source.rights.use) || typeof source.rights.reviewRef !== "string" || !source.rights.reviewRef) errors.push(`sourceVersion ${source.id} requires valid rights use and reviewRef`);
    if (!object(source.custody) || !custodyStatuses.has(source.custody.status) || typeof source.custody.evidenceRef !== "string" || !source.custody.evidenceRef) errors.push(`sourceVersion ${source.id} requires valid custody status and evidenceRef`);
    if (!object(source.reacquisition) || typeof source.reacquisition.mode !== "string") errors.push(`sourceVersion ${source.id} requires reacquisition mode`);
    else if (source.reacquisition.mode !== "none" && typeof source.reacquisition.recipeRef !== "string") errors.push(`sourceVersion ${source.id} non-none reacquisition requires recipeRef`);
    if (["LICENSE_REQUIRED", "CONSENT_REQUIRED", "REFERENCE_ONLY"].includes(source.custody?.status) && source.rights?.use === "permitted") errors.push(`sourceVersion ${source.id} custody ${source.custody.status} cannot have permitted use`);
  }

  for (const adapter of registry.adapters) {
    if (!object(adapter)) continue;
    assertKnown(new Set(["id", "version", "formats", "networkAccess"]), adapter, `adapter ${adapter.id}`, errors);
    if (typeof adapter.version !== "string" || !adapter.version) errors.push(`adapter ${adapter.id} requires version`);
    if (!Array.isArray(adapter.formats) || !adapter.formats.length || adapter.formats.some((format) => !formats.has(format))) errors.push(`adapter ${adapter.id} has invalid formats`);
    if (adapter.networkAccess !== "forbidden") errors.push(`adapter ${adapter.id} must forbid network access`);
  }

  for (const artifact of registry.artifacts) {
    if (!object(artifact)) continue;
    assertKnown(new Set(["id", "sourceVersionId", "population", "format", "engineEligibility", "adapterId", "engineSourceType", "sha256", "derivesFromArtifactIds"]), artifact, `artifact ${artifact.id}`, errors);
    if (!sourceIds.has(artifact.sourceVersionId)) errors.push(`artifact ${artifact.id} references unknown sourceVersionId ${artifact.sourceVersionId}`);
    if (!adapterIds.has(artifact.adapterId)) errors.push(`artifact ${artifact.id} references unknown adapterId ${artifact.adapterId}`);
    if (typeof artifact.population !== "string" || !artifact.population) errors.push(`artifact ${artifact.id} requires population`);
    if (!formats.has(artifact.format)) errors.push(`artifact ${artifact.id} has invalid format`);
    if (!["ingestible", "reference_only", "test_only", "quarantined"].includes(artifact.engineEligibility)) errors.push(`artifact ${artifact.id} has invalid engineEligibility`);
    if (artifact.engineSourceType !== undefined && !sourceTypes.has(artifact.engineSourceType)) errors.push(`artifact ${artifact.id} has invalid engineSourceType ${artifact.engineSourceType}`);
    if (artifact.engineEligibility === "ingestible" && !artifact.engineSourceType) errors.push(`artifact ${artifact.id} ingestible artifact requires engineSourceType`);
    if (artifact.sha256 !== undefined && !/^[a-f0-9]{64}$/.test(artifact.sha256)) errors.push(`artifact ${artifact.id} sha256 must be lowercase hex`);
    for (const parent of artifact.derivesFromArtifactIds ?? []) if (!artifactIds.has(parent)) errors.push(`artifact ${artifact.id} references unknown parent artifact ${parent}`);
  }

  for (const policy of registry.routingPolicies) {
    if (!object(policy)) continue;
    assertKnown(new Set(["id", "requiresArtifactIds", "supersedesPopulations", "retainsEngineSourceTypes", "crosswalkPolicy"]), policy, `routingPolicy ${policy.id}`, errors);
    if (!Array.isArray(policy.requiresArtifactIds) || !policy.requiresArtifactIds.length) errors.push(`routingPolicy ${policy.id} requires at least one artifact`);
    for (const artifactId of policy.requiresArtifactIds ?? []) if (!artifactIds.has(artifactId)) errors.push(`routingPolicy ${policy.id} references unknown artifact ${artifactId}`);
    if (!Array.isArray(policy.supersedesPopulations)) errors.push(`routingPolicy ${policy.id} requires supersedesPopulations array`);
    if (!Array.isArray(policy.retainsEngineSourceTypes)) errors.push(`routingPolicy ${policy.id} requires retainsEngineSourceTypes array`);
    for (const type of policy.retainsEngineSourceTypes ?? []) if (!sourceTypes.has(type)) errors.push(`routingPolicy ${policy.id} retains invalid source type ${type}`);
    if (policy.crosswalkPolicy && !["none", "system_qualified_explicit"].includes(policy.crosswalkPolicy)) errors.push(`routingPolicy ${policy.id} has invalid crosswalkPolicy`);
  }
  return errors;
}

export function compileSourceRegistry(registry) {
  const errors = validateSourceRegistry(registry);
  if (errors.length) throw new SourceRegistryValidationError(errors);
  const sourceVersions = new Map(registry.sourceVersions.map((item) => [item.id, item]));
  const adapters = new Map(registry.adapters.map((item) => [item.id, item]));
  const artifacts = registry.artifacts.map((artifact) => ({
    artifactId: artifact.id, sourceVersionId: artifact.sourceVersionId, sourceId: sourceVersions.get(artifact.sourceVersionId).sourceId,
    population: artifact.population, format: artifact.format, engineEligibility: artifact.engineEligibility,
    engineSourceType: artifact.engineSourceType ?? null, adapterId: artifact.adapterId, adapterVersion: adapters.get(artifact.adapterId).version
  })).sort((a, b) => a.artifactId.localeCompare(b.artifactId));
  const routingPolicies = registry.routingPolicies.map((policy) => ({ ...policy, requiresArtifactIds: [...policy.requiresArtifactIds].sort(), supersedesPopulations: [...policy.supersedesPopulations].sort(), retainsEngineSourceTypes: [...policy.retainsEngineSourceTypes].sort() })).sort((a, b) => a.id.localeCompare(b.id));
  const policy = { schemaVersion: registry.schemaVersion, snapshotId: registry.snapshotId, artifacts, routingPolicies };
  return { policy, sha256: createHash("sha256").update(stable(policy)).digest("hex") };
}

export function resolveIngestibleArtifacts(registry, artifactIds) {
  const { policy, sha256 } = compileSourceRegistry(registry);
  const wanted = new Set(artifactIds);
  const artifacts = policy.artifacts.filter((artifact) => wanted.has(artifact.artifactId));
  if (artifacts.length !== wanted.size) throw new SourceRegistryValidationError(["requested unknown artifact ID"]);
  const blocked = artifacts.filter((artifact) => artifact.engineEligibility !== "ingestible");
  if (blocked.length) throw new SourceRegistryValidationError([`non-ingestible artifacts requested: ${blocked.map((artifact) => artifact.artifactId).join(", ")}`]);
  return { registrySnapshotId: registry.snapshotId, registryPolicySha256: sha256, artifacts };
}
