import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { analyze, compileWorkbook, ingestCsvSources, reconcile, loadMethodProfile } from "./index.js";

/** Post-implementation synthetic proof pack. Its values are derived here rather than copied from ENG001/ENG002 truth sets. */
const files = [
  { name: "source_claims.csv", type: "claims" as const, content: "Claim ID,DOS,Billed,Allowed,Provider_ID,Location,Service_Line,Primary_Insurance\nHO-C1,2026-05-02,411.23,300.00,HO-PRV-A,HO-LOC-1,Primary Care,Medicare\nHO-C2,2026-05-16,289.77,210.00,HO-PRV-B,HO-LOC-2,Imaging,Commercial" },
  { name: "source_payments.csv", type: "payments" as const, content: "Payment_ID,Claim_ID,Payment_Date,Amt Paid,Payer,cash_event_type\nHO-P1,HO-C1,2026-05-20,250.00,Medicare,payer_payment\nHO-P2,HO-C2,2026-06-05,175.00,Commercial,payer_payment\nHO-P3,,2026-06-06,7.50,Unapplied,unapplied_cash" },
  { name: "source_ar.csv", type: "ar_snapshot" as const, content: "receivable_id,claim_id,snapshot_date,balance,age_bucket,age_days,payer\nHO-C1,HO-C1,2026-06-30,50.00,31-60,59,Medicare\nHO-C2,HO-C2,2026-06-30,35.00,0-30,45,Commercial" },
  { name: "source_gl.csv", type: "general_ledger" as const, content: "period,cash,ar\n2026-06,425.00,85.00" }
];
const method = await loadMethodProfile(join(process.cwd(), "../../methodology/synthetic-demo-scenario-v0.1.json"));
const deal = ingestCsvSources("HELDOUT-POST-IMPLEMENTATION", files); const analysis = analyze(deal, method); const { reconciliations, findings } = reconcile(deal, method); const root = join(process.cwd(), "../../artifacts"); await mkdir(root, { recursive: true }); const workbook = await compileWorkbook({ deal, analysis, reconciliations, findings, methodId: method.id, methodVersion: method.version, runId: "HELDOUT-POST-IMPLEMENTATION", recoveryRates: method.recoveryRates }); await writeFile(join(root, "held-out-r1-synthetic-scenario.xlsx"), workbook); const evidence = { dealId: deal.dealId, sourceFiles: files.map((file) => file.name), counts: { claims: deal.claims.length, cashEvents: deal.cashEvents.length, receivables: deal.receivables.length, quarantined: deal.quarantined.length }, reconciliationCount: reconciliations.length, openFindingCount: findings.length, workbook: "artifacts/held-out-r1-synthetic-scenario.xlsx" }; await writeFile(join(root, "held-out-r1-synthetic-scenario.json"), JSON.stringify(evidence, null, 2)); console.log(JSON.stringify(evidence));
