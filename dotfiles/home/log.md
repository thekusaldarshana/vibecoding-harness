# Wiki log

Append-only. Newest entries at the bottom. One entry per ingest, query that
produced something, or lint pass.

Every entry starts with the same prefix so the log stays greppable:

```bash
grep '^## \[' log.md | tail -5
```

Format:

```markdown
## [YYYY-MM-DD] ingest | Short title

- source: notes/<file>.md
- read: 1 note, 0 assets
- wrote: <page>.md (new), <page>.md (updated §2)
- flagged: <contradiction or gap, or nothing>
- next: <the one question worth answering next>
```

Types: `ingest`, `query`, `lint`. Keep entries short — this is a timeline,
not a diary. Page content belongs in pages.
