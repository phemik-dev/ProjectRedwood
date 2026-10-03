# REDWOOD-PROFESSIONAL-WORKBENCH-001 Report

## Status

**PROVEN — system workflow capability.** This does not claim professional methodology correctness or practitioner validation.

## Professional architecture

Redwood now preserves separate run-bound artifacts for observed findings, reviewer decisions, evidence-backed finding dispositions, adjustment-treatment candidates, approved/rejected treatments, materiality assessments, and release records. Every artifact binds to run, method profile/version, dependency fingerprint, reviewer identity, rationale, evidence references, and timestamp.

Observed economics remain separate from candidate and approved professional treatment. No core calculation, canonical claim, cash population, A/R control, reconciliation, or sustainability observation is overwritten by an approved treatment.

## Invalidation and authority

A mapping change recalculates the dependency fingerprint and centrally invalidates decisions, dispositions, candidates, treatments, materiality assessments, and release records. Invalid records retain an explicit reason: `Mapping state changed`.

Release snapshots are server-derived from the run gate matrix. A request cannot supply or alter the snapshot. Draft workbook availability remains independent of release authorization.

## Review and workbook

The Review stage now contains a run-scoped queue/detail workbench derived from open findings, non-approved mappings, and unmet review/release gates. It shows observed evidence, source context, decision history, stale state, and evidence-required controls.

Workbook additions preserve the existing formulas and reconciliation sheets while adding:

- Adjustment Detail — observed source adjustment events;
- Review Register — candidates, decisions, approved/rejected/superseded provenance;
- Release Gates — compiler-passed method, fingerprint, gate snapshot, and draft/release state.

## Authored proofs

`PROF-NORM-PROVIDER-001` and `PROF-NORM-PAYER-001` are authored regression proof fixtures, not practitioner validation. They prove evidence state and absence of automatic normalization; payer proof remains approval-ineligible without explicit payer canonicalization authority.

## Verification

- Core tests: 30/30 passed.
- Core build/typecheck: passed.
- Workbench typecheck/build: passed.
- Source routing tests: 2/2 passed.
- Live server smoke test persisted candidate, treatment, materiality, and release records, then verified all were invalidated by a mapping change.
- Review Workbench asset served HTTP 200 from the rebuilt Workbench.

## Remaining boundary

Materiality methodology, professional normalization basis, payer canonicalization authority, practitioner validation, and actual release authorization remain professional decisions. This milestone makes their workflow governable; it does not decide them.
