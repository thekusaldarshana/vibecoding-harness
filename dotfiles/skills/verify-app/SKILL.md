---
name: verify-app
description: Create, run, or maintain a project's reusable verification commands and feature map; collect runtime evidence for software changes.
---

# Verify the application

Read `.vcharn/verification.json`, `.vcharn/features/README.md`, and the
relevant feature pages. Inspect each configured command before executing it:
repository commands run with the agent's permissions and are not sandboxed
by vcharn. Honor the user's scope for side effects and environment access.

- For first-time setup, read [setup.md](references/setup.md).
- For stale controls, coverage gaps, or a maintenance request, read
  [maintain.md](references/maintain.md).
- For a change, select checks and journeys that exercise its acceptance
  conditions and regression risks; run `vcharn verify run [check-name]`.

Inspect command logs, assertions, and runtime observations. An exit code of
zero is evidence about the command, not automatic proof of every feature.
A `runtime` label is a declared category, not a test of what the command did.
Use real user journeys for UI work, real requests for API work, and real
invocations for CLI work. Store screenshots/traces when useful and possible.
Evidence must exclude credentials and private data; `.vcharn/evidence/`
should be ignored by git. No production writes are authorized by this skill.

Report the observed result, evidence paths, checks run, and omitted coverage.
Fix demonstrated failures, rerun affected checks, and stop when sufficient.
When credentials or tools are unavailable, leave affected behavior unverified
and state the prerequisite. Do not weaken assertions to manufacture success.
