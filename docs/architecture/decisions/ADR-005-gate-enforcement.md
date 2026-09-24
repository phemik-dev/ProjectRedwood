# ADR-005: Draft export and client release are separate states

- **Status:** Accepted for MVP engineering.
- **Authority:** Direct user build brief.

## Decision

Compute G0–G7 status as explicit run artifacts. A draft workbook may be generated for review even when gates are open or blocked. G7 cannot pass unless required mappings are approved, reconciliation differences are absent, findings are resolved/reviewed, and a release decision is recorded.

## Rationale

A workbook is a review artifact, not evidence that financial controls passed. Materiality cannot turn an unexplained arithmetic difference into a passing control.

## Consequences

- G3 and G7 stay blocked when an unresolved difference exists.
- Export UI displays the gate/rationale matrix and labels the output draft unless G7 passes.
- Approval decisions remain run-bound and cannot bypass a change by being reused across runs.
