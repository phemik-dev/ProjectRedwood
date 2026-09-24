import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function loadJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), "utf8"));
}

export function ageBucket(days) {
  if (!Number.isInteger(days) || days < 0) return null;
  if (days <= 30) return "0_30";
  if (days <= 60) return "31_60";
  if (days <= 90) return "61_90";
  if (days <= 120) return "91_120";
  return "120_plus";
}

export function assertMethodContract(method) {
  const failures = [];
  const gateIds = (method.review_gates ?? []).map(g => g.id);
  const expectedGates = ["G0","G1","G2","G3","G4","G5","G6","G7"];
  if (JSON.stringify(gateIds) !== JSON.stringify(expectedGates)) failures.push("review gates must be exactly G0-G7");
  if (method.reconciliation_policy?.auto_force_balance !== false) failures.push("auto_force_balance must be false");
  if (method.reconciliation_policy?.arithmetic_tolerance_cents !== 1) failures.push("arithmetic tolerance must be one cent");
  if (method.reconciliation_policy?.professional_materiality?.status !== "pending_reviewer") failures.push("professional materiality must remain reviewer-controlled");
  if (method.accounting_basis?.professional_approval?.required_for_client_release !== true) failures.push("professional approval must be required for client release");
  if (method.cutoff_policy?.subsequent_cash_in_observed_collections !== false) failures.push("subsequent cash must not be observed cash");
  if (method.ingestion_semantics?.blank_money !== "unknown_not_zero") failures.push("blank money must not silently become zero");
  if (method.ingestion_semantics?.parentheses !== "negative") failures.push("parentheses must preserve negative signs");
  if (method.recovery_policy?.only_one_primary_method_per_run !== true) failures.push("only one primary recovery method may be active per run");
  if (failures.length) throw new Error(failures.join("; "));
  return true;
}

export function assertControls(controls) {
  const c = controls.controls_cents ?? {};
  const expected = {
    billed: 10964656,
    expected_allowed: 6911688,
    matched_cash: 5320559,
    unmatched_cash: 32145,
    open_ar: 1591129,
    ar_120_plus: 902152
  };
  for (const [k,v] of Object.entries(expected)) {
    if (c[k] !== v) throw new Error(`ENG001 control mismatch for ${k}: expected ${v}, got ${c[k]}`);
  }
  const r = controls.reconciliation_cents ?? {};
  if (r.all_june_cash_to_gl_difference !== 75000) throw new Error("all cash-to-GL variance changed");
  if (r.matched_june_cash_to_gl_difference !== 107145) throw new Error("matched cash-to-GL variance changed");
  if (r.ar_to_gl_difference !== 140501) throw new Error("A/R-to-GL variance changed");
  return true;
}

export function assertReviewerDecision(decision) {
  const required = ["decision_id","deal_id","method_id","method_version","run_id","gate_id","decision","reviewer","timestamp","rationale","evidence_refs"];
  for (const key of required) {
    if (!(key in decision)) throw new Error(`reviewer decision missing ${key}`);
  }
  if (!["G0","G1","G2","G3","G4","G5","G6","G7"].includes(decision.gate_id)) throw new Error("invalid gate_id");
  if (!["approve","reject","override","defer"].includes(decision.decision)) throw new Error("invalid decision");
  if (!decision.reviewer?.name || !decision.reviewer?.role) throw new Error("reviewer identity incomplete");
  if (!decision.rationale?.trim()) throw new Error("rationale required");
  if (!Array.isArray(decision.evidence_refs) || decision.evidence_refs.length === 0) throw new Error("evidence_refs required");
  return true;
}

function main() {
  const method = loadJson("methodology/redwood-qor-v0.1.json");
  const controls = loadJson("fixtures/m1/eng001-controls.json");
  const decision = loadJson("fixtures/m1/reviewer-decision.sample.json");
  assertMethodContract(method);
  assertControls(controls);
  assertReviewerDecision(decision);
  const summary = {
    status: "PASS",
    method_id: method.method_id,
    method_version: method.method_version,
    engineering_status: method.status,
    professional_approval: method.accounting_basis.professional_approval.status,
    client_release_allowed: method.accounting_basis.professional_approval.status === "approved",
    known_open_findings: method.known_eng001_findings.filter(f => f.status === "open").map(f => f.id)
  };
  process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
