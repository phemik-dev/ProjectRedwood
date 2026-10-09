# Design 004 Source Mapping

## Scope and authority

`apps/workbench/public/design-004/` is the approved Design 004, source-first static presentation. It is a parallel entry point served at `/design-004/index.html`; it does not replace the root Workbench or `/next` surface.

The architectural authority is the direct approved Design 004 integration request and `.tmp/design-004-source/healthcare-qor/DESIGN-TO-DATA.md`. Runtime financial authority is exclusively the canonical Workbench endpoint:

```text
GET /api/runs/:id
```

There is **no default query target**, including no default `ENG001` engagement. A caller must explicitly select an existing canonical run with `?run=<id>`; missing, invalid, or unavailable run IDs render an explicit unavailable state. No local financial fixture, `run-record.js`, fallback totals, or write operation exists in this surface.

## Source-to-destination mapping

| Approved source | Destination | Conformance |
| --- | --- | --- |
| `prototype/index.html` | `apps/workbench/public/design-004/index.html` | Same document architecture, viewport, base/variant styles, `#app`, and design script. The design-only `run-record.js` tag is deliberately removed and replaced by the canonical adapter in `design.js`. |
| `prototype/sites-base.css` | `apps/workbench/public/design-004/sites-base.css` | Current destination SHA-256 and approved source SHA-256 are both `DB4A8D5F193FEC63B19133B42EE05BF14C335C31411158D8FCD7948A466CD812`; current bytes therefore match the approved source, including its mixed newline provenance. Independent Review 002 observed an earlier candidate destination hash `2AE5FF54407F8E564EAFF814BB021F130A35B60CA421DF4FF0EAFAAA3141A8AF`; its content matched only after newline normalization. That historical candidate is not described as byte-identical. |
| `prototype/healthcare.css` | `apps/workbench/public/design-004/healthcare.css` | Source-first text copy with newline normalization from the prototype's mixed endings to destination CRLF, then narrowly scoped mobile-lens and D05 drawer-protection additions. It is not an exact-byte copy; prototype source SHA-256: `E22D94D35457BEF7D915A1EB064F2B58A39CB7FDFF2AE0A119DC8923D3B6B60A`. |
| `prototype/design.js` | `apps/workbench/public/design-004/design.js` | Same DOM, CSS classes, presentation state, Workbench/Review/Decision lenses, selected A/R evidence drawer, and seven workflow hand-offs. The only data-authority replacement removes `window.EXISTING_RUN` and asynchronously loads a canonical run via `GET /api/runs/:id`. |
| `prototype/fonts/*` | `apps/workbench/public/design-004/fonts/*` | Original Plex Sans font files and OFL retained. |
| `prototype/run-record.js` | _intentionally absent_ | Design-only financial extract is not shipped. Canonical API data is required; request failure renders an explicit unavailable state and never falls back to embedded facts. |

## DESIGN-TO-DATA binding

| Design element | Canonical binding | Boundary preserved |
| --- | --- | --- |
| Engagement record | `id`, `scope`, `profile`, `gates` | Technical metadata stays read-only; it is not an approval record. |
| Four comparisons | `reconciliations[]` | Integer cents are formatted for display only; controls are independent and never summed into a bridge. |
| Selected A/R evidence | reconciliation `id: ar-to-gl`, `evidence`, `evidenceCount`; matching `findings[]` | $4,539.31 remains visible as an unresolved difference and materiality remains unset. |
| Evidence inventory | `sourceInventory[]`, matching hashes | General inventory does not substitute for figure-specific lineage. |
| Open scrutiny | `findings[]`, gate records G0/G1/G2/G5/G6/G7 | No risk ranking, decision, disposition, or conclusion is invented. |
| Workflow navigation | Existing Intake, Map, Reconcile, Migration evidence, Analyze, Review, Export labels | Seven hand-offs are presentation-only. No route, server, API, upload, approval, release, or workbook behavior is changed. |

## Runtime and responsive conformance

The source presentation retains its three lenses and evidence-first drawer. While a drawer is open, its dialog is modal (`aria-modal`), keyboard focus cycles within its focusable controls, background shell/sidebar controls are made inert and pointer-blocked, Escape/backdrop close it, and focus returns to its opening control where that control remains available after rerender. At 390px the sidebar becomes compact, the Workspace workflow control is retained, and financial content stacks; narrow controls preserve their source horizontal-access behavior rather than removing a lens. Runtime screenshot evidence is under `docs/evidence/design-004-screenshots/`.

## Explicit non-changes

- No change to `apps/workbench/server.mjs`, `apps/workbench/public/index.html`, `apps/workbench/public/app.js`, `apps/workbench/public/next/`, root UI, API behavior, persisted run records, source evidence, calculation, gates, review authority, release authority, or workbook behavior.
- No fallback data and no local financial calculation.
- No backend, sites-preview, or unrelated application changes.
