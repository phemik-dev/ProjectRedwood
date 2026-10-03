# Redwood Corpus Crosswalk

| semantic_scenario_id | corpus_lane | legacy_alias | package / fixture | proof_type | source_type | truth_contract | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-INGEST-001 | 08_CHALLENGE_CORPUS | A | Challenge A | front-door system proof | authored scenario | excluded post-run truth | PROVEN |
| REDWOOD-CASH-EVENT-001 | 08_CHALLENGE_CORPUS | B | Challenge B | event semantics | authored scenario | none supplied | PROVEN with limitation |
| RS-SERVICE-LINE-COVERAGE-001 | 08_CHALLENGE_CORPUS | C | Challenge C | coverage limitation | authored scenario | post-run truth | PROVEN with limitation |
| REDWOOD-GOV-001 | 08_CHALLENGE_CORPUS | D | Challenge D | gate governance | authored scenario | post-run truth | PROVEN |
| RS-OWNERSHIP-SITE-001 | 08_CHALLENGE_CORPUS | E | Challenge E | ownership context | authored scenario | post-run truth | PROVEN with zero-population limitation |
| RR-MIGRATION-001 | 08_CHALLENGE_CORPUS | F | Challenge F | migration routing | authored scenario | post-run truth | PROVEN |
| RS-PROVIDER-DEPARTURE-004 | authored regression | none | fixture | evidence boundary | synthetic | authored truth | PROVEN regression |
| RS-PAYER-SHIFT-001 | authored regression | none | fixture | payer sustainability | synthetic | authored truth | PROVEN regression |
| RS-PATIENT-RESPONSIBILITY-001 | authored regression | none | fixture | patient responsibility | synthetic | authored truth | PROVEN regression |

`08A_ENGINEERING_VARIANTS` is a distinct adversarial lane. It may test the same implementation surfaces but never redefines the semantic identity of the canonical challenge corpus.
