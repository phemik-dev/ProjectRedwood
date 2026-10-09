import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const designPath = new URL("../apps/workbench/public/design-004/design.js", import.meta.url);

const baseRun = () => ({
  id: "run-001",
  dependencyFingerprint: "fingerprint-001",
  profile: { id: "qor-healthcare", version: "1.0.0" },
  scope: { dealId: "Deal 001", currency: "USD" },
  gates: [{ gate: "G7", status: "passed", rationale: "Authorized by the recorded reviewer." }],
  reconciliations: [],
  findings: [],
  sourceInventory: [],
  releaseRecords: []
});

const approvedRecord = () => ({
  decision: "approved",
  runId: "run-001",
  methodProfileId: "qor-healthcare",
  methodVersion: "1.0.0",
  dependencyFingerprint: "fingerprint-001",
  gateSnapshot: [{ gate: "G7", status: "passed" }]
});

async function renderDecision(run) {
  const source = await readFile(designPath, "utf8");
  const app = { innerHTML: "" };
  const document = {
    body: { classList: { toggle() {} } },
    addEventListener() {},
    getElementById(id) { return id === "app" ? app : null; },
    querySelector() { return null; }
  };
  const context = {
    URLSearchParams,
    Intl,
    document,
    location: { search: "", assign() {} },
    window: { scrollTo() {}, alert() {} },
    console
  };
  const executable = source.replace(
    /\nloadCanonicalRun\(\);\s*$/,
    "\nglobalThis.__design004Test = { setRun: value => { run = value; }, setLens: value => { state.lens = value; }, shell, conditionCopy, decision };"
  );
  vm.runInNewContext(executable, context, { filename: designPath.pathname });
  context.__design004Test.setRun(run);
  context.__design004Test.setLens("decision");
  context.__design004Test.shell();
  return { html: app.innerHTML, copy: context.__design004Test.conditionCopy(), card: context.__design004Test.decision() };
}

test("Design 004 renders recorded authorization only for a current approved release record", async () => {
  const run = baseRun();
  run.releaseRecords.push(approvedRecord());

  const rendered = await renderDecision(run);

  assert.equal(rendered.copy.state, "Release authorization recorded.");
  assert.match(rendered.html, /Release authorization recorded\./);
  assert.match(rendered.card, /Release authorization recorded\./);
  assert.doesNotMatch(rendered.html, /Release authorization unverified\./);
});

test("Design 004 renders unverified authorization for invalid release-record scenarios", async () => {
  const scenarios = [
    ["no G7 pass", run => { run.gates[0].status = "blocked"; run.releaseRecords.push(approvedRecord()); }],
    ["no release record", () => {}],
    ["wrong run", run => { const record = approvedRecord(); record.runId = "other-run"; run.releaseRecords.push(record); }],
    ["wrong profile", run => { const record = approvedRecord(); record.methodProfileId = "other-profile"; run.releaseRecords.push(record); }],
    ["wrong version", run => { const record = approvedRecord(); record.methodVersion = "2.0.0"; run.releaseRecords.push(record); }],
    ["stale dependency fingerprint", run => { const record = approvedRecord(); record.dependencyFingerprint = "stale"; run.releaseRecords.push(record); }],
    ["missing G7 snapshot", run => { const record = approvedRecord(); record.gateSnapshot = []; run.releaseRecords.push(record); }],
    ["invalidated record", run => { const record = approvedRecord(); record.invalidatedAt = "2026-01-01T00:00:00Z"; run.releaseRecords.push(record); }],
    ["both fingerprint bindings omitted", run => { delete run.dependencyFingerprint; const record = approvedRecord(); delete record.dependencyFingerprint; run.releaseRecords.push(record); }],
    ["both version bindings omitted", run => { delete run.profile.version; const record = approvedRecord(); delete record.methodVersion; run.releaseRecords.push(record); }],
    ["both fingerprint bindings empty", run => { run.dependencyFingerprint = ""; const record = approvedRecord(); record.dependencyFingerprint = ""; run.releaseRecords.push(record); }],
    ["both version bindings null", run => { run.profile.version = null; const record = approvedRecord(); record.methodVersion = null; run.releaseRecords.push(record); }]
  ];

  for (const [name, arrange] of scenarios) {
    const run = baseRun();
    arrange(run);
    const rendered = await renderDecision(run);

    assert.equal(rendered.copy.state, "Release authorization unverified.", name);
    assert.match(rendered.html, /Release authorization unverified\./, name);
    assert.match(rendered.card, /Release authorization unverified\./, name);
    assert.doesNotMatch(rendered.html, /Release authorization recorded\./, name);
  }
});
