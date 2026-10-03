import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { validateSourceRegistry, type SourceRegistry } from "./data-estate.js";

async function registryFixture(): Promise<SourceRegistry> {
  return JSON.parse(await readFile(new URL("../../../docs/evidence/redwood-source-registry.v1.json", import.meta.url), "utf8")) as SourceRegistry;
}

test("data estate registry separates custody, rights, recipe, and adapter state", async () => {
  const registry = await registryFixture();
  validateSourceRegistry(registry);
  assert.ok(registry.sources.some(source => source.source_id === "canonical_challenge_corpus" && source.custody_status === "PHYSICALLY_HELD"));
  assert.ok(registry.sources.some(source => source.source_id === "cms_pfs_reference" && source.custody_status === "REPRODUCIBLY_ACQUIRABLE" && source.reacquisition_recipe));
  assert.ok(registry.sources.some(source => source.source_id === "practitioner_qofr_workbook" && source.semantic_role.includes("not source data")));
});

test("registry validator rejects malformed runtime data deterministically", async () => {
  const registry = await registryFixture();
  const duplicate = structuredClone(registry); duplicate.sources.push(structuredClone(duplicate.sources[0]));
  assert.throws(() => validateSourceRegistry(duplicate), /duplicate source id/);

  const missingRecipe = structuredClone(registry); const publicSource = missingRecipe.sources.find(source => source.source_id === "cms_pfs_reference")!; publicSource.reacquisition_recipe = null;
  assert.throws(() => validateSourceRegistry(missingRecipe), /Reacquirable source lacks recipe/);

  const licensedAutomation = structuredClone(registry); const practitioner = licensedAutomation.sources.find(source => source.source_id === "practitioner_qofr_workbook")!; practitioner.rights_status = "LICENSE_REQUIRED"; practitioner.acquisition_mode = "automated";
  assert.throws(() => validateSourceRegistry(licensedAutomation), /Licensed source cannot be automated/);

  const invalidEnum = structuredClone(registry); invalidEnum.sources[0].adapter_status = "NETWORK_FETCH" as never;
  assert.throws(() => validateSourceRegistry(invalidEnum), /Invalid adapter status/);
});
