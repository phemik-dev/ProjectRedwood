# REDWOOD-MAIN-INTEGRATION-001 Reconciliation

## Preconditions

- **Current executable baseline:** `integration/redwood-current-programme` at `077930497b057c34e3dfa4423156d45f6ba2f69b`.
- **Current programme-state documentation commit:** `1a3e9176c4a461b93f212d6db1d22be41567d84f`.
- **main:** `68c197597f382c25a63e16e38a8c0eca80cc0884`.
- **Merge base:** `63631b9d5576fddedbe9fa812f29e3d824fc994f`.
- **Scope:** semantic inventory only. No merge, rebase, cherry-pick, reset, or main mutation occurred.

## Main-only commit matrix

| Main commit(s) | Original intent | Integration equivalent | Classification | Integration action | Risk / verification |
| --- | --- | --- | --- | --- | --- |
| `27c7a79`, `ce7848c`, `59ca637`, `fb49bf6`, `5bc9ea4`, `e0346d6`, `2b8b51d` | M1 machine-readable method, reviewer decision schema, ENG001 control fixture, standalone validator/tests | Method Profile, ADR-001/005/009, run-bound review ledger, gates, core tests | `CONFLICTING` | Do not port schema or replace package scripts. Reconcile individual safety assertions later against current TypeScript model. | Main contract uses incompatible field/model names and a standalone Node test layout; current implementation has richer run/fingerprint semantics. |
| `240417b`, `ecf7ca4`, `41f7cdf` | CMS public-data acquisition and transfer workflows | No equivalent committed workflow on integration branch | `REQUIRED — NOT PRESENT` | Selectively port after security/corpus-governance review, outside current method comparison. | External acquisition credentials, artifact size, and data-estate contract must be reviewed. |
| `4b16374`, `8bdb488`, `ad83ae5` | Provider/rate/enrollment discovery and beneficiary recovery workflows | Current sustainability uses authored evidence, not public-data acquisition | `REQUIRED — NOT PRESENT` | Preserve intent for data-estate integration; do not treat as current RS methodology. | May introduce external-data assumptions and PHI/governance concerns. |
| `ff595d3`, `41c285d`, `f386ad7` | Ownership/transaction-context acquisition workflows | RS ownership-site evidence exists, but not public acquisition workflow | `REQUIRED — NOT PRESENT` | Evaluate as separate source-acquisition capability. | Must preserve ADR-006 and ownership evidence boundaries. |
| `1ecde06`, `dbdc432` | CMS PFS 2026 Q4 acquisition/locality repair | Workpaper comparison identifies payer/rate methodology gap but no current PFS source implementation | `REQUIRED — NOT PRESENT` | Preserve for later payer/reference-context capability review. | Public PFS is reference context only, never commercial-contract proxy. |
| `2f9ee38`, `a1e7c56`, `8c5287f` | Full provider economics discovery/transfer workflows | No integration equivalent | `REQUIRED — NOT PRESENT` | Review alongside public-data estate workflows. | Large-transfer/custody and provider-data governance required. |
| `afb1e73`, `dc0448d`, `78a8a28` | Real-world reference cohort contract/build workflow | Current programme explicitly has no blind real-deal source validation | `REQUIRED — NOT PRESENT` | Port only after corpus/lineage review; do not call the benchmark workbook source data. | Must remain separate from practitioner workpaper method benchmark. |
| `d1ad00b`, `c010e47`, `badcd8e`, `68c1975` | Data-estate governance, challenge-corpus documentation, scale corpus custody | Current programme documents taxonomy warning and semantic registry, but lacks main's physical custody/workflow docs | `ALREADY REPRESENTED` for semantic discipline; `REQUIRED — NOT PRESENT` for physical custody/workflow artifacts | Reconcile documentation and selectively port custody/workflow artifacts in a later data-estate integration. | Avoid overwriting current scenario semantics with bare letters. |

## Semantic conclusion

The 29 commits are primarily a **data-estate and M1-contract lineage**, not a replacement for the current analytical, sustainability, or professional-workbench implementation. A textual merge could be clean while introducing incompatible MethodProfile schemas, package scripts, and public-data assumptions.

## Recommended strategy

1. Retain `integration/redwood-current-programme` as the executable analytical baseline.
2. Do **not** merge or cherry-pick `main` wholesale.
3. Create a later, separately authorized data-estate integration plan that ports selected workflow/documentation intent one subsystem at a time.
4. Before porting M1 artifacts, map their invariant assertions into the current TypeScript MethodProfile, review ledger, and gate model rather than restoring obsolete JSON/schema/package structure.
5. `main` is **not safe to promote** today. No architectural conflict requires emergency resolution; the required missing workflows need deliberate governance review.
