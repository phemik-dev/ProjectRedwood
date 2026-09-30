# UI-INGEST-001 acceptance evidence

## Browser-created Challenge A run

- **Source package:** `Redwood_Challenge_A_clean_baseline_v0.1.zip`
- **ZIP SHA-256:** `9d48c8b4a585f75bf912a72c3f9789fd0ef8bd4db6259904b9e561071c2acf17`
- **Browser-created intake:** `ed7ec67f-4ccf-402c-96c2-625b8813e4c9`
- **Browser-created run:** `a80d93e0-7f05-425f-9715-e480e481066e`
- **MappingSet:** `819fc591-986b-4257-bebc-98caed6f153a`
- **Valuation date:** `2026-06-30`
- **G1:** Passed with review items
- **Reconcile handoff:** observed in the browser UI.

The package was uploaded through the visible ZIP intake path, source inventory/previews were displayed, mappings were visible, and the user invoked the visible **Run Redwood** action. `Validation_Truth.csv` was classified as `truth_oracle_excluded` and was not passed to canonical ingestion.

## Post-run truth comparison

After the browser-created run was frozen, `Validation_Truth.csv` was opened for evaluation.

| Truth metric | Frozen Redwood result | Status |
| --- | ---: | --- |
| Claim_Count | 480 | Match |
| Total_Billed | $153,520.10 | Match |
| Expected_Allowed | $53,489.83 | Match |
| Total_Cash | $37,274.33 | Match |
| Open_AR | $16,215.50 | Match |
| AR_120plus | $5,544.18 | Match |
| Bank_Total | $37,274.33 | Match in current front-door source/run adapter |
| ERA_to_Bank_Difference | $0.00 | Match in current front-door source/run adapter |

No truth value or source row was modified to obtain the matched controls.

## UX assessment

### Positive observations

- **Discoverability:** one ZIP package control is the primary intake path; individual files are an optional disclosure.
- **Comprehension:** source inventory, type recognition, hashes, previews, mappings and G1 rationale are visible.
- **Evidence visibility:** raw source headers and representative rows are available on demand; truth oracle is visibly excluded.
- **Reviewer control:** mapping actions and staged Run Redwood promotion are present.
- **Professional credibility:** Reconcile presents controls as evidence rather than plugs.

### Open UX defects

- Mapping inventory remains long; it needs a dedicated action-required queue and grouping before the interaction can be considered low cognitive load.
- G1/G2 wording and mapping-review summary require one further bounded refinement to distinguish proposed mappings from actual reviewer-required actions.

### Methodology questions

- Bank Deposits is now a governed supporting source population and cash-to-bank control; the final browser-created trace still needs to capture that current implementation.

## Milestone decision

**UI-INGEST-001 is not yet PROVEN.** The primary canonical population controls match after a browser-front-door run, but the missing bank/ERA canonical relationship and remaining bounded mapping UX refinement must be addressed or explicitly scoped before closure.
