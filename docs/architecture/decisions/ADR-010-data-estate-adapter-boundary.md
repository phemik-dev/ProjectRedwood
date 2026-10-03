# ADR-010: Data-estate acquisition is outside analytical ingestion

- **Status:** Accepted for MVP engineering.
- **Authority:** REDWOOD-DATA-ESTATE-INTEGRATION-001 direct user milestone.

## Decision

Source identity, rights, custody, reacquisition, physical artifacts, semantic interpretation, and adapter state are governed by the data estate before a source reaches Redwood ingestion. The analytical engine accepts only explicitly resolved typed artifacts through existing routing, mapping, and lineage boundaries.

Acquisition code must not calculate QoR, alter canonical economics, bypass source mapping, bypass gates, or infer professional conclusions. Public fee schedules remain reference context and never become commercial-rate proxies.

## Consequences

- Registry status is independent across custody, rights, semantic role, and adapter maturity.
- Large sources are represented by recipes, manifests, and custody receipts rather than raw bytes in Git.
- Public observed facts, derived transaction economics, authored regressions, practitioner benchmarks, and restricted/client sources remain visibly distinct.
