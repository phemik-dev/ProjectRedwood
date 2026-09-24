import { createHash, randomUUID } from "node:crypto";
import type { ReviewDecision } from "./types.js";

export function dependencyFingerprint(input: { runId: string; methodVersion: string; sourceHashes: string[]; mappingHash: string; engineVersion: string }): string { return createHash("sha256").update(JSON.stringify({ ...input, sourceHashes: [...input.sourceHashes].sort() })).digest("hex"); }
export function createDecision(input: Omit<ReviewDecision, "id" | "timestamp">): ReviewDecision { if (!input.reviewer || !input.rationale) throw new Error("Reviewer and rationale are required; checkbox-only approval is forbidden."); return { ...input, id: randomUUID(), timestamp: new Date().toISOString() }; }
export function invalidateDecision(decision: ReviewDecision, reason: string): ReviewDecision { return { ...decision, invalidatedAt: new Date().toISOString(), invalidationReason: reason }; }
export function isActiveDecision(decision: ReviewDecision, currentRunId: string, currentMethodVersion: string): boolean { return !decision.invalidatedAt && decision.runId === currentRunId && decision.methodVersion === currentMethodVersion; }
