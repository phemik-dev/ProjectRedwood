# Redwood Synchronisation Ledger

## UI front-door ingestion

| Capability | Status | Evidence |
| --- | --- | --- |
| UI-INGEST-001 — Challenge A front-door path | **IN SYNC / PROVEN** | `docs/UI_INGEST_001_REPORT.md`, `docs/evidence/ui-ingest-001.conformance.json`, browser run `25a549c1-e42a-4cab-a2de-6a1fc3ad2d14` |
| Challenge A source package | Frozen | ZIP SHA-256 `9d48c8b4a585f75bf912a72c3f9789fd0ef8bd4db6259904b9e561071c2acf17` |
| Challenge A MappingSet | Frozen evidence | `4154ed1f-6cfb-4dd5-984c-6c5a029f48db` |
| Challenge A truth comparison | Matched | Population, billed, allowed, cash, A/R, ageing, bank total and ERA-to-bank controls all matched post-run. |

## Scale estate

| Capability | Status | Evidence |
| --- | --- | --- |
| 1M scale corpus physical custody | Refer to canonical main branch ledger | The UI-INGEST branch does not duplicate scale corpus artifacts. |
| 10M scale corpus physical custody | Refer to canonical main branch ledger | The UI-INGEST branch does not duplicate scale corpus artifacts. |

## Backlog, intentionally outside UI-INGEST-001

- `UX-MAP-002` — distinguish financial-semantic mapping review from operational/provenance metadata in the Action Required queue.

## Scenario identity governance

Semantic scenario IDs—not corpus letters—are the durable proof identities. The registered bindings, Challenge D governance proof, exact source hashes, and provider-departure semantic verification are in `docs/SCENARIO_IDENTITY_REGISTRY.md`.

## Current frozen proof

`RR-MIGRATION-001 — PM/RCM migration with explicit provider crosswalk and independent control retention`

Challenge F is frozen as a **PROVEN** migration/routing/reconciliation proof. Run `3f1715a9-4c60-4097-bb11-d141f29b3d04` accepted separately attributable native LEGACY_PM and NEW_RCM populations, used its explicit 24-entry provider crosswalk with complete coverage, retained independent A/R, GL, and bank controls, and reconciled all four controls at $0.00 difference. G3/G4 passed but G7 remained blocked by G0/G2/G5/G6; a draft workbook was compiled without implying client-release authority. The immutable binding and conformance evidence are in `docs/RR_MIGRATION_001_REPORT.md` and `docs/evidence/rr-migration-001.conformance.json`.

## Programme proof status

| Corpus lane | Semantic capability | Status |
| --- | --- | --- |
| A | Front-door ingestion | **PROVEN** |
| B | Typed cash-event and recoupment semantics; malformed-adjustment quarantine | **PROVEN — no truth contract supplied** |
| C | Service-line coverage proof | **PROVEN — comparison limitation retained** |
| D | Gated draft/release governance | **PROVEN** |
| D | Provider-departure Revenue Sustainability — deterministic windowed evidence | **PROVEN — professional judgment remains unapproved** |
| Synthetic | Nonzero provider-departure evidence with reviewer-governed normalization boundary | **PROVEN — authored regression; professional normalization not exercised** |
| E | Ownership/site context retention, separate presentation, and non-fabrication of same-store economics | **PROVEN — zero-population coverage limitation** |
| F | PM/RCM migration, routing, and explicit provider crosswalk | **PROVEN** |
| System | Professional Workbench and Release Governance | **PROVEN — system workflow; practitioner validation remains open** |
| Estate | Data Estate integration | **PROVEN — source/rights/custody/adapter registry; external reacquisition remains governed** |

Challenge E run `ad47195e-f0d3-4e84-b886-0f8ecbbfcd4a` retains lineaged LOC04 acquisition context, matches all ten published post-run oracle assertions, and has no reconciliation findings. Its acquired-site post-close population is zero, so it does not prove treatment of a nonzero acquired-site population.

Corrected run `34976659-a74d-4aa8-b927-c84a452dcafd` records immutable `subsequentCashEnd` `2026-08-31` and matches all nine Challenge D oracle measures. It preserves PRV-004 run-bound evidence, the existing A/R finding, and blocked release governance. James Kader, CFO, recorded G5 as **noted** on decision `b04c2743-9e44-4f0e-b4a5-5e7c51f8c44a`; this documents the risk without approving an adjustment or release. The prior open window defect is resolved in `docs/operations/known-divergences/rs-provider-departure-002-subsequent-cash-window.md`.

Challenge B run `1ddd85d4-7915-46c6-96b4-78b0ef9ff5ba` reconfirms typed payer, patient, partial-payment, and recoupment semantics, seven malformed-adjustment quarantines, visible A/R difference, and blocked release governance. Its complete supplied archive has no truth-oracle contract; that limits only an external aggregate-output claim and is recorded in `docs/REDWOOD_CASH_EVENT_002_REPORT.md`.

Synthetic run `6884cf5f-724b-4d18-8d6d-a0f27f0d6ede` proves nonzero PRV-DEP pre/post-departure/FTE evidence, all 15 authored truth-contract assertions, and the absence of automatic normalization. It remains evidence-only; reviewer approval is still required for any QoR conclusion.

## Next governed movement

Freeze Challenge E; do not alter it to manufacture a nonzero acquired-site result. The next nonzero-economic-effect proof sequence is: (1) payer/reimbursement shift, then (2) patient-responsibility deterioration. Each requires a separately authorized corpus with an explicit truth contract. Before claiming a professional Revenue Sustainability conclusion, obtain an explicit **approved** reviewer judgment bound to the exact run, Method Profile, and supporting evidence. Do not reopen Challenge F absent a regression against the population-specific supersession invariant. No alternate loader or fixture injection is authorised.
