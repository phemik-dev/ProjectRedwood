# ENG001 synthetic engineering fixture

This fixture is synthetic and used for deterministic regression. It is **not** a professionally approved golden master.

## Baseline source controls

- billed: `$109,646.56`
- allowed: `$69,116.88`
- matched cash: `$53,205.59`
- unmatched cash: `$321.45`
- A/R: `$15,911.29`
- A/R over 120 days: `$9,021.52`

## Expected findings

- all cash (`$53,527.04`) to supplied all-cash GL control (`$52,777.04`): `$750.00` difference
- matched cash (`$53,205.59`) to separately supplied matched-cash GL control (`$52,134.14`): `$1,071.45` difference
- operational A/R (`$15,911.29`) to GL A/R (`$14,506.28`): `$1,405.01` difference

The separate all-cash and matched-cash GL controls are explicit fixture scoping evidence. Redwood does not infer a relationship between GL bad debt (`$1,083.58`), unmatched cash (`$321.45`), and the A/R difference (`$1,405.01`); that possible relationship remains an investigation hypothesis.
