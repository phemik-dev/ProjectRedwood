# ADR-001: Method profiles are versioned executable configuration

- **Status:** Accepted for MVP engineering; professional policy values remain unapproved.
- **Authority:** Direct user build brief.

## Context

Redwood must support different professional QoR methods without embedding professional policy as global engine behavior. The model must preserve deterministic software invariants separately from professional methodology choices.

## Decision

Use a first-class immutable `MethodProfile` associated with each `AnalysisRun`. Profiles contain accounting basis, source expectations, ageing definition, reconciliation tolerance, recovery method/assumptions, normalizations, and release requirements. A profile is cloned to create a new version; a version used in a released run is never mutated. Values that require professional judgment remain nullable until explicitly approved.

## Consequences

- The engine receives a profile rather than hidden global assumptions.
- Changes to a profile or an assumption invalidate dependent approvals.
- The seed Redwood profile is an engineering hypothesis and cannot claim professional approval.
- Future proprietary firm profiles can use the same core engine.

## Preserved invariants

- Unreconciled differences remain visible.
- Observed, estimated, and adjusted amounts remain distinct.
- Professional judgment is explicit and approval-bound.
