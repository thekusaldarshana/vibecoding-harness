# Raw notes

Your notes live in this folder, exactly as you wrote them. This is the source
of truth, and the one folder agents are not allowed to change.

- Write here freely: dated notes, clipped articles, meeting notes, half-formed
  thinking. There is no required format and no frontmatter to maintain.
- Agents read these files and never edit, rename, move, or reformat them. A
  correction belongs in the wiki page that cites the note, not in the note.
- Images and attachments can sit next to the note or in `attachments/`.
- Files the notes cite — papers, clippings, saved docs — go in
  [`../refs/`](../refs/README.md) as **copies**. Symlinks do not survive git:
  the repo stores the link target, not the content, so the reference dangles
  on every other machine. `vcharn notes status` reports them as
  `unsynced-reference`.

The wiki these notes feed lives in [`../dev-knowledge/`](../dev-knowledge/index.md).
`dev-knowledge/index.md` is its catalog; `dev-knowledge/log.md` is its
timeline. You read the wiki; your agent maintains it.

Typical loop:

```bash
vcharn notes new postgres-locking        # create notes/2026-11-16-postgres-locking.md
vcharn prompt ingest postgres locking    # brief your agent to file it
vcharn notes status                      # what is unfiled, stale, or unindexed
```

You can also just tell the agent: "ingest my latest note". It should run
`vcharn notes status` itself before it starts.
