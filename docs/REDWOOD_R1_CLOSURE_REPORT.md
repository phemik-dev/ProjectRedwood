# Redwood R1 Closure Report — Build 003

**Build 002 source:** `c7bd42a207f9c7ef625d096371ebdd82dbbe5f09`  
**Build 003 branch:** `build/redwood-r1-closure-v0.3`  
**Status:** local closure candidate; MappingSet changes/rejections now produce successor runs. Remote CI execution remains pending.

## Assurance 001B closure matrix

| Finding | Build 003 result | Evidence |
| --- | --- | --- |
| Workbench DealScope | Partially closed | Intake sends/persists scope; server runs scoped analyze/reconcile and scope contributes to fingerprint. |
| Authoritative Mapping Layer | Closed locally | Critical claim/payment/A/R/GL fields execute through MappingSet; Mapping review creates successor runs from retained source artifacts; rejected mappings return unavailable values rather than stale aliases. |
| Finding disposition | Substantially closed | First-class persisted disposition endpoint, evidence/rationale requirement, profile policy/gate support, and visible Workbench disposition form; lifecycle invalidation coverage remains incomplete. |
| Evaluation-time approval validity | Closed for server gate evaluation | Server supplies run profile/fingerprint to gate evaluation; stale decisions are inactive under mismatch. |
| Workbook derived ageing/payment semantics | Partially closed | Workbook binds to run profile/scope and shows source/derived ageing; Recovery Analysis uses derived buckets. |

## Full ENG001 regression

- Drive workbook SHA-256: `581dae68ece024229e68095e86490ec5fbc0d38905a01e04e0fec0b2aa23f4b4`
- Raw sheets processed before Validation_Truth: Claims_Raw, Payments_Raw, AR_Snapshot_Raw, GL_Monthly_Raw
- Result: all 10 Validation_Truth controls matched after the raw-sheet engine run.
- Expected G3 reconciliation exception remained visible. No balancing entry was created.

## Authoritative MappingSet → Successor Run Closure

A controlled lifecycle trace retained original source artifacts on Run A and replayed them with MappingSet v2 for Run B.

- Run A used `Billed_Amount → grossCharge` and produced `$100.00`.
- Run B used `Alternate_Billed → grossCharge` and produced `$120.00`.
- Run B references Run A through `parentRunId`.
- MappingSet IDs and dependency fingerprints are distinct.
- Run A remains unchanged; Run B starts with no carried-forward decisions or dispositions.

## Current verification

```text
pnpm build
pnpm typecheck
pnpm test  # 20/20 passed
pnpm --filter @redwood/core eng001-full
```

## Remaining divergences

1. Native Excel/LibreOffice formula recalculation remains unobserved.
2. Disposition invalidation endpoint coverage remains incomplete, although stale dispositions are inactive when their fingerprint no longer matches.

## CI result

GitHub Actions passed for SHA `01399967a3e8eb55da9117be1865572b61318dd2`:

https://github.com/phemik-dev/ProjectRedwood/actions/runs/36172719893

## Assurance 001C readiness

**Ready for Assurance 001C.** The required successor-run MappingSet lifecycle is demonstrated locally and the Build 003 GitHub Actions workflow passed. Remaining items are evidence limitations rather than a bypass of the R1 core governance invariant.
