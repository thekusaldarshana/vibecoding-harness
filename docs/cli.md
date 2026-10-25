# vcharn CLI reference

Requires Node.js 18+, with no runtime dependencies. Run from a checkout with
`node /path/to/vibecoding-harness/bin/vcharn.mjs`, or install the checkout
with `npm install --global /path/to/vibecoding-harness` to use `vcharn`.
The package has not been published to a registry by this change.

Every command accepts `--root <project>` and `--json`. Errors exit 1; JSON
errors go to stderr. Help and version are plain text. No command calls an
AI provider. `prompt` prints instructions for your chosen agent to follow.

## Installation

```bash
vcharn init --root /path/to/project --agent all --dry-run
vcharn init --root /path/to/project --agent all
```

`init` installs `.vcharn/AGENTS.md`, complete skill folders under
`.vcharn/skills/`, and a memory guide. It always adds a reference block to
`AGENTS.md`. `--agent` selects additional adapters:

| Agent | Project instruction file |
| --- | --- |
| `generic` (default), `codex` | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `cursor` | `.cursor/rules/vcharn.mdc` |
| `gemini` | `GEMINI.md` |
| `copilot` | `.github/copilot-instructions.md` |
| `all` | All of the above |

These are instruction bridges, not native slash-command registrations. If
an agent does not automatically load the bridge in your environment, tell
it to read `.vcharn/AGENTS.md` explicitly. No vendor SDK is required.

Existing skills and shared instructions are preserved. Only the marked
vcharn reference block in adapter files is refreshed; surrounding rules
remain intact. To update installed skills, compare them with this checkout
and merge deliberately. Initialization adds `/.vcharn/evidence/` to the
project ignore file. Review memory notes before committing them. No personal
wiki or global agent configuration is modified. Writes through existing
symlinks below the target root are rejected. Use a real project path.

## Workflows

`vcharn skills` lists skills and workflow names. `vcharn prompt <workflow>
[task...]` prints a self-contained entry brief plus the relevant reference.
Installed skills may load additional references on demand.

| Workflow | Purpose |
| --- | --- |
| `work` | Implement and verify a software change |
| `how`, `why` | Trace runtime mechanics or investigate historical intent |
| `recall` | Recover context and write a handoff |
| `architect`, `prototype` | Sketch interfaces and compare concrete experiments |
| `plan` | Make an outcome and proof driven execution plan |
| `learn` | Teach inline and update the personal knowledge wiki |
| `verify-setup`, `verify`, `maintain` | Build, run, or refresh application verification |
| `write`, `readme` | Technical documents or repository README work |

For example: `vcharn prompt architect "Design the webhook rate limiter"`.
Paste the result into an agent, or ask it to run the command and follow the
result. `/vcharn` and `/learn-mode` are conveniences only where supported;
plain language and direct file references always work.

## Verification

Run `vcharn verify init` to create `.vcharn/verification.json` and a feature
index without overwriting existing files. Use `--dry-run` to preview.
Have your agent follow `vcharn prompt verify-setup` and populate real checks:

```json
{
  "version": 1,
  "checks": [
    {
      "name": "cli-help",
      "argv": ["node", "bin/vcharn.mjs", "--help"],
      "kind": "runtime",
      "expected": "Prints CLI usage and exits successfully",
      "timeoutMs": 10000
    }
  ]
}
```

This example is for the harness checkout. Configure your app's actual test
and runtime commands. Names are unique lowercase slugs, `kind` is `test` or
`runtime`, `expected` is nonempty, and `timeoutMs` is 1..3600000.

`vcharn verify run [check-name]` runs selected checks sequentially from the
project root. `--dry-run` prints checks without executing or saving evidence.
Commands receive literal argv without a shell, inherit the environment, and
must exit zero to pass. Use cross-platform executables; npm/shell wrappers
may need an explicit interpreter on Windows. POSIX timeouts terminate the
process group; Windows timeouts terminate the direct process only.

