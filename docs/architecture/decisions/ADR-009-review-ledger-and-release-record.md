# ADR-009: Professional review ledger and release records are run-bound

- **Status:** Proposed for implementation.
- **Authority:** REDWOOD-PROFESSIONAL-WORKBENCH-001 direct user milestone.

## Decision

Observed evidence, system findings, reviewer decisions, adjustment candidates, approved treatments, materiality assessments, and release records are separate immutable artifacts. Professional artifacts bind to an exact run, methodology version, dependency fingerprint, reviewer identity, rationale, evidence references, and timestamp.

An approved treatment is an overlay on observed economics. It never mutates canonical source facts, reconciliation controls, or calculated Revenue Realization/Sustainability values. A draft workbook remains draft unless a valid immutable release record exists.

## Invalidation

Any change to source set, mapping, scope, method, calculation engine, finding evidence, or professional ledger dependency invalidates dependent decisions, treatments, materiality assessments, and release records. Invalid records remain preserved with their reason; they never carry forward silently.

## Unresolved methodology

Materiality scope (run-wide versus control-specific) remains a professional-method decision. The implementation may record proposed/approved materiality but must not use it to force an arithmetic reconciliation pass.
