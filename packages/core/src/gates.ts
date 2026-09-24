import type { CanonicalDeal, Finding, Gate, MappingDecision, Reconciliation, ReviewDecision, SourceType } from "./types.js";
export interface GateStatus { gate: Gate; status: "open" | "passed" | "blocked"; rationale: string; }
export function evaluateGates(input: { deal: CanonicalDeal; mappings: MappingDecision[]; reconciliations: Reconciliation[]; findings: Finding[]; decisions: ReviewDecision[] }): GateStatus[] {
  const approved = (gate: Gate) => input.decisions.some((decision) => decision.gate === gate && decision.decision === "approved" && !decision.invalidatedAt);
  const required = new Set<SourceType>(["claims", "payments", "ar_snapshot", "general_ledger"]);
  const present = new Set(input.mappings.map((mapping) => mapping.sourceType));
  const mappingsReady = input.mappings.length > 0 && input.mappings.every((mapping) => mapping.canonicalField && mapping.reviewStatus === "approved");
  const reconClear = input.reconciliations.every((reconciliation) => reconciliation.arithmeticStatus === "matched");
  const findingsClear = input.findings.every((finding) => finding.status === "resolved");
  return [
    { gate: "G0", status: approved("G0") ? "passed" : "open", rationale: approved("G0") ? "Scope decision approved." : "Scope approval has not been recorded." },
    { gate: "G1", status: [...required].every((type) => present.has(type)) && input.deal.quarantined.length === 0 ? "passed" : "blocked", rationale: "Required source populations must be present and invalid rows quarantined/reviewed." },
    { gate: "G2", status: mappingsReady ? "passed" : "blocked", rationale: "Every proposed mapping must have a canonical target and reviewer approval." },
    { gate: "G3", status: reconClear ? "passed" : "blocked", rationale: "Unreconciled differences cannot be suppressed by materiality or export." },
    { gate: "G4", status: "passed", rationale: "Deterministic engine completed for this run." },
    { gate: "G5", status: approved("G5") ? "passed" : "open", rationale: "Professional assumptions/judgments require an explicit approval." },
    { gate: "G6", status: findingsClear && approved("G6") ? "passed" : "blocked", rationale: "Findings must be resolved and reviewed before release." },
    { gate: "G7", status: approved("G7") && mappingsReady && reconClear && findingsClear ? "passed" : "blocked", rationale: "Client release requires all dependent gates and explicit release authorization." }
  ];
}
