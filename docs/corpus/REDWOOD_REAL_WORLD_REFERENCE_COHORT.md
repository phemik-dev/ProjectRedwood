# Redwood Real-World Reference Cohort v0.1

## Purpose
Create a compact, reproducible, cross-source public-data cohort that tests Redwood semantics far better than storing entire national files.

The cohort is not a market sample and is not intended for epidemiological or reimbursement inference. It is a systems-validation estate for source interpretation, identity resolution, canonicalisation, reconciliation, sustainability analysis, professional review and workbook compilation.

## Core rules
1. Same entity set across sources wherever the public data permits it.
2. Deterministic selection: no manual cherry-picking after results are seen.
3. Observed public facts are never silently altered.
4. Derived/synthetic rows are stored separately and carry provenance.
5. Raw national sources are reacquired on demand from official URLs; the corpus stores the extraction recipe, source version/hash, and bounded cohort.
6. Scale testing is separate from semantic testing.

## Target cohort
Aim for 48–72 clinicians drawn from physician-group-relevant specialties, with multiple clinicians per organization where possible.

Initial specialty set:
- Ophthalmology
- Orthopedic Surgery
- Cardiology
- Gastroenterology
- Dermatology
- Urology

Geographic diversity target:
- at least 4 U.S. states
- urban and non-urban practice contexts where observable
- at least 8 multi-clinician organizations if the source fields support stable organization identity

Selection priority:
1. clinician has NPI and stable organization/group identifier;
2. organization has multiple clinicians;
3. clinician specialty matches target set;
4. clinician appears in utilization/provider-service data;
5. clinician has usable practice-location data;
6. affiliation data retained when present.

If a criterion is unavailable in the public source, record it as unavailable rather than substituting another field silently.

## Observed cohort outputs
- cohort_clinicians.csv
- cohort_organizations.csv
- cohort_nppes.csv
- cohort_affiliations.csv
- cohort_utilization.csv
- cohort_provider_summary.csv
- cohort_provider_service.csv
- cohort_geography_service.csv where a deterministic geographic join is defensible
- cohort_public_enrollment.csv where NPI/identifier linkage is defensible
- source_registry.csv
- field_semantics.csv
- provenance_manifest.json
- selection_receipt.json

## Reference-rate layer
Use current and prior Medicare Physician Fee Schedule releases as reference-rate evidence only. Medicare rates must never be presented as a commercial payer contract.

Create:
- cohort_hcpcs_reference_codes.csv
- pfs_rate_reference_current.csv
- pfs_rate_reference_prior.csv where reproducibly available
- rate_change_scenarios.csv (DERIVED)

## Challenge-case layer
Build distinct, versioned scenarios from the observed cohort:
A. clean source mapping
B. provider departure / FTE normalization
C. service-line mix change
D. reimbursement reference-rate shift
E. ownership / CHOW context
F. PM/RCM identifier migration
G. contradictory provider/location sources
H. payer concentration / revenue sustainability
I. one-time / out-of-period revenue
J. aging / subsequent cash
K. denial / reversal / recoupment
L. bank / ERA reassociation mismatch

Observed source records are immutable. Synthetic transaction/economic data used to make these scenarios coherent must live under derived/ and include a derivation recipe.

## Scale layer
Generate deterministic replicas/mutations of validated cohort structures at:
- 100k rows
- 1m rows
- 10m rows

Scale packs test ingestion, memory, indexing and rerun speed only. They do not create new evidence or professional truth.

## Pass criteria
The cohort is useful only if Redwood can:
- identify source grain before mapping;
- preserve IDs and date roles;
- map source facts into canonical state without hidden coercion;
- keep observed/estimated/adjusted states separate;
- reconcile the synthetic transaction layers without forced balancing;
- expose unresolved differences;
- invalidate dependent review decisions after upstream changes;
- reproduce the exact analytical run and output;
- compile a reviewable workbook with source trace.

## Storage
Google Drive is authoritative for corpus bytes and manifests.
ProjectRedwood GitHub stores acquisition/extraction recipes, schemas, tests and small fixtures.
HiveForge consumes the corpus for development and execution.
Large public national source files are not retained unless a specific assurance/performance need requires them.
