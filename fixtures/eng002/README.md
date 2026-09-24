# ENG002 synthetic structural-variation fixture

ENG002 is synthetic and intentionally differs from ENG001. It tests the canonical model rather than serving as a professional truth set.

It includes:

- corrected/replacement claim versions (`E2-C001` versions 1 and 2);
- typed payer, patient, secondary-payer, refund, recoupment, and unapplied cash events;
- contractual adjustment, write-off, and denial events that are not cash;
- multiple A/R snapshots that must not aggregate silently across snapshot dates;
- varying source headers and parenthesized negative values;
- payer, provider, location, and service-line concentration dimensions.

The fixture intentionally contains mixed snapshots, so a valuation-date selector is required before using its A/R total as a single-period control. Any implementation that aggregates both snapshots without an explicit definition is non-conforming.
