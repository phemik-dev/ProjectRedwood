# HiveForge Coding Philosophy: Build From Intent, Learn From Reality

**Policy ID:** `hiveforge.intent-reality.v1`  
**Status:** Governing policy  
**Scope:** All HiveForge builds and workspaces; this document is the canonical repository copy.

## Governing principle

HiveForge builds from intent, observes reality, and forces the two to account for each other. The objective is not merely software that works. It is a system that can explain why it works, detect when reality differs from design, learn from that difference, and propose improvements without losing sight of the larger goal.

The operating loop is:

`Intent → Architecture → Code → Execution → Evidence → Reconstructed Behaviour → Conformance → Improvement`

## Constitutional priority

This policy takes priority over individual coding conventions, implementation preferences, test convenience, deployment friction, and environment-specific workarounds. It remains subordinate to platform safety requirements and explicit human decisions that deliberately change goals, principles, authority models, security boundaries, or critical invariants.

Resolve conflicts by this hierarchy:

`Goal → Principles → Invariants → Product Behaviour → Implementation → Environment Adaptation`

Lower-level changes must remain compatible with every level above them.

## 1. Start from the big picture

Before meaningful modification, establish the primary product goal, architectural intent, invariants, capability being implemented, authority, and evidence needed to demonstrate that capability. Optimize details freely only when higher-level intent remains intact.

## 2. Treat runtime reality as evidence

Code, documentation, tests, and diagrams are claims about architecture—not proof of the executed architecture. Instrument important workflows to establish requested work, decisions, authority, execution order, state change, retries, outputs, and verification evidence. Prefer structured, machine-readable facts over opaque logs.

## 3. Compare intended and observed behaviour

Maintain intended-process and observed-process representations for important workflows. Compare them continuously. Treat divergence as a first-class engineering object. It can reveal a defect, stale intent, environment assumption, undocumented valid path, missing test, needless complexity, architectural weakness, security or authority violation, or an improvement opportunity.

Neither the specification nor runtime behaviour is automatically correct. Investigate the discrepancy.

## 4. Diagnose before editing

Use:

`Expected state → Actual state → Difference → Cause → Smallest valid correction`

For installation and deployment, distinguish product requirements, architectural requirements, environment requirements, provider-specific requirements, development conveniences, and accidental historical assumptions. Do not absorb an environment hack into the product without deciding whether the environment should adapt instead.

## 5. Turn repeated evidence into improvement proposals

Repeated friction is evidence. An improvement proposal must state:

1. observed pattern;
2. related intended behaviour;
3. divergence;
4. proposed change;
5. preserved goals and invariants;
6. expected benefits;
7. risks and trade-offs;
8. evidence required to prove the improvement.

## 6. Reality must not silently rewrite intent

A frequent behaviour or common workaround can still be incorrect. Changes to goals, architectural principles, security boundaries, authority models, or critical invariants require explicit review.

## 7. Design for convergence

Prefer observable, evidence-producing, reproducible, portable, inspectable architectures. Make authority and state transitions explicit, preserve provider independence where possible, and make failure explainable.

## 8. Preserve architectural memory

Capture deployment constraints, validated adaptations, rejected approaches, decisions, conformance rules, environment profiles, known divergence patterns, migration knowledge, and execution evidence as durable knowledge. The next execution must benefit from the previous one.

## 9. Definition of done

For substantial work, answer:

- Does it satisfy the intended capability?
- Are relevant invariants preserved?
- Can we observe what happened?
- Is sufficient evidence produced?
- Does observed behaviour conform to intended behaviour?
- If not, is every divergence understood?
- Are environment-specific assumptions explicit?
- Did a workaround indicate an architectural improvement?
- What durable knowledge prevents this work from recurring?

Tests passing are necessary but insufficient.
