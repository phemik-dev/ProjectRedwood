import { sum } from "./money.js";
import type { CanonicalDeal, Cents, Finding, MethodProfile, Reconciliation } from "./types.js";

function control(id: string, label: string, leftDefinition: string, rightDefinition: string, leftTotal: Cents, rightTotal: Cents, method: MethodProfile, evidence: string[]): Reconciliation {
  const difference = leftTotal - rightTotal; const absolute = difference < 0n ? -difference : difference;
  const arithmeticStatus = absolute <= method.arithmeticToleranceCents ? "matched" : "difference";
  const materialityStatus = method.professionalMaterialityCents === undefined ? "unset" : absolute <= method.professionalMaterialityCents ? "within-materiality" : "over-materiality";
  return { id, label, leftDefinition, rightDefinition, leftTotal, rightTotal, difference, percentageDifference: rightTotal === 0n ? undefined : Number(difference * 10000n / rightTotal) / 100, arithmeticStatus, materialityStatus, evidence };
}
export function reconcile(deal: CanonicalDeal, method: MethodProfile): { reconciliations: Reconciliation[]; findings: Finding[] } {
  const allCash = sum(deal.cashEvents.map((event) => event.amount));
  const matchedCash = sum(deal.cashEvents.filter((event) => event.claimId && deal.claims.some((claim) => claim.id === event.claimId)).map((event) => event.amount));
  const unmatchedCash = allCash - matchedCash;
  const glCash = sum(deal.glRecords.map((record) => record.cash)); const glMatchedCash = sum(deal.glRecords.map((record) => record.matchedCash ?? record.cash)); const arSnapshotDate = [...new Set(deal.receivables.map((item) => item.snapshotDate))].sort().at(-1); const activeReceivables = arSnapshotDate ? deal.receivables.filter((item) => item.snapshotDate === arSnapshotDate) : []; const ar = sum(activeReceivables.map((item) => item.balance)); const glAr = sum(deal.glRecords.map((record) => record.ar));
  const controls = [
    control("all-cash-to-gl", "All cash to GL cash", "All typed cash events", "GL cash", allCash, glCash, method, deal.cashEvents.map((event) => event.lineage.sourceRowId).concat(deal.glRecords.map((record) => record.lineage.sourceRowId))),
    control("matched-cash-to-gl", "Matched cash to GL cash", "Cash events attached to known claims", "GL matched-cash control when supplied, otherwise GL cash", matchedCash, glMatchedCash, method, deal.cashEvents.filter((event) => event.claimId).map((event) => event.lineage.sourceRowId)),
    control("ar-to-gl", "A/R snapshot to GL A/R", "Explicit A/R snapshot", "GL A/R", ar, glAr, method, activeReceivables.map((item) => item.lineage.sourceRowId).concat(deal.glRecords.map((record) => record.lineage.sourceRowId)))
  ];
  const findings: Finding[] = controls.filter((item) => item.arithmeticStatus === "difference").map((item) => ({ id: `finding:${item.id}`, kind: "reconciliation", title: `${item.label} difference`, detail: `Difference remains visible: ${item.difference.toString()} cents. Professional materiality is ${item.materialityStatus}.`, status: "open", references: item.evidence }));
  if (unmatchedCash !== 0n) findings.push({ id: "finding:unmatched-cash", kind: "reconciliation", title: "Unmatched cash", detail: `${unmatchedCash.toString()} cents is not linked to a canonical claim; no balancing entry was made.`, status: "open", references: deal.cashEvents.filter((event) => !event.claimId || !deal.claims.some((claim) => claim.id === event.claimId)).map((event) => event.lineage.sourceRowId) });
  const snapshotDates = [...new Set(deal.receivables.map((item) => item.snapshotDate))].sort(); if (snapshotDates.length > 1) findings.push({ id: "finding:mixed-ar-snapshots", kind: "data_quality", title: "Multiple A/R snapshots supplied", detail: `A/R analysis uses latest supplied snapshot ${arSnapshotDate}; ${snapshotDates.length - 1} earlier snapshot(s) remain separate and were not aggregated.`, status: "open", references: deal.receivables.map((item) => item.lineage.sourceRowId) });
  return { reconciliations: controls, findings };
}
