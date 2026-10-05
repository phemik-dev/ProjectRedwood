import type { Cents } from "./types.js";

/** Evidence is retained separately from the modeled result; a recovery estimate is never observed cash. */
export type RecoveryEvidenceState = "observed" | "derived" | "estimated" | "insufficient";
export type RecoveryMethodKind = "COLLECTION_DISTRIBUTION" | "PERCENT_OF_CHARGES" | "COMPOSITE";
export type Segment = Record<string, string>;

export interface RecoveryBoundary {
  /** The date at which target balances are reconstructed. */
  asOfDate: string;
  /** Historical evidence usable to reconstruct a method's assumptions. */
  reconstruction: { startDate: string; endDate: string };
}

export interface RecoveryTarget {
  id: string;
  openBalanceCents: Cents;
  /** Required by PERCENT_OF_CHARGES. */
  grossChargesCents?: Cents;
  /** Must equal the calculation boundary's asOfDate. */
  asOfDate: string;
  segment?: Segment;
  evidenceState: RecoveryEvidenceState;
  evidenceReferences: string[];
}

export interface CollectionObservation {
  segment?: Segment;
  chargeCents: Cents;
  collectionCents: Cents;
  eventDate: string;
  evidenceState: RecoveryEvidenceState;
  evidenceReferences: string[];
}

export interface CollectionDistributionMethod {
  kind: "COLLECTION_DISTRIBUTION";
  observations: CollectionObservation[];
}

export interface PercentOfChargesMethod {
  kind: "PERCENT_OF_CHARGES";
  /** Decimal literal in [0, 1]; parsed as an exact rational. */
  percent: number | string;
}

export interface CompositeRule {
  /** Rules are evaluated in declaration order; the first matching rule owns the item. */
  segment: Segment;
  method: Exclude<RecoveryMethod, CompositeMethod>;
}

export interface CompositeMethod {
  kind: "COMPOSITE";
  rules: CompositeRule[];
  fallback: Exclude<RecoveryMethod, CompositeMethod>;
}

export type RecoveryMethod = CollectionDistributionMethod | PercentOfChargesMethod | CompositeMethod;

export interface RecoveryEvidence {
  state: RecoveryEvidenceState;
  references: string[];
}

export interface RecoveryEstimate {
  targetId: string;
  method: RecoveryMethodKind;
  /** The selected composite segment, if any. */
  segment?: Segment;
  expectedRecoveryCents: Cents;
  /** Calculated recovery is modeled; it is never an observed collection. */
  evidenceState: "estimated" | "insufficient";
  evidence: RecoveryEvidence[];
}

export interface ExcludedRecoveryTarget {
  targetId: string;
  reason: "outside_as_of_boundary" | "missing_charges" | "insufficient_method_evidence";
  evidence: RecoveryEvidence[];
}

export interface RecoveryResult {
  boundary: RecoveryBoundary;
  estimates: RecoveryEstimate[];
  excluded: ExcludedRecoveryTarget[];
  totalExpectedRecoveryCents: Cents;
}

type Rational = { numerator: bigint; denominator: bigint };

function matches(segment: Segment | undefined, required: Segment | undefined): boolean {
  return Object.entries(required ?? {}).every(([key, value]) => segment?.[key] === value);
}

function decimal(value: number | string): Rational {
  const text = String(value);
  if (!/^(?:0|1)(?:\.\d+)?$/.test(text)) throw new Error(`Recovery percent must be a decimal literal between 0 and 1: ${text}`);
  const [whole, fractional = ""] = text.split(".");
  const denominator = 10n ** BigInt(fractional.length);
  const numerator = BigInt(whole + fractional);
  if (numerator > denominator) throw new Error(`Recovery percent must not exceed 1: ${text}`);
  return { numerator, denominator };
}

function roundedProduct(amount: Cents, rate: Rational): Cents {
  const negative = amount < 0n;
  const absolute = negative ? -amount : amount;
  const rounded = (absolute * rate.numerator * 2n + rate.denominator) / (2n * rate.denominator);
  return negative ? -rounded : rounded;
}

function evidence(state: RecoveryEvidenceState, references: string[]): RecoveryEvidence {
  return { state, references: [...references] };
}

function estimateWithMethod(target: RecoveryTarget, method: Exclude<RecoveryMethod, CompositeMethod>, boundary: RecoveryBoundary): RecoveryEstimate | ExcludedRecoveryTarget {
  const targetEvidence = evidence(target.evidenceState, target.evidenceReferences);
  if (method.kind === "PERCENT_OF_CHARGES") {
    if (target.grossChargesCents === undefined) return { targetId: target.id, reason: "missing_charges", evidence: [targetEvidence] };
    return { targetId: target.id, method: method.kind, expectedRecoveryCents: roundedProduct(target.grossChargesCents, decimal(method.percent)), evidenceState: target.evidenceState === "insufficient" ? "insufficient" : "estimated", evidence: [targetEvidence, evidence("estimated", [])] };
  }

  const observations = method.observations.filter((item) => item.eventDate >= boundary.reconstruction.startDate && item.eventDate <= boundary.reconstruction.endDate && item.eventDate <= boundary.asOfDate && matches(target.segment, item.segment));
  const evidenceItems = [targetEvidence, ...observations.map((item) => evidence(item.evidenceState, item.evidenceReferences))];
  const chargeCents = observations.reduce((total, item) => total + item.chargeCents, 0n);
  if (chargeCents === 0n || observations.some((item) => item.evidenceState === "insufficient")) return { targetId: target.id, reason: "insufficient_method_evidence", evidence: evidenceItems };
  const collectionCents = observations.reduce((total, item) => total + item.collectionCents, 0n);
  return { targetId: target.id, method: method.kind, expectedRecoveryCents: roundedProduct(target.openBalanceCents, { numerator: collectionCents, denominator: chargeCents }), evidenceState: target.evidenceState === "insufficient" ? "insufficient" : "estimated", evidence: evidenceItems };
}

/**
 * Calculates modeled remaining recovery without reading or mutating CanonicalDeal or analytics.
 * Target snapshots must match the as-of date exactly; omitted populations are reported, not balanced away.
 */
export function estimateRecovery(targets: RecoveryTarget[], method: RecoveryMethod, boundary: RecoveryBoundary): RecoveryResult {
  if (boundary.reconstruction.startDate > boundary.reconstruction.endDate || boundary.reconstruction.endDate > boundary.asOfDate) throw new Error("Recovery reconstruction window must end on or before the as-of date.");
  const estimates: RecoveryEstimate[] = [];
  const excluded: ExcludedRecoveryTarget[] = [];
  for (const target of targets) {
    const targetEvidence = evidence(target.evidenceState, target.evidenceReferences);
    if (target.asOfDate !== boundary.asOfDate) {
      excluded.push({ targetId: target.id, reason: "outside_as_of_boundary", evidence: [targetEvidence] });
      continue;
    }
    if (method.kind !== "COMPOSITE") {
      const outcome = estimateWithMethod(target, method, boundary);
      "reason" in outcome ? excluded.push(outcome) : estimates.push(outcome);
      continue;
    }
    const rule = method.rules.find((candidate) => matches(target.segment, candidate.segment));
    const outcome = estimateWithMethod(target, rule?.method ?? method.fallback, boundary);
    if ("reason" in outcome) excluded.push(outcome);
    else estimates.push({ ...outcome, method: "COMPOSITE", ...(rule ? { segment: rule.segment } : {}) });
  }
  return { boundary, estimates, excluded, totalExpectedRecoveryCents: estimates.reduce((total, item) => total + item.expectedRecoveryCents, 0n) };
}
