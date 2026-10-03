# Redwood Scenario Identity Registry

## Authority and purpose

Scenario letters and folder names are **transport labels**, not proof identities.  A semantic scenario ID is the durable identity for planning, execution evidence, and claims.  A proof may reference more than one semantic capability only where the run-bound source evidence supports each claim independently.

The canonical binding for a scenario execution is:

`semantic scenario ID → capability → corpus lane / letter → exact run ID → exact source-artifact hashes → observed proof status`

Never infer a scenario's capability from its corpus letter.  Never use a later run with a similar letter as evidence for an earlier proof.

## Identity rules

1. Assign semantic IDs in the form `DOMAIN-CAPABILITY-NNN`; retain corpus letters only as aliases.
2. A semantic proof claim must name the immutable run ID and all available source artifact hashes.  A ZIP hash is additive evidence, not a substitute for the run binding.
3. A source package may establish that a scenario contains a semantic event without proving that the relevant calculation or user-visible analysis was executed.
4. If the ZIP package itself is not retained, record this explicitly and use the persisted run's source inventory as the available exact-evidence binding.
5. G1 describes source sufficiency and source validity/quarantine; G2 separately describes canonical mapping review.  A G1 blocker must name the missing/unusable population or quarantine reason, never unreviewed mappings.
6. Before a challenge corpus is inspected, uploaded, or run, copy its authoritative ZIP unchanged into `.tmp/`, record its SHA-256, and use that staged local path for browser execution. This is the user-approved corpus-counting convention.

## Challenge-use discipline

- `08_CHALLENGE_CORPUS` is the canonical professional-scenario semantics corpus. It may shape parsers, mappings, controls, calculations, and error handling.
- `08A_ENGINEERING_VARIANTS` is an adversarial/regression engineering corpus. It may shape the same existing QoR-brief implementation surfaces but does not broaden product scope.
- The M7 held-out deal pack is sealed acceptance evidence. Do not inspect it, use it for implementation decisions, convert it into fixtures, tune mappings/calculations against it, or establish outputs from it before the final M7 acceptance run.
- Challenge-corpus success demonstrates behavioural coverage only; it is not final product acceptance or practitioner validation.
- M7 starts from an empty engagement and processes a genuinely unseen source pack through intake, mapping, reconciliation, analysis, review, and formula-driven workbook export. Record manual interventions and independent reconciliation evidence.

## Registered semantic scenarios and proofs

