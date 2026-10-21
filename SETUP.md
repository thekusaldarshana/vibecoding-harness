# Setup

## Project installation

Requires Node.js 18+. Clone this repository and run its CLI directly:

```bash
node /path/to/vibecoding-harness/bin/vcharn.mjs init --root /path/to/project --agent all --dry-run
node /path/to/vibecoding-harness/bin/vcharn.mjs init --root /path/to/project --agent all
```

Substitute real paths. Choose `generic` (default), `codex`, `claude`,
`cursor`, `gemini`, `copilot`, or `all`. Every installation includes an
`AGENTS.md` reference to `.vcharn/AGENTS.md`; selected adapters add bridges
for other agents. Existing instructions and skills are preserved. Read the
[CLI reference](docs/cli.md) for exact paths and update behavior.

To use the short command, run `npm install --global .` from this checkout.
Alternatively use the absolute `node .../bin/vcharn.mjs` invocation throughout.
No package registry publication is required. No global agent settings are
modified by `init`.

In a project session, tell your agent to read `.vcharn/AGENTS.md`. It should
load skills from `.vcharn/skills/` as needed. The same files support any agent
with file access and a shell, including environments without skill discovery.
If native slash commands are unavailable, use plain language or explicitly
reference the skill file.

## Verification setup

From your target project, run:

```bash
vcharn verify init
vcharn prompt verify-setup
```

Ask your agent to follow the printed brief. It inspects the actual app,
configures test and runtime argv commands, exercises representative user
journeys, and documents them in `.vcharn/features/README.md` with feature
pages. No checks are guessed or executed by initialization.

```bash
vcharn doctor
vcharn verify run --dry-run
vcharn verify run
```

An empty scaffold fails readiness. Review configured commands before running:
they inherit your environment and permissions. Logs and reports are stored
under `.vcharn/evidence/`, ignored by git during project initialization.
See [verification schemas and limits](docs/cli.md#verification).

## Personal learning wiki

Learning remains optional and occurs in the current project session. The
agent reads and updates `~/dev-knowledge/` when you request a lesson. To seed
it manually without replacing existing notes, run from this checkout:

```bash
mkdir -p ~/dev-knowledge
cp -n dev-knowledge/index.md ~/dev-knowledge/index.md
```

If the destination exists, preserve it. Personal notes belong in private
storage; the CLI never initializes, uploads, or overwrites your wiki. If an
agent cannot write outside the project, it should teach inline and report
the unsaved note, then follow its environment's permission process.

## Installing skills in other agents

You can use the skills independently. Copy the complete folder from
`dotfiles/skills/<name>/` into a skill location supported by your installed
agent, or point its instructions at that folder. Preserve `references/` and
`scripts/`. There is no universal native skill directory across agents;
the CLI avoids that dependency by installing a shared project folder.

For manual global Claude setups, merge `dotfiles/CLAUDE.md` into your existing
rulebook after replacing `{{YOUR_NAME}}` and choosing your languages. Keep
personal rules and notes intact. The project's shared protocol
`dotfiles/AGENTS.md` works without personal placeholders.

The README tools can also run directly:

```bash
node dotfiles/skills/readme-craft/scripts/make-banner.mjs --help
node dotfiles/skills/readme-craft/scripts/check-readme.mjs README.md
```

## Migrating an existing installation

Existing global Claude rules, learn-mode, readme-craft, and personal wiki
notes remain usable. To add the portable workflows:

1. Run `vcharn init --root <project> --agent <agent>`.
2. Compare the installed `.vcharn/AGENTS.md` against any existing global
   protocol. Consolidate conflicting custom preferences deliberately.
3. If you use global skill copies, compare them with the new bundled skills;
   retain one intended version to avoid ambiguous duplicate discovery.
4. Set up real verification commands and feature maps for that project.
5. Save future handoffs with `vcharn checkpoint --file <note.md>` so another
   agent can recover context using `vcharn recall <phrase>`.

Re-running initialization refreshes only marked instruction bridges. Shared
rules and skill files are preserved, so later upgrades require comparison
and merging. Initialization does not remove older files or personal notes.
