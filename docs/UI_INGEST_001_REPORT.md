# UI-INGEST-001 acceptance evidence

## Browser-created Challenge A run

- **Source package:** `Redwood_Challenge_A_clean_baseline_v0.1.zip`
- **ZIP SHA-256:** `9d48c8b4a585f75bf912a72c3f9789fd0ef8bd4db6259904b9e561071c2acf17`
- **Browser-created run:** `25a549c1-e42a-4cab-a2de-6a1fc3ad2d14`
- **MappingSet:** `4154ed1f-6cfb-4dd5-984c-6c5a029f48db`
- **Valuation date:** `2026-06-30`
- **G1:** Passed with review items
- **Reconcile handoff:** observed in the browser UI.
- **Downloaded workbook SHA-256:** `7ff0992d48b18fe8c8a74f926a394b5b641707623edcaba38ce5c883dcf672b1`

The package was uploaded through the visible ZIP intake path, source inventory/previews were displayed, mappings were visible, and the user invoked the visible **Run Redwood** action. `Validation_Truth.csv` was classified as `truth_oracle_excluded` and was not passed to canonical ingestion.

## Post-run truth comparison

Only after the browser-created run was frozen was `Validation_Truth.csv` opened for evaluation.

| Truth metric | Frozen Redwood result | Status |
| --- | ---: | --- |
| Claim_Count | 480 | Match |
| Total_Billed | $153,520.10 | Match |
| Expected_Allowed | $53,489.83 | Match |
| Total_Cash | $37,274.33 | Match |
| Open_AR | $16,215.50 | Match |
| AR_120plus | $5,544.18 | Match |
| Bank_Total | $37,274.33 | Match |
| ERA_to_Bank_Difference | $0.00 | Match |

No truth value or source row was modified to obtain the matched controls. No balancing entry was created.

## UX assessment

### Positive observations

- **Discoverability:** one ZIP package control is the primary intake path; individual files are an optional disclosure.
- **Comprehension:** source inventory, type recognition, hashes, previews, mappings and G1 rationale are visible.
- **Confidence:** explicit G1, staged Run Redwood and Reconcile handoff make evidence state visible.
- **Cognitive load:** source previews are collapsed; the complete mapping inventory is disclosed rather than forced into the first view.
- **Error recovery:** an invalid design-artifact ZIP was visibly blocked with missing required source populations.
- **Professional credibility:** Reconcile presents controls as evidence rather than plugs, and Export prevents client-release implication.
- **Evidence visibility:** raw source headers and representative rows are available on demand; truth oracle is visibly excluded.
- **Reviewer control:** mapping actions, professional decisions and finding dispositions are visible in the workbench.

### UX follow-up

The Action Required queue currently includes several operational/provenance fields. A later refinement should distinguish financial-semantic mapping actions from irrelevant operational fields more precisely. This presentation follow-up did not prevent the governed Challenge A run.

## Milestone decision

**UI-INGEST-001 — PROVEN.** Challenge A entered through the browser-facing ZIP front door, formed a staged intake, was promoted through the visible Run Redwood action, reached Reconcile, and matched all hidden truth-oracle assertions after the run was frozen.
