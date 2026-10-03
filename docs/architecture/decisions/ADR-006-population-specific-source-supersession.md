# ADR-006: Source supersession is population-specific

- **Status:** Accepted for MVP engineering.
- **Authority:** Direct user decision after observed Challenge F migration proof.
- **Conformance evidence:** `docs/evidence/rr-migration-001.conformance.json`

## Decision

Ingestion and source routing apply supersession at the duplicated **financial-population** grain, never at the folder or package grain.

When a complete native PM/RCM migration cohort is present with its explicit provider crosswalk, the native charge and cash populations supersede duplicate root `claims` and `payments` populations. Independent root control and reference populations—including A/R snapshots, general ledger, bank deposits, provider roster, service-line history, payer contract references, and ownership-site history—remain in the run unless a separate, explicit population-level rule replaces them.

Provider identity for native records is resolved only through a system-qualified explicit crosswalk. Display-name matching, unqualified identifier matching, and inferred key normalization are not permitted as substitutes.

## Rationale

Challenge F demonstrated that native PM/RCM transactions can be the authoritative transaction population while root A/R, GL, bank, and reference artifacts remain necessary independent controls. Folder-wide filtering previously removed those controls and prevented a coherent reconciliation proof. Retaining every source would instead double-count duplicated transaction populations.

Population-specific routing preserves native attribution and avoids duplicate transactions without discarding independent control evidence.

## Consequences

- Router rules must declare both the superseded population and the retained independent populations.
- A native cohort is not sufficient to delete a root source merely because both appear in the same ZIP or folder.
- Native provider rows without a matching system-qualified crosswalk entry are quarantined; they are never reconciled through a name-based fallback.
- Reconciliation continues to surface any difference; routing cannot introduce a balancing entry or silently force a control to match.
- Challenge F is the regression proof for this contract; future changes must retain its routing and control-retention assertions.
