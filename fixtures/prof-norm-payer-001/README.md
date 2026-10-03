# PROF-NORM-PAYER-001

Synthetic authored payer-normalization **precondition fixture**. It proves comparable-period payer evidence and an explicit authority gap. It does **not** contain, create, or imply a professional approval or a contract-rate conclusion.

## Intake population

Use the CSV source populations through the standard intake path. `Validation_Truth.csv` and `Proof_Semantics.json` are post-run proof artifacts and must not be intake sources.

## Authority boundary

The payer labels in this fixture are raw source labels. Redwood currently has no payer canonicalization/crosswalk authority model. Therefore the deterministic state is `evidence_only`, no payer is eligible for a professional normalization approval, and the rate reference is factual context only—not causation.

A future payer-normalization decision requires an explicit payer crosswalk authority (raw payer, canonical payer ID, rule/version, evidence, and applicable period), lineaged contract/causation evidence, a named reviewer, exact run/profile/fingerprint binding, methodology, affected population, and amount. The fixture contains no such decision.
