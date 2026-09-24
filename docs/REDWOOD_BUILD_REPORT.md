# Redwood Build Report — Physician Group QoR MVP v0.1

**Build branch:** `build/redwood-qor-mvp-v0.1`  
**Report status:** implementation evidence through the current synthetic MVP slice; not a production or professionally approved release.

## Overall status

Redwood now executes a traceable synthetic physician-group flow:

`CSV/XLSX source pack → source hashing / row lineage → canonical records → reconciliation + QoR analysis → review gates → formula-driven draft XLSX`

The current state demonstrates the governing invariant: it surfaces rather than plugs the ENG001 cash and A/R differences. It is suitable as an inspectable engineering MVP foundation, not as evidence of production HIPAA readiness or professional QoR approval.

## Architecture implemented

- **Method kernel:** draft, versioned engineering-hypothesis Method Profile in `methodology/redwood-qor-v0.1.json`; deterministic versus professional-rule distinction; ADR-001.
- **Canonical model:** claims with versions, typed cash events, typed adjustment events, explicit A/R snapshots, GL records, source-row lineage, review decisions, mappings, and gates in `packages/core/src/`.
- **Ingestion:** CSV plus selected XLSX worksheet adapter; source hashes, stable row identifiers, blank/sign preservation, duplicate-file/record quarantine, and direct-PHI header exclusion.
- **Reconciliation and analytics:** integer-cent (`bigint`) arithmetic, all-cash/GL, matched-cash/GL, A/R/GL controls, realization measures, recovery estimates, and payer/provider/location/service-line concentrations.
- **Review:** run-bound mapping approvals and G0–G7 status; draft export is separated from client-release authorization; review decisions carry reviewer/rationale/timestamp.
- **Persistence:** local immutable run artifact store that survives a local-server restart. Runtime records are intentionally excluded from Git.
- **Excel compiler:** formula-bearing XLSX with Executive Summary, QoR Waterfall, Cash Collections, AR Aging, Payer, Location, Provider, Service Line, Collection Curves, Assumptions, Reconciliation, Findings, and Source Trace.
- **Workbench:** local work-state UI at `apps/workbench/` following Intake → Map → Reconcile → Analyze → Review → Export.

## Workstreams

| Workstream | Status | Evidence |
| --- | --- | --- |
| A Method Kernel | Engineering complete; professional approval open | `methodology/redwood-qor-v0.1.json`, ADR-001 |
| B Canonical Revenue Model | Implemented for ENG001/ENG002 scope | `packages/core/src/types.ts`, `ingest.ts` |
| C Corpus & Ingestion | ENG001 + ENG002 and CSV/XLSX adapter implemented | `fixtures/eng001/`, `fixtures/eng002/` |
| D Reconciliation Engine | Implemented for core cash/A/R controls | `reconciliation.ts`, ENG001 demo |
| E QoR Analytics | Initial realization and concentration scope implemented | `analytics.ts` |
| F Professional Review | Run-bound mapping/decision/gate primitives implemented | `review.ts`, `gates.ts`, workbench |
| G Excel Compiler | Formula-bearing draft compiler implemented | `workbook.ts`, `artifacts/ENG001-redwood-draft.xlsx` |
| H Workbench | Local workbench implemented | `apps/workbench/` |
| I Assurance | Unit and local integration evidence established | `packages/core/src/core.test.ts`, conformance record |

## Tests and observed evidence

The last full verification run passed:

```text
pnpm build
pnpm typecheck
pnpm test     # 11/11 passed
pnpm demo
node scripts/validate-conformance.mjs docs/evidence/redwood-qor-mvp-v0.1.conformance.json
```

ENG001 demo reproduced, without balancing entries:

| Control | Difference |
| --- | ---: |
| all cash to GL cash | $750.00 |
| matched cash to GL cash | $1,071.45 |
| A/R snapshot to GL A/R | $1,405.01 |
| unmatched cash | $321.45 |

Key local integration observations are recorded in `docs/evidence/redwood-qor-mvp-v0.1.conformance.json`: CSV run creation, XLSX A/R upload, mapping approval, persisted reviewer decision after server restart, and G3/G7 blocking while draft export remained available.

## Artifacts

- Sample workbook: `artifacts/ENG001-redwood-draft.xlsx`
- ENG001 fixture: `fixtures/eng001/`
- ENG002 structural-variation fixture: `fixtures/eng002/`
- Conformance record: `docs/evidence/redwood-qor-mvp-v0.1.conformance.json`
- Gold Deal comparison lane: `docs/GOLD_DEAL_VALIDATION.md`

## Known technical and professional-policy gaps

1. Method Profile v0.1 is explicitly an **engineering hypothesis**, not professionally approved.
2. The workbench stores runtime data locally with a V8 artifact store; it is not a multi-user, production-security, or HIPAA-ready database.
3. Mapping inference supports configured exact aliases; broader schema inference, preamble/footer detection, and a full mapping-rule editor are incomplete.
4. Reconciliation scope currently covers core cash and A/R controls; claims-source totals, allocation controls, trend/volume-rate decomposition, and additional operational controls need extension.
5. ExcelJS writes formulas but does not calculate them. Structural formula checks run in tests; independent Excel/LibreOffice recalculation is still required for release assurance.
6. ENG002 is synthetic variation, not a held-out independently maintained acceptance pack. No genuine held-out fixture or Gold Deal data has been used.
7. Findings cannot yet be fully dispositioned through a dedicated workflow; therefore a release-pass path is intentionally not demonstrated.
8. The direct-PHI header exclusion is an MVP input control only; production privacy/security architecture remains out of scope.

## Gold Deal readiness assessment

**Ready for controlled validation intake, not final professional comparison.** Redwood can retain source lineage, create a canonical run, expose mapping and reconciliation differences, and populate a comparison matrix while leaving unavailable values unavailable. Gold Deal onboarding must still establish source adapters, professional Method Profile differences, and any required canonical-model extensions before it can be declared comparable.

## Commit evidence

- `0b46e85` — core evidence engine
- `5a07117` — local workbench
- `9a6d5ca` — approved build toolchain
- `22eac18` — ENG002 and workbook control expansion
- `44ea603` — persistent run/review artifacts
- `66ca057` — mapping decisions
- `c40a9ff` — review-gate enforcement
- `095b357` — PHI exclusion and Gold validation lane

## Recommended next action

Create an independently controlled held-out synthetic source pack and test a fresh empty engagement end-to-end. In parallel, obtain professional review of the draft Method Profile rather than embedding unresolved policy in code.
