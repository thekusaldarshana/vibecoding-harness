# vibecoding-harness

A portable Claude Code setup for pairing with an agent as a **maintainer**,
not a typist: the agent gates significant changes behind a short
restate-it-back check, and separately builds your own syntax-level reading
fluency over time through a personal, cumulative knowledge wiki — without
ever forcing a lesson on you.

## Contents

- [Why](#why)
- [How it works](#how-it-works)
  - [The Maintainer Protocol](#the-maintainer-protocol)
  - [The Learning Journal](#the-learning-journal)
- [Layout](#layout)
- [Install](#install)
- [Examples](#examples)
- [FAQ](#faq)
- [License](#license)

## Why

You don't have to be the one typing the code to be responsible for the
system. But if you can't explain what changed and why, you're not really
reviewing it — you're just approving it. This harness makes that gap
visible instead of letting it quietly widen: every significant change
comes with a patch note and a check that you can say back what it does,
and every unfamiliar concept gets an optional, low-friction detour into a
wiki that's actually yours.

## How it works

### The Maintainer Protocol

Every non-trivial change gets classified as **SIGNIFICANT** or
**ROUTINE**:

| | Examples | What happens |
|---|---|---|
| **SIGNIFICANT** | new module/service, schema or data-flow change, new dependency or pattern, core business logic, security/auth, wide blast radius, or "I don't get this" | A three-part **Patch Note** (WHAT / WHY / HOW), then the agent asks you to restate it in your own words before marking it done. Logged to the project's `MAINTAINER_LOG.md`. |
| **ROUTINE** | styling, copy, formatting, lint fixes, an already-checkpointed pattern | Ships immediately. No gate. |

When it's unsure, it classifies toward SIGNIFICANT — never guesses toward
skipping the check. After 5 ROUTINE changes in a row with nothing
SIGNIFICANT in between, it triggers one lightweight zoom-out so things
never silently drift past what you could explain end to end.

### The Learning Journal

When the agent hits a teachable moment — new syntax, a language feature, a
CS concept — it doesn't lecture and doesn't silently skip it. It asks:

> "There's something we can learn here — want to pause and go into
> learning mode?"

Say no, and you get the minimum translation needed to keep moving, and the
concept is marked `introduced` for later. Say yes, and `/learn-mode` runs
a fixed six-part teaching shape (snippet → what it does → why it's here →
its formal name → the general problem it solves → what it connects to),
anchored to your actual code, and records it into a personal wiki at
`~/dev-knowledge/` that only grows from things you actually hit.

## Layout

```
dotfiles/
  CLAUDE.md                        # global rulebook template (fill in {{YOUR_NAME}})
  skills/learn-mode/SKILL.md       # the /learn-mode skill
dev-knowledge/
  index.md                         # empty starter hub for the knowledge wiki
examples/
  MAINTAINER_LOG.md                # what a project log looks like after a few checkpoints
  dev-knowledge/
    token-bucket-algorithm.md      # what one wiki concept file looks like
SETUP.md                           # manual install instructions
```

This repo is a **template** — no one's name or personal details are in
it. Fill in `{{YOUR_NAME}}` in `dotfiles/CLAUDE.md` before installing. If
you want your own filled-in copy to sync across machines, keep that in a
*separate, private* repo — see the note in [FAQ](#faq).

## Install

See [SETUP.md](SETUP.md) for full manual steps. In short:

```bash
mkdir -p ~/.claude
cp dotfiles/CLAUDE.md ~/.claude/CLAUDE.md   # then fill in {{YOUR_NAME}}
# if you already have a global CLAUDE.md, merge the two Protocol sections in instead

mkdir -p ~/.claude/skills/learn-mode
cp dotfiles/skills/learn-mode/SKILL.md ~/.claude/skills/learn-mode/SKILL.md

mkdir -p ~/dev-knowledge
cp dev-knowledge/index.md ~/dev-knowledge/index.md
```

Then start (and later resume) a dedicated learning session rooted at
`~/dev-knowledge/`:

```bash
cd ~/dev-knowledge && claude   # first time
claude --resume                # or /resume from inside a session, later
```

Verify against your actual Claude Code version before trusting any of the
above — personal-skill install paths and resume flags can differ between
installs (`claude --help`, `/help`).

## Examples

- [`examples/MAINTAINER_LOG.md`](examples/MAINTAINER_LOG.md) — two sample
  Patch Note entries, with the restated-in-your-own-words line included.
- [`examples/dev-knowledge/token-bucket-algorithm.md`](examples/dev-knowledge/token-bucket-algorithm.md)
  — one sample wiki concept file, in the six-part shape.

## FAQ

**Why two repos (this one + a private one)?**
This one is the reusable, name-redacted starting shape — meant to be
forked or cloned as-is. Your filled-in `CLAUDE.md` and your actual growing
`~/dev-knowledge/` wiki are personal and keep changing, so they belong in
a private repo you symlink into `~/.claude` and `~/dev-knowledge`, synced
separately across machines.

**Does this slow down routine work?**
No — ROUTINE changes (styling, copy, lint, an already-checkpointed
pattern) ship with no gate at all. The check only fires for changes with
real blast radius.

**What if the gate gets in the way?**
Say so — the protocol says explicitly: don't silently relax it under time
pressure, raise it and decide together whether to adjust it.

## License

[MIT](LICENSE)
