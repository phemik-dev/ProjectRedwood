import { deserialize, serialize } from "node:v8";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
const directory = new URL("./data/runs/", import.meta.url);
export async function loadRuns() { await mkdir(directory, { recursive: true }); const entries = await readdir(directory); const runs = new Map(); for (const entry of entries.filter((name) => name.endsWith(".bin"))) { const run = deserialize(await readFile(new URL(entry, directory))); runs.set(run.id, run); } return runs; }
export async function saveRun(run) { await mkdir(directory, { recursive: true }); await writeFile(new URL(`${run.id}.bin`, directory), serialize(run)); }
