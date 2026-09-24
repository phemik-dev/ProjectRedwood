# Harness-Level Constitution Extension

## Status

**Local web-profile implementation installed; runtime verification pending host restart.** The rollout uses `~/.dsh/AGENTS.md` for immediate cross-workspace guidance and installs a user-owned `@local/hiveforge-constitution` Web profile bundle that contributes a non-shadowed global `SystemPrompt` section. The built-in `AGENTS.md` loader remains user-role guidance, so the bundle is the mechanism that gives the policy system-prompt priority for all agent presets in this profile.

## Required implementation

Implement a first-party, versioned `dsh-constitution` host-plane package and mount it in every shipped profile/base composition. It must register a non-shadowed global `SystemPrompt` section, rather than use the agent-scoped `dsh-persona` section (which standard presets may shadow).

```ts
ctx.systemPrompt.section({
  name: 'hiveforge:constitution',
  order: -90,
  text: constitutionalPolicyText,
})
```

`-90` intentionally follows the fixed harness identity at `-100` and precedes deployment persona (`0`) and tool guidance. The policy section must be present for every agent preset, including standard, code, minimal, custom, spawned, and forked agents.

## Policy source and versioning

- Store the canonical policy text with the package, identified by `hiveforge.intent-reality.v1`.
- Treat policy text as a released, versioned API: changes require release notes and migration guidance.
- Permit only owner-controlled deployment configuration to select an approved policy version; do not let workspace instructions disable or replace it.
- Continue loading `~/.dsh/AGENTS.md` and project `AGENTS.md` as lower-authority application and workspace guidance.

## Runtime conformance service

Add a host-owned `ConformanceService` that persists structured records with:

- intended capability, architectural intent, invariants, authority, and evidence plan;
- observed execution facts from tool outcomes, test/deployment events, retries, and artifacts;
- intended-versus-observed comparison and classified divergences;
- completion disposition and durable learning/improvement proposal.

The service must be host-plane because it crosses agent lifetimes and supports session, workspace, and release-level reporting. Agent presets may contribute model-facing tools, but may not own the authoritative store or bypass validation.

## Gates

For work marked substantial or critical:

1. Require an intent record before mutable execution begins, unless an explicit human authority grants an exception recorded in the same work item.
2. At completion, require evidence, invariant disposition, and a conformance status.
3. Reject a `conforms` disposition while an unresolved divergence exists.
4. Require explicit human review for changes affecting product goals, architectural principles, authority/security boundaries, or critical invariants.
5. Aggregate repeated divergences into reviewable improvement proposals; do not automatically promote workarounds into policy.

## Acceptance tests

1. Start a session with each shipped and a custom agent preset; every assembled system prompt contains `hiveforge:constitution` at the specified order.
2. A repository `AGENTS.md` cannot remove or weaken the constitutional prompt section.
3. A direct human request can deliberately change a goal only when the associated conformance record identifies the authority and revised intent.
4. Tool execution records reconstruct an observed workflow that can be compared with its intent record.
5. A test run that passes but lacks required evidence/invariant disposition cannot yield `conforms` for substantial work.
6. Release/upgrade tests preserve the policy package and its selected version across supported profile upgrades.

## Deployment scope and remaining promotion work

The installed local bundle is owned outside the generated runtime and survives runtime-package replacement. It is registered in the current **Web profile**, so it applies to all workspaces and agent presets served by the existing HiveForge desktop Web host after that host restarts. It deliberately does not patch upgrade-owned shipped presets.

To make this a first-party property of every HiveForge distribution and every profile, promote the same package and tests into the editable Harness source, add it to the base distribution bundle list, and release it. That source tree is not present in this generated dependency-only runtime installation.
