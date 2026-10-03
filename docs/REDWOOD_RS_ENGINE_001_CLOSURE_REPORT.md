# REDWOOD-RS-ENGINE-001 Closure Report

## Decision

**PROVEN — system capability; professional correctness remains unproven.**

Redwood now calculates and presents run-bound Revenue Sustainability evidence across provider, payer, service line, location/same-store, and source-backed patient responsibility, using shared comparison/coverage grammar. It does not autonomously normalize revenue or issue professional conclusions.

## Frozen regression matrix

| Proof | Generalized run | Invariants observed |
| --- | --- | --- |
| UI-INGEST-001 / Challenge A | `39b75f33-02c2-4069-aa06-15dc273be5e4` | 480 claims; zero cash/A/R differences; zero findings; G3/G4 passed; G7 blocked. |
| RS-SERVICE-LINE-COVERAGE-001 / C | `72a34562-adc1-4f88-b45e-ac6d9c020ddb` | zero control differences; G3/G4 passed; coverage remains absent without a declared prior window. |
| RS-OWNERSHIP-SITE-001 / E | `93023db3-aa7d-4759-a04c-fe3eb2fb3542` | zero control differences; zero findings; ownership context retained; no same-store effect fabricated. |
| RR-MIGRATION-001 / F | `2270c755-265e-4a47-b20a-35c4948ba40f` | 480 canonical claims; zero control differences; G3/G4 passed; G7 blocked. |
| RS-PROVIDER-DEPARTURE-004 | `690db9d5-a39b-4a83-ba17-e28336c221ce` | 5 source claims; zero control differences; comparable declared window; no automatic normalization. |

No regression was classified as expected evolution. The payer proof exposed one reusable bank-period defect; it was corrected by applying analysis-period boundaries consistently to cash and bank deposits, with tests passing and corrected run `55368607-34a2-4b48-904e-80c50fccc3d9` G3 passed.

## New semantic proofs

- **RS-PAYER-SHIFT-001:** reusable current/prior payer evidence and volume/mix/effective-rate/residual bridge; authored regression only, no contract-rate inference or normalization.
- **RS-PATIENT-RESPONSIBILITY-001:** run `ae0d56ff-a575-4379-8897-a103c22966c4` proves source-backed current/prior responsibility evidence and patient collections remain distinct; G7 blocked.

## System versus professional boundary

**System capability proven:** Redwood can calculate and present sustainability evidence across provider, payer, service line, location, and patient responsibility.

**Professional correctness not proven:** Redwood has not been validated against sanctioned practitioner workpapers or real-deal evidence for normalization decisions.

## Verification

Core tests: 23/23 passed. Core/workbench typechecks and builds passed. The conformance record validates. The Workbench server remains running on port 4173.
