# RR-MIGRATION-001 — PM/RCM migration with explicit provider crosswalk and independent control retention

## Status

**PROVEN** for migration routing, explicit provider identity resolution, native attribution, independent reconciliation controls, and gated draft export.

This proof does **not** constitute professional release authority or, if the programme closure rule requires it, formal end-to-end scenario closure before a post-run hidden truth-oracle comparison is performed.

## Authority and claim boundary

This semantic scenario is bound to Challenge F, whose corpus letter is only a transport label. The proof demonstrates that a complete native PM/RCM cohort may supersede duplicate root transaction populations while retaining root control populations. It does not claim that G3/G4 success authorizes client release.

## Exact execution evidence

- **Run:** `3f1715a9-4c60-4097-bb11-d141f29b3d04`
- **Persisted run:** `apps/workbench/data/runs/3f1715a9-4c60-4097-bb11-d141f29b3d04.bin`
- **Unchanged staged package:** `.tmp/Redwood_Challenge_F_pm_rcm_migration_v0.1.zip`
- **ZIP SHA-256:** `ebe4117ea4ee02c1982613a914f1e38793d0f03cf728a4f59053b5b1fb87575a`
- **Draft workbook:** `.tmp/redwood-3f1715a9-4c60-4097-bb11-d141f29b3d04.xlsx`
- **Workbook response:** HTTP 200; 97,128 bytes; SHA-256 `52dc473a8cbd13c4bfbe3e3626f2832431bc3d5ed6787ac344374eb721122538`

## Source-artifact binding

| Source artifact | Classification | SHA-256 |
| --- | --- | --- |
| `F_pm_rcm_migration/AR_Snapshot_Raw.csv` | A/R control | `fc0299eead6ca3e2704bb6627803b87fd06e70116db18d23fa36005d50e1e213` |
| `F_pm_rcm_migration/Bank_Deposits.csv` | bank-deposit control | `a7680b666897848e831e9f8a2b4272cb218d2c26d40afcdc6735b738cce1ce2b` |
| `F_pm_rcm_migration/Claims_Raw.csv` | duplicate root claims, superseded | `18129eb948a65d4361fac0a042b004b59c986d0d6709328c67b24acd8dca0bd0` |
| `F_pm_rcm_migration/GL_Monthly_Raw.csv` | general-ledger control | `e608d59d16640f9086405b5f6cee0bb24a6a58762fee3ace633017ed59421349` |
| `F_pm_rcm_migration/Migration_Crosswalk.csv` | explicit provider crosswalk | `ea220eb9f0a4ece8e8fde2c77c53a4f625924f380962f5cec8e160cf75188b14` |
| `F_pm_rcm_migration/Payments_Raw.csv` | duplicate root payments, superseded | `8a9a20552cfb342a5f4b013e5aa5c09fbb76168438d4d694bc3e54b2d9d70bd5` |
| `F_pm_rcm_migration/Location_Master.csv` | supporting | `94d7f950b7dc2f21bc80cf2b6ed543037f3577103e92abde3da1ade49be23cb4` |
| `F_pm_rcm_migration/Payer_Master.csv` | supporting | `1bbd12729c560d0dbf75c30632b5d0c35dce0d4d6a1330f991cb9f319c23c9bf` |
| `F_pm_rcm_migration/Provider_Master.csv` | supporting | `4f88050195f3f6fb89831acd66146e7805720cf3b2ede9cd38299eb197a7f011` |
| `F_pm_rcm_migration/README.md` | supporting | `b0dd008dcb966ef7dd57d9788a50cd3fcdb568cb01b238c18de1840a30e3f15c` |
| `F_pm_rcm_migration/Validation_Truth.csv` | truth oracle excluded | `afcfae34d0399798c3339267c0988adfac13e9cc6aa3bbb25d55909e6493654` |
| `F_pm_rcm_migration/manifest.json` | supporting | `e0264f8a51ffef69a4be0a294812e6a65f1b48186ee4ef1680b92c4825476aa9` |
| `F_pm_rcm_migration/source_native/Legacy_Cash.csv` | LEGACY_PM cash | `ec314a484fff5e7e1edada5827d4170e3b161da63748ae258c6b79f3127c30b1` |
| `F_pm_rcm_migration/source_native/New_Cash.tsv` | NEW_RCM cash | `c9ef925b0a4c272a8f1f436d32b33b42eb025ca55ef6dcd1b740301e8bbf1bdf` |
| `F_pm_rcm_migration/source_native/PM_Legacy_Charges.csv` | LEGACY_PM charges | `c3b8569ef93d348e406cd1d0200a8dcbff6a010309559fae6189adab6daee5a8` |
| `F_pm_rcm_migration/source_native/RCM_New_Charges.csv` | NEW_RCM charges | `8a5a71899dbfd37c2941f6a66ed3c7fe7485c7506bd7281bca106a4c0842fd20` |

`Validation_Truth.csv` was explicitly classified as `truth_oracle_excluded` and was not used by the deterministic engine.

## Observed behaviour

### Native cohort and explicit provider crosswalk

- The run retained four separately attributable native contributions: 302 LEGACY_PM cash rows, 333 NEW_RCM cash rows, 244 LEGACY_PM charge rows, and 236 NEW_RCM charge rows.
- Every row was accepted; no native row was rejected or quarantined.
- The explicit crosswalk contained 24 entries. Both LEGACY_PM and NEW_RCM had 12 native providers, 12 mapped providers, and no missing provider IDs.
- Native source files remained distinct in run-bound migration evidence; they were not collapsed into display-name-based identities.

### Independent reconciliation controls

| Control | Left | Right | Difference |
| --- | ---: | ---: | ---: |
| All cash to GL cash | $37,274.33 | $37,274.33 | $0.00 |
| ERA cash to bank deposits | $37,274.33 | $37,274.33 | $0.00 |
| Matched cash to GL cash | $37,274.33 | $37,274.33 | $0.00 |
| A/R snapshot to GL A/R | $16,215.50 | $16,215.50 | $0.00 |

No balancing entry was used or required. The run had zero open findings.

### Governance and export

- **G3 passed:** all reconciliation controls matched.
- **G4 passed:** deterministic processing completed with run-bound migration evidence and complete crosswalk coverage.
- **G7 remained blocked:** G0 was open, G2 and G6 were blocked, and G5 was open. A draft workbook was therefore available but was not a client-release authorization.

## Durable architectural lesson

> **Source supersession is population-specific, not folder-specific. Native transactional sources may replace duplicate transaction populations without displacing independent control populations.**

This is now the ingestion/router contract in `docs/architecture/decisions/ADR-006-population-specific-source-supersession.md`, implemented by `apps/workbench/source-routing.mjs`, and protected by `apps/workbench/source-routing.test.mjs`.
