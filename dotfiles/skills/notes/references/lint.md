# Lint the wiki

Run after a batch of ingests, before a long gap, or when the user says the
wiki feels messy. A lint pass edits the wiki and never touches raw notes.

## Automated first

```bash
vcharn notes status --json
```

It reports, deterministically:

| Problem | Meaning |
| --- | --- |
| `unfiled-note` | a raw note no page cites — never ingested, or provenance was forgotten |
| `changed-source` | the note's hash no longer matches the page's `sha256` — the page may be stale |
| `unindexed-page` | a wiki page with no line in `index.md` — invisible to future sessions |
| `dangling-index-link` | an index line pointing at a file that does not exist |
| `orphan-page` | a page with no inbound links from other pages |
| `missing-source` | a page cites a note path that no longer exists |
| `unsynced-reference` | a symlink under `notes/` or `refs/` leaves the data folder; copy the file in instead |
| `broken-reference` | a symlink points at something that no longer exists |

Fix everything the tool can see before reading prose. A `changed-source` page
gets re-read against the new note content, not just a new hash.

## Then the part a script cannot do

Read `index.md` and a sample of pages end to end, and look for:

- **Contradictions** — two pages asserting different things, or a page and a
  note disagreeing. Record both, dated, with sources; pick one and say why.
- **Staleness** — claims superseded by a newer note or by the current code.
  Rewrite the page; do not append a correction underneath the old claim.
- **Synthesis gaps** — a topic spread across five pages with no page that
  says how they fit. Create the connecting page or section.
- **Missing pages** — things linked or mentioned repeatedly with no page of
  their own.
- **Link rot in prose** — inline links to renamed pages.
- **Empty scaffolding** — sections that only say "TBD" and have been there
  for months. Delete them or fill them.
- **Status honesty** — learning concepts marked `solid` that the user could
  not explain last time they came up. Downgrade rather than flatter.

## Repair order

1. Fix the mechanical problems from `notes status`.
2. Merge near-duplicate pages: pick the better name, fold the content, leave
   a link if a raw note or page pointed at the old one.
3. Correct contradictions, newest evidence wins, both sides recorded.
4. Rewrite thin pages from their sources.
5. Update `index.md` summaries, then append a log entry:

```markdown
## [2026-11-16] lint | Monthly pass

- fixed: 3 unindexed pages, 1 dangling index link, 1 stale page (postgres-transactions.md)
- merged: pg-locking.md → postgres-row-locking.md
- gaps: no page on advisory locks; no note on migration rollbacks
- asked: which Postgres version is production on?
```

## Report

Give the user a short list: what was wrong, what you changed, and the two or
three questions worth answering next. Nothing else — a lint report is not a
tour of the wiki.

Never "fix" a raw note to resolve a lint finding. The note is the evidence.
