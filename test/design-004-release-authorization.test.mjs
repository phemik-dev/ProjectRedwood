import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const designPath = new URL("../apps/workbench/public/design-004/design.js", import.meta.url);
const stylesheetPath = new URL("../apps/workbench/public/design-004/healthcare.css", import.meta.url);
const source = () => readFile(designPath, "utf8");

test("Design 004 release authority requires current G7 and a verified approved release record", async () => {
  const design = await source();

  assert.match(design, /const verifiedReleaseRecord = \(\) => activeRecords\("releaseRecords"\)\.find\(record => record\?\.decision === "approved"/);
  [
    "!item?.invalidatedAt",
    'item?.status !== "invalidated"',
    "record?.runId === run?.id",
    "record?.methodProfileId === run?.profile?.id",
    "record?.methodVersion === run?.profile?.version",
    "record?.dependencyFingerprint === run?.dependencyFingerprint",
    'snapshot?.gate === "G7" && snapshot?.status === "passed"'
  ].forEach(requirement => assert.ok(design.includes(requirement), `Missing release-record requirement: ${requirement}`));
  assert.match(design, /const hasReleaseAuthority = \(\) => gate\("G7"\)\?\.status === "passed" && Boolean\(verifiedReleaseRecord\(\)\);/);
});

test("Design 004 uses one explicit unverified fallback in desktop and mobile decision paths", async () => {
  const [design, stylesheet] = await Promise.all([source(), readFile(stylesheetPath, "utf8")]);

  assert.match(design, /const releaseAuthorizationCopy = \(\) => hasReleaseAuthority\(\) \? "Release authorization recorded\." : "Release authorization unverified\.";/);
  assert.match(design, /state: releaseAuthorizationCopy\(\), lead: hasReleaseAuthority\(\) \? release\?\.rationale \|\| "Verified release record is current for this canonical run\." : releaseAuthorizationCopy\(\)/);
  assert.match(design, /<p>\$\{esc\(releaseAuthorizationCopy\(\)\)\}<\/p>/);
  assert.match(design, /copy = conditionCopy\(\)/);
  assert.match(stylesheet, /@media\(max-width:560px\)\{[^]*?\.lens\{display:grid!important/);
  assert.match(design, /\[\["workbench", "Workbench"\], \["review", "Review"\], \["decision", "Decision"\]\]/);
  assert.ok(stylesheet.includes(".mobile-workflow-button"), "Mobile workflow control must remain styled rather than create separate status copy.");
});
