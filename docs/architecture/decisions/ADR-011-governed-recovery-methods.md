# ADR-011: Recovery methods run in parallel and remain governed

- **Status:** Accepted for MVP engineering.
- **Authority:** REDWOOD-RECOVERY-METHODS-001 direct user milestone.

## Decision

Recovery methods are versioned, run-bound calculations. Collection-distribution, percent-of-charges, and composite methods preserve observed cash, component outputs, evidence state, scope, cutoff, lineage, and dependency fingerprint independently.

A composite has no default weighting. It remains unapproved unless governed combination inputs, rationale, reviewer authority, and approval exist. Segment overrides are evidence-bound and invalidate on dependency changes.

## Boundary

As-of analysis uses only evidence available by its governed cutoff. Retrospective reconstruction may use later collections only when explicitly designated and must never be relabeled as contemporaneous A/R evidence.