Runs save combined stdout/stderr logs and a JSON report under
`.vcharn/evidence/<run-id>/`. Reports include argv, expected result, category,
exit status, duration, timeout, and log paths. Every selected check runs even
if an earlier one fails. Any failure exits 1. An empty selection fails.
Inspect assertions and artifacts: a runtime label and exit zero do not prove
that a command exercised a user journey. Configured commands execute with
your permissions; review them before running. Logs can contain sensitive
output, so redact before sharing.

`vcharn doctor` checks installed files and requires at least one configured
runtime check. It executes no app commands and does not establish coverage.

## Feature map and portable memory

`vcharn feature add <slug>` creates a journey template; `--dry-run` previews
it. Fill in observed behavior and link it from `.vcharn/features/README.md`.
`vcharn feature list` lists the map's files.

`vcharn checkpoint --file <note.md>` copies a nonempty Markdown handoff into
`.vcharn/memory/` with a unique dated filename. Relative input paths resolve
from `--root`. `--dry-run` creates nothing. The agent writes the note with
the goal, sources, decisions, evidence, unfinished work, and next step.

`vcharn recall [query...]` searches a case-insensitive literal phrase in
Markdown handoffs, feature maps, and `MAINTAINER_LOG.md`. It returns file,
line, and matching text. Open matching files for context. It does not read
private chat stores or perform semantic search.

## Plan validation

`vcharn plan check plan.json` validates structure without running commands:

```json
{
  "tasks": [
    {
      "id": "verify-cli",
      "outcome": "The installed CLI prints usage",
      "verify": ["vcharn", "--help"],
      "expected": "Usage text and exit zero"
    }
  ]
}
```

IDs must be unique lowercase slugs; every task requires nonempty `outcome`,
`expected`, and `verify` argv. Validation does not prove the plan complete,
execute tasks, or imply permission to publish changes.

## Personal setup (`vcharn home`)

`vcharn home` keeps your personal data separate from this program. Your data
folder holds only what is yours. Make it a private git repo to share it across
machines:

```
vcharn-home.json   # {"version": 1, "vars": {"YOUR_NAME": "...", ...}}
rules.md           # optional rules placed above the shared protocol
dev-knowledge/     # optional learning wiki
```

`vars` fills every `{{KEY}}` placeholder in `dotfiles/CLAUDE.md`. `init` writes
the keys the template actually uses; `install` refuses to run while any is empty.

| Command | Effect |
| --- | --- |
| `vcharn home init` | Create the data folder (default `~/.vcharn/data`; asks when interactive) |
| `vcharn home init --from <git-url>` | Clone your existing data repo into place, e.g. on a new machine |
| `vcharn home init --data <dir>` | Use another folder |
| `vcharn home install` | Render the rulebook and create the links below |

The chosen folder is saved in `~/.vcharn/home.json`, so later commands need no
flag. `--from` refuses to clone into a non-empty folder. After cloning, `init`
only adds starter files the repo lacks.

`install` writes `~/.vcharn/CLAUDE.md` (personal rules, then the rendered
template) and links it, the bundled skills, and the wiki for each agent:

| Agent | Rulebook link | Skills links |
| --- | --- | --- |
| claude | `~/.claude/CLAUDE.md` | `~/.claude/skills/<skill>` |
| codex | `~/.codex/AGENTS.md` | `~/.agents/skills/<skill>` |

plus `~/dev-knowledge` → `<data>/dev-knowledge` when present. These defaults
live in [`dotfiles/home.json`](../dotfiles/home.json), not in code. A profile can
replace them with its own `agents` and `links` arrays (paths relative to your
home and data folders):

```json
{
  "version": 1,
  "vars": { "YOUR_NAME": "Ada", "YOUR_LANGUAGES": "Rust, Go" },
  "agents": [{ "name": "gemini", "rulebook": ".gemini/GEMINI.md" }]
}
```

Only symlinks are replaced. An existing real file or folder at a link path is
reported as `skipped-real-file`, left untouched, and the command exits non-zero;
move it aside and re-run. Re-run after updating vcharn or editing your data.
`--dry-run` reports every action without writing. The generated rulebook stays
on the machine and is never written into the data folder.
