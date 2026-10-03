# ADR-007: Subsequent cash uses an explicit immutable run-scope window

- **Status:** Accepted for MVP engineering.
- **Authority:** Direct user decision: add `subsequentCashEnd` to immutable run scope; authorize Challenge D value `2026-08-31` and rerun.
- **Origin:** `docs/operations/known-divergences/rs-provider-departure-002-subsequent-cash-window.md`

## Decision

Every newly created scoped analysis run carries a required ISO date field, `subsequentCashEnd`. Subsequent cash consists only of cash events dated strictly after `valuationDate` and on or before `subsequentCashEnd`.

The field belongs to immutable run scope—not a global default or an inferred Method Profile value. It is validated with the other scope dates, carried into the persisted run, included in the dependency fingerprint through scope serialization, sent through the browser intake API, and displayed in the generated workbook.

## Rationale

A valuation date creates a lower bound but does not define how long post-valuation collections should be observed. A hidden/open-ended engine calculation produced a Challenge D truth-oracle mismatch. The observation period is engagement-specific factual scope, not a professional recovery assumption.

## Consequences

- A new run cannot silently apply an unbounded subsequent-cash horizon.
- Changing the window produces a different run scope and invalidates dependent approval fingerprints.
- Historical persisted runs retain their original scope and are not retroactively altered.
- The window affects the `subsequentCash` observation metric only; it does not force reconciliation, modify raw transactions, or create a professional adjustment.
