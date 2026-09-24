# Redwood MVP PHI quarantine and exclusion policy

Redwood MVP is for synthetic/sanitized data and does **not** claim HIPAA compliance.

## Canonical-model minimum necessary rule

The canonical revenue model does not require patient name, full address, SSN, or clinical narrative. Claim/account tokens are the allowed linkage mechanism.

## Ingestion behavior

CSV/XLSX inputs with recognized direct-identifier headers are quarantined as a source-file exception before canonicalization. Current blocked header set includes patient name, first/last name, SSN, street address, and clinical-note/narrative fields. Quarantine is visible in the active run; Redwood does not silently discard or transform these columns.

## MVP boundary

This is an input-exclusion control, not a production security architecture. Production use requires reviewed requirements for access control, encryption, retention, audit logging, vendor controls, incident response, and any applicable HIPAA obligations.
