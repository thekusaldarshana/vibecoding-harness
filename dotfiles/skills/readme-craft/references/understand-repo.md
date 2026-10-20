# Stage 1: understand the repository

You cannot sell what you do not understand. Spend real effort here; it is what separates an accurate README from
a pretty brochure.

## Read, in this order
1. **What exists already**: the current README, `docs/`, CHANGELOG, CONTRIBUTING, LICENSE, `AGENTS.md`/`CLAUDE.md`.
   Note what is correct (keep it), outdated (fix it), missing (add it).
2. **Manifests**: `package.json`, `pyproject.toml`/`setup.cfg`/`requirements*.txt`, `Cargo.toml`, `go.mod`,
   `pom.xml`/`build.gradle`, `Gemfile`, `composer.json`, `*.csproj`, `Dockerfile`, `Makefile`, `justfile`.
   They give the name, version, license, runtime versions, entry points, scripts and dependencies.
3. **Entry points**: the CLI's `main`/`bin`, the server's start file, the library's public exports. Read the help
   text and argument parser: that is the real command surface.
4. **Tests and examples**: they show intended usage better than any comment.
5. **CI config** (`.github/workflows/`, `.gitlab-ci.yml`): which OSes and versions are actually tested, and whether
   CI runs at all (a workflow file is not proof that it runs).
6. **Git history** (`git log --oneline | head -30`): what changed recently, what is new, the project's maturity.

## Run it (the most valuable ten minutes)
- Follow the install path a newcomer would, in a clean state if you can. Note every surprise.
- Run the quick-start commands and the help output. Copy exact command names, flags and output.
- If the project produces something visual (UI, CLI output, video, chart), produce it now: it becomes the README
  screenshot or GIF ([[visuals]]).
- If you cannot run it (missing hardware, paid key, OS), say which parts are unverified in the hand-over.

## Write a fact sheet before any prose
```text
Name / one-line purpose:
Who it is for (primary, secondary):
What makes it different (max 3 points, each backed by code you saw):
Requirements (exact versions, per OS):
Install (verified commands):
First success in <5 min (verified):
Main commands / API surface:
Configuration (files, env vars; never their secret values):
Status / maturity (version, stability, known limits):
License; contribution and security channels that actually exist:
Unverified or unknown (to ask the owner):
```
Everything in the README must trace back to a line of this fact sheet.
