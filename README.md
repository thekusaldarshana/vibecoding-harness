# vibecoding-harness

A portable Claude Code setup for pairing with an agent as a **maintainer**,
not a typist: the agent gates significant changes behind a short
restate-it-back check, and separately builds your own syntax-level reading
fluency over time through a personal, cumulative knowledge wiki — without
ever forcing a lesson on you.

Two pieces:

- **The Maintainer Protocol** — classifies every non-trivial change as
  SIGNIFICANT or ROUTINE. SIGNIFICANT changes get a three-part Patch Note
  (WHAT / WHY / HOW) and a restate-it-back check before being marked done,
  logged to a per-project `MAINTAINER_LOG.md`. ROUTINE changes just ship.
- **The Learning Journal** — when the agent hits a teachable moment (new
  syntax, a CS concept, an SWE pattern), it asks if you want to pause into
  `/learn-mode`: a fixed six-part teaching shape, recorded into a personal
  knowledge wiki at `~/dev-knowledge/` that grows only from concepts you
  actually hit in real work.

This repo is a **template** — no one's name or personal details are in it.
Fill in `{{YOUR_NAME}}` in `dotfiles/CLAUDE.md` before installing.

## Layout

```
dotfiles/
  CLAUDE.md                        # global rulebook template (fill in {{YOUR_NAME}})
  skills/learn-mode/SKILL.md       # the /learn-mode skill
dev-knowledge/
  index.md                         # empty starter hub for the knowledge wiki
SETUP.md                           # manual install instructions
```

## Install

See [SETUP.md](SETUP.md). In short:

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

Verify against your actual Claude Code version — personal-skill paths and
resume flags can differ between installs; don't assume the above matches
yours without checking (`claude --help`, `/help`).

## Why a template + a private repo

The wiki and the filled-in rulebook are personal and keep growing — they
belong in a private repo you sync across machines, not here. This repo is
just the reusable starting shape.
