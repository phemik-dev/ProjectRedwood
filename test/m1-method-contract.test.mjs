import test from "node:test";
import assert from "node:assert/strict";
import {
  ageBucket,
  assertMethodContract,
  assertControls,
  assertReviewerDecision,
  loadJson
} from "../src/method/validate.mjs";

const method = loadJson("methodology/redwood-qor-v0.1.json");
const controls = loadJson("fixtures/m1/eng001-controls.json");
const decision = loadJson("fixtures/m1/reviewer-decision.sample.json");

test("method contract satisfies M1 safety invariants", () => {
  assert.equal(assertMethodContract(method), true);
  assert.equal(method.reconciliation_policy.auto_force_balance, false);
  assert.equal(method.accounting_basis.professional_approval.status, "pending");
  assert.equal(method.release_policy.client_release_requires_all_gates, true);
});

test("ENG001 controls remain exact to one cent", () => {
  assert.equal(assertControls(controls), true);
  assert.equal(controls.controls_cents.billed, 10964656);
  assert.equal(controls.controls_cents.expected_allowed, 6911688);
  assert.equal(controls.controls_cents.matched_cash, 5320559);
  assert.equal(controls.controls_cents.unmatched_cash, 32145);
  assert.equal(controls.controls_cents.open_ar, 1591129);
  assert.equal(controls.controls_cents.ar_120_plus, 902152);
});

test("known reconciliation differences stay open and unforced", () => {
  const findings = Object.fromEntries(method.known_eng001_findings.map(f => [f.id, f]));
  assert.equal(findings["ENG001-CASH-GL-ALL"].difference_cents, 75000);
  assert.equal(findings["ENG001-CASH-GL-MATCHED"].difference_cents, 107145);
  assert.equal(findings["ENG001-AR-GL"].difference_cents, 140501);
  assert.equal(findings["ENG001-AR-GL"].status, "open");
  assert.equal(method.reconciliation_policy.auto_force_balance, false);
});

test("aging boundaries are non-overlapping and exact", () => {
  const cases = new Map([[0,"0_30"],[30,"0_30"],[31,"31_60"],[60,"31_60"],[61,"61_90"],[90,"61_90"],[91,"91_120"],[120,"91_120"],[121,"120_plus"]]);
  for (const [days,bucket] of cases) assert.equal(ageBucket(days), bucket);
  assert.equal(ageBucket(-1), null);
});

test("review decision carries authority, rationale and evidence", () => {
  assert.equal(assertReviewerDecision(decision), true);
  assert.equal(decision.gate_id, "G3");
  assert.equal(decision.decision, "defer");
  assert.match(decision.rationale, /1,405\.01/);
});

test("release remains blocked pending professional approval", () => {
  assert.equal(method.accounting_basis.professional_approval.required_for_client_release, true);
  assert.equal(method.accounting_basis.professional_approval.status, "pending");
  assert.notEqual(method.accounting_basis.professional_approval.status, "approved");
});
