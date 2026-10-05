import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analyze, ingestCsvSources, type MethodProfile, type SourceType } from "./index.js";

const fixture = (path: string) => new URL(`../../../fixtures/${path}`, import.meta.url);
const text = (path: string) => readFile(fixture(path), "utf8");

const method: MethodProfile = {
  id: "rr-evidence-fixture",
  name: "Revenue-recognition evidence fixture method",
  version: "0.1.0",
  status: "synthetic-testing-only",
  arithmeticToleranceCents: 1n,
  ageingBasis: "service_date",
  recoveryMethod: "global_rate",
  recoveryRates: {}
};

const scope = (dealId: string) => ({
  dealId,
  valuationDate: "2026-06-30",
  analysisPeriodStart: "2026-01-01",
  analysisPeriodEnd: "2026-06-30",
  priorComparableStart: "2025-01-01",
  priorComparableEnd: "2025-06-30",
  subsequentCashEnd: "2026-08-31",
  currency: "USD",
  entityScope: ["Synthetic physician group"],
  methodProfileId: method.id,
  methodVersion: method.version
});

type TruthContract = {
  scenarioId: string;
  intakeDisposition: string;
  authorizedTruthState: string;
  intakeSources: string[];
  metrics: { grossChargeCents: number; allowedAmountCents: number; observedCashCents: number };
  prohibited: string[];
  automaticNormalizationCents: number;
};

async function contract(root: string): Promise<TruthContract> {
  return JSON.parse(await text(`${root}/Truth_Contract.json`));
}

async function run(root: string) {
  const intake: Array<[string, SourceType]> = [["claims.csv", "claims"], ["payments.csv", "payments"]];
  const sources = await Promise.all(intake.map(async ([name, type]) => ({ name, type, content: await text(`${root}/${name}`) })));
  return analyze(ingestCsvSources(root.toUpperCase(), sources), method, scope(root.toUpperCase()));
}

for (const scenario of [
  "rr-cohort-curve-001",
  "rr-percent-charges-001",
  "rr-composite-001",
  "rr-segment-override-001"
]) {
  test(`${scenario.toUpperCase()} preserves fixture evidence without an automatic normalization`, async () => {
    const truth = await contract(scenario);
    const result = await run(scenario);

    assert.equal(truth.scenarioId, scenario.toUpperCase());
    assert.equal(truth.intakeDisposition, "excluded_post_run_truth_contract");
    assert.equal(truth.authorizedTruthState, "evidence_only");
    assert.deepEqual(truth.intakeSources, ["claims.csv", "payments.csv"]);
    assert.equal(result.grossCharge, BigInt(truth.metrics.grossChargeCents));
    assert.equal(result.allowedAmount, BigInt(truth.metrics.allowedAmountCents));
    assert.equal(result.observedCash, BigInt(truth.metrics.observedCashCents));
    assert.equal(result.adjustmentTotal, BigInt(truth.automaticNormalizationCents));
    assert.equal(truth.automaticNormalizationCents, 0);
    assert.ok(truth.prohibited.length >= 2);
  });
}

test("RR-COMPOSITE-001 retains separate components rather than deriving a composite", async () => {
  const truth = await contract("rr-composite-001") as TruthContract & { componentSignals: Array<{ id: string; value: number }> };
  assert.deepEqual(truth.componentSignals, [
    { id: "observed_cash_to_charge", value: 0.6 },
    { id: "allowed_to_charge", value: 0.8 }
  ]);
  assert.match(truth.prohibited.join(" "), /double count/i);
});

test("RR-SEGMENT-OVERRIDE-001 preserves observed segments without an override", async () => {
  const truth = await contract("rr-segment-override-001") as TruthContract & { observedSegments: Array<{ id: string; grossChargeCents: number; observedCashCents: number }> };
  const result = await run("rr-segment-override-001");

  assert.deepEqual(truth.observedSegments, [
    { id: "Imaging", grossChargeCents: 60000, observedCashCents: 50000 },
    { id: "Laboratory", grossChargeCents: 40000, observedCashCents: 30000 }
  ]);
  assert.deepEqual(result.serviceLineConcentration, [
    { serviceLine: "Imaging", grossCharge: 60000n },
    { serviceLine: "Laboratory", grossCharge: 40000n }
  ]);
  assert.match(truth.prohibited.join(" "), /override/i);
});
