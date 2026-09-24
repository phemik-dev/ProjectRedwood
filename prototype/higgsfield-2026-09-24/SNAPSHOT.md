# Higgsfield Redwood prototype snapshot

This folder preserves the Redwood-specific source delta from the Higgsfield-hosted prototype.

- Live site: https://redwood-qor.higgsfield.app
- Higgsfield website ID: `a0e9466c-f18a-49bb-8007-8443e555201b`
- Snapshot date: 2026-09-24
- Snapshot HEAD: `7406180`
- Initial Higgsfield template commit: `7be7401`

## What is preserved here
Only files changed or added by the Redwood prototype relative to the initial Higgsfield website template. Higgsfield/vendor framework packages are intentionally not copied into the canonical repo.

The live prototype remains useful as a UX reference. It is **not** accepted as a financial-control implementation: prior audit found unsafe numeric coercion, fixed sample visuals, incomplete reconciliation, weak approval binding, and an XML one-sheet export rather than the required formula-driven .xlsx.

HiveForge should treat these files as reference material, not as architecture to inherit wholesale.
