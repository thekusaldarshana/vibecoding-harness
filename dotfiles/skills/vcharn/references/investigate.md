# How and why

For **how**, trace a concrete entry point through calls, state, persistence,
and output. Read implementations and callers, not only names or comments.
Cite file paths and symbols, trace a real input, and include relevant failure
paths. Run a focused probe where static reading leaves a material unknown.

For **why**, inspect git history, blame, tests, design notes, and maintainer
handoffs. Use connected issue trackers or review discussions only if they
are available and relevant. Separate documented intent (with its source)
from inferred rationale and unknown history. A plausible reason is not
proof of the original author's motivation.

For a bug, separate observed symptoms, reproduction steps, hypotheses, and
the smallest experiment that distinguishes them. Confirm the reproduction
before and after a fix when possible. Avoid changing unrelated systems on
the strength of an untested hypothesis.

Read-only investigations can run in parallel when supported. Otherwise
investigate sequentially; no named model or vendor-specific tool is required.
Return the mental model in plain language with evidence and remaining gaps.
