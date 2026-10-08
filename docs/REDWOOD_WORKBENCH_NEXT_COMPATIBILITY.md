# Redwood Workbench Next Compatibility Map

## Scope

`/next/` is a reversible parallel clean-room presentation within canonical Workbench static assets. `/` remains the default interface. No backend, calculation, run persistence, professional artifact, or workbook behavior is replaced.

| Canonical phase | Parallel surface | Canonical dependency | Parity / gap |
| --- | --- | --- | --- |
| Intake | ZIP/individual source intake form | `POST /api/intakes` | Supported; retains canonical source inventory and G1 intake state. |
| Map | Mapping table and successor action | run mappings, `POST /mapping-successor` | Supported; reviewer identity remains canonical action input. |
| Reconcile | Controls, residuals, evidence drawer | run reconciliations/findings | Supported; no local arithmetic. |
| Migration evidence | Native contribution/crosswalk panel | `deal.migrationEvidence`, G4 | Must remain explicit when run contains migration evidence; unavailable otherwise. |
| Analyze | Provider/service and derived evidence | run analysis | Supported only for fields current API exposes; missing data stays unavailable. |
| Review | Queue/detail and decisions/dispositions | canonical run findings/decisions/dispositions endpoints | Supported for existing decision/disposition routes; candidate/treatment/materiality API gaps remain unrepresented until contract-integrated. |
| Export | Gate matrix and workbook link | run gates, canonical workbook endpoint | Supported; draft/release label derives from canonical G7 only. |

## Deliberate gaps

- No run-list route: existing canonical run is opened with `?run=<id>`.
- No dedicated evidence-document viewer: drawer shows inventory hashes and run finding references only.
- No API version negotiation, pagination, authentication/session authority, or executive-summary API exists.
- Parallel view must not infer recovery approval, materiality, release, missing evidence, or financial results.

## Reversible switch proposal

Keep `/` as the fallback. After manual local parity acceptance, introduce a configuration-controlled route/default switch that serves `/next/` only when explicitly enabled. Rollback is restoring `/` without touching run data or backend behavior.
