# vibecoding-harness · vcharn

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="docs/assets/banner-light.svg">
  <img src="docs/assets/banner-dark.svg" alt="vibecoding-harness: Pair with an agent as a maintainer." width="100%">
</picture>

**Review what changes. Learn what you need. Keep shipping.**

[![License: MIT](https://img.shields.io/badge/license-MIT-547B65?style=flat-square)](LICENSE)
[![Agent instructions](https://img.shields.io/badge/agent%20instructions-portable-725C96?style=flat-square)](dotfiles/AGENTS.md)
[![Portable agent skills](https://img.shields.io/badge/agent%20skills-portable-416B8B?style=flat-square)](#skills)
[![Script runtime: Node.js 18+](https://img.shields.io/badge/scripts-Node.js%2018%2B-547B65?style=flat-square)](#quick-start)

**[Quick start](#quick-start)** · **[How it works](#how-it-works)** · **[Skills](#skills)** · **[Examples](#examples)**

</div>

**vcharn** pairs any coding agent that can read files and run commands with
reusable engineering workflows: investigate the system, design through
experiments, verify real behavior, and keep the maintainer able to explain
what changed. Claude Code, Codex, Cursor, Gemini, Copilot, and other agents
can use the same shared instructions.

The harness combines its existing Maintainer Protocol and optional Learning
Journal with workflows inspired by pstack. The new CLI installs project
instructions, prints task-specific briefs, runs configured verification
commands, and saves evidence and portable handoffs. It uses Node.js 18+ with
no runtime dependencies and does not call an AI provider.

## Quick start

Clone this repository, then initialize a project:

```bash
git clone https://github.com/thekusaldarshana/vibecoding-harness.git
cd vibecoding-harness
node bin/vcharn.mjs init --root /path/to/your-project --agent all --dry-run
node bin/vcharn.mjs init --root /path/to/your-project --agent all
```

Replace `/path/to/your-project` with your project directory. Use `--agent
codex`, `claude`, `cursor`, `gemini`, `copilot`, or the default `generic` to
select instruction bridges. Existing rules and installed skills are
preserved; only vcharn's marked reference blocks are refreshed.

For a named command, install this local checkout:

```bash
npm install --global .
vcharn --help
```

Alternatively, keep using `node /path/to/vibecoding-harness/bin/vcharn.mjs`.
This change does not publish the package to npm.

In your project session, ask your agent:

```text
Read .vcharn/AGENTS.md. Use vcharn to investigate and implement this change:
<your task>. Verify the affected behavior and show the evidence.
```

Set up application-specific verification next:

```bash
vcharn verify init --root /path/to/your-project
vcharn prompt verify-setup
```

Have the agent follow the setup brief to inspect the app, configure real
commands, and catalog user journeys. An empty verification scaffold fails
readiness. Then, from your project:

```bash
vcharn doctor
vcharn verify run
```

See [SETUP.md](SETUP.md) for installation and migration, and the
[CLI reference](docs/cli.md) for commands, schemas, and limitations.

## How it works

### The Maintainer Protocol

Significant changes receive a short **WHAT / WHY / HOW** patch note and a
request for the maintainer to restate their understanding. These include
new modules, schema or data-flow changes, core logic, auth, new patterns,
and anything the maintainer flags as unclear. The agent finishes authorized
implementation and verification before requesting that checkpoint.

Routine changes proceed without a gate. After five consecutive routine
changes, the agent offers a brief zoom-out. Significant checkpoints and the
maintainer's actual words go in `MAINTAINER_LOG.md`. Pending restatements
stay pending; agents must never fabricate them. These are instructions,
not a hook that mechanically blocks commits. Explicit user preferences
can adjust the workflow.

### The Learning Journal

Learning is optional and stays in the current project session. When invited,
`learn-mode` teaches six parts: the real snippet, what it does, its purpose
here, formal name, general problem, and connections to earlier concepts.

The stronger version traces actual runtime mechanics and researches design
intent from available sources. It distinguishes historical evidence from
inference, explains relevant alternatives, and offers a short prediction or
restatement exercise. Notes accumulate in `~/dev-knowledge/`, with status
`unseen` → `introduced` → `practiced` → `solid` based on demonstrated
understanding. The CLI does not create or alter that personal wiki.

### Verification and continuity

Each project owns `.vcharn/verification.json`, its control tools, and a
feature map describing real user journeys. `vcharn verify run` executes
configured argv commands and saves logs and a JSON report. Agents inspect
runtime observations and assertions before claiming success. Exit zero and
a runtime label alone do not establish feature coverage.

Session handoffs live in `.vcharn/memory/` and work across agents.
`vcharn recall <phrase>` searches them, feature maps, and the maintainer log.
It does not depend on private chat formats. Browser tools, service
connectors, parallel agents, and cloud runners can help when available;
the workflows also work sequentially with local tools.

## Skills

| Skill | Purpose |
| --- | --- |
| [vcharn](dotfiles/skills/vcharn/SKILL.md) | Engineering entry point with investigation, recall, design, planning, and writing references |
| [verify-app](dotfiles/skills/verify-app/SKILL.md) | Create, run, and maintain reusable verification and feature maps |
| [learn-mode](dotfiles/skills/learn-mode/SKILL.md) | Teach concepts using grounded mechanics and historical evidence |
| [readme-craft](dotfiles/skills/readme-craft/SKILL.md) | Study a repository and produce an accurate README with bundled offline checks |

Ask for a skill in plain language or read its `SKILL.md` directly. Native
slash commands depend on your agent. `vcharn skills` lists workflows;
`vcharn prompt how <topic>` prints instructions to give any agent.

| Command | Use |
| --- | --- |
| `vcharn prompt work <task>` | Implement and verify |
| `vcharn prompt how <topic>` / `vcharn prompt why <topic>` | Trace behavior or investigate motivation |
| `vcharn prompt architect <task>` / `vcharn prompt prototype <task>` | Compare interface sketches and experiments |
| `vcharn prompt learn <concept>` | Teach inline and update knowledge notes |
| `vcharn prompt maintain` | Refresh verification against current code |
| `vcharn feature add <slug>` | Scaffold a user journey |
| `vcharn checkpoint --file note.md` | Save a portable handoff |
| `vcharn recall <phrase>` | Search project context |
| `vcharn plan check plan.json` | Validate outcome and proof fields without executing a plan |

The [pstack integration map](docs/pstack-integration.md) explains how the
article concepts became vcharn workflows. This is an original adaptation of
the supplied guides, not a copy of the vendor-specific plugin.

## Layout

```text
bin/vcharn.mjs                  CLI entry point
lib/cli.mjs                     Installation, workflow briefs, verification, memory
dotfiles/AGENTS.md              Shared maintainer, learning, and evidence protocols
dotfiles/CLAUDE.md              Legacy global Claude template
dotfiles/skills/                Four portable skills and supporting resources
dev-knowledge/index.md          Optional starter for a personal knowledge wiki
examples/                       Maintainer log and concept note examples
docs/cli.md                     Command reference and schemas
docs/pstack-integration.md      Article concepts and adaptation boundaries
test/cli.test.mjs               CLI integration tests
```

Installed projects keep shared rules, skills, verification, feature maps,
and memory under `.vcharn/`. Agent instruction files reference that folder.
Evidence is ignored by git; review handoffs before sharing them.

## Examples

- [Maintainer log](examples/MAINTAINER_LOG.md) with sample patch notes and restatements.
- [Concept note](examples/dev-knowledge/token-bucket-algorithm.md) in the six-part shape.
- [CLI reference](docs/cli.md) with verification and plan JSON examples.

## Customisation

Edit installed `.vcharn/AGENTS.md` for review preferences and learning
languages. Adapt control tools and feature maps to your actual app. The
legacy `dotfiles/CLAUDE.md` template retains `{{YOUR_NAME}}` for manual global
installs; the shared project protocol uses “the maintainer” directly.

Keep personal wiki notes in a private location. CLI reinstallations preserve
customized files; compare and merge new skill versions deliberately.

## FAQ

**Does vcharn run an agent?** No. It supplies shared instructions and local
tooling. Your chosen agent reads the workflows and performs the work.

**Do I need Node.js?** Only for the CLI and bundled scripts. Skills and
protocols can be read and followed as Markdown without it.

**Can it control any app automatically?** Configure existing test/runtime
commands and have an agent build controls for your stack where needed.
The CLI captures evidence; it cannot invent app-specific acceptance tests.

**Does it install globally or upload data?** `init` writes only to the
selected project. No AI service, scheduler, or chat upload is configured.
Verification commands inherit your environment and have your permissions.

**What happened to the old setup?** Existing global Claude instructions,
learn-mode, readme-craft, and personal wiki files remain usable. See the
[migration guide](SETUP.md#migrating-an-existing-installation).

## Development and contributing

```bash
npm test
npm run check:readme
```

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep scripts dependency-free and
portable, lessons optional, and verification claims grounded in evidence.

## License

[MIT](LICENSE)
