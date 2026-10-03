# RS-PROVIDER-DEPARTURE-004 — Nonzero provider-departure evidence with reviewer-governed normalization boundary

## Status

**PROVEN — nonzero provider-departure evidence → valuation-bounded attribution → explicit pre/post-departure economics → no autonomous adjustment → reviewer authority preserved.** Redwood calculates and presents the observed population, but does not produce a QoR adjustment, professional conclusion, or release authorization.

## Immutable execution evidence

- **Run:** `6884cf5f-724b-4d18-8d6d-a0f27f0d6ede`
- **Authored synthetic corpus:** `.tmp/Redwood_RS_PROVIDER_DEPARTURE_004_v0.1.zip`
- **ZIP SHA-256:** `05d0b9e2ab9aa5508505baf03ed130266a46edd8fb62902a48414c5298f17a2e`
- **Scope:** valuation `2026-06-30`; subsequent-cash window end `2026-08-31`
- **Draft workbook:** `.tmp/redwood-6884cf5f-724b-4d18-8d6d-a0f27f0d6ede.xlsx` — HTTP 200; 19,041 bytes; SHA-256 `9c28f0a2705b26d6a4ff4c4fb163eb52616b0fc5e1f037fee08f75f848259787`

## Observed departure evidence

| Provider | FTE | Departure date | Observed billed through departure | Observed billed after departure through valuation | Post-departure claims |
| --- | ---: | --- | ---: | ---: | ---: |
| PRV-DEP | 1.0 | 2026-04-15 | $1,000.00 | $3,500.00 | 2 |

The claim on the departure date is included in the pre-departure population. Claims after departure through valuation form the post-departure population. A claim after valuation is excluded from this evidence; it remains visible only in the separately bounded subsequent-cash population.

These are factual, lineaged amounts. The Analyze view and workbook label them **evidence only — not a QoR normalization**. No automatic normalization was created: analysis adjustment total is $0.00.

## Truth-contract comparison

The authored `Validation_Truth.csv` was excluded from intake and inspected after execution. All 15 declared assertions matched, including in-scope billed ($5,400.00), allowed ($4,320.00), cash ($4,320.00), subsequent cash through the authorized window ($2,400.00), FTE, departure date, pre/post-departure amounts, claim count, and zero automatic normalization.

Because this truth contract was authored alongside the synthetic corpus, the comparison is deterministic regression evidence—not a blind held-out acceptance test.

## Controls and governance

- All cash-to-GL, ERA-to-bank, matched-cash-to-GL, and A/R-to-GL controls matched at $0.00 difference.
- The run had no findings or quarantined rows.
- G1, G3, and G4 passed; G0/G5 remained open; G2/G6 were blocked; G7 remained blocked.
- The deterministic calculation did not advance professional or release authority.

## Durable boundary

ADR-008 defines this evidence-only measurement. Any normalization must be an explicit reviewer-governed Method Profile/decision that addresses replacement capacity, attribution, methodology, and professional basis. A G5 `noted` decision is not approval.
