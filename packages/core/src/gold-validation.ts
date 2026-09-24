import type { Cents } from "./types.js";
export interface ValidationMetric { metric: string; professionalValue?: Cents; redwoodValue?: Cents; sourceExplanation?: string; methodologyExplanation?: string; reviewStatus: "open" | "explained" | "accepted"; }
export interface ValidationComparison extends ValidationMetric { difference?: Cents; }
/** Gold Deal data is controlled validation evidence; this function never persists it or treats it as model-training input. */
export function compareGoldDealMetrics(metrics: ValidationMetric[]): ValidationComparison[] { return metrics.map((metric) => ({ ...metric, difference: metric.professionalValue === undefined || metric.redwoodValue === undefined ? undefined : metric.redwoodValue - metric.professionalValue })); }
