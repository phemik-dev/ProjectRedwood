# REDWOOD-DATA-ESTATE-INTEGRATION-001 Report

## Status

**PROVEN — data-estate system capability** for registry, custody/rights/reacquisition distinctions, corpus crosswalk governance, and adapter boundary. This does not claim that every public source has been reacquired or semantically validated.

## Architecture

ADR-010 separates acquisition/custody from source routing, canonical ingestion, analysis, and professional workflow. The analytical engine receives only resolved typed artifacts; acquisition cannot calculate QoR, alter economics, or bypass mapping/gates.

## Historical intent recovered

Historical mainline public-data workflows were classified as intent to preserve, not code to cherry-pick: CMS synthetic/reference, provider/NPPES/enrollment context, PFS reference context, ownership/transaction context, reference cohort, and scale custody. Historical CI artifacts were ephemeral; workflows alone do not prove physical custody.

## Source registry

`docs/evidence/redwood-source-registry.v1.json` records governed source identity, rights, custody, canonical lane, semantic role, adapter state, verification state, and reacquisition recipe. `packages/core/src/data-estate.ts` validates registry identity, custody/reacquisition consistency, and rights constraints without coupling acquisition to the analytical engine.

## Custody

Direct evidence-estate lane existence was verified for real public data, synthetic Redwood, reference cohort, canonical challenge corpus, engineering variants, scale corpus, and source registry lanes.

The scale estate has a documented historical conflict: older source registry wording described 1M/10M as on-demand, while later custody documentation and direct evidence-estate verification establish physical holdings. This is retained as `DOCUMENTATION_STALE`; prior wording is not rewritten.

## Rights and boundary

- public rate/context sources are reference only;
- practitioner workbook is a hash-verified benchmark only;
- canonical challenge and engineering lanes remain distinct;
- authored fixtures are regression evidence only;
- restricted/client material requires independent consent/license/security governance.

## Adapter boundary

Adapter maturity is independently recorded (`NOT_IMPLEMENTED`, `IMPLEMENTED`, `TESTED`, `SEMANTICALLY_VALIDATED`, `NOT_APPLICABLE`). Source identity, artifact custody, semantic interpretation, crosswalk authority, and routing are separate concepts. ADR-006 population-specific supersession remains binding.

## Verification

- Core tests: 31/31 passed, including source-registry validation.
- Core typecheck passed.
- No Revenue Realization, Revenue Sustainability, Professional Workbench, gate, or reconciliation logic was changed.

## Remaining limitations

- Registry records current governed evidence classes, not a complete manifest of every Drive artifact member.
- Exact public reacquisition recipes require controlled, rights-aware workflow reimplementation; no external source was acquired during this milestone.
- Main-only workflow integration and main promotion remain separate work.