| Semantic ID | Capability / claim boundary | Corpus alias | Exact evidence binding | Status |
| --- | --- | --- | --- | --- |
| `UI-INGEST-001` | Browser front-door intake through immutable run and post-run truth comparison | Challenge A | Run `25a549c1-e42a-4cab-a2de-6a1fc3ad2d14`; ZIP SHA-256 `9d48c8b4a585f75bf912a72c3f9789fd0ef8bd4db6259904b9e561071c2acf17`; MappingSet `4154ed1f-6cfb-4dd5-984c-6c5a029f48db` | **PROVEN** |
| `REDWOOD-GOV-001` | Unresolved evidence remains visible through deterministic calculation, review, and draft workbook generation; client release stays blocked | Challenge D | Run `c8f21c7f-82a5-47a1-9d21-ab78af14660a`; source inventory in the record below | **PROVEN** |
| `RS-PROVIDER-DEPARTURE-001` | Provider-departure evidence is recognized and carried to a visible, run-bound Revenue Sustainability analysis | Challenge D is a candidate corpus alias; letter is not the proof identity | Browser run `573bc172-0c62-41a7-af87-84171b94280e`; PRV-004 is visible with FTE, dates, departed-before-valuation status, and source trace | **PROVEN — REVIEW EVIDENCE ONLY** |
| `RS-PROVIDER-DEPARTURE-002` | Governed provider-departure execution with post-run oracle comparison | Challenge D | Run `7237d02f-548f-4d1d-8177-334ccb31944f`; ZIP SHA-256 `6d358a0ab03b5919305f65a159dae0a4c158eb68bfb5f9cccd2b3113454c9604`; evidence in `docs/RS_PROVIDER_DEPARTURE_002_REPORT.md` | **SUPERSEDED — subsequent-cash window defect corrected in -003** |
| `RS-PROVIDER-DEPARTURE-003` | Immutable subsequent-cash observation window and governed provider-departure rerun | Challenge D | Run `34976659-a74d-4aa8-b927-c84a452dcafd`; ZIP SHA-256 `6d358a0ab03b5919305f65a159dae0a4c158eb68bfb5f9cccd2b3113454c9604`; `subsequentCashEnd` `2026-08-31`; evidence in `docs/RS_PROVIDER_DEPARTURE_003_REPORT.md` | **PROVEN — deterministic window regression; professional judgment remains unapproved** |
| `RS-PROVIDER-DEPARTURE-004` | Nonzero provider-departure evidence with reviewer-governed normalization boundary | Authored synthetic corpus | Run `6884cf5f-724b-4d18-8d6d-a0f27f0d6ede`; ZIP SHA-256 `05d0b9e2ab9aa5508505baf03ed130266a46edd8fb62902a48414c5298f17a2e`; evidence in `docs/RS_PROVIDER_DEPARTURE_004_REPORT.md` | **PROVEN — AUTHORED REGRESSION; PROFESSIONAL NORMALIZATION NOT EXERCISED** |
| `PROF-NORM-PROVIDER-001` | Authored provider-normalization precondition and invalidation contract | Authored synthetic corpus | `fixtures/prof-norm-provider-001/`; proof contract `docs/architecture/professional-normalization-proof-contract.md`; conformance record `docs/evidence/prof-norm-provider-001.conformance.json` | **IMPLEMENTED FIXTURE — NO PROFESSIONAL APPROVAL OR EXECUTED DECISION API** |
| `PROF-NORM-PAYER-001` | Authored payer-normalization precondition with explicit canonicalization/causation authority blocker | Authored synthetic corpus | `fixtures/prof-norm-payer-001/`; proof contract `docs/architecture/professional-normalization-proof-contract.md`; conformance record `docs/evidence/prof-norm-payer-001.conformance.json` | **IMPLEMENTED FIXTURE — INELIGIBLE FOR APPROVAL PENDING PAYER AUTHORITY** |
| `REDWOOD-CASH-EVENT-001` | Typed payer, patient, partial-payment, and recoupment cash events are preserved; malformed denial adjustments are quarantined rather than silently normalized | Challenge B | Browser run `51f02c71-1f02-41b6-a60f-a3137d3c8e55`; ZIP SHA-256 `debc8ab87800f8ca4d440f8f073c20c5df7df4afdd31a68d6704a2e9121b066d`; full evidence in `docs/evidence/redwood-cash-event-001.conformance.json` | **PROVEN — WITH UNDERSTOOD SOURCE DIVERGENCES** |
| `REDWOOD-CASH-EVENT-002` | Rerun of cash-event semantic, quarantine, control, and governance evidence; oracle-availability boundary | Challenge B | Run `1ddd85d4-7915-46c6-96b4-78b0ef9ff5ba`; ZIP SHA-256 `debc8ab87800f8ca4d440f8f073c20c5df7df4afdd31a68d6704a2e9121b066d`; evidence in `docs/REDWOOD_CASH_EVENT_002_REPORT.md` | **PROVEN — NO TRUTH CONTRACT SUPPLIED** |
| `REDWOOD-CHB-001` | Historic planned provider-departure/revenue-sustainability movement | Challenge B | Superseded as a semantic identity: Challenge B contains cash-event and malformed-adjustment evidence, not provider departure | **RETIRED ALIAS** |
| `RS-SERVICE-LINE-COVERAGE-001` | Service-line history, lineage, financial reconciliation, and analytical coverage limitation | Challenge C | Browser run `122e95c0-4562-458d-b67f-5b16f708ac73`; source ZIP SHA-256 `d0026c5714b33f1f24c549a30b557352a0ee92fbfa7ad12279debb80c7b97994` | **PROVEN — NO MOVEMENT DECOMPOSITION CLAIM** |
| `RR-MIGRATION-001` | PM/RCM migration with explicit provider crosswalk, native transaction attribution, and independent control retention | Challenge F | Run `3f1715a9-4c60-4097-bb11-d141f29b3d04`; ZIP SHA-256 `ebe4117ea4ee02c1982613a914f1e38793d0f03cf728a4f59053b5b1fb87575a`; complete source-artifact binding in `docs/RR_MIGRATION_001_REPORT.md` | **PROVEN** |
| `RS-OWNERSHIP-SITE-001` | Ownership/site context retention, separate presentation, and non-fabrication of same-store economics | Challenge E | Run `ad47195e-f0d3-4e84-b886-0f8ecbbfcd4a`; ZIP SHA-256 `8ec4442d3fa5d846d357609b99805bcd5e731b7e666afb27ab041ff1ec3e4907`; evidence in `docs/RS_OWNERSHIP_SITE_001_REPORT.md` | **PROVEN — ZERO-POPULATION COVERAGE LIMITATION** |
| `REDWOOD-PROFESSIONAL-WORKBENCH-001` | Run-bound professional review, candidate/treatment, invalidation, draft/release governance workflow | Authored regression workflow | Core review ledger, Review UI/workbook, server smoke test; evidence in `docs/REDWOOD_PROFESSIONAL_WORKBENCH_001_CLOSURE_REPORT.md` | **PROVEN — SYSTEM WORKFLOW; PRACTITIONER VALIDATION OPEN** |
| `RS-SERVICE-LINE-MIX-002` | Historical service-line mix, rate/volume, and same-store movement | Future separately authored corpus | Requires a declared prior-period population and truth oracle before Redwood sees the source | **NOT YET AUTHORIZED / NOT EXECUTED** |

