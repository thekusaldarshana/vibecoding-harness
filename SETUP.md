# Setup — Maintainer Protocol + Learning Journal

## What these files are

- `dotfiles/CLAUDE.md` — the global rulebook. Two protocols: how the agent
  hands you work to review (Maintainer Protocol), and how it teaches you
  what you don't yet know how to read (Learning Journal). Project-agnostic
  — it applies everywhere once it's in the right place. Contains a
  `{{YOUR_NAME}}` placeholder — fill that in with your own name before
  installing.
- `dotfiles/skills/learn-mode/SKILL.md` — the `/learn-mode` skill: the
  six-part teaching procedure, invokable directly or triggered by a "yes"
  to a learning pause. (Named `learn-mode` rather than `learn` in case
  `learn` is already taken on your account — if `learn-mode` also
  collides, pick another distinct name and update the `name:` field here
  and the `/learn-mode` references in `CLAUDE.md` to match.)
- `dev-knowledge/index.md` — the starter hub for your personal knowledge
  wiki. Deliberately empty. It fills up from real sessions, not from a
  pre-built curriculum.

## Manual setup

1. Fill in `{{YOUR_NAME}}` in `dotfiles/CLAUDE.md`, then put the rulebook
   where Claude Code loads it for *every* project:

   ```bash
   mkdir -p ~/.claude
   cp dotfiles/CLAUDE.md ~/.claude/CLAUDE.md
   ```

   If you already have a global `~/.claude/CLAUDE.md`, merge this into it
   rather than overwriting — keep whatever's already there and add these
   two protocols underneath.

2. Put the skill where this Claude Code installation actually expects
   personal skills to live — check first, this may not be exactly
   `~/.claude/skills/`:

   ```bash
   mkdir -p ~/.claude/skills/learn-mode
   cp dotfiles/skills/learn-mode/SKILL.md ~/.claude/skills/learn-mode/SKILL.md
   ```

3. Create the wiki folder and drop the starter index in it:

   ```bash
   mkdir -p ~/dev-knowledge
   cp dev-knowledge/index.md ~/dev-knowledge/index.md
   ```

4. No per-project setup beyond this — `MAINTAINER_LOG.md` gets created
   automatically inside whichever project you're working in, the first
   time a significant change happens there.

5. `/learn-mode` teaches inline in whichever project session raised the
   question, and writes to `~/dev-knowledge/` by absolute path — no
   session switch needed. If you ever want unattached study time not tied
   to a project, start (and later resume) a session rooted there directly:
   `cd ~/dev-knowledge && claude` the first time, then `/resume` or
   `claude --resume` after that. Confirm the exact resume command against
   your installed version rather than assuming.

## What to expect in practice

- On routine work (styling, copy, formatting) — nothing changes. No gate,
  no pause.
- On significant work (new module, schema change, new pattern, core logic)
  — you'll get a short three-part patch note and be asked to restate it.
  If you can't, because it's unfamiliar syntax rather than unclear logic,
  that's the cue for the Learning Journal to offer a pause — not a failure
  of the protocol, it's the protocol doing its job.
- The learning offer is always a question, never a lecture you're stuck
  in. Saying no costs nothing and doesn't need justifying.
- `~/dev-knowledge/` will look sparse for a while. That's correct — it
  starts at zero on purpose and only grows from concepts you actually hit
  in real work, so nothing in it is disconnected from something you
  needed.

## If this starts to erode

If you notice yourself (or the agent) skipping checkpoints "just this
once," that's worth noticing rather than powering through — the whole
point of the trigger being state-based rather than calendar-based is that
there's no missed day to feel bad about, only work that hasn't reached a
significant point yet. If it's genuinely getting in the way of shipping,
that's a reason to adjust the rule out loud, not to quietly stop following
it.
