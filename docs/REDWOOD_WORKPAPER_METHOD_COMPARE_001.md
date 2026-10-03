# REDWOOD-WORKPAPER-METHOD-COMPARE-001

## Baseline and custody

- **Executable baseline examined:** `integration/redwood-current-programme` at `077930497b057c34e3dfa4423156d45f6ba2f69b`.
- **Practitioner benchmark:** `FINAL QofR.xlsm`.
- **Benchmark SHA-256:** `bde3af152d79fdcd7a722ff00707d8f25e6d9971e2399804015a0bdbeaff39d7`.
- **Benchmark treatment:** frozen practitioner workpaper/method benchmark only; not source data, blind validation, or practitioner validation.

## Cohort inspected

The populated `BCBS-Iowa` cohort appears in `Waterfall - 1` and `%Charges - 1`, with summary linkage from `Summary - Waterfall` and `Summary - %Charges`.

| Workpaper observation | Classification | Current Redwood comparison |
| --- | --- | --- |
| Waterfall matrix uses service-month × collection-month `SUMIFS` over Payments and period/cutoff controls. | `METHOD CAPABILITY GAP` | Redwood supports `historical_cohort_curve` as a declared MethodProfile enum but has no implemented cohort-matrix/collection-distribution calculation or cohort-curve inputs. |
| `%Charges - 1` uses selected month, six-month period, eighteen-month cutoff, and percent-of-charges method. | `METHOD CAPABILITY GAP` | Redwood supports global/age-bucket recovery rates and explicit run scope, but not segment-level `%Charges` method definitions or payer/site-specific cutoff overrides. |
| Summary includes distinct Waterfall and `%Charges` outputs. | `METHOD CAPABILITY GAP` | Redwood can select one recovery method per immutable MethodProfile. It cannot calculate both methods as separately traceable outputs in one run. |
| Workpaper summary combines method outputs, including a 50/50-style blended convention. | `PROFESSIONAL JUDGMENT` | Redwood must not adopt a blend automatically. A future composite method must preserve each component and bind blend/rationale to reviewer authority. |
| Segment-specific period/cutoff values are visible in cohort sheets. | `METHOD CAPABILITY GAP` | Scope is run-wide and immutable; comparison windows exist, but segment-level overrides with rationale/reviewer/version/invalidation are not represented. |
| Workpaper reconstructs retrospective expected collections from later payment outcomes. | `DELIBERATE REDWOOD BOUNDARY` | Redwood distinguishes valuation-bound observed cash, subsequent cash through explicit end, and contemporaneous A/R snapshots. It does not reconstruct an as-of A/R result from later realized collections without an explicit retrospective method. |
| `%Charges` summary uses `IFERROR(...,"n/a")` fallbacks. | `DELIBERATE REDWOOD BOUNDARY` | Redwood emits `Unavailable`, `absent`, `immature`, `partial`, and explicit limitations rather than silently converting unsupported populations to zero. |
| Workbook presents cash, expected collections, recovery inputs, sustainability evidence, review register, and release gates. | `ALREADY_SUPPORTED` | Current export separates observed cash, derived expected remaining cash, method inputs, evidence-only sustainability, candidate/approved review artifacts, and draft/release state. |
| Workpaper contains many payer/site cohorts and payer mapping. | `MISSING EVIDENCE` | The underlying source data and mapping rationale are unavailable, so Redwood cannot compare cohort values or validate mapping outcomes. |

## Capability conclusion

Current Redwood can represent a single selected recovery method with versioned MethodProfile inputs, explicit run scope, observed cash, estimated remaining collections, professional overlays, and source-to-cell traceability. It cannot yet represent the practitioner workbook's collection-distribution/cohort curve, `%Charges` method, simultaneous method outputs, governed blend, or segment-level override ledger.

This is not a defect in existing controls or a basis to adopt the workbook methodology. It is a bounded **method capability gap** requiring practitioner explanation before implementation.

## Candidate changes — not authorized for implementation

1. Add versioned cohort-curve and percent-of-charges method definitions as separately calculated MethodProfile outputs.
2. Add reviewer-governed composite/blend artifacts which preserve component outputs, rationale, segment scope, approval, and dependency invalidation.
3. Add segment-level window/cutoff override artifacts only with explicit evidence, reviewer authority, and a prospective/retrospective method designation.
4. Define a retrospective reconstruction contract separately from contemporaneous as-of A/R analysis; never conflate them.

## Documentation divergence

`docs/REDWOOD_CURRENT_PROGRAMME_STATE.md` records the earlier documentation commit `74f1643...` as the baseline while this comparison was correctly frozen at `0779304...`, the later programme-sync commit. This is a `REPO_STALE` baseline-pointer difference and must be corrected in the next programme-state documentation commit; it does not affect the executable code examined.
