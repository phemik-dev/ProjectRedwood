import assert from "node:assert/strict";
import test from "node:test";
import { estimateRecovery, type RecoveryBoundary, type RecoveryTarget } from "./recovery.js";

const boundary: RecoveryBoundary = {
  asOfDate: "2026-06-30",
  reconstruction: { startDate: "2026-01-01", endDate: "2026-06-30" }
};
const target = (overrides: Partial<RecoveryTarget> = {}): RecoveryTarget => ({
  id: "AR-1",
  openBalanceCents: 10_000n,
  grossChargesCents: 40_000n,
  asOfDate: "2026-06-30",
  segment: { payer: "A", age: "0-30" },
  evidenceState: "observed",
  evidenceReferences: ["ar-row-1"],
  ...overrides
});

test("COLLECTION_DISTRIBUTION uses only reconstruction-window evidence and retains provenance", () => {
  const result = estimateRecovery([target()], {
    kind: "COLLECTION_DISTRIBUTION",
    observations: [
      { chargeCents: 20_000n, collectionCents: 15_000n, eventDate: "2026-02-15", evidenceState: "observed", evidenceReferences: ["cash-1"] },
      { chargeCents: 10_000n, collectionCents: 10_000n, eventDate: "2025-12-31", evidenceState: "observed", evidenceReferences: ["old-cash"] }
    ]
  }, boundary);
  assert.equal(result.totalExpectedRecoveryCents, 7_500n);
  assert.equal(result.estimates[0].evidenceState, "estimated");
  assert.deepEqual(result.estimates[0].evidence.map((item) => item.references), [["ar-row-1"], ["cash-1"]]);
});

test("PERCENT_OF_CHARGES uses exact cents and calls missing charge evidence out", () => {
  const result = estimateRecovery([target(), target({ id: "AR-2", grossChargesCents: undefined })], { kind: "PERCENT_OF_CHARGES", percent: "0.333" }, boundary);
  assert.equal(result.totalExpectedRecoveryCents, 13_320n);
  assert.deepEqual(result.excluded.map((item) => [item.targetId, item.reason]), [["AR-2", "missing_charges"]]);
});

test("COMPOSITE applies the first matching segment override and fallback once per target", () => {
  const result = estimateRecovery([target(), target({ id: "AR-2", segment: { payer: "B", age: "0-30" } })], {
    kind: "COMPOSITE",
    rules: [
      { segment: { payer: "A" }, method: { kind: "PERCENT_OF_CHARGES", percent: "0.10" } },
      { segment: { age: "0-30" }, method: { kind: "PERCENT_OF_CHARGES", percent: "0.50" } }
    ],
    fallback: { kind: "PERCENT_OF_CHARGES", percent: "0.20" }
  }, boundary);
  assert.deepEqual(result.estimates.map((item) => [item.targetId, item.method, item.segment, item.expectedRecoveryCents]), [
    ["AR-1", "COMPOSITE", { payer: "A" }, 4_000n],
    ["AR-2", "COMPOSITE", { age: "0-30" }, 20_000n]
  ]);
});

test("as-of mismatch and insufficient evidence are visible exclusions, not zeroed estimates", () => {
  const result = estimateRecovery([target({ id: "OLD", asOfDate: "2026-05-31" }), target({ id: "NO-EVIDENCE" })], {
    kind: "COLLECTION_DISTRIBUTION",
    observations: [{ chargeCents: 0n, collectionCents: 0n, eventDate: "2026-03-01", evidenceState: "insufficient", evidenceReferences: ["gap"] }]
  }, boundary);
  assert.equal(result.totalExpectedRecoveryCents, 0n);
  assert.deepEqual(result.excluded.map((item) => [item.targetId, item.reason]), [["OLD", "outside_as_of_boundary"], ["NO-EVIDENCE", "insufficient_method_evidence"]]);
  assert.equal(result.excluded[1].evidence[1].state, "insufficient");
});

test("reconstruction cannot reach beyond the as-of boundary", () => {
  assert.throws(() => estimateRecovery([target()], { kind: "PERCENT_OF_CHARGES", percent: 0.5 }, { asOfDate: "2026-06-30", reconstruction: { startDate: "2026-06-01", endDate: "2026-07-01" } }), /must end on or before/);
});
