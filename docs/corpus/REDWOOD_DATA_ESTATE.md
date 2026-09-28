# Redwood Data Estate v0.2

## Authority boundary

- **Google Drive** is the evidence-corpus and research authority.
- **ProjectRedwood** is the executable authority: acquisition/extraction recipes, schemas, parsers, tests, machine-readable methods, small fixtures and evidence receipts.
- **HiveForge** is the development/execution environment consuming controlled corpus assets.
- **Higgsfield has no Redwood data-estate role.**

## Canonical Drive lanes

| Lane | Purpose |
|---|---|
| 01_REAL_PUBLIC_DATA | Official public/test evidence physically retained where useful |
| 03_SYNTHETIC_REDWOOD | Redwood-owned canonical engineering fixtures |
| 05_THIRD_PARTY_SYNTHETIC | Third-party synthetic originals and bounded derived adapter fixtures |
| 06_PROFESSIONAL_BENCHMARKS | Public professional method/output evidence; VMG Health is the primary current benchmark |
| 07_REAL_WORLD_REFERENCE_COHORT | Compact cross-linked observed public cohort |
| 08_CHALLENGE_CORPUS | Canonical professional/transaction scenario semantics |
| 08A_ENGINEERING_VARIANTS | Secondary ENG001-schema adversarial engineering variants |
| 09_SCALE_CORPUS | Performance-only fixtures; 100k stored, 1m/10m generated on demand |
| 10_SOURCE_REGISTRY | Custody, rights, reacquisition and corpus-governance controls |

## Custody statuses

- **PHYSICALLY_HELD** — bytes are present in Drive.
- **DERIVED_REPRODUCIBLE** — derived asset can be regenerated deterministically from held/public evidence.
- **REACQUIRE_ON_DEMAND** — large public source is intentionally not retained; official source and reproducible acquisition/query recipe are retained.
- **LICENSE_REQUIRED** — commercial/restricted source requires paid or contractual access.
- **CONSENT_REQUIRED** — private/confidential source requires explicit permission and appropriate sanitization.
- **REFERENCE_ONLY** — useful for semantics/research, but content is not copied into the corpus under current rights evidence.
- **NOT_YET_ACQUIRED** — evidence class remains a real-world validation gap.

## Large-source rule

Do not retain national-scale public files merely because they are available.

Prefer, in order:
1. selective official API queries;
2. deterministic cross-linked cohort extraction;
3. bounded source-semantic challenge fixtures;
4. version/source/hash receipts and acquisition recipes;
5. full reacquisition only when a named assurance/performance task requires it.

The successful full-provider transfer workflow is therefore an **ephemeral acquisition mechanism**, not a mandate to put gigabytes into Drive.

## Current compact evidence estate

### Real-world reference cohort v0.1
Built reproducibly by `.github/workflows/redwood-reference-cohort-build.yml`.

Current bounded cohort:
- 48 clinicians
- 27 observed organisations
- 724 provider-service rows
- 92 facility-affiliation rows
- 88 utilization rows
- 54 public-enrollment rows
- 40 cohort HCPCS reference codes
- 1,621 geography/service context rows
- six transaction-relevant specialties across four states

Observed facts and derived simulation groupings are stored separately.

### Challenge suites
- `08_CHALLENGE_CORPUS` is canonical for professional/transaction scenario meaning.
- `08A_ENGINEERING_VARIANTS` is a secondary implementation/adversarial lane and must not silently redefine canonical scenario semantics.

### Scale corpus
100k is physically materialized. 1m/10m are generated on demand. Scale replicas test ingestion, indexing, memory, rerun and compiler performance only; they add no professional evidence.

## Current public-evidence strengths

Redwood now physically holds or reproducibly derives:
- ENG001 clean/messy regression fixtures
- Synthea original + bounded linked adapter fixture
- eMedNY public EDI sample/test suite
- Medicare MAC public EDI examples
- CMS DE-SynPUF Sample 1 source estate and bounded fixtures
- Medicare PFS 2026 26C + 26D reference-rate packs
- NPPES / public enrollment / Doctors & Clinicians context
- CMS hospital/FQHC/RHC ownership and enrollment context
- public transaction-context evidence
- VMG Health public professional benchmark pack
- cross-linked reference cohort
- canonical challenge suite + engineering variants
- scale corpus

## Evidence frontier

More public-data volume is not the next constraint.

The priority missing evidence is sanctioned practitioner material:
- actual PM/RCM exports from completed or representative physician-group work;
- longitudinal A/R snapshots plus subsequent cash;
- matched ERA/EFT/bank/deposit/GL chains;
- provider roster/FTE/effective-date history;
- payer contracts and rate amendments;
- sanitized professional QoR/QoE workpapers and review decisions.

These remain external-validation lanes and must not be simulated away.

## Core discipline

**Researching a source is not possessing it.  
Possessing it is not validating its semantics.  
Validating semantics is not implementing an adapter.  
Passing an adapter test is not proving professional correctness.**
