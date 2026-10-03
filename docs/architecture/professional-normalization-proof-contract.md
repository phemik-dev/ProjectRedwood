# Professional Normalization Proof Contract

## Status

**Implemented as authored precondition fixtures only.** No professional normalization decision, approval, adjustment, gate pass, or release authority is implemented or claimed by this contract.

## Purpose

`PROF-NORM-PROVIDER-001` and `PROF-NORM-PAYER-001` make the required evidence and invalidation semantics executable as authored fixture contracts. They do not repurpose the generic Workbench `ReviewDecision` as a normalization approval.

## Current authority boundary

The current API persists generic, run-bound gate decisions (`approved`, `rejected`, `noted`) and finding dispositions. It does not persist a normalization subject, amount, affected population, proof ID, causation basis, or state transition. `ProfessionalTreatmentState` exposes a vocabulary, but deterministic analysis presently derives only `evidence_only` and `review_required`.

Therefore:

- an existing G5 `approved` decision is not a professional normalization approval;
- the provider fixture is eligible only for a future explicit professional decision after its stated evidence requirements are met;
- the payer fixture is deliberately ineligible: payer canonicalization/crosswalk authority and causal contract evidence do not yet exist.

## Required future decision semantics

A future dedicated normalization decision must bind all of the following immutably:

1. proof ID; dimension and target canonical identity;
2. exact run ID, method profile ID/version, source hashes, and dependency fingerprint;
3. named authorized reviewer, role, rationale, and lineaged evidence references;
4. truth state (`approved_for_normalization` or `rejected`), professional methodology, affected period/population, and amount;
5. a separate adjustment record. It must not overwrite canonical claims, cash, A/R, observed analysis, or reconciliation controls.

Provider approvals additionally require departure, FTE, replacement-capacity, transition, and attribution evidence. Payer approvals additionally require an authorized raw-to-canonical payer crosswalk and direct contract/causation evidence for the applicable period.

## Truth and invalidation semantics

Base states are deterministic evidence states. A future professional decision may transition an eligible record through `reviewed` to `approved_for_normalization` or `rejected`. Invalidation is an overlay: a decision is inactive after any material source, mapping/crosswalk, recovery-assumption, scope, method version, engine version, or finding-state fingerprint change. The displayed record then returns to its deterministic base state and a successor run requires a fresh decision.

No invalidation may silently carry a prior adjustment forward, make an unmatched population balance, or advance G5/G7.

## Fixture discipline

Each fixture has source CSVs, a README, `Proof_Semantics.json`, and `Validation_Truth.csv`. The last two are post-run proof artifacts and must not become intake sources. Assertions with `Professional_Approval_Record_Count = 0` and `Automatic_Normalization_Amount = 0.00` are intentional negative proof assertions.
