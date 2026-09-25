# Project Redwood — R1 Remediation Report

**Build:** 002 / Assurance 001 remediation  
**Source build:** `build/redwood-qor-mvp-v0.1` at `b19e08000fd8ea30c56cbfb697900f0ab0eca34d`  
**Remediation branch:** `build/redwood-r1-remediation-v0.2`  
**Status:** engineering candidate; not yet ready for Assurance 001B because the authorized full ENG001 corpus is unavailable in this runtime.

## Remediation matrix

| Assurance 001 finding | R1 result | Evidence |
| --- | --- | --- |
| G7 bypassed prerequisites | Fixed | `gates.ts`; explicit test blocks G7 for each blocked prerequisite. |
| No first-class scope/cutoff | Partially fixed | `DealScope`, scope validation, valuation cutoff, subsequent-cash test. Workbench scope capture remains incomplete. |
| Claim versions double-count | Fixed for explicit relationships | `Claim.familyId`, status, supersession; ENG002 replacement regression. |
| Unapplied cash increased realization | Fixed | analytics separates all cash, allocated collections, unapplied, refunds, recoupments, transfers, subsequent cash. |
| Profile policy hard-coded | Fixed | JSON profile loader; draft profile stays unset; separate synthetic scenario profile. |
| Invalidation helper not runtime-bound | Fixed for current mapping state | run dependency fingerprint and stale-decision invalidation on mapping changes; source changes create distinct runs. |
| Compact ENG001 substituted for full corpus | Open external dependency | `docs/operations/known-divergences/r1-full-eng001-corpus-unavailable.md`. |
| A/R ageing trusted source fields | Fixed for scoped analysis | deterministic date-based derivation and 0/30/31/60/61/90/91/120/121 tests. |
| Recovery called collection curve | Fixed | workbook sheet renamed `Recovery Analysis`. |
| GL missing from trace | Fixed | GL records written to `Source Trace`; workbook test asserts it. |
| Optional adjustments rejected | Fixed | required-type intake validation; live five-file verification. |
| Finding disposition/release path | Partial | run-bound reviewer decision and G0–G7 controls exist; dedicated evidence-backed disposition workflow remains incomplete. |
| Workbook semantic mismatch | Fixed for cash/recovery/GL semantics | R1 workbook distinguishes all/allocated/unapplied/subsequent cash and has GL trace. |

## R1 tests and verification

Local R1 verification has demonstrated core tests through the remediation sequence, including gate dependencies, claim supersession, valuation boundary, A/R ageing boundaries, profile loading, fingerprint validity, workbook trace, and optional-adjustment intake. The GitHub Actions workflow at `.github/workflows/r1-verify.yml` is configured to independently run:

```text
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test
pnpm demo
pnpm heldout
node scripts/validate-conformance.mjs docs/evidence/redwood-r1-remediation-v0.2.conformance.json
```

No remote CI run is claimed in this report until GitHub executes the pushed workflow.

## Fixture results

- **ENG001_CONTROL_FIXTURE:** retained unchanged as a compact control fixture; expected differences remain visible, not plugged.
- **ENG002:** explicit `E2-C001` replacement relationship prevents the original `$200.00` and replacement `$220.00` from double-counting active gross charge.
- **Full ENG001 corpus:** not exercised. The authorized full corpus was not available in this runtime; this remains a documented blocker.
- **Gold Deal / ICP001 / CHAOS001 / SCALE001:** not created, inspected, or used.

## R1 artifacts

- `artifacts/ENG001-r1-synthetic-scenario.xlsx`
- `artifacts/held-out-r1-synthetic-scenario.xlsx`
- `artifacts/held-out-r1-synthetic-scenario.json`

Build 001 artifacts remain preserved under their original names.

## Known divergences / blockers

1. The complete authorized ENG001 corpus must be materialized or made available as controlled external evidence before Assurance 001B.
2. The draft Method Profile remains professionally unapproved; its recovery values are intentionally null.
3. The local V8 artifact store is not a production multi-user or HIPAA-ready persistence system.
4. Formula structure is tested, but native Excel/LibreOffice recalculation has not been independently observed.
5. Workbench UI does not yet capture a full Deal Scope or a dedicated finding-disposition record.

## Readiness determination

**Not ready for Assurance 001B yet.** The core remediation mechanisms are materially improved, but the full-corpus integration requirement and the remaining review/scope UX evidence are incomplete. No professional authority or external corpus result has been fabricated to produce a green conclusion.
