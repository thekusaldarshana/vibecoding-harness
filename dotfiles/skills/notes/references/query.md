# Query the wiki

The wiki exists so answers do not have to be re-derived from raw files. Read
the compiled pages first; go back to raw notes only when a page is thin or
the question needs a claim the page did not record.

## Steps

1. Read `index.md`. It is a catalog with a one-line summary per page and is
   the intended entry point up to a few hundred pages.
2. Pick the few pages that could answer the question and read them fully.
   Follow their inline links one hop when the question spans topics.
3. Only if the wiki is silent or vague: `grep` the raw notes, read the
   relevant passages, and say that the answer is not yet compiled.
4. Answer from the wiki with citations to page paths (and to raw notes when
   used). Separate what the wiki states from what you inferred, and say when
   two pages disagree.
5. If the answer is thin, propose the specific page or section to extend and
   the source that would settle it, rather than filling the gap with general
   knowledge.

## File the answer back

A good synthesis is knowledge too. When the answer is non-trivial — a
comparison, a decision, a connection across notes — offer to save it as a
page (or a section on an existing page), with the index line and log entry
that go with it. Do not ask twice if the user already said yes; do not file
trivial one-liners.

Log queries in `log.md` with the same prefix style:

```markdown
## [2026-11-16] query | Does the wiki cover row locking?

- read: postgres-transactions.md, postgres-row-locking.md
- answered: partially; no page on advisory locks
- filed: no
```

## Do not

- Do not rewrite pages just because you read them.
- Do not answer from general knowledge and present it as the wiki's position.
- Do not cite a page you did not open.
- Do not modify raw notes to make an answer tidier.
