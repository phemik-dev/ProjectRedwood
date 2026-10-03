# REDWOOD-RS-ENGINE-001 — Revenue Sustainability Analysis Spine

## Status

**INCOMPLETE — reusable evidence layer implemented; payer proof executed; patient-responsibility proof is explicitly insufficient pending a dedicated responsibility source and current-period reconciliation scope correction.**

## Architecture built

- `packages/core/src/sustainability.ts` provides a run-bound `revenueSustainability` object with a shared current/prior comparison-window grammar, coverage state, provider/payer/service-line/location rows, deterministic effects/residuals, cash buckets, lineage references, and evidence states.
- `DealScope` now permits explicit immutable `priorComparableStart` and `priorComparableEnd`; scope validation requires the pair together.
- Provider-departure evidence remains governed by ADR-008 and is not an adjustment.
- Claim ingestion now retains explicitly supplied patient-responsibility source fields, but no dedicated responsibility source classification has been authorized or implemented.
- Analyze includes an in-place Revenue Sustainability selector surface. It labels unavailable patient-responsibility evidence explicitly rather than inferring obligations from patient cash.
- The workbook adds bounded Revenue Sustainability evidence sheets and retains existing reconciliation/waterfall logic.

## Comparison and decomposition boundary

Comparison windows are inclusive ISO ranges and are persisted in run scope. Comparative rows expose `comparable`, `partial`, `immature`, or `absent` coverage. Payer/service-line decomposition exposes volume, mix, effective-rate, and residual amounts; residuals are not silently allocated. All observations are `evidence_only` unless a separately governed review state exists.

## Provider result

`RS-PROVIDER-DEPARTURE-004` remains frozen: nonzero pre/post departure evidence is preserved, automatic normalization is zero, and professional normalization is not exercised.

## Payer result — RS-PAYER-SHIFT-001

Authored corpus corrected run `55368607-34a2-4b48-904e-80c50fccc3d9` uses declared 2025/2026 comparable windows and returns lineaged payer current/prior metrics. Atlas Commercial current allowed is $400.00 versus $1,200.00 prior; State Medicaid current allowed is $750.00 versus $250.00 prior. The engine reports explicit mix/effective-rate components and residuals rather than allocating them.

The first run exposed a reusable bank-deposit scope defect: deposits were valuation-bounded but not analysis-period-bounded. The engine did not force a balance. The correction applies the declared analysis-period start/end to scoped cash and bank controls; the corrected payer run reconciles all four controls at $0.00 and passes G3. This remains an authored regression proof and does not infer commercial contract-rate causation or authorize normalization.

## Patient responsibility result — RS-PATIENT-RESPONSIBILITY-001

Authored corpus run `ae0d56ff-a575-4379-8897-a103c22966c4` supplies explicit source-backed `patient_responsibility` claim fields rather than inferring obligation from patient cash. It shows current assessed responsibility $200.00 versus $100.00 prior, patient payment $50.00 versus $100.00 prior, and $150.00 current A/R with all four controls matched and G7 blocked. The observation is evidence-only; no collectability deterioration conclusion or normalization is created.

## Workbook and UI

The workbook remains draft-only and preserves gates. Revenue Sustainability sheets label all values evidence-only. The Workbench Analyze extension offers Provider, Payer, Service line, Location, and Patient responsibility views without leaving the engagement; Patient responsibility states the missing source boundary.

## Verification

- Core tests: 23/23 passed before the payer proof execution.
- Core and Workbench typechecks passed.
- Workbench/core build passed and server restarted.
- Existing A–F/RS frozen runs retain their persisted historical artifacts; no source evidence was changed.

## Required next reversible steps

1. Obtain authority for a dedicated `patient_responsibility` source contract, implement its canonical/lineage model, author RS-PATIENT-RESPONSIBILITY-001, and run it.
2. Add an explicit regression for analysis-period bank-deposit scoping, then execute the complete frozen proof matrix under the generalized engine.
3. Issue a final `conforms`/`conforms-with-understood-divergence` record only after those steps.
