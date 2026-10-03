import assert from "node:assert/strict";
import test from "node:test";
import { bindFindings, createAdjustmentTreatmentCandidate, createApprovedAdjustmentTreatment, createDecision, createFindingDisposition, createMaterialityAssessment, createReleaseRecord, invalidateFindingDisposition, invalidateStaleRunArtifacts, isActiveAdjustmentTreatment, isActiveDecision, isActiveFinding, isActiveFindingDisposition, isActiveMaterialityAssessment, isActiveReleaseRecord, isActiveRunArtifact, type RunContext } from "./index.js";

const context: RunContext = { runId: "run-1", methodProfileId: "method-1", methodVersion: "1.0.0", dependencyFingerprint: "fingerprint-a" };
const staleContext: RunContext = { ...context, dependencyFingerprint: "fingerprint-b" };
const evidence = ["source-row:1"];

test("bindFindings makes deterministic findings run-bound without mutating the input", () => {
  const findings = [{ id: "finding-1", kind: "reconciliation" as const, title: "Difference", detail: "Visible", status: "open" as const, references: evidence }];
  const [bound] = bindFindings(findings, context, "2026-01-01T00:00:00.000Z");
  assert.equal(findings[0].runId, undefined);
  assert.equal(bound.runId, context.runId);
  assert.equal(bound.createdAt, "2026-01-01T00:00:00.000Z");
  assert.ok(isActiveFinding(bound, context));
  assert.equal(isActiveFinding(bound, staleContext), false);
});

test("professional decisions require named authority and remain backwards compatible", () => {
  assert.throws(() => createDecision({ runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, gate: "G5", decision: "approved", reviewer: "Advisor", role: "", rationale: "Reviewed", evidenceReferences: [] }), /role/i);
  const decision = createDecision({ runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, gate: "G5", decision: "approved", reviewer: "Advisor", role: "Partner", rationale: "Reviewed", evidenceReferences: [], dependencyFingerprint: context.dependencyFingerprint });
  assert.ok(isActiveDecision(decision, context.runId, context.methodVersion, context.dependencyFingerprint));
  assert.equal(isActiveDecision(decision, "other-run", context.methodVersion, context.dependencyFingerprint), false);
  assert.ok(isActiveRunArtifact(decision, context));
  assert.equal(isActiveRunArtifact(decision, { ...context, methodVersion: "2.0.0" }), false);
});

test("finding dispositions are evidence-backed and invalidate on dependency change", () => {
  assert.throws(() => createFindingDisposition({ id: "ignored", findingId: "finding-1", runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, reviewer: "Advisor", role: "Partner", decision: "reviewed", rationale: "Reviewed", evidenceReferences: [], dependencyFingerprint: context.dependencyFingerprint, invalidatedAt: undefined, invalidationReason: undefined }), /evidence/i);
  const disposition = createFindingDisposition({ findingId: "finding-1", runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, reviewer: "Advisor", role: "Partner", decision: "resolved", rationale: "Tracing completed", evidenceReferences: evidence, dependencyFingerprint: context.dependencyFingerprint });
  assert.ok(isActiveFindingDisposition(disposition, context));
  assert.equal(isActiveFindingDisposition(disposition, staleContext), false);
  const [invalidated] = invalidateStaleRunArtifacts([disposition], staleContext.dependencyFingerprint, "Mapping changed");
  assert.equal(isActiveFindingDisposition(invalidated, context), false);
  assert.match(invalidated.invalidationReason ?? "", /Mapping changed/);
  assert.ok(invalidateFindingDisposition(disposition, "Source changed").invalidatedAt);
});

test("adjustment treatment lifecycle is run-bound and evidence-backed", () => {
  assert.throws(() => createAdjustmentTreatmentCandidate({ runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, adjustmentEventIds: [], proposedTreatment: "exclude", rationale: "Exclude", evidenceReferences: evidence, createdBy: "Analyst", dependencyFingerprint: context.dependencyFingerprint }), /adjustment event/i);
  const candidate = createAdjustmentTreatmentCandidate({ runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, adjustmentEventIds: ["adjustment-1"], proposedTreatment: "exclude", proposedAmount: 100n, rationale: "Nonrecurring", evidenceReferences: evidence, createdBy: "Analyst", dependencyFingerprint: context.dependencyFingerprint });
  const treatment = createApprovedAdjustmentTreatment({ candidateId: candidate.id, runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, decision: "approved", reviewer: "Advisor", role: "Partner", rationale: "Approved treatment", evidenceReferences: evidence, dependencyFingerprint: context.dependencyFingerprint });
  assert.ok(isActiveAdjustmentTreatment(treatment, context));
  const [invalidated] = invalidateStaleRunArtifacts([treatment], staleContext.dependencyFingerprint, "Source changed");
  assert.equal(isActiveAdjustmentTreatment(invalidated, context), false);
});

test("materiality and release records preserve professional authority but do not change source facts", () => {
  assert.throws(() => createMaterialityAssessment({ reconciliationId: "cash-to-gl", runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, outcome: "within-materiality", status: "approved", reviewer: "Advisor", role: "Partner", rationale: "Threshold considered", evidenceReferences: evidence, dependencyFingerprint: context.dependencyFingerprint }), /threshold/i);
  const materiality = createMaterialityAssessment({ reconciliationId: "cash-to-gl", runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, thresholdCents: 1000n, outcome: "within-materiality", status: "approved", reviewer: "Advisor", role: "Partner", rationale: "Threshold considered", evidenceReferences: evidence, dependencyFingerprint: context.dependencyFingerprint });
  assert.ok(isActiveMaterialityAssessment(materiality, context));
  const release = createReleaseRecord({ runId: context.runId, methodProfileId: context.methodProfileId, methodVersion: context.methodVersion, dependencyFingerprint: context.dependencyFingerprint, gateSnapshot: [{ gate: "G0", status: "passed", rationale: "Scope approved" }], decision: "approved", reviewer: "Advisor", role: "Partner", rationale: "Release reviewed", evidenceReferences: evidence, workbookHash: "sha256:example" });
  assert.ok(isActiveReleaseRecord(release, context));
  const [staleMateriality, staleRelease] = invalidateStaleRunArtifacts([materiality, release], staleContext.dependencyFingerprint, "Method changed");
  assert.ok(staleMateriality.invalidatedAt);
  assert.ok(staleRelease.invalidatedAt);
});
