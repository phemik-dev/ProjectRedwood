# RS-PROVIDER-DEPARTURE-004

Synthetic, evidence-only provider-departure/FTE scenario.

PRV-DEP has FTE 1.0 and departs on 2026-04-15. The corpus deliberately contains nonzero billed claims after that date and before the 2026-06-30 valuation date. Redwood must expose those observed amounts as run-bound evidence only. It must not create an automatic QoR normalization, alter historical claims, or authorize release.

`Validation_Truth.csv` is a post-run comparison contract and must not be used as intake input.
