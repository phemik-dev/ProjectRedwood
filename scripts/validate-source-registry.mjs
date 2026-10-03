import { readFile } from "node:fs/promises";
import { compileSourceRegistry, SourceRegistryValidationError } from "./source-registry.mjs";

const path = process.argv[2];
if (!path) {
  console.error("Usage: node scripts/validate-source-registry.mjs <registry.json>");
  process.exitCode = 2;
} else {
  try {
    const registry = JSON.parse(await readFile(path, "utf8"));
    const { sha256 } = compileSourceRegistry(registry);
    console.log(JSON.stringify({ valid: true, snapshotId: registry.snapshotId, compiledPolicySha256: sha256 }));
  } catch (error) {
    const message = error instanceof SourceRegistryValidationError ? error.message : error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}
