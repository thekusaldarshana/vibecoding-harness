---
name: readme-craft
description: Write or overhaul a rich, accurate, beautifully styled README.md for any repository, including a hand-coded light/dark SVG banner, badges, real screenshots or GIFs, and verified quick-start commands. Use whenever the user asks to create, improve, restyle, polish or "make pretty" a README, project front page, or GitHub landing page, or prepares a repo for open-source release, even if they don't say "readme-craft".
---

# /readme-craft: a README that is true first, beautiful second

A great README answers four questions in this order, for the reader who is actually going to land on it:
**What is this? Why should I care? How do I start in under five minutes? Where do I go next?**
Beauty earns attention, but a single wrong command loses it forever. So: understand, then verify, then style.

Works the same in any agent (Claude Code, Codex, Cursor, Gemini CLI, Copilot). Every step uses plain file reads,
a shell, and the two zero-dependency Node scripts in `scripts/`. No image-generation model is needed: visuals are
hand-written SVG or captured from the real project.

## The six stages (do not skip 1 or 5)

| # | Stage | Output | Read |
|---|-------|--------|------|
| 1 | **Understand the repo** | A short fact sheet: purpose, audience, install path, commands that really work | [[understand]] |
| 2 | **Decide the shape** | Audience (non-coder / developer / library user), the 3-second pitch, section list | [[structure]] |
| 3 | **Make the visuals** | Banner SVGs (light + dark), real screenshot/GIF, optional diagram | [[visuals]] |
| 4 | **Write it** | README.md using GitHub-flavoured Markdown features that actually render | [[github-markdown]] |
| 5 | **Verify** | `node scripts/check-readme.mjs README.md` passes; every command was run | [[checklist]] |
| 6 | **Hand over** | What changed, what you could not verify, the settings only the owner can change | below |

## Hard rules
1. **Never invent.** No feature, command, flag, number, badge or benchmark that you did not find in the code or
   run yourself. If you could not run something, say so in the hand-over, not in the README.
2. **Every command is copy-paste correct** for the platforms you claim. Run it, or mark it unverified to the user.
3. **No fake visuals.** Screenshots and GIFs come from the real project. Decorative banners are fine; a mock-up
   presented as the product is not.
4. **No personal or secret data**: no tokens, `.env` contents, private paths, private emails, internal hostnames.
5. **Badges only for things that are true and live.** No CI badge if CI is not running; no coverage badge
   without coverage; no "downloads" badge for an unpublished package.
6. **Respect the existing voice.** On an existing README, keep correct content and the author's tone; improve
   structure and presentation. Ask before deleting whole sections.
7. **Ask, do not guess** what only the owner knows: the target audience if unclear, the project tagline if none
   exists, whether to mention unreleased features. One batch, at most four questions, each with a recommendation.

## Quick start for the agent

```bash
# 1. Learn the repo (see references/understand-repo.md for the full checklist)
# 2. Generate a banner pair to customise (writes banner-light.svg and banner-dark.svg)
node <skill-dir>/scripts/make-banner.mjs --title "project" --tagline "What it does, in one line." \
     --out docs/assets --accent "#FFB547"
# 3. Write README.md
# 4. Verify links, anchors, images and alt text
node <skill-dir>/scripts/check-readme.mjs README.md
```

`<skill-dir>` is where this skill is installed (for example `~/.claude/skills/readme-craft`).

## Hand-over message (always)
Lead with the result. Then: sections added or changed · visuals created and how (hand-coded SVG, captured GIF) ·
commands you ran vs could not run · claims you softened or removed and why · things only the owner can do in the
host's settings (description, topics, social preview image, Discussions, Pages) · how to preview locally.

[[understand]]: references/understand-repo.md
[[structure]]: references/structure.md
[[visuals]]: references/visuals.md
[[github-markdown]]: references/github-markdown.md
[[checklist]]: references/checklist.md
