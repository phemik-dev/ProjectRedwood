# Project Redwood — Governing Engineering Instructions

This repository implements Redwood’s healthcare transaction revenue-intelligence and Quality of Revenue diligence product. The governing HiveForge constitution in the user-global `AGENTS.md` applies before these instructions. These repository rules operationalize it and never weaken it.

## Product intent and non-negotiable invariant

The bounded MVP must transform **unseen source files → canonical model → reviewed QoR analysis → populated, formula-driven `.xlsx` output** without manually rebuilding the workbook, beginning with U.S. physician-group transactions.

**Non-negotiable invariant:** unreconciled differences must be surfaced; Redwood must never silently force financial populations to balance.

## Required approach for substantial work

Before implementation, record or state:

1. the capability and intended behaviour;
2. applicable architectural intent and invariants;
3. decision authority and source-of-truth boundaries;
4. acceptance evidence and how observed behaviour will be reconstructed.

Use `docs/constitution/conformance-record.template.yaml` for substantial changes. Validate JSON records with `node scripts/validate-conformance.mjs <record.json>` against the stable contract in `docs/constitution/conformance-record.schema.json`. Capture unresolved or recurring divergences under `docs/operations/known-divergences/`; capture reviewed improvements under `docs/architecture/decisions/` or an appropriate durable location.

## Source-of-truth boundaries

- This repository is the canonical implementation source.
- Google Drive is the research, methodology, evidence, source-register, and client-reference corpus.
- The frozen Higgsfield prototype is reference material, not the governing implementation.

## Completion

Tests are necessary but insufficient. Do not report substantial work complete without evidence for the intended capability, an invariant check, observed-result conformance, and an explicit explanation of every remaining divergence.
