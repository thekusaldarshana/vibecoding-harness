---
name: notes
description: Maintain the user's personal notes wiki at dev-knowledge — ingest raw notes, answer questions from it, and lint it. Raw notes under notes/ are read-only for agents. Use when the user says ingest, file, organize, index, or "what do my notes say about…".
---

# notes

Three layers, with one owner each:

| Layer | Where | Agent |
| --- | --- | --- |
| Raw notes | `<data>/notes/` (default `~/.vcharn/data/notes/`) | reads, never writes |
| Reference files | `<data>/refs/` — copied in, never symlinked | reads, never writes |
| Wiki | `<data>/dev-knowledge/` (linked as `~/dev-knowledge/`) | writes, owns entirely |
| Schema | this skill, the global rulebook, `index.md` conventions | follows; proposes changes |

`vcharn notes status --json` prints the resolved data folder, every raw note
with its hash, which wiki pages cite it, and the current problems. Run it
before and after a filing pass. It is the source of truth about what is
already ingested — never infer that from filenames.

If `notes/` does not exist yet, run `vcharn notes init` first.

## The contract

- **Raw notes are immutable.** Never edit, rename, move, reformat, or "fix"
  a file under `notes/` — not even a typo, not even to add frontmatter. If a
  raw note is wrong, the correction lives in the wiki page that cites it.
- **One note can touch many pages, one page can cite many notes.** Extend
  existing pages before creating new ones. Near-duplicate pages are the
  default failure of this workflow.
- **Provenance is recorded in the wiki, never in the note.** Each page that
  draws on a note carries `sources:` frontmatter with the note's path, its
  `sha256`, and the ingest date. That is how `notes status` knows what is
  filed and when a note has drifted.
- **`index.md` is the catalog, `log.md` is the timeline.** Every page gets an
  index line; every operation gets a log entry. A page that is not in the
  index is invisible to future sessions.
- **Rewriting beats appending.** A page reflects current understanding, not
  the history of every pass. History lives in the log and in git.
- **Contradictions are content.** When a new note disagrees with a page,
  record both with dates and sources and say which one you trust and why.
  Never silently overwrite.

## Route by request

| Request | Read |
| --- | --- |
| "file / ingest / organise my notes", a new note was added | [references/ingest.md](references/ingest.md) |
| "what do my notes say about X", synthesis, comparison | [references/query.md](references/query.md) |
| "check / lint / clean up the wiki", after a batch of ingests | [references/lint.md](references/lint.md) |

The user writes notes; you maintain the wiki. Do not ask them to write wiki
pages, and do not make them approve every cross-reference — that is the work
they delegated. Do surface contradictions, gaps, and claims you could not
ground.
