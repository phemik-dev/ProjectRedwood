import { createHash, randomUUID } from "node:crypto";
import type { AdjustmentTreatmentCandidate, ApprovedAdjustmentTreatment, Finding, FindingDisposition, MaterialityAssessment, ReleaseRecord, ReviewDecision, RunContext } from "./types.js";

export interface ApprovalDependencies { runId: string; methodVersion: string; sourceHashes: string[]; mappingHash: string; assumptionHash: string; scopeHash: string; engineVersion: string; findingHash: string; }

type RunBoundArtifact = { runId: string; methodProfileId: string; methodVersion: string; dependencyFingerprint?: string; invalidatedAt?: string; invalidationReason?: string; };

function required(value: string | undefined, label: string): void { if (!value?.trim()) throw new Error(`${label} is required.`); }
function requiredEvidence(evidenceReferences: string[]): void { if (!evidenceReferences.length) throw new Error("At least one evidence reference is required."); }
function oneOf<T extends string>(value: string, values: readonly T[], label: string): asserts value is T { if (!values.includes(value as T)) throw new Error(`Invalid ${label}: ${value}.`); }

export function dependencyFingerprint(input: ApprovalDependencies): string { return createHash("sha256").update(JSON.stringify({ ...input, sourceHashes: [...input.sourceHashes].sort() })).digest("hex"); }

/** Strictly evaluates whether a record remains usable for one exact analysis run. */
export function isActiveRunArtifact(artifact: RunBoundArtifact, context: RunContext): boolean {
  return !artifact.invalidatedAt && artifact.runId === context.runId && artifact.methodProfileId === context.methodProfileId && artifact.methodVersion === context.methodVersion && artifact.dependencyFingerprint === context.dependencyFingerprint;
}

export function bindFindings(findings: Finding[], context: RunContext, createdAt = new Date().toISOString()): Finding[] {
  return findings.map((finding) => ({ ...finding, runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, dependencyFingerprint: context.dependencyFingerprint, createdAt }));
}

export function isActiveFinding(finding: Finding, context: RunContext): boolean {
  return !finding.supersededAt && finding.runId === context.runId && finding.methodProfileId === context.methodProfileId && finding.methodVersion === context.methodVersion && finding.dependencyFingerprint === context.dependencyFingerprint;
}

export function createDecision(input: Omit<ReviewDecision, "id" | "timestamp">): ReviewDecision {
  required(input.reviewer, "Reviewer"); required(input.role, "Reviewer role"); required(input.rationale, "Rationale");
  oneOf(input.decision, ["approved", "rejected", "noted"] as const, "decision");
  return { ...input, id: randomUUID(), timestamp: new Date().toISOString() };
}

export function invalidateRunArtifact<T extends RunBoundArtifact>(artifact: T, reason: string): T {
  required(reason, "Invalidation reason");
  return { ...artifact, invalidatedAt: new Date().toISOString(), invalidationReason: reason };
}

export function invalidateDecision(decision: ReviewDecision, reason: string): ReviewDecision { return invalidateRunArtifact(decision, reason); }

export function isActiveDecision(decision: ReviewDecision, currentRunId: string, currentMethodVersion: string, currentFingerprint?: string): boolean {
  return !decision.invalidatedAt && decision.runId === currentRunId && decision.methodVersion === currentMethodVersion && (currentFingerprint === undefined || decision.dependencyFingerprint === currentFingerprint);
}

export function invalidateStaleRunArtifacts<T extends RunBoundArtifact>(artifacts: T[], currentFingerprint: string, reason: string): T[] {
  return artifacts.map((artifact) => !artifact.invalidatedAt && artifact.dependencyFingerprint !== undefined && artifact.dependencyFingerprint !== currentFingerprint ? invalidateRunArtifact(artifact, reason) : artifact);
}

export function invalidateStaleDecisions(decisions: ReviewDecision[], currentFingerprint: string, reason: string): ReviewDecision[] { return invalidateStaleRunArtifacts(decisions, currentFingerprint, reason); }

