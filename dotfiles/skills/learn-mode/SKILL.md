---
name: learn-mode
description: Teach a code, SWE, or CS concept using a fixed six-part shape, then record it in the user's personal knowledge wiki at ~/dev-knowledge/. Use when they say yes to a "want to pause and learn" offer from the Learning Journal protocol, or when they invoke /learn-mode directly with something they're stuck on.
---

# /learn-mode

## Before teaching

1. Check `~/dev-knowledge/index.md` for whether this concept already has a
   file and what status it's at (`unseen` / `introduced` / `practiced` /
   `solid`). If a file exists, read it first — extend or correct it,
   never re-teach from zero something already `practiced` or `solid`.
2. If this fires inside a project's coding session, offer the dedicated
   space before teaching: "want to switch to your `~/dev-knowledge`
   session for this, or do it right here?" Do whichever they pick, without
   pushing toward either.

## The teaching shape — always these six parts, in this order

1. **The snippet** — the actual code or example that raised this, verbatim.
2. **What it does** — plainly, functionally.
3. **Its purpose here** — why this specific snippet needed it.
4. **Its name** — the formal term, so it's searchable independently later.
5. **The problem it solves** — the general class of problem, beyond this
   one snippet.
6. **What it connects to** — named links to related concepts already in
   the wiki.

Stay anchored to the real code in front of you. Never substitute a generic
tutorial example when a real one from the user's own work is available.

## After teaching

Create or update `~/dev-knowledge/<concept-name>.md` with the six parts
above, link it from `index.md` under the right section (Language syntax /
Frameworks / CS & SWE theory), and set its status.

If this session revealed that something already in the wiki was wrong,
outdated, or contradicted by what was just taught, correct or remove that
material now. Never leave an old and a new version of the same
understanding sitting side by side.
