# Redwood Sites Source-Port Fidelity Mapping — `sites-preview`

## Authority and scope

- **Authority:** direct request on `feature/redwood-sites-source-port` to create only `/sites-preview/index.html`, `styles.css`, and `app.js`, adapting the recovered Sites composition to an Engagement page backed by a canonical run API.
- **Surface:** static Workbench assets at `apps/workbench/public/sites-preview/`, served by the existing Workbench at `http://127.0.0.1:4173/sites-preview/index.html`.
- **Out of scope:** `/`, `/next`, server/API, canonical calculations, persisted run data, source evidence, review authority, and workbook generation.

## Intent, architecture, and invariants

The port preserves the recovered Sites information architecture while replacing its illustrative local data and simulation with a read-only request to the existing `GET /api/runs/:id` endpoint. The selected run comes only from `?run=…`; no fallback run or fictional engagement is created.

Preserved invariants:

1. Unreconciled differences, open findings, and every non-passed gate remain visible and are never balanced, suppressed, or relabelled as approved.
2. The preview performs no financial or QoR calculation, API mutation, approval, disposition, release action, or local persistence.
3. Review and release authority stay with existing canonical run records. G7 is shown exactly as returned; visual state is not authorization.
4. Existing root, `/next`, API/backend, canonical source evidence, review workflow, and workbook stay unchanged.
5. A reconciliation opens only run-bound evidence and explicitly states the unavailable reconciliation-to-document/calculation/review thread identity.

## Source-port mapping

| Recovered Sites pattern | `sites-preview` adaptation | Authority/evidence boundary |
| --- | --- | --- |
| Dark persistent sidebar and workflow navigation | `index.html` / `styles.css` retain the rail, numbered workflow links, mobile toggle, root fallback, and the seven canonical workflow capabilities. | Engagement remains an overview lens, not an eighth workflow capability. Links transfer the selected run to existing `/next` UI; they create nothing. |
| Condition-first engagement composition | `app.js` derives the attention queue from returned gates and open findings before presenting reconciliation controls. | No illustrative Northstar headline, figures, or reassuring synthesized status is carried over. |
| Work, Review, Decision lenses | Lens buttons adjust only explanatory framing for the same returned run. | They neither calculate an alternate result nor create a review decision. |
| Clickable progress rail | Seven cards surface source/finding counts and exact canonical gate status. | Status originates in the loaded run; no new gates are introduced. |
| Contextual reconciliation figures | Each returned reconciliation displays its labels, population definitions, stored difference, arithmetic status, and materiality status. | Currency presentation converts the canonical cent representation for display only; it does not reconstruct or calculate a reconciliation. |
| Attention cards and release presentation | Canonical gate rationale and finding detail form the queue; G7 status/rationale appears in a separate release card. | The card explicitly says it is not release authority. No approval or release control exists in this preview. |
| Evidence drawer and trails | The drawer provides selected-control context plus source inventory and finding references. | The API exposes run-level source inventory, not a reconciliation-specific source/calculation/review thread; this divergence remains disclosed in the drawer. |
| Responsive and accessible Sites structure | Skip link, visible focus, mobile navigation, Escape/scrim drawer close, focus return, and reduced-motion handling are retained. | Accessibility interaction carries no business-state effect. |

## Recovered-reference exclusions

The recovered reference assets (`.tmp/sites-reference-decompressed.html`, `.tmp/sites-reference-styles.css`, `.tmp/sites-reference-app.js`) are visual and interaction references only. Their locally simulated review actions, draft export, hard-coded entity names, users, sources, currency figures, calculations, conclusions, and authority must not enter this port.

## Observed canonical-run evidence

On the existing port `4173`, `GET /api/runs/c8f21c7f-82a5-47a1-9d21-ab78af14660a` returned HTTP 200 with the following actual QoR state:

- **Run / scope:** `c8f21c7f-82a5-47a1-9d21-ab78af14660a` / `ENG001`; profile `redwood-physician-group-qor-draft-v0.1` version `0.1.0`.
- **Gates:** 8 total: G0 open; G1, G2, G3, G6, G7 blocked; G4 passed; G5 open.
- **Reconciliations:** 4 total. `all-cash-to-gl`, `cash-to-bank`, and `matched-cash-to-gl` have zero stored difference and `matched` arithmetic status. `ar-to-gl` stores a 453,931-cent difference and `difference` arithmetic status; materiality is `unset`.
- **Finding:** one open finding, `finding:ar-to-gl`, reporting the A/R snapshot-to-GL A/R difference and unset professional materiality.
- **Source inventory:** 7 run-bound source records.

This evidence supports UI rendering only. It does not establish professional methodology validation, source-document attribution for an individual reconciliation, professional approval, or release authority.

## Known divergence and smallest valid correction

- **Expected Sites fidelity:** material figures may lead to their own evidence trail.
- **Observed canonical API:** it provides the run-level inventory and finding references but no reconciliation-to-document/calculation/review thread identity.
- **Classification:** architectural weakness; **status:** understood.
- **Smallest valid correction:** retain the contextual drawer but label its inventory as run-level and not attributed to the selected reconciliation. Do not invent source linkage.

## Validation record

Validation commands and browser observations for this source port are recorded in `docs/evidence/redwood-sites-source-port-001.conformance.json`. The Workbench build copies the static preview to `apps/workbench/dist/sites-preview/`; no new server is started.
