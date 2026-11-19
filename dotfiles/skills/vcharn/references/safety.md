# Safe agent systems and incident work

Read this when a change gives an agent a tool, a subprocess, a permission, a
schedule, or a retry; when a live system misbehaves; or before you print,
merge, or deploy anything. Every rule comes from a real incident (a coding
agent shipped a tool that let one agent start itself without end, 197 processes
ran, a server ran out of memory, and the same loop had already happened once,
unnoticed, six days earlier).

## 1. A comment is not evidence

Never write "only X can do Y" or "profile P sees only these tools" in a
comment, doc, or commit message unless you observed it. Ask the real system:
print the resolved tool list, permission set, or route for each actor and
compare it with the claim. Frameworks often default to ON (plugins, toolsets,
routes); an allow-list you wrote may not be an allow-list. Add a test that
fails when an actor has anything unexpected. Check every actor, not only the
intended one.

## 2. A tool that starts an agent needs five guards

Anything that spawns an agent, a model call chain, or a worker that can itself
call the same tool is a loop waiting to happen. Before shipping, it must have:

1. **Not offered to the callee.** Hide it from the agent it starts (and from
   anything running inside it), and refuse if called anyway. Mark the child
   (an environment flag) so any descendant can tell.
2. **A concurrency cap**, enforced by the OS (a file lock that dies with its
   holder), not by a counter that a crash can leak. Refuse when full; never queue.
3. **A hard stop**: run the child in its own process group and kill the whole
   group on timeout. Killing only the direct child orphans its children.
4. **No error text that invites a retry.** Never write "ask again" or "try
   again" in a tool error. Say what happened and that the caller should stop and tell the person.
5. **A resource limit** on the container or service that runs it, so a
   mistake harms one service, not the whole machine.

Search the codebase for the same pattern (subprocess, queue, scheduler, "retry")
whenever you find one instance.

## 3. A live test is not finished at the answer

After any live or end-to-end test, also look at the system: process count,
session or job count, memory, queue depth, log volume. A correct answer can
hide a 33-call loop. Compare counts before and after; investigate any growth
you did not cause. Check the same signals the next day.

## 4. Investigating an incident

- Read-only first. Snapshot logs and state before they rotate. Change nothing
  until the maintainer approves; then make the smallest change, back up the
  file first, and record it.
- Do not anchor on the first plausible cause, and do not trust an earlier report:
  recheck each claim against the logs, the database, and the code. A mechanism
  that fits (retries, timeouts) can be the amplifier, not the cause. Ask what
  made the first event happen, from primary data (session database,
  history files), not only from log lines.
- Label every finding CONFIRMED, INFERRED or UNKNOWN, with the command and
  output that show it. Say which check would turn an INFERRED into a CONFIRMED.
- Look for the same bug in earlier history: a "new" incident may be the second.
- The people who tested it are evidence too: ask what they typed and when.

## 5. Secrets in output

Listing configuration safely means printing structure, never values. Do not
cut a file with `sed`, `awk`, `cut`, or `grep` and trust the result: a line
without the expected shape (no `NAME=`) prints whole. Print the key name
and the value's length, or the line number and "N chars", and mark anything
that does not parse as a key. If a secret is printed anyway, say so at once,
treat it as leaked, and tell the maintainer to rotate it. Never put secrets in
an external request, a commit, or a report.

## 6. Before you merge, push, or deploy

- Confirm what the target branch is. "Main" may be a mirror of someone else's
  project; check the default branch, the remotes, and any note that says
  "never merge here". If the words and the repository disagree, use the safe
  reading and say so in the report.
- Merge a fix with the tests that would have caught the incident, run in a
  throwaway environment that matches production (a container from the live image),
  not only on the dev machine.
- Deploy by the project's documented procedure: build, test on a copy of the
  data, rename (do not delete) the old containers, start the new, check the
  health signals, keep the rollback.
- Authorization covers the named action. Approval to fix one thing is not
  approval to change the neighbouring thing.
