# ADR-003: A/R analytics use an explicit valuation snapshot

- **Status:** Accepted for MVP engineering.
- **Authority:** Direct user build brief.

## Decision

Retain every imported A/R snapshot as a lineaged canonical population. When a run contains multiple snapshot dates and no reviewer-selected valuation date exists, use the latest supplied snapshot for A/R analysis and the A/R-to-GL control. Emit an open data-quality finding stating the selected date and that earlier snapshots were not aggregated.

## Rationale

Summing snapshots over time double-counts receivables and violates the requirement not to mix snapshots silently. Selecting the latest date is a deterministic, explainable engineering fallback, not a professional accounting policy.

## Consequences

- The workbook labels source rows as `Active` or `Historical` and collection-curve formulas use active rows only.
- Future Method Profiles or reviewer decisions can override the selected valuation date explicitly.
- Mixed snapshots remain visible for review.