## Challenge D evidence binding

- **Run:** `c8f21c7f-82a5-47a1-9d21-ab78af14660a`
- **Persisted evidence:** `apps/workbench/data/runs/c8f21c7f-82a5-47a1-9d21-ab78af14660a.bin`
- **Retained Challenge D archive:** `.tmp/Redwood_Challenge_D_provider_departure_fte_v0.1.zip` — SHA-256 `6d358a0ab03b5919305f65a159dae0a4c158eb68bfb5f9cccd2b3113454c9604`.
- **Archive-to-run linkage:** the persisted run did not store the ZIP hash, but all seven archive entries have the same names and SHA-256 values as the run's complete source inventory, with no archive-only entries. This verifies the archive's source content is the exact input set for the persisted run; it does not claim that the server persisted ZIP container bytes.
- **Source artifacts:**
  - `ar_snapshot.csv` — `e9ad2a88cd73963d10439be56afa42e3f61288853fce9632439c02f11c50d2d9`
  - `bank_deposits.csv` — `8e2f70928eeb45a3a3cf2fee5d207f21f39f3a7d347dccf383791facda0b7467`
  - `claims.csv` — `e6dd1ef19f4e230757bee21a19c29f547215e8d31bf95499c1b2d4cebcd1563e`
  - `gl_cash.csv` — `52da73d2f7cd1f8c4946ab71af628d1dcadeae89ded261872ad35d5355d7023b`
  - `normalization_adjustments.csv` — `4205c5ec944baf10f9e4040d74c5dc9f7afaf71cc713eeb7e446f6c1105ee943`
  - `payments.csv` — `b0a2265a75260706a807dbd88d76c0ed28a17687506baf1e4a4f790beb69a0de`
  - `provider_roster.csv` — `e699c88d5eef17684e7e932c2174db54959381326d8a92748cc045abbcd53629`

### G1 semantics, verified

G1 is blocked in the persisted Challenge D run because there is **one quarantined adjustment row**, not because mappings await approval.  The precise quarantine reason is **`Missing adjustment amount`**.  Required source populations are present.  G2 is separately blocked because proposed mappings lack canonical targets and/or reviewer approval.

The Map page's earlier `G1 pass_with_warnings` is an intake-stage presence check.  The persisted run's G1 gate additionally evaluates quarantine state.  This difference must not be described as a mapping-review blocker; its differing presentation is recorded as an understood UI-state divergence in `docs/evidence/redwood-gov-001.conformance.json`.

### Provider-departure source semantics, verified

Challenge D contains direct source evidence for a provider departure:

- `provider_roster.csv`: `PRV-004`, FTE `1.0`, start date `2025-01-01`, **end date `2026-04-14`**, provenance `DERIVED_CHALLENGE_DEPARTURE`.
- `normalization_adjustments.csv`: `NORM-001`, `PRV-004`, effective date `2026-04-15`, reason **`PROVIDER_DEPARTURE`**, treatment `REMOVE_POST_DEPARTURE_AND_SEPARATELY_ASSESS_GO_FORWARD`.

This establishes that Challenge D is an eligible corpus lane for `RS-PROVIDER-DEPARTURE-001`.  It does **not** turn the governance proof into an end-to-end Revenue Sustainability proof: the captured browser evidence demonstrates gate behavior and reconciliation, while the current Analyze view does not display the run's `providerSustainability` output.  The next run must visibly verify that output, bind it to this semantic ID, and preserve the same front-door and gate authority boundaries.
