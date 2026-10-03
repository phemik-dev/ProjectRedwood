# REDWOOD-PROGRAMME-SYNC-001 Reconciliation

## Executable baseline

- **Integration branch:** `integration/redwood-current-programme`
- **Baseline SHA:** `74f1643a6c41769b8166667e3f50efea11470a45`
- **Parent implementation SHA:** `e45f272e8da551c1e32480dd297a5653bd910b9a`
- **Remote:** `origin/integration/redwood-current-programme` at the same SHA.
- **Main status:** deliberately not integrated. The integration branch remains divergent from `main`; a later `REDWOOD-MAIN-INTEGRATION-001` must assess that separately.

| Area | Repository before baseline | Live programme state | Evidence | Resolution |
| --- | --- | --- | --- | --- |
| Implementation lineage | `build/redwood-chb-001` at older committed Workbench state; later work only local | RS Engine and Professional Workbench live in worktree | committed baseline SHA and test output | `REPO_STALE` resolved by integration baseline branch |
| UI ingestion | Historical UI proof documents existed on earlier lineage | `UI-INGEST-001` remains PROVEN | report, conformance, run `25a549c1-e42a-4cab-a2de-6a1fc3ad2d14` | `IN_SYNC` |
| Service line | Individual coverage proof, no shared sustainability model in committed history | Coverage limitation is intentional | `RS-SERVICE-LINE-COVERAGE-001`, sustainability module | `IN_SYNC` with limitation retained |
| Ownership/site | Historical run and source evidence were local-only | `RS-OWNERSHIP-SITE-001` PROVEN with zero-population limitation | report, conformance, run `ad47195e-f0d3-4e84-b886-0f8ecbbfcd4a` | `REPO_STALE` resolved in baseline |
| Provider departure | Earlier roster evidence only | RS-PROVIDER-DEPARTURE-004 proves evidence boundary, not normalization | ADR-008, report, run `6884cf5f-724b-4d18-8d6d-a0f27f0d6ede` | `REPO_STALE` resolved in baseline |
| Migration routing | No durable current report/ADR on branch | RR-MIGRATION-001 PROVEN | ADR-006, report, run `3f1715a9-4c60-4097-bb11-d141f29b3d04` | `REPO_STALE` resolved in baseline |
| RS Engine | No committed reusable layer | `REDWOOD-RS-ENGINE-001` system capability PROVEN | sustainability module, reports, conformance | `REPO_STALE` resolved in baseline |
| Professional Workbench | Generic decisions only in earlier branch | `REDWOOD-PROFESSIONAL-WORKBENCH-001` system workflow PROVEN | ADR-009, review ledger/UI/workbook/tests | `REPO_STALE` resolved in baseline |
| Challenge letters | Multiple corpus taxonomies use overlapping letters | Semantic IDs are canonical | scenario registry | `NAMING_CONFLICT` documented; letters remain aliases only |
| Practitioner workbook | Not represented as source or test data | Available only as final workpaper benchmark, no source dataset | external path supplied by programme authority | `DOCUMENTATION_GAP`; current-state index records boundary |

## Uncorroborated or intentionally limited claims

- No practitioner-validated normalization methodology is claimed.
- No real-deal blind source-data validation is claimed.
- Authored regression proofs are not held-out acceptance or practitioner validation.
- The real `FINAL QofR.xlsm` has not been treated as source data or executed as a blind validation corpus.
