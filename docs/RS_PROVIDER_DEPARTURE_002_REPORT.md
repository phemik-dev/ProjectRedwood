# RS-PROVIDER-DEPARTURE-002 — Provider-departure evidence and governed run

## Status

**EXECUTED — INCOMPLETE.** The run proves provider-departure evidence is carried into run-bound analysis and preserves release governance. It does not establish a professionally approved go-forward QoR judgment, and its post-run oracle comparison exposed an open subsequent-cash-window defect.

## Immutable execution evidence

- **Run:** `7237d02f-548f-4d1d-8177-334ccb31944f`
- **Staged corpus:** `.tmp/Redwood_Challenge_D_provider_departure_fte_v0.1.zip`
- **ZIP SHA-256:** `6d358a0ab03b5919305f65a159dae0a4c158eb68bfb5f9cccd2b3113454c9604`
- **Draft workbook:** `.tmp/redwood-7237d02f-548f-4d1d-8177-334ccb31944f.xlsx`
- **Workbook response:** HTTP 200; 75,851 bytes; SHA-256 `341049d319543c7af4748a13201bb700262d87f7a402fd83f9111a57b9efecc1`

## Observed provider-departure evidence

`PRV-004` appears in the run-bound `analysis.providerSustainability` population with:

- gross charge: **$17,331.26**;
- FTE: **1.0**;
- specialty: **Ophthalmology**;
- start date: **2025-01-01**;
- end date: **2026-04-14**, before the **2026-06-30** valuation date.

The existing Analyze-view contract renders valuation-relative roster status from this same run-bound analysis and roster lineage. This execution therefore demonstrates observable provider-departure evidence, not an automatic normalization or professional conclusion.

## Gates and retained financial evidence

- G4 **passed**: deterministic engine completed.
- G0 **open**, G1 **blocked**, G2 **blocked**, G3 **blocked**, G5 **open**, G6 **blocked**, and G7 **blocked**.
- The quarantined adjustment remained visible with reason **`Missing adjustment amount`**.
- The A/R-to-GL difference remained visible at **$4,539.31**, yielding one open finding. It was neither suppressed nor force-balanced.
- Cash-to-GL, ERA-to-bank, and matched-cash-to-GL each matched at **$32,463.61**.

## Post-run oracle comparison

The run matched the Challenge D expected results for charges ($79,181.62), allowed amount ($37,002.92), cash through valuation ($32,463.61), open A/R ($4,539.31), claim lines (333), payments (632), all-date bank deposits ($37,002.92), and all-date GL cash ($37,002.92).

The subsequent-cash measure did **not** conform: the oracle expects **$4,312.15** through 2026-08-31, while the run reports **$4,539.31** because the current calculation has no upper observation-window boundary. The full diagnosis and required correction are recorded in `docs/operations/known-divergences/rs-provider-departure-002-subsequent-cash-window.md`.

## Authority boundary

No reviewer decision or professional assumption was created. The result is intentionally limited to deterministic evidence and governed draft export. It must not be represented as a professional Revenue Sustainability conclusion or client-release authorization.
