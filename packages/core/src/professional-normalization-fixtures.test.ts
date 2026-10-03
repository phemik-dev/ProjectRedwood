import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { analyze, ingestCsvSources, type MethodProfile, type SourceType } from "./index.js";

const fixture = (path: string) => new URL(`../../../fixtures/${path}`, import.meta.url);
const text = (path: string) => readFile(fixture(path), "utf8");

const method: MethodProfile = {
  id: "professional-normalization-fixture",
  name: "Professional normalization fixture method",
  version: "0.1.0",
  status: "synthetic-testing-only",
  arithmeticToleranceCents: 1n,
  ageingBasis: "service_date",
  recoveryMethod: "global_rate",
  recoveryRates: {}
};

function scoped(dealId: string) {
  return {
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
  };
}

async function sources(root: string, entries: Array<[string, SourceType]>) {
  return Promise.all(entries.map(async ([name, type]) => ({ name, type, content: await text(`${root}/${name}`) })));
}

test("PROF-NORM-PROVIDER-001 retains review-required evidence but authors no approval", async () => {
  const root = "prof-norm-provider-001";
  const semantics = JSON.parse(await text(`${root}/Proof_Semantics.json`));
  const truth = await text(`${root}/Validation_Truth.csv`);
  const deal = ingestCsvSources("PROF-NORM-PROVIDER-001", await sources(root, [
    ["claims.csv", "claims"], ["payments.csv", "payments"], ["ar_snapshot.csv", "ar_snapshot"],
    ["gl_cash.csv", "general_ledger"], ["bank_deposits.csv", "bank_deposits"], ["provider_roster.csv", "provider_roster"]
  ]));
  const result = analyze(deal, method, scoped("PROF-NORM-PROVIDER-001"));
  const provider = result.revenueSustainability.provider.find((row) => row.id === "PRV-PROF-001");
  const departure = result.providerSustainability.find((row) => row.provider === "PRV-PROF-001");

  assert.equal(semantics.proofId, "PROF-NORM-PROVIDER-001");
  assert.equal(semantics.intakeDisposition, "excluded_post_run_proof_artifact");
  assert.equal(semantics.initialTruthState, "review_required");
  assert.equal(semantics.professionalApprovalRecord, null);
  assert.deepEqual(semantics.permittedTerminalTruthStates, ["approved_for_normalization", "rejected"]);
  assert.equal(provider?.evidenceState, "review_required");
  assert.equal(departure?.preDepartureGrossCharge, 100000n);
  assert.equal(departure?.postDepartureGrossCharge, 200000n);
  assert.equal(departure?.postDepartureClaimCount, 1);
  assert.equal(result.adjustmentTotal, 0n);
  assert.match(truth, /Automatic_Normalization_Amount,0\.00/);
  assert.match(truth, /Professional_Approval_Record_Count,0/);
  assert.match(semantics.invalidationAssertions.join(" "), /successor run/i);
});

test("PROF-NORM-PAYER-001 retains evidence-only raw payer movement and blocks approval", async () => {
  const root = "prof-norm-payer-001";
  const semantics = JSON.parse(await text(`${root}/Proof_Semantics.json`));
  const truth = await text(`${root}/Validation_Truth.csv`);
  const deal = ingestCsvSources("PROF-NORM-PAYER-001", await sources(root, [
    ["claims.csv", "claims"], ["payments.csv", "payments"], ["ar_snapshot.csv", "ar_snapshot"],
    ["gl_cash.csv", "general_ledger"], ["bank_deposits.csv", "bank_deposits"], ["payer_contract_reference.csv", "payer_contract_reference"]
  ]));
  const result = analyze(deal, method, scoped("PROF-NORM-PAYER-001"));
  const atlas = result.revenueSustainability.payer.find((row) => row.id === "Atlas Commercial");
  const state = result.revenueSustainability.payer.find((row) => row.id === "State Medicaid");

  assert.equal(semantics.proofId, "PROF-NORM-PAYER-001");
  assert.equal(semantics.initialTruthState, "evidence_only");
  assert.equal(semantics.professionalApprovalRecord, null);
  assert.deepEqual(semantics.permittedTerminalTruthStates, []);
  assert.ok(semantics.blockingPreconditions.some((item: string) => /canonicalization\/crosswalk authority/i.test(item)));
  assert.equal(atlas?.evidenceState, "evidence_only");
  assert.equal(state?.evidenceState, "evidence_only");
  assert.equal(atlas?.prior?.allowed, 120000n);
  assert.equal(atlas?.current.allowed, 40000n);
  assert.equal(state?.prior?.allowed, 25000n);
  assert.equal(state?.current.allowed, 75000n);
  assert.equal(result.adjustmentTotal, 0n);
  assert.match(truth, /Payer_Canonicalization_Authority,absent/);
  assert.match(truth, /Automatic_Normalization_Amount,0\.00/);
  assert.match(truth, /Professional_Approval_Record_Count,0/);
});
