# Redwood Synchronisation Ledger

## UI front-door ingestion

| Capability | Status | Evidence |
| --- | --- | --- |
| UI-INGEST-001 — Challenge A front-door path | **IN SYNC / PROVEN** | `docs/UI_INGEST_001_REPORT.md`, `docs/evidence/ui-ingest-001.conformance.json`, browser run `25a549c1-e42a-4cab-a2de-6a1fc3ad2d14` |
| Challenge A source package | Frozen | ZIP SHA-256 `9d48c8b4a585f75bf912a72c3f9789fd0ef8bd4db6259904b9e561071c2acf17` |
| Challenge A MappingSet | Frozen evidence | `4154ed1f-6cfb-4dd5-984c-6c5a029f48db` |
| Challenge A truth comparison | Matched | Population, billed, allowed, cash, A/R, ageing, bank total and ERA-to-bank controls all matched post-run. |

## Scale estate

| Capability | Status | Evidence |
| --- | --- | --- |
| 1M scale corpus physical custody | Refer to canonical main branch ledger | The UI-INGEST branch does not duplicate scale corpus artifacts. |
| 10M scale corpus physical custody | Refer to canonical main branch ledger | The UI-INGEST branch does not duplicate scale corpus artifacts. |

## Backlog, intentionally outside UI-INGEST-001

- `UX-MAP-002` — distinguish financial-semantic mapping review from operational/provenance metadata in the Action Required queue.

## Next governed movement

`REDWOOD-CHB-001 — Provider Departure & Revenue Sustainability Proof`

Challenge B must use the same browser front door, staged intake, MappingSet, immutable run and reconciliation evidence path. No alternate loader or fixture injection is authorised.
