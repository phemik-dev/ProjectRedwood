import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const designPath = new URL("../apps/workbench/public/design-004/design.js", import.meta.url);
const source = await readFile(designPath, "utf8");

const control = (id, arithmeticStatus = "difference", materialityStatus = "unset") => ({
  id,
  label: id === "ar-to-gl" ? "A/R snapshot to GL A/R" : "Cash receipts to GL cash",
  leftDefinition: id === "ar-to-gl" ? "A/R snapshot" : "Cash receipts",
  rightDefinition: id === "ar-to-gl" ? "GL A/R" : "GL cash",
  leftTotal: "10000",
  rightTotal: arithmeticStatus === "matched" ? "10000" : "87655",
  difference: arithmeticStatus === "matched" ? "0" : "12345",
  arithmeticStatus,
  ...(materialityStatus === undefined ? {} : { materialityStatus }),
  evidence: []
});

const baseRun = (id = "run-001") => ({
  id,
  dependencyFingerprint: "fingerprint-001",
  profile: { id: "qor-healthcare", version: "1.0.0" },
  scope: { dealId: "Deal 001", currency: "USD" },
  gates: [{ gate: "G7", status: "blocked" }],
  reconciliations: [control("ar-to-gl")],
  findings: [],
  sourceInventory: [],
  releaseRecords: []
});

async function load(response, requestedId = "run-001") {
  const app = { innerHTML: "" };
  const events = {};
  let fetchCount = 0;
  const context = {
    URLSearchParams,
    Intl,
    console,
    location: { search: `?run=${requestedId}`, assign() {} },
    window: { scrollTo() {}, alert() {} },
    document: {
      body: { classList: { toggle() {} } },
      getElementById() { return app; },
      querySelector() { return { focus() {} }; },
      addEventListener(type, handler) { events[type] = handler; }
    },
    fetch: async () => { fetchCount += 1; return { ok: true, status: 200, json: async () => response }; }
  };
  vm.runInNewContext(source, context, { filename: designPath.pathname });
  await new Promise(resolve => setImmediate(resolve));
  return {
    html: () => app.innerHTML,
    fetchCount: () => fetchCount,
    lens(name) { events.click({ target: { closest() { return { dataset: { action: `lens:${name}` } }; } } }); return app.innerHTML; }
  };
}

test("D02: materiality summary uses explicit unavailable, unset, mixed, and recorded states", async () => {
  const omittedControl = control("ar-to-gl");
  delete omittedControl.materialityStatus;
  const omitted = await load({ ...baseRun(), reconciliations: [omittedControl] });
  assert.match(omitted.html(), /Materiality <b>unavailable<\/b>/);
  assert.doesNotMatch(omitted.html(), /Materiality <b>recorded<\/b>/);

  const unset = await load({ ...baseRun(), reconciliations: [control("ar-to-gl", "difference", "unset")] });
  assert.match(unset.html(), /Materiality <b>unset<\/b>/);

  const mixed = await load({ ...baseRun(), reconciliations: [control("ar-to-gl", "difference", "unset"), control("cash-to-gl", "difference", "over-materiality")] });
  assert.match(mixed.html(), /Materiality <b>mixed<\/b>/);

  const recorded = await load({ ...baseRun(), reconciliations: [control("ar-to-gl", "difference", "within-materiality")] });
  assert.match(recorded.html(), /Materiality <b>recorded<\/b>/);
});

test("D03: A/R review and decision bind only to ar-to-gl and reflect its own state", async () => {
  const run = baseRun();
  run.reconciliations = [control("cash-to-gl", "difference", "unset"), control("ar-to-gl", "matched", "over-materiality")];
  const rendered = await load(run);

  const review = rendered.lens("review");
  const decision = rendered.lens("decision");
  assert.match(review, /canonical A\/R control records arithmetic agreement/);
  assert.match(review, />Arithmetic agreement<\/span>/);
  assert.doesNotMatch(review, /Derived · open finding/);
  assert.doesNotMatch(review, /What explains the \$123\.45 difference/);
  assert.match(decision, /A\/R snapshot to GL A\/R records arithmetic agreement\./);
  assert.match(decision, /Arithmetic agreement · materiality over-materiality recorded/);
  assert.doesNotMatch(decision, /A\/R difference remains visible/);
  assert.doesNotMatch(decision, /A\/R snapshot to GL A\/R remains unresolved/);
});

test("D04: loader rejects mismatched identities and malformed canonical response shapes", async () => {
  const mismatched = await load(baseRun("run-other"));
  assert.equal(mismatched.fetchCount(), 1);
  assert.match(mismatched.html(), /Canonical run unavailable/);
  assert.match(mismatched.html(), /identity does not match the requested run/);
  assert.doesNotMatch(mismatched.html(), /Deal 001/);

  const malformed = await load({ id: "run-001", scope: {}, profile: {}, gates: [], reconciliations: [], findings: [] });
  assert.equal(malformed.fetchCount(), 1);
  assert.match(malformed.html(), /Canonical run unavailable/);
  assert.match(malformed.html(), /missing sourceInventory/);
});

test("D04: loader rejects invalid required members inside canonical collections before rendering", async () => {
  const scenarios = [
    ["gate status", run => { run.gates = [{ gate: "G7" }]; }, /invalid gates\.status/],
    ["reconciliation identity", run => { run.reconciliations = [{ arithmeticStatus: "matched", evidence: [] }]; }, /invalid reconciliations\.id/],
    ["reconciliation evidence", run => { run.reconciliations = [{ ...control("ar-to-gl"), evidence: "not-an-array" }]; }, /invalid reconciliations\.evidence/],
    ["finding references", run => { run.findings = [{ id: "finding-1", status: "open", references: "not-an-array" }]; }, /invalid findings\.references/],
    ["source inventory hash", run => { run.sourceInventory = [{ name: "claims.csv" }]; }, /invalid sourceInventory\.hash/]
  ];

  for (const [name, arrange, expected] of scenarios) {
    const run = baseRun();
    arrange(run);
    const rendered = await load(run);
    assert.equal(rendered.fetchCount(), 1, name);
    assert.match(rendered.html(), /Canonical run unavailable/, name);
    assert.match(rendered.html(), expected, name);
    assert.doesNotMatch(rendered.html(), /Deal 001/, name);
  }
});
