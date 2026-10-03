# REDWOOD-CASH-EVENT-002 — Cash-event semantics rerun and oracle-availability boundary

## Status

**PROVEN — controlled source-semantic evidence; post-run oracle not supplied.** The rerun independently reconfirms event classification, quarantine, reconciliation, and governance behavior. The staged Challenge B package contains no truth-oracle artifact, so it cannot establish a new external oracle comparison.

## Immutable execution evidence

- **Run:** `1ddd85d4-7915-46c6-96b4-78b0ef9ff5ba`
- **Staged corpus:** `.tmp/Redwood_Challenge_B_provider_departure_v0.1.zip`
- **ZIP SHA-256:** `debc8ab87800f8ca4d440f8f073c20c5df7df4afdd31a68d6704a2e9121b066d`
- **Scope:** valuation `2026-06-30`; `subsequentCashEnd` `2026-08-31`
- **Draft workbook:** `.tmp/redwood-1ddd85d4-7915-46c6-96b4-78b0ef9ff5ba.xlsx` — HTTP 200; 82,064 bytes; SHA-256 `6b5a6a465e2099ad5bd3d27f06bf5aa5097c294034a0af6b15ac7fa33fe339eb`

## Observed cash-event semantics

The payment-source `event_type` mapping is preserved as an authoritative configured alias to canonical `payment_type`. The run-bound cash mix is:

| Source event label | Canonical type | Count | Amount |
| --- | --- | ---: | ---: |
| PAYER_PAYMENT | payer_payment | 287 | $28,307.84 |
| PATIENT_PAYMENT | patient_payment | 274 | $5,759.30 |
| PARTIAL_PAYMENT | payer_payment | 6 | $490.07 |
| RECOUPMENT | recoupment | 3 | -$94.74 |

No event was labeled as a reversal. The proof therefore establishes recoupment behavior, not reversal behavior.

## Preserved evidence and governance

- All-cash-to-GL, ERA-to-bank, and matched-cash-to-GL controls each matched at **$34,462.47**.
- The A/R-to-GL difference remained visible at **$5,965.03**, producing one open finding.
- All seven malformed adjustment records remained quarantined with **`Missing adjustment ID`**; no identifiers or posting dates were invented.
- G4 passed. G0/G5 remained open; G1/G2/G3/G6 remained blocked; G7 remained blocked. The workbook is a draft only.

## Oracle-availability boundary

Post-run extraction of the unchanged ZIP found its complete seven-file source set—adjustments, A/R snapshot, bank deposits, claims, GL cash, payments, and provider roster—but **no `Validation_Truth.csv`, expected-results file, manifest, or other truth-oracle contract**. This is a corpus-evidence limitation, not an engine failure and not a reason to invent expected values.

## Claim boundary

This frozen proof demonstrates correct preservation and presentation of supplied cash-event semantics, recoupment, malformed adjustment quarantine, independent controls, and release governance. It does not claim reversal behavior, valid adjustment semantics, or externally oracle-verified aggregate output for Challenge B.
