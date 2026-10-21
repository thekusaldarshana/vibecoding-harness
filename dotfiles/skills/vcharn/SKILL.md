---
name: vcharn
description: Implement, investigate, or design software changes using evidence, reusable verification tools, and portable session memory. Use for vcharn engineering workflows.
---

# vcharn

Ground the task in current code and the user's intended outcome. For an
ambiguous report, restate the observed problem before proposing a cause;
continue independent investigation while any necessary question is pending.
Do not turn a clear request into an extra approval gate.

Choose the smallest relevant workflow and load only that reference:

| Task | Read |
| --- | --- |
| Explain mechanics (`how`), investigate intent (`why`), diagnose a bug | [investigate.md](references/investigate.md) |
| Recover prior work or prepare a handoff | [recall.md](references/recall.md) |
| Compare prototypes or design an interface | [design.md](references/design.md) |
| Break an accepted design into verifiable steps | [plan.md](references/plan.md) |
| Write a tutorial, guide, reference, or explanation | [writing.md](references/writing.md) |

For feature implementation: identify an observable acceptance condition,
inspect the affected path, implement, then exercise that path. Use the
project's verification skill in `.vcharn/skills/verify-app/SKILL.md` if
installed; otherwise inspect existing tests and runtime tools directly.
When scripts repeatedly solve the same control or debugging problem, turn
them into a small documented tool. Avoid creating wrappers with no reuse.

Fix demonstrated failures and rerun affected checks. Stop when the requested
behavior and required gates are verified. If access, credentials, or tools
block verification, report the exact missing prerequisite and unverified
behavior; never replace evidence with a claim of success.

Keep the maintainer informed using WHAT / WHY / HOW for significant work.
Preserve the installed restatement checkpoint and optional learning offer.
For a lesson, use the installed learn-mode skill; do not force a tutorial
into ordinary engineering work. Save durable decisions and unfinished work
as a handoff. Do not deploy, merge, message others, or expand external access
unless authorized by the user.

CLI workflows are instruction emitters, not model runners: `vcharn prompt
how <topic>` prints a brief for any agent. If vcharn is unavailable, follow
these files directly. Parallel agents, specific model vendors, and cloud
computers are optional; a single agent can perform every workflow in order.
