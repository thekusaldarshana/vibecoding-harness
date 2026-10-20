# Stage 4: GitHub-flavoured Markdown that renders

## Building blocks
- **Centered header**: wrap banner, tagline and badges in `<div align="center">` … `</div>` with blank lines inside
  so Markdown still renders within it.
- **Badges** (shields.io static badges render without any service): `https://img.shields.io/badge/<label>-<message>-<hex>?style=flat-square`,
  optional `&logo=<simpleicons-name>&logoColor=white`. Encode spaces as `%20`, `|` as `%7C`, `≥` as `%E2%89%A5`,
  and a literal `-` as `--`. Keep one style for all badges, 4-7 in total, each linking somewhere useful.
- **Link bar**: `**[Quick start](#quick-start)** · **[Usage](#usage)** · …`
- **Side by side**: an HTML `<table>` with two `<td valign="top">`; leave a blank line after `<td>` so Markdown
  inside renders.
- **Alerts**: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` on the first line of a quote.
- **Collapsible**: `<details><summary><b>Windows</b></summary>` + blank line + content + `</details>`; add `open`
  to the one most readers need.
- **Task lists** for roadmaps: `- [ ] item`. **Footnotes**: `text[^1]` … `[^1]: note`.
- **Code blocks** always with a language (`bash`, `powershell`, `jsonc`, `text`); one command per line, comments
  after `#` so it stays copy-pasteable.
- **Keyboard keys**: `<kbd>Ctrl</kbd>+<kbd>C</kbd>`. **Small print**: `<sub>…</sub>`.

## Anchors (the classic trap)
GitHub builds heading IDs by lower-casing, dropping most punctuation and emoji, and turning spaces into `-`. Emoji
and variation selectors make these unpredictable (`## 🚀 Quick start` becomes `#-quick-start`). For headings with
emoji or symbols, put an explicit anchor right above and link to it:
```markdown
<a id="quick-start"></a>

## 🚀 Quick start
```
`scripts/check-readme.mjs` reports every `#link` that has no matching heading or explicit anchor.

## Portability
npm, PyPI and VS Code Marketplace pages strip some HTML (`<picture>`, alignment) and do not resolve relative image
paths. If the README is also a package page, use absolute `https://raw.githubusercontent.com/...` image URLs and
make sure it still reads well as plain Markdown.

## Things that do not render on GitHub
`<style>`, `<script>`, `class`/`style` attributes, iframes, custom fonts, and JavaScript. HTML attributes that
survive include `align`, `width`, `height`, `valign`, `id` (on `<a>`), `open`, `alt` and `src`.
