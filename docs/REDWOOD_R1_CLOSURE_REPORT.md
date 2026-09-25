# Redwood R1 Closure Report — Build 003

**Build 002 source:** `c7bd42a207f9c7ef625d096371ebdd82dbbe5f09`  
**Build 003 branch:** `build/redwood-r1-closure-v0.3`  
**Status:** closure mechanisms partially implemented; not yet ready for Assurance 001C because reviewed MappingDecision objects are not yet the sole canonicalization authority and the Workbench lacks a complete visible disposition form.

## Assurance 001B closure matrix

| Finding | Build 003 result | Evidence |
| --- | --- | --- |
| Workbench DealScope | Partially closed | Intake sends/persists scope; server runs scoped analyze/reconcile and scope contributes to fingerprint. |
| Authoritative Mapping Layer | Partial | Shared canonical alias registry drives mapping inference and critical ingestion aliases; full MappingSet-driven recanonicalization is not complete. |
| Finding disposition | Partial | First-class persisted disposition endpoint, evidence/rationale requirement, profile policy and gate support added; full Workbench UI/lifecycle remains incomplete. |
| Evaluation-time approval validity | Closed for server gate evaluation | Server supplies run profile/fingerprint to gate evaluation; stale decisions are inactive under mismatch. |
| Workbook derived ageing/payment semantics | Partially closed | Workbook binds to run profile/scope and shows source/derived ageing; Recovery Analysis uses derived buckets. |

## Full ENG001 regression

- Drive workbook SHA-256: `581dae68ece024229e68095e86490ec5fbc0d38905a01e04e0fec0b2aa23f4b4`
- Raw sheets processed before Validation_Truth: Claims_Raw, Payments_Raw, AR_Snapshot_Raw, GL_Monthly_Raw
- Result: all 10 Validation_Truth controls matched after the raw-sheet engine run.
- Expected G3 reconciliation exception remained visible. No balancing entry was created.

## Current verification

```text
pnpm build
pnpm typecheck
pnpm test  # 18/18 passed
pnpm --filter @redwood/core eng001-full
```

## Remaining divergences

1. Mapping decisions are not yet consumed as a complete reviewed MappingSet by canonicalization; the shared alias configuration is an intermediate authoritative configuration, not a full reviewed mapping execution pathway.
2. Finding disposition endpoint is present but the Workbench lacks complete visible disposition lifecycle UX and automated disposition invalidation endpoint coverage.
3. Build 003 CI has not yet run remotely on GitHub.
4. Native Excel/LibreOffice formula recalculation remains unobserved.

## Assurance 001C readiness

**Not ready.** The core scoped runtime, fingerprint behavior, payment mapping, and derived workbook ageing have progressed, but the two incomplete closure mechanisms above must be completed before a truthful Assurance 001C candidate can be presented.
