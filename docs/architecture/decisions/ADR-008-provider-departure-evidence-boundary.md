# ADR-008: Provider-departure evidence has a reviewer-governed normalization boundary

- **Status:** Accepted for MVP engineering.
- **Authority:** Direct user decision: calculate evidence only; normalization remains reviewer-governed.
- **Conformance evidence:** `docs/evidence/rs-provider-departure-004.conformance.json`

## Decision

For a provider whose roster end date precedes the immutable run valuation date, Redwood derives a run-bound factual population from valuation-bounded active claims:

- pre-departure observed billed: service date on or before the end date;
- post-departure observed billed: service date strictly after the end date and on or before valuation;
- post-departure claim count; and
- separately identified undated observed billed when applicable.

The calculation retains FTE, roster dates, specialty, and roster lineage. It does not alter canonical claims, cash, A/R, recovery, realizable revenue, findings, gates, or any Method Profile assumption.

## Rationale

A provider departure can create material go-forward review evidence, but a departure date and observed post-departure revenue do not determine an appropriate QoR normalization. Replacement capacity, transition arrangements, attribution, and methodology require a reviewer-governed professional conclusion.

> **Evidence of a departure does not itself authorize an economic normalization.**

## Consequences

- Only dated departures before valuation receive pre/post measured fields; no departure impact is inferred for active, future-ending, or missing-date roster entries.
- Observed post-departure revenue is prominently labelled evidence-only in the Analyze view and workbook.
- Any normalization remains a separate, explicit Method Profile/reviewer decision bound to its exact run and evidence.
- G5/G7 authority is unchanged by this deterministic measurement.
