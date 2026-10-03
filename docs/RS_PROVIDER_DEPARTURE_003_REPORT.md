# RS-PROVIDER-DEPARTURE-003 — Subsequent-cash window correction and governed rerun

## Status

**PROVEN — deterministic subsequent-cash window and Challenge D oracle regression.** This is not a professional go-forward Revenue Sustainability conclusion: no reviewer judgment was created and release gates remain blocked.

## Authorized contract

The user authorized an immutable `subsequentCashEnd` run-scope field and specified **2026-08-31** for Challenge D. The accepted contract is in `docs/architecture/decisions/ADR-007-subsequent-cash-run-window.md`.

Subsequent cash now includes only events dated strictly after valuation and on or before this persisted upper bound. The run scope, dependency fingerprint, browser intake payload, and workbook all carry the same value.

## Immutable rerun evidence

- **Run:** `34976659-a74d-4aa8-b927-c84a452dcafd`
- **Corpus:** `.tmp/Redwood_Challenge_D_provider_departure_fte_v0.1.zip` — unchanged SHA-256 `6d358a0ab03b5919305f65a159dae0a4c158eb68bfb5f9cccd2b3113454c9604`
- **Scope:** valuation date `2026-06-30`; subsequent cash window end `2026-08-31`
- **Draft workbook:** `.tmp/redwood-34976659-a74d-4aa8-b927-c84a452dcafd.xlsx`
- **Workbook evidence:** HTTP 200; 76,263 bytes; SHA-256 `40d5f9de13c3b36380a6555dabba3dbdfa32d5a24457b6075a0df3b4583af2bd`; Assumptions sheet records `2026-08-31`.

## Post-run oracle comparison

All nine Challenge D expected measures matched:

| Measure | Expected | Observed |
| --- | ---: | ---: |
| Charges | $79,181.62 | $79,181.62 |
| Allowed | $37,002.92 | $37,002.92 |
| Cash through valuation | $32,463.61 | $32,463.61 |
| Open A/R at valuation | $4,539.31 | $4,539.31 |
| Subsequent cash through 2026-08-31 | $4,312.15 | $4,312.15 |
| Claim lines | 333 | 333 |
| Payments | 632 | 632 |
| All-date bank deposits | $37,002.92 | $37,002.92 |
| All-date GL cash | $37,002.92 | $37,002.92 |

## Preserved governance and invariants

- `PRV-004` remains visible in the run-bound provider-sustainability population; its end date is before valuation.
- The malformed adjustment remains quarantined with reason `Missing adjustment amount`.
- The $4,539.31 A/R-to-GL difference remains an open finding. It was not changed, balanced, or suppressed.
- G4 passed, while G0 is open; G1/G2/G3/G6 are blocked; G5 is open; and G7 remains blocked.
- The correction changes only the bounded `subsequentCash` observation metric. It does not provide release authority or an automatic Revenue Sustainability adjustment.

## CFO review record

James Kader, CFO, recorded **G5 · noted** decision `b04c2743-9e44-4f0e-b4a5-5e7c51f8c44a` on this exact run and Method Profile. The record notes that PRV-004's departure supports a review-required go-forward risk, while historical revenue remains observed and no automatic normalization is authorized. It cites the run, `Provider_Roster.csv: PRV-004`, `normalization_adjustments.csv: NORM-001`, and this report.

The decision deliberately does **not** approve a professional adjustment or client release. G5 remains open and G7 remains blocked.

## Evidence qualification

The expected-results file was already accessible during the earlier divergence diagnosis, and the user explicitly supplied the correcting date. This rerun is a governed regression confirmation, not a blinded held-out acceptance test.
