import assert from "node:assert/strict";
import test from "node:test";
import { classifyPackageEntry, directSources } from "./source-routing.mjs";

test("native migration cohort supersedes only duplicate root claims and payments", () => {
  const sources = directSources([
    { name: "Migration_Crosswalk.csv", type: "migration_crosswalk", content: "crosswalk" },
    { name: "PM_Legacy_Charges.csv", type: "legacy_pm_charges", content: "legacy charges" },
    { name: "RCM_New_Charges.csv", type: "rcm_new_charges", content: "new charges" },
    { name: "Legacy_Cash.csv", type: "legacy_cash", content: "legacy cash" },
    { name: "New_Cash.tsv", type: "new_cash", content: "new cash" },
    { name: "Claims.csv", type: "claims", content: "derived claims" },
    { name: "Payments.csv", type: "payments", content: "derived payments" },
    { name: "AR_Snapshot.csv", type: "ar_snapshot", content: "root ar control" },
    { name: "GL_Monthly.csv", type: "general_ledger", content: "root gl control" },
    { name: "Bank_Deposits.csv", type: "bank_deposits", content: "root bank control" },
    { name: "Provider_Roster.csv", type: "provider_roster", content: "root reference control" },
    { name: "Service_Line_History.csv", type: "service_line_history", content: "root reference control" },
    { name: "Payer_Contract_Reference.csv", type: "payer_contract_reference", content: "root reference control" },
    { name: "Ownership_Site_History.csv", type: "ownership_site_history", content: "root reference control" }
  ]);

  assert.deepEqual(sources.map((source) => source.type), [
    "migration_crosswalk", "legacy_pm_charges", "rcm_new_charges", "legacy_cash", "new_cash",
    "ar_snapshot", "general_ledger", "bank_deposits", "provider_roster", "service_line_history",
    "payer_contract_reference", "ownership_site_history"
  ]);
  assert.ok(!sources.some((source) => source.type === "claims" || source.type === "payments"));
});

test("native filenames classify before ordinary derived populations", () => {
  assert.equal(classifyPackageEntry("Challenge/PM_Legacy_Charges.csv"), "legacy_pm_charges");
  assert.equal(classifyPackageEntry("Challenge/RCM_New_Charges.csv"), "rcm_new_charges");
  assert.equal(classifyPackageEntry("Challenge/New_Cash.tsv"), "new_cash");
});
