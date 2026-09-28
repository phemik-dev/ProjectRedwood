# Redwood Scale Physical Custody v0.4

## Status
All defined Redwood scale profiles are physically materialized. A generator or recipe is no longer accepted as a substitute for possession.

## Physically held profiles

- **100k** — existing validated physical pack.
- **1M** — 1,000,000 claims; 1,322,917 payments; 435,418 A/R rows.
  - Google Drive: `02_DATA_CORPUS/09_SCALE_CORPUS/1M_PHYSICAL/Redwood_Scale_1M_Physical.zip`
- **10M** — 10,000,000 claims; 13,229,170 payments; 4,354,180 A/R rows.
  - Google Drive: `02_DATA_CORPUS/09_SCALE_CORPUS/10M_PHYSICAL/`
  - Stored as one control archive plus 4 claims shard archives, 6 payment shard archives, and 2 A/R shard archives.

## Custody rule
A defined scale profile is considered complete only when its actual data bytes are physically stored in the Redwood Google Drive corpus and the physical location is verifiable.

Recipe and generator files may remain for provenance, reproducibility and rebuild convenience, but they do not satisfy corpus custody.

## Superseded statements
Older scale documents that described 1M and 10M as recipe-only/on-demand are superseded by this control. They must not be used as the current possession status.

## Purpose boundary
These scale profiles test ingestion, memory, indexing, rerun and workbook/compiler performance. They are synthetic scale fixtures and are not additional real-world evidence.
