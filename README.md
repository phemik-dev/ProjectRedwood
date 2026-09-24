# Project Redwood

Redwood is a U.S.-market healthcare transaction revenue intelligence / Quality of Revenue (QoR) diligence product.

## Source-of-truth boundaries

- **This repository** is the canonical implementation source for Redwood.
- **Google Drive** remains the research, methodology, evidence, source-register and client-reference corpus.
- **Higgsfield** currently hosts the original interactive prototype at https://redwood-qor.higgsfield.app. A frozen copy of the Redwood-specific prototype source is preserved under `prototype/higgsfield-2026-09-24/`.

## Build objective

The bounded MVP acceptance test is:

> unseen source files in → canonical model → reviewed QoR analysis → populated, formula-driven .xlsx out, without manually rebuilding the workbook.

The first implementation vertical is a U.S. physician-group transaction.

## Build manager

Implementation will be executed through HiveForge against the milestone and acceptance contract in `docs/HIVEFORGE_BUILD_PLAN.md`.

## Engineering constitution and conformance

HiveForge work follows the [Intent–Reality Coding Philosophy](docs/constitution/HIVEFORGE_CODING_PHILOSOPHY.md). The root [AGENTS.md](AGENTS.md) operationalizes it for this repository. For substantial work, create a machine-readable conformance record from [`docs/constitution/conformance-record.template.yaml`](docs/constitution/conformance-record.template.yaml), preserve unresolved divergence records under [`docs/operations/known-divergences/`](docs/operations/known-divergences/), and record reviewed architectural decisions under [`docs/architecture/decisions/`](docs/architecture/decisions/).

## Important rule

Redwood must surface unreconciled differences; it must never silently force financial populations to balance.
