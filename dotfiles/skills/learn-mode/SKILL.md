---
name: learn-mode
description: Teach a code, SWE, or CS concept using a fixed six-part shape (snippet, what it does, why it's here, formal name, general problem it solves, connections), then record it in the user's personal knowledge wiki at ~/dev-knowledge/. Use this whenever the user says yes to a "want to pause and learn" offer from the Learning Journal protocol, invokes /learn-mode directly, or asks something like "what does this syntax mean", "explain this pattern", or "teach me this" about a piece of code or a CS/SWE concept they're unfamiliar with — even if they don't say "learn-mode" explicitly.
---

# /learn-mode

## Before teaching

1. Check `~/dev-knowledge/index.md` for whether this concept already has a
   file and what status it's at (`unseen` / `introduced` / `practiced` /
   `solid`). If a file exists, read it first — extend or correct it,
   never re-teach from zero something already `practiced` or `solid`.
2. Ground the explanation in current implementations and callers. For
   "how", trace an actual input through runtime behavior. For "why", inspect
   available git history, tests, and design notes; distinguish documented
   intent from your inference. Cite file paths or commits for consequential
   claims. Use the vcharn investigation reference if installed, or perform
   that research directly. Do not require connectors or subagents.
3. Teach it right here, in whichever session or project raised the
   question. Do not offer to switch to a separate `~/dev-knowledge`
   session — that costs the exact code context that made this worth
   teaching, and buys nothing: reading and writing `~/dev-knowledge/`
   files by absolute path works the same regardless of which directory
   the current session is rooted in.

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


## Strengthen the mental model

Keep the six-part shape. Within "purpose here" and "problem it solves",
explain the relevant tradeoff and one plausible alternative when evidence
supports it. Show a small trace or runnable experiment if it clarifies the
mechanics; report only results you actually observed.

Offer a brief prediction or restatement exercise after teaching, without
forcing one. Advance status from the maintainer's demonstrated understanding,
not the agent's confidence or the number of explanations. Link prior notes
and record source paths and the date so examples can be rechecked later.
Keep the personal concept wiki separate from project session handoffs and
feature maps. If the wiki is inaccessible, teach inline and report the
unsaved note; do not claim it was written or silently choose a new location.
