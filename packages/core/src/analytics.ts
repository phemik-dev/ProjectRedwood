import { sum } from "./money.js";
import type { CanonicalDeal, Cents, MethodProfile } from "./types.js";

export interface QorAnalysis { grossCharge: Cents; allowedAmount: Cents; observedCash: Cents; openAr: Cents; arSnapshotDate?: string; adjustmentTotal: Cents; expectedRemainingCash: Cents; realizableRevenue: Cents; payerConcentration: Array<{ payer: string; observedCash: Cents }>; providerConcentration: Array<{ provider: string; grossCharge: Cents }>; locationConcentration: Array<{ location: string; grossCharge: Cents }>; serviceLineConcentration: Array<{ serviceLine: string; grossCharge: Cents }>; }
function group(items: Array<{ key?: string; amount?: Cents }>): Array<{ key: string; amount: Cents }> { const groups = new Map<string, Cents>(); for (const item of items) { const key = item.key ?? "Unavailable"; groups.set(key, (groups.get(key) ?? 0n) + (item.amount ?? 0n)); } return [...groups].map(([key, amount]) => ({ key, amount })).sort((a, b) => (a.amount > b.amount ? -1 : 1)); }
export function analyze(deal: CanonicalDeal, method: MethodProfile): QorAnalysis {
  const arSnapshotDate = [...new Set(deal.receivables.map((row) => row.snapshotDate))].sort().at(-1);
  const activeReceivables = arSnapshotDate ? deal.receivables.filter((row) => row.snapshotDate === arSnapshotDate) : [];
  const openAr = sum(activeReceivables.map((row) => row.balance));
  let expectedRemainingCash = 0n;
  for (const item of activeReceivables) { const rate = method.recoveryRates[item.ageBucket ?? ""] ?? method.recoveryRates.global; if (rate !== undefined) expectedRemainingCash += BigInt(Math.round(Number(item.balance) * rate)); }
  const observedCash = sum(deal.cashEvents.map((event) => event.amount));
  return { arSnapshotDate, grossCharge: sum(deal.claims.map((claim) => claim.grossCharge)), allowedAmount: sum(deal.claims.map((claim) => claim.allowedAmount)), observedCash, openAr, adjustmentTotal: sum(deal.adjustmentEvents.map((event) => event.amount)), expectedRemainingCash, realizableRevenue: observedCash + expectedRemainingCash, payerConcentration: group(deal.cashEvents.map((event) => ({ key: event.payer, amount: event.amount }))).map((x) => ({ payer: x.key, observedCash: x.amount })), providerConcentration: group(deal.claims.map((claim) => ({ key: claim.provider, amount: claim.grossCharge }))).map((x) => ({ provider: x.key, grossCharge: x.amount })), locationConcentration: group(deal.claims.map((claim) => ({ key: claim.location, amount: claim.grossCharge }))).map((x) => ({ location: x.key, grossCharge: x.amount })), serviceLineConcentration: group(deal.claims.map((claim) => ({ key: claim.serviceLine, amount: claim.grossCharge }))).map((x) => ({ serviceLine: x.key, grossCharge: x.amount })) };
}
