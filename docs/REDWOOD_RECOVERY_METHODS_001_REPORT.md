# REDWOOD-RECOVERY-METHODS-001 Report

## Status

**PROVEN — RECOVERY-METHOD SYSTEM CAPABILITY.** This is not professionally validated recovery methodology.

## Architecture

`packages/core/src/recovery.ts` adds extensible collection-distribution, percent-of-charges, and composite method contracts. Outputs preserve observed target balance, evidence references, as-of date, reconstruction window, segment selection, expected recovery, exclusions, and evidence state separately from any professional treatment.

## Method behavior

- Collection-distribution uses only observations within the explicit reconstruction window and returns insufficient state where history is inadequate.
- Percent-of-charges uses exact-cent rational arithmetic and excludes targets lacking a charge basis rather than creating zero.
- Composite runs component methods independently and applies ordered segment rules/fallback; it does not silently install weighted approval or replace component evidence.
- Retrospective reconstruction has an explicit evidence window and cannot be relabeled as contemporaneous as-of evidence.

## Governance

ADR-011 prohibits default composite weighting. Segment choices/overrides are evidence-bound and must become reviewer-governed artifacts before professional treatment. No recovery calculation creates an approved QoR adjustment.

## Proof fixtures

Authored regression fixtures and excluded truth contracts were added for:

- `RR-COHORT-CURVE-001`
- `RR-PERCENT-CHARGES-001`
- `RR-COMPOSITE-001`
- `RR-SEGMENT-OVERRIDE-001`

Each is labelled authored regression evidence, not practitioner validation. Tests preserve zero automatic normalization and component separation.

## Presentation

Recovery presentation additions use the existing Analyze/Review and workbook architecture to show method identity, evidence state, components, exclusions, and evidence-only treatment. Observed, estimated, candidate, and approved layers remain distinct.

## Verification

- `pnpm test`: 43 core tests plus 6 registry tests passed.
- Core/workbench typecheck passed.
- Build passed.
- `RECOVERY-METHODS-001` conformance validated.

## Methodology limitations

No claim is made that a chosen historical window, cutoff, percent, composite weighting, segment override, or recovery method is professionally correct. Those remain professional validation decisions.
