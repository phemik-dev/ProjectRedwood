# ADR-004: Persist immutable analysis-run artifacts locally

- **Status:** Accepted for MVP engineering.
- **Authority:** Direct user build brief.

## Decision

The local workbench persists every constructed analysis run and its review decisions as a Node V8-serialized artifact under its ignored runtime data directory. Runs retain canonical lineaged records, calculations, findings, Method Profile identity/version, and decisions. Review decisions are append-only and bind to the exact run ID.

## Rationale

In-memory-only work makes a review decision unreconstructable after a restart. A local binary artifact provides a dependency-free MVP persistence layer while preserving `bigint` cent values without JSON coercion.

## Consequences

- Runs survive local-server restarts.
- Runtime data is intentionally ignored from Git; only synthetic fixtures and evidence artifacts are committed.
- This is not a production multi-user database, security boundary, or PHI-ready persistence design.
- A changed source or method creates a new run; any prior decision remains bound to the old one and cannot silently approve the new run.
