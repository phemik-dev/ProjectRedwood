import assert from "node:assert/strict";
import test from "node:test";
import { analyze, ingestCsvSources, type MethodProfile } from "./index.js";

const method: MethodProfile = {
  id: "provider-departure-test",
  name: "Provider departure test",
  version: "0.1.0",
  status: "synthetic-testing-only",
  arithmeticToleranceCents: 1n,
  ageingBasis: "service_date",
  recoveryMethod: "global_rate",
  recoveryRates: {}
};

const scope = {
  dealId: "PD-TEST",
  valuationDate: "2026-06-30",
  analysisPeriodStart: "2026-01-01",
  analysisPeriodEnd: "2026-06-30",
  subsequentCashEnd: "2026-08-31",
  currency: "USD",
  entityScope: ["Synthetic physician group"],
  methodProfileId: method.id,
  methodVersion: method.version
};

test("provider departure evidence separates valuation-bounded pre and post revenue without normalizing claims", () => {
  const deal = ingestCsvSources("PD-TEST", [
    { name: "claims.csv", type: "claims", content: "claim_id,service_date,billed,allowed,provider\nD1,2026-04-15,100.00,80.00,PRV-DEP\nD2,2026-04-16,200.00,160.00,PRV-DEP\nD3,2026-07-01,300.00,240.00,PRV-DEP\nA1,2026-05-01,50.00,40.00,PRV-ACTIVE" },
    { name: "provider_roster.csv", type: "provider_roster", content: "provider_id,fte,start_date,end_date,specialty\nPRV-DEP,1.0,2025-01-01,2026-04-15,Cardiology\nPRV-ACTIVE,0.8,2025-01-01,2026-12-31,Primary Care" }
  ]);

  const result = analyze(deal, method, scope);
  const departed = result.providerSustainability.find((item) => item.provider === "PRV-DEP");
  const active = result.providerSustainability.find((item) => item.provider === "PRV-ACTIVE");

  assert.equal(result.grossCharge, 35000n);
  assert.equal(departed?.grossCharge, 30000n);
  assert.equal(departed?.preDepartureGrossCharge, 10000n);
  assert.equal(departed?.postDepartureGrossCharge, 20000n);
  assert.equal(departed?.postDepartureClaimCount, 1);
  assert.equal(departed?.undatedGrossCharge, 0n);
  assert.equal(departed?.fte, 1);
  assert.equal(departed?.endDate, "2026-04-15");
  assert.equal(active?.grossCharge, 5000n);
  assert.equal(active?.endDate, "2026-12-31");
  assert.equal(active?.postDepartureGrossCharge, undefined);
  assert.equal(active?.preDepartureGrossCharge, undefined);
  assert.equal(deal.claims.length, 4);
});
