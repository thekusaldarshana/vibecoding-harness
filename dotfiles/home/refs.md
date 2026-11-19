# Reference material

External sources your notes and wiki pages cite: papers, clippings, docs you
saved, screenshots of a talk.

**Copy files in here. Never symlink them.**

Git stores a symlink as the target path it points at, not the file content. A
link to `~/Documents/paper.pdf` syncs as that absolute path and dangles on
every other machine — the note looks fine on this laptop and silently loses
its source everywhere else. `vcharn notes status` reports those as
`unsynced-reference`.

- Small text, PDFs, images: copy them in as-is.
- A large external folder you only cite: copy the parts you cite, or keep the
  folder outside and link to it by URL or commit in a `dev-knowledge/` page.
- Large binaries: enable Git LFS first (`git lfs install`, then a
  `.gitattributes` rule), otherwise every version lives in the repo forever.
- Name for retrieval, not for tidiness:
  `refs/2026-11-postgres-locking-paper.pdf`.
- When a reference shapes a page, cite it inline and add it to that page's
  `sources:` frontmatter with its `sha256`, exactly like a note.
