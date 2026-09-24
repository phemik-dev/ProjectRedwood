# HiveForge build plan — Redwood MVP

## Operating model
HiveForge is the implementation harness. ProjectRedwood is the code source of truth. Google Drive provides methodology and research evidence but is not a code repository.

Every milestone must:
1. state the exact input evidence used;
2. implement only the bounded scope;
3. add tests before claiming closure;
4. preserve source lineage and deterministic financial behavior;
5. produce a commit/release evidence trail;
6. stop rather than silently inventing accounting policy.

## Milestones

### M1 — Method & accounting baseline
Lock definitions for allowed revenue, cash cut-off, contractual adjustments, gross/net A/R, bad debt, valuation date, recovery policy, materiality and review gates G0–G7.

**Exit:** machine-readable method config + tests + reviewer decision log. The known ENG001 A/R-to-GL difference remains open until evidenced.

### M2 — Representative corpus
Bring ENG001 synthetic controls into the repo, create structurally different ENG002, and create a held-out deal pack not used during implementation.

**Exit:** clean + messy inputs, truth sets, checksums, planted exceptions, and independent expected values.

### M3 — Ingestion & mapping
Support CSV/XLSX first; parse safely; preserve signs/blanks; detect duplicates; stable row IDs; file hashes; mapping decisions; source preview; quarantine invalid inputs.

**Exit:** messy fixtures ingest without silent coercion.

### M4 — Reconciliation & calculation engine
Deterministic decimal/integer-cent arithmetic; independent cash↔GL, A/R↔GL and claims controls; QoR waterfall; aging; payer/location/provider/service-line analyses; assumption sensitivity; record-level lineage.

**Exit:** engine reproduces independent truth and surfaces planted differences.

### M5 — Reviewable workbench
Implement the Design Quarter work-state flow: Intake → Map → Reconcile → Analyze → Review → Export. Bind findings/approvals to actor, rationale, timestamp, method version and exact run. Any dependent change invalidates approval.

**Exit:** no fixed demo numbers; all visible financial views derive from active engagement state.

### M6 — Excel compiler
Generate a genuine formula-driven .xlsx with Executive Summary, QoR Waterfall, Cash Collections, A/R Aging, Payer, Location, Provider, Service Line, Collection Curves, Assumptions, Findings and Source Trace.

**Exit:** workbook reopens in Excel, editable assumptions recalculate correctly, no broken formulas/external links/macros required.

### M7 — Held-out demonstration
Run a fresh unseen source pack from an empty engagement through mapping, reconciliation, review and .xlsx export.

**Exit:** no hidden manual calculations or workbook rebuild; independent reconciliation passes and elapsed time/manual interventions are recorded.

## Release rule
Passing M7 proves a bounded physician-group MVP. It does not prove production HIPAA readiness, every-vendor ingestion, or professional equivalence to a completed client engagement.
