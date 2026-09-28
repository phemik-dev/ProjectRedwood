# Redwood Challenge Corpus v0.1

## Purpose

The Redwood Challenge Corpus is the bounded, reproducible assurance estate used to test whether Redwood preserves evidence, interprets source grain correctly, keeps calculation separate from judgment, exposes unresolved differences, and produces governed transaction analysis under difficult conditions.

A challenge-corpus pass is **not** practitioner validation or professional equivalence.

## Authority split

- `08_CHALLENGE_CORPUS` in Google Drive is the **canonical professional/transaction scenario suite**.
- `08A_ENGINEERING_VARIANTS` is a **secondary implementation/adversarial lane** using more implementation-specific or ENG001-like source shapes.
- Engineering variants must not silently redefine the canonical professional scenario meaning.
- Observed public source facts and derived transaction economics must remain distinguishable.

## Canonical scenario suite

| ID | Scenario | Primary control |
|---|---|---|
| A | Clean claim → payment → A/R → bank → GL | Baseline end-to-end reconciliation |
| B | Partial payment, denial and recoupment | Preserve negative/partial economic events; no silent netting |
| C | Payer concentration and reimbursement shift | Separate mix, rate and volume effects |
| D | Provider departure / FTE normalization | Expose provider change; reviewer owns normalization |
| E | Acquisition / same-store / site change | Separate acquired growth from organic base |
| F | Aging, censoring and subsequent cash | Preserve maturity/cutoff discipline |
| G | ERA/EFT/bank reassociation mismatch | Leave unmatched cash explicit |
| H | PM/RCM migration | Require crosswalk; avoid duplicate economics across old/new IDs |
| I | Patient-responsibility deterioration | Separate payer-to-patient shift from collection behavior |
| J | One-time / out-of-period revenue | Preserve service-period vs cash-period integrity |
| K | Coding / procedure-mix change | Surface mix/intensity changes without autonomous misconduct conclusions |
| L | Ownership / change-of-control context | Keep ownership context separate from revenue facts and require review |

## Engineering variants

The engineering-variant lane currently includes validated variants covering:
- clean baseline;
- provider departure/FTE normalization;
- service-line mix change;
- reimbursement-rate shift;
- ownership/CHOW/same-store;
- PM/RCM migration;
- real observed provider/location source contradictions;
- payer concentration + patient responsibility;
- one-time/out-of-period revenue;
- aging + subsequent cash;
- denial/reversal/recoupment;
- bank/ERA reassociation mismatch.

These cases are useful for schema/adapter/reconciliation torture tests. They do not supersede the canonical scenario semantics above.

## Required properties of every challenge case

A case must have:
1. explicit source files and source grain;
2. stable identifiers or a declared crosswalk;
3. observed vs derived provenance;
4. expected deterministic control results;
5. any intentional mismatch clearly documented;
6. no hidden balancing row inserted merely to make populations tie;
7. review-required items called out separately from calculable facts;
8. reproducible construction or a frozen immutable fixture.

## Current assurance use

The corpus can test:
- source ingestion and schema variation;
- mapping/crosswalk logic;
- exact-money behavior;
- event semantics;
- cash/A/R/GL bridges;
- unresolved-difference handling;
- provider/site/service normalization triggers;
- rate/mix/sustainability scenarios;
- review-state invalidation;
- workbook-output truth once the compiler is implemented.

## What remains open

A canonical challenge-corpus pass does **not** close:
- sanctioned practitioner validation;
- real PM/RCM source semantics;
- real longitudinal A/R and subsequent cash;
- real matched ERA/EFT/bank/GL chains;
- real provider/FTE effective-date histories;
- payer contract interpretation;
- professional methodology approval;
- independent held-out empty-engagement-to-reviewed-.xlsx assurance.

## Drive locations

- Canonical suite: `02_DATA_CORPUS/08_CHALLENGE_CORPUS`
- Engineering variants: `02_DATA_CORPUS/08A_ENGINEERING_VARIANTS`
- Reference cohort feeding source semantics: `02_DATA_CORPUS/07_REAL_WORLD_REFERENCE_COHORT`
- Scale estate: `02_DATA_CORPUS/09_SCALE_CORPUS`
