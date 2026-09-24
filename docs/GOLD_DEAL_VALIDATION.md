# Gold Deal Validation lane

Gold Deal 001 is controlled validation evidence, not silent training data and not an automatic architecture rewrite.

## Required comparison matrix

For each metric, retain:

- metric;
- professional value;
- Redwood value;
- difference;
- source explanation;
- methodology explanation;
- review status.

`packages/core/src/gold-validation.ts` supplies the lossless comparison primitive: unavailable values remain unavailable and are never replaced by a zero or an invented explanation.

## Review classification

Every difference must be classified as one of: bug, missing adapter, missing domain rule, Method Profile difference, professional judgment, canonical-model gap, or source-data limitation. Architecture changes occur only after this comparison and classification.

## Controlled-use boundary

No Gold Deal source file, professional flat file, delivered workbook, or identifier-bearing content belongs in Git unless explicitly sanitized and authorized. The current repository contains no Gold Deal data.
