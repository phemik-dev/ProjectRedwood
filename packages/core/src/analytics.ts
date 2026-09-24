import { sum } from "./money.js";
import type { CanonicalDeal, Cents, MethodProfile } from "./types.js";

export interface QorAnalysis { grossCharge: Cents; allowedAmount: Cents; observedCash: Cents; openAr: Cents; expectedRemainingCash: Cents; realizableRevenue: Cents; payerConcentration: Array<{ payer: string; observedCash: Cents }>; providerConcentration: Array<{ provider: string; grossCharge: Cents }>; serviceLineConcentration: Array<{ serviceLine: string; grossCharge: Cents }>; }
function group(items: Array<{ key?: string; amount?: Cents }>): Array<{ key: string; amount: Cents }> { const groups = new Map<string, Cents>(); for (const item of items) { const key = item.key ?? "Unavailable"; groups.set(key, (groups.get(key) ?? 0n) + (item.amount ?? 0n)); } return [...groups].map(([key, amount]) => ({ key, amount })).sort((a, b) => (a.amount > b.amount ? -1 : 1)); }
export function analyze(deal: CanonicalDeal, method: MethodProfile): QorAnalysis {
  const openAr = sum(deal.receivables.map((row) => row.balance));
  let expectedRemainingCash = 0n;
  for (const item of deal.receivables) { const rate = method.recoveryRates[item.ageBucket ?? ""] ?? method.recoveryRates.global; if (rate !== undefined) expectedRemainingCash += BigInt(Math.round(Number(item.balance) * rate)); }
  return { grossCharge: sum(deal.claims.map((claim) => claim.grossCharge)), allowedAmount: sum(deal.claims.map((claim) => claim.allowedAmount)), observedCash: sum(deal.cashEvents.map((event) => event.amount)), openAr, expectedRemainingCash, realizableRevenue: sum(deal.cashEvents.map((event) => event.amount)) + expectedRemainingCash, payerConcentration: group(deal.cashEvents.map((event) => ({ key: event.payer, amount: event.amount }))).map((x) => ({ payer: x.key, observedCash: x.amount })), providerConcentration: group(deal.claims.map((claim) => ({ key: claim.provider, amount: claim.grossCharge }))).map((x) => ({ provider: x.key, grossCharge: x.amount })), serviceLineConcentration: group(deal.claims.map((claim) => ({ key: claim.serviceLine, amount: claim.grossCharge }))).map((x) => ({ serviceLine: x.key, grossCharge: x.amount })) };
}
