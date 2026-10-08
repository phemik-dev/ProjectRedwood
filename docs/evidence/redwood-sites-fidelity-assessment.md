# Redwood Sites-Fidelity Assessment — Engagement Overview

## Scope and authority

- **Authority:** direct request to correct **only** the first engagement overview on `feature/redwood-sites-fidelity`.
- **Surface:** the isolated Workbench `/next/index.html` frontend.
- **Out of scope:** the root frontend, server/API, canonical model/calculations, persisted runs, and the seven workflow capability screens.

## Intent and preserved boundaries

The overview must lead with canonical conditions rather than an invented headline: open/blocked gates and canonical findings remain visible before material reconciliation figures. It consumes the existing persisted run response only; it performs no calculation, mutation, approval, or release inference.

The seven canonical workflow capabilities remain explicit and reachable: Intake, Map, Reconcile, Migration evidence, Analyze, Review, and Export. The added **Engagement** item is an overview lens, not an eighth workflow capability. Root fallback remains the existing `/` link.

## Fidelity adaptation

Recovered Sites references (`.tmp/sites-reference-decompressed.html`, `.tmp/sites-reference-styles.css`, `.tmp/sites-reference-app.js`) informed these overview-only adaptations:

1. A condition-first banner states the actual count and identities of non-passed canonical gates.
2. Work, Review, and Decision lenses change the overview framing without creating new data or decisions.
3. A clickable progress rail exposes all seven existing workflow capabilities with canonical gate/status context.
4. Reconciliation figures retain their canonical definitions, differences, materiality/arithmetic status, and route to the existing run-bound evidence drawer.
5. Attention cards retain canonical gate rationales and open finding details; release position reports G7 exactly and never treats display state as release authority.

## Evidence and conformance

- `node --check public/next/workbench-next.js` passed.
- `pnpm run typecheck` passed for the established Workbench checks.
- `pnpm run build` passed and copied the updated `/next` assets to `apps/workbench/dist/next`.
- `git diff --check` passed.
- Existing Workbench observation: `GET http://127.0.0.1:4173/next/index.html` returned 200 and contains the Engagement overview entry; `GET /api/runs/c8f21c7f-82a5-47a1-9d21-ab78af14660a` returned 200 with 8 gates, 4 reconciliations, and 1 finding for direct overview consumption.
- Diff review confirmed no changes to `apps/workbench/public/index.html`, `apps/workbench/public/app.js`, `apps/workbench/server.mjs`, or `apps/workbench/build.mjs`.

**Conformance:** the corrected overview conforms to the condition-first, work/review/decision, workflow-progress, and contextual-figure patterns while preserving canonical API/run-state authority. **Known fidelity limitation:** the canonical API does not expose a reconciliation-to-source-document thread identity, so a material figure opens the established run-bound evidence drawer rather than a figure-specific source thread.
