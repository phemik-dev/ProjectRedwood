# Redwood Workbench Next Parallel Frontend Integration

## Status

**IMPLEMENTED — parallel clean-room frontend; default switch not authorized.**

## Location

- Existing canonical Workbench: `/`
- Parallel frontend: `/next/index.html`
- Exact directory URL `/next/` is intentionally not claimed because the static server has no directory-index rewrite.

## Canonical preservation

The parallel frontend calls the existing same-origin canonical API only. It does not import core browser code, recalculate financial values, evaluate gates, create a second backend, alter run persistence, modify workbook logic, or substitute fictional economics.

## Phase compatibility

The parallel rail retains Intake → Map → Reconcile → Migration evidence → Analyze → Review → Export. Intake creates canonical intakes/runs; Map creates canonical mapping successors; Review uses existing decision/disposition routes; Export uses the canonical workbook route and server G7 state.

## Verified

- Root Workbench `/`: HTTP 200
- Parallel page `/next/index.html`: HTTP 200
- Parallel JavaScript: HTTP 200
- Canonical API intake path is used by the new UI.
- Migration phase is represented from run-bound `migrationEvidence` and G4.
- Workbench typecheck and static build passed.
- Clean-room conformance record validated.

## Deliberate API gaps

- No run-list route: use `?run=<run-id>` to open a persisted canonical run.
- No evidence-document viewer: drawer reports inventory hashes and finding references only.
- No pagination/search/auth/version negotiation/evidence graph API.
- No local inference of approvals, materiality, recovery approval, release, or unavailable evidence.

## Reversible switch

Keep `/` as fallback. A future explicit approval may add a configuration-controlled default route switch only after manual local parity acceptance. Rollback restores `/` without changing backend behavior or run data.
