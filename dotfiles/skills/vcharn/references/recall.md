# Portable recall

Run `vcharn recall <literal phrase>` to find matching lines in project
handoffs, feature maps, and MAINTAINER_LOG.md. Open the matching files for
context. Recall searches local Markdown, not private agent chat stores.
Without the CLI, search those same files directly.

Check recalled claims against current code and git history. Label old
observations by revision or date; do not treat past plans as current intent.
Read relevant personal knowledge notes only when teaching and with access
permitted. Use explicit transcript exports only if the user provides them.

Before a session ends, write a concise handoff containing the goal,
constraints, decisions with sources, changed files, commands and evidence,
blocked or unfinished work, and a concrete next step. Save it with
`vcharn checkpoint --file <note.md>` or under `.vcharn/memory/` directly.
Keep secrets, raw transcripts, and unrelated personal information out.
Do not fabricate completed work or a maintainer restatement.
