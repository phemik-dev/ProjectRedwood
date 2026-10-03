import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { compileSourceRegistry, resolveIngestibleArtifacts, validateSourceRegistry } from "../scripts/source-registry.mjs";

const registryPath = new URL("../data-estate/source-registry.v1.json", import.meta.url);
const fixture = async () => JSON.parse(await readFile(registryPath, "utf8"));

test("canonical source registry validates and compiles deterministically", async () => {
  const registry = await fixture();
  assert.deepEqual(validateSourceRegistry(registry), []);
  const first = compileSourceRegistry(registry);
  const reordered = { ...registry, artifacts: [...registry.artifacts].reverse(), adapters: [...registry.adapters].reverse(), routingPolicies: [...registry.routingPolicies].reverse() };
  const second = compileSourceRegistry(reordered);
  assert.equal(first.sha256, second.sha256);
  assert.deepEqual(first.policy, second.policy);
});

test("registry rejects dangling adapters and non-ingestible source types", async () => {
  const registry = await fixture();
  registry.artifacts[0].adapterId = "missing-adapter";
  registry.artifacts[0].engineSourceType = "made_up_type";
  const errors = validateSourceRegistry(registry);
  assert.ok(errors.some((error) => error.includes("unknown adapterId missing-adapter")));
  assert.ok(errors.some((error) => error.includes("invalid engineSourceType made_up_type")));
});

test("registry rejects source rights that contradict restricted custody", async () => {
  const registry = await fixture();
  registry.sourceVersions[0].custody.status = "CONSENT_REQUIRED";
  registry.sourceVersions[0].rights.use = "permitted";
  assert.ok(validateSourceRegistry(registry).some((error) => error.includes("cannot have permitted use")));
});

test("registry rejects routing policies that reference unregistered artifacts", async () => {
  const registry = await fixture();
  registry.routingPolicies[0].requiresArtifactIds.push("unregistered-artifact");
  assert.ok(validateSourceRegistry(registry).some((error) => error.includes("references unknown artifact unregistered-artifact")));
});

test("resolved intake manifest admits only explicitly ingestible artifacts and carries frozen snapshot evidence", async () => {
  const registry = await fixture();
  const manifest = resolveIngestibleArtifacts(registry, ["challenge-f-crosswalk", "challenge-f-legacy-charges"]);
  assert.equal(manifest.registrySnapshotId, "redwood-source-registry-v1-initial");
  assert.match(manifest.registryPolicySha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(manifest.artifacts.map((artifact) => artifact.engineSourceType), ["migration_crosswalk", "legacy_pm_charges"]);
  assert.throws(() => resolveIngestibleArtifacts(registry, ["cms-provider-service-reference"]), /non-ingestible artifacts requested/);
});

test("registry enforces an adapter boundary without network permission", async () => {
  const registry = await fixture();
  registry.adapters[0].networkAccess = "allowed";
  assert.ok(validateSourceRegistry(registry).some((error) => error.includes("must forbid network access")));
});
