# ADR-002: Use integer cents and first-class reconciliation artifacts

- **Status:** Accepted for MVP engineering.
- **Authority:** Direct user build brief.

## Decision

Represent monetary values as `bigint` integer cents in the canonical model. A missing money field is `undefined`, never zero. Use typed reconciliation artifacts containing population definitions, both totals, difference, arithmetic tolerance status, professional-materiality status, and lineage evidence.

## Rationale

IEEE floating point can create false variances. A bare comparison cannot show what populations were compared or whether a professional decision exists. Both problems undermine inspection.

## Consequences

- Workbook conversion happens only at output boundaries.
- A one-cent arithmetic tolerance is distinct from nullable professional materiality.
- No reconciliation function can add a plug/balancing event.
- Population-specific GL controls can remain separately represented when their definitions differ.
