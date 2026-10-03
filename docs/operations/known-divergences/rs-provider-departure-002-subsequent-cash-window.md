# RS-PROVIDER-DEPARTURE-002 — Subsequent-cash observation window diverges from Challenge D oracle

- **Status:** Resolved in `RS-PROVIDER-DEPARTURE-003`
- **Classification:** Defect
- **Originating conformance record:** `docs/evidence/rs-provider-departure-002.conformance.json`
- **Observed run:** `7237d02f-548f-4d1d-8177-334ccb31944f`
- **Resolution evidence:** `docs/evidence/rs-provider-departure-003.conformance.json`; corrected run `34976659-a74d-4aa8-b927-c84a452dcafd`

## Intended state

For the Challenge D truth comparison, subsequent cash is measured from the valuation date through the supplied window end of **2026-08-31**. The expected subsequent-cash amount is **$4,312.15**.

## Actual state

The run's `analysis.subsequentCash` is **$4,539.31**. The engine sums every cash event dated after the valuation date, with no upper bound. The run scope permits only an analysis period ending on or before the valuation date and therefore carries no subsequent-cash window end.

## Difference and cause

The observed amount exceeds the oracle by **$227.16**. The calculation in `packages/core/src/analytics.ts` filters only `paymentDate > valuationDate`; it does not receive or apply a `subsequentCashEnd` value. The missing control is a model/scope capability, not a reconciliation adjustment or a professional judgment.

## Preserved invariants

- The difference is visible in post-run truth comparison; it was not normalized or hidden.
- Historical cash, bank, GL, and A/R controls retain their observed values and gate behavior.
- No client-release authority was granted: G7 remains blocked.

## Required follow-up

1. Obtain explicit product authority for a subsequent-cash observation-window field and its source-of-truth boundary.
2. Extend the scope/method contract and analytics calculation to use that explicit upper bound.
3. Add regression coverage for the Challenge D valuation-to-window interval.
4. Execute a new immutable run and perform a post-run oracle comparison before any full provider-departure closure claim.

## Resolution

ADR-007 introduced required immutable `subsequentCashEnd` scope. The corrected run `34976659-a74d-4aa8-b927-c84a452dcafd` used the user-authorized `2026-08-31` boundary and reported $4,312.15 subsequent cash, matching the Challenge D expected result. The correction did not alter the existing A/R finding or release gates.

## Procedural limitation

The local expected-results file was accessible and inspected before the original execution. No implementation or input modification followed that inspection before the original run, and the user subsequently supplied the correcting date. The corrected rerun is therefore a regression confirmation, not a blinded hidden-oracle acceptance test.
