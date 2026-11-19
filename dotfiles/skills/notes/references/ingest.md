# Ingest a raw note

Goal: integrate one new note into the existing wiki, so the knowledge is
compiled once and stays current. Not: summarise the note and drop it in a
folder.

## 0. Ground yourself

```bash
vcharn notes status --json
```

Read the `data` path, the note's state, and existing problems. If the note
already shows `ingested`, ask whether the user edited it (hash changed) or
wants a re-read; do not silently reprocess.

## 1. Read the note completely

Read the whole raw file, plus every image or file it references. Notes are
short; skimming produces worse pages than reading once.

While reading, extract only what the wiki can use:

- claims and facts, with how confident the note is
- entities (people, tools, projects, systems) and the concepts they belong to
- decisions and the reason given for them
- open questions the note raises
- anything that contradicts what you already know from the wiki
- dates, versions, and environment details that qualify the claims

## 2. Look before you write

Search the wiki before creating anything:

```bash
grep -ril "<key term>" ~/dev-knowledge/
```

Read `index.md` first, then the closest existing pages. For each extracted
item decide:

| Situation | Action |
| --- | --- |
| Same concept already has a page | extend or correct that page |
| Concept is new but belongs to a page's topic | add a section to that page |
| Concept deserves its own page (it will be linked to) | create one page |
| Note disagrees with a page | record both, dated, with sources; state which you trust |
| Note only restates a page | add provenance to the page; create nothing |

A note that produces three really good page updates beats one that produces
ten thin new pages.

## 3. Write the pages

Wiki pages are one idea each, linked to their neighbours. Keep the existing
conventions:

- learning concepts keep the six-part shape from `/learn-mode` and their
  status (`unseen` → `introduced` → `practiced` → `solid`)
- topic, entity, and decision pages use plain headings and link to related
  pages inline with relative markdown links
- no page without an inbound link or an index line

Record provenance in the page frontmatter, merging with any existing entry:

```yaml
---
sources:
  - path: notes/2026-11-16-postgres-locking.md
    sha256: 6f1c...e2
    ingested: 2026-11-16
---
```

Take `sha256` from `vcharn notes status --json`; do not compute it by hand
or copy a stale value. Use the data-folder-relative path (`notes/...`).

## 4. Update the catalog

Add or adjust one line in `index.md`, under the right section, with a
one-line summary. For a learning concept include the status; for a topic or
entity page the summary is enough:

```markdown
- [Postgres row locking](postgres-row-locking.md) — `introduced` — row locks, deadlocks, and why a long transaction blocks writes
```

Keep the index ordered by section, not by date. Date order lives in the log.

## 5. Append to the log

`log.md` is append-only and greppable. Every entry starts with the same
prefix:

```markdown
## [2026-11-16] ingest | Postgres locking notes

- source: notes/2026-11-16-postgres-locking.md
- read: 1 note, 0 assets
- wrote: postgres-row-locking.md (new), postgres-transactions.md (updated §2)
- flagged: note claims `SELECT ... FOR UPDATE` never blocks reads; contradicts postgres-transactions.md §4
- next: verify against the concrete version used at work
```

## 6. Verify before reporting

```bash
vcharn notes status
```

The note must show `ingested`, not `unfiled` or `changed`; new pages must not
be reported as `unindexed-page`; the index must have no `dangling-index-link`.
Then confirm the raw note is untouched:

```bash
git -C ~/.vcharn/data status --short notes/
```

A modified file under `notes/` is a bug in your pass, not a detail.

## 7. Report to the user

Say what changed in one short block: pages created, pages updated, the
contradiction or gap you found (if any), and the single question most worth
answering next. Do not paste whole pages back into chat.