export function createFindingDisposition(input: Omit<FindingDisposition, "id" | "timestamp">): FindingDisposition {
  required(input.findingId, "Finding ID"); required(input.reviewer, "Reviewer"); required(input.role, "Reviewer role"); required(input.rationale, "Rationale"); requiredEvidence(input.evidenceReferences);
  oneOf(input.decision, ["reviewed", "resolved", "accepted_with_exception"] as const, "finding disposition");
  return { ...input, id: randomUUID(), timestamp: new Date().toISOString() };
}

export function isActiveFindingDisposition(disposition: FindingDisposition, context: RunContext): boolean { return isActiveRunArtifact(disposition, context); }
export function invalidateFindingDisposition(disposition: FindingDisposition, reason: string): FindingDisposition { return invalidateRunArtifact(disposition, reason); }

export function createAdjustmentTreatmentCandidate(input: Omit<AdjustmentTreatmentCandidate, "id" | "createdAt">): AdjustmentTreatmentCandidate {
  required(input.createdBy, "Candidate creator"); required(input.rationale, "Rationale"); requiredEvidence(input.evidenceReferences);
  if (!input.adjustmentEventIds.length) throw new Error("At least one adjustment event ID is required.");
  oneOf(input.proposedTreatment, ["include", "exclude", "reclassify"] as const, "proposed treatment");
  return { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
}

export function createApprovedAdjustmentTreatment(input: Omit<ApprovedAdjustmentTreatment, "id" | "timestamp">): ApprovedAdjustmentTreatment {
  required(input.candidateId, "Adjustment candidate ID"); required(input.reviewer, "Reviewer"); required(input.role, "Reviewer role"); required(input.rationale, "Rationale"); requiredEvidence(input.evidenceReferences);
  oneOf(input.decision, ["approved", "rejected"] as const, "adjustment treatment decision");
  return { ...input, id: randomUUID(), timestamp: new Date().toISOString() };
}

export function isActiveAdjustmentTreatment(treatment: ApprovedAdjustmentTreatment, context: RunContext): boolean { return isActiveRunArtifact(treatment, context); }
export function invalidateAdjustmentTreatment(treatment: ApprovedAdjustmentTreatment, reason: string): ApprovedAdjustmentTreatment { return invalidateRunArtifact(treatment, reason); }

export function createMaterialityAssessment(input: Omit<MaterialityAssessment, "id" | "assessedAt">): MaterialityAssessment {
  required(input.reconciliationId, "Reconciliation ID"); required(input.reviewer, "Reviewer"); required(input.role, "Reviewer role"); required(input.rationale, "Rationale"); requiredEvidence(input.evidenceReferences);
  oneOf(input.outcome, ["unset", "within-materiality", "over-materiality"] as const, "materiality outcome"); oneOf(input.status, ["proposed", "approved", "superseded"] as const, "materiality status");
  if (input.outcome !== "unset" && input.thresholdCents === undefined) throw new Error("Materiality threshold is required for a classified outcome.");
  return { ...input, id: randomUUID(), assessedAt: new Date().toISOString() };
}

export function isActiveMaterialityAssessment(assessment: MaterialityAssessment, context: RunContext): boolean { return isActiveRunArtifact(assessment, context) && assessment.status !== "superseded"; }
export function invalidateMaterialityAssessment(assessment: MaterialityAssessment, reason: string): MaterialityAssessment { return invalidateRunArtifact(assessment, reason); }

export function createReleaseRecord(input: Omit<ReleaseRecord, "id" | "releasedAt">): ReleaseRecord {
  required(input.reviewer, "Reviewer"); required(input.role, "Reviewer role"); required(input.rationale, "Rationale"); requiredEvidence(input.evidenceReferences);
  oneOf(input.decision, ["approved", "rejected"] as const, "release decision");
  if (!input.gateSnapshot.length) throw new Error("A release gate snapshot is required.");
  return { ...input, id: randomUUID(), releasedAt: new Date().toISOString() };
}

export function isActiveReleaseRecord(record: ReleaseRecord, context: RunContext): boolean { return isActiveRunArtifact(record, context); }
export function invalidateReleaseRecord(record: ReleaseRecord, reason: string): ReleaseRecord { return invalidateRunArtifact(record, reason); }
