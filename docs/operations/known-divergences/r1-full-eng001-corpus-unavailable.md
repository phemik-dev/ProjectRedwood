# R1 full ENG001 corpus unavailable

- **Origin:** `docs/evidence/redwood-r1-remediation-v0.2.conformance.json`
- **Expected:** R1 integration regression uses the established full synthetic corpus (approximately 240 claims, 336 payments, 109 A/R rows).
- **Observed:** The frozen Build 001 checkout contains compact `fixtures/eng001/` control inputs only; Google Drive corpus is not mounted or accessible in this runtime.
- **Classification:** environment
- **Status:** open
- **Required action:** Materialize an authorized synthetic corpus into the test environment or provide a controlled external fixture process. Do not mutate compact source data to simulate it.
