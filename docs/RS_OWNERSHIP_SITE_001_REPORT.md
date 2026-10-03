# RS-OWNERSHIP-SITE-001 — Ownership-site context with independent controls

## Status

**PROVEN — ownership/site context retention, separate presentation, and non-fabrication of same-store economics.** This frozen proof preserves transaction context for same-store review; it does not make a professional same-store or go-forward adjustment.

## Immutable execution evidence

- **Run:** `ad47195e-f0d3-4e84-b886-0f8ecbbfcd4a`
- **Staged corpus:** `.tmp/Redwood_Challenge_E_ownership_chow_same_store_v0.1.zip`
- **ZIP SHA-256:** `8ec4442d3fa5d846d357609b99805bcd5e731b7e666afb27ab041ff1ec3e4907`
- **Scope:** valuation `2026-06-30`; `subsequentCashEnd` `2026-08-31`
- **Persisted source inventory:** bound to the run and includes the ownership history, claims, payments, A/R, GL, bank, supporting, and excluded truth-oracle artifacts.
- **Draft workbook:** `.tmp/redwood-ad47195e-f0d3-4e84-b886-0f8ecbbfcd4a.xlsx` — HTTP 200; 96,503 bytes; SHA-256 `df1bc8575be37f3ccff49af122238f8e39fb2f8f4e03ba7a6232760b5766dcb1`

## Ownership evidence

The run preserves the supplied ownership-site history record:

| Location | Event | Effective date | Classification | Source |
| --- | --- | --- | --- | --- |
| LOC04 | acquired_site | 2026-01-01 | DERIVED_TRANSACTION_CONTEXT | `Ownership_Site_History.csv`, row 2, SHA-256 `183a2d955fbe54e998ba1a6142f8a4976d6088c0c46161b29fc14b2ee1e97ef2` |

The source instruction is retained verbatim in lineage: “Treat post-close site revenue separately from same-store legacy base.” The analysis reports LOC04 separately with zero acquired-site billed and zero legacy-site billed. The zero is supported by the corpus population, not manufactured by an adjustment.

## Post-run truth comparison

The excluded `Validation_Truth.csv` was inspected only after run execution. All ten published assertions matched:

- 480 claims;
- $153,520.10 billed;
- $53,489.83 expected allowed;
- $37,274.33 cash;
- $16,215.50 open A/R;
- $5,544.18 in the 120+ A/R bucket;
- $37,274.33 bank total;
- $0.00 ERA-to-bank difference;
- acquired location LOC04; and
- $0.00 acquired-site post-close allowed.

## Independent controls and governance

All cash-to-GL, ERA-to-bank, matched-cash-to-GL, and A/R-to-GL controls matched at $0.00 difference. The run has no findings; G1, G3, and G4 passed. G2 remains blocked, G0/G5 remain open, G6 is blocked, and G7 is therefore blocked. Draft export does not imply client release.

## Claim boundary

Because the supplied acquired-site post-close population is zero, this is evidence that Redwood preserves and separates ownership context without fabricating same-store effects. It is not proof that a nonzero acquired-site population is excluded correctly, nor a professional CHOW or go-forward conclusion.
