# Stage 3: visuals without an image model

Three kinds of visuals, all made with code or captured from the real project.

## 1. Banner: hand-written SVG, in a light and a dark version
SVG is text: shapes, colours and type described in XML. Start from `scripts/make-banner.mjs`, then customise the
right-hand motif so it hints at what the project does (phone frames for a video tool, a terminal for a CLI, nodes
and edges for a graph library, bars for analytics).

Rules for SVG that renders on GitHub and elsewhere:
- Displayed through `<img>`, so **no scripts, no external fonts, no external images, no `<foreignObject>`**.
  Use system font stacks: `ui-sans-serif, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif` and
  `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. Text renders in the viewer's font, so leave slack.
- Set `width`, `height` and `viewBox` (e.g. 1280x300), `role="img"` and an `aria-label`.
- Two files with the same layout and swapped palettes, served with:
  ```html
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="docs/assets/banner-light.svg">
    <img alt="project: tagline" src="docs/assets/banner-dark.svg" width="100%">
  </picture>
  ```
- Contrast: text at least 4.5:1 against its background in both versions.
- Optional subtle motion with CSS `@keyframes` inside `<style>` works in `<img>` SVGs; keep it calm and short.

**Always look at it.** Rasterise and view the PNG before shipping, because a mistake in SVG is invisible in the
source. Any of these works: `rsvg-convert -o out.png in.svg`, `ffmpeg -i in.svg out.png`,
`inkscape in.svg -o out.png`, or open the SVG in a browser and screenshot it. Check alignment, overflow, and how
both palettes look.

## 2. Real screenshots and GIFs (the strongest proof)
- Capture the real product: a browser screenshot (Playwright/Chromium headless), a terminal recording
  (`asciinema` + `agg`, or `vhs`), or frames from a video the project produced.
- A small GIF from a video with FFmpeg (palette pass keeps it crisp and small):
  ```bash
  ffmpeg -ss 0 -t 12 -i demo.mp4 -vf "fps=10,scale=270:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=bayer" docs/assets/demo.gif
  ```
- Keep GIFs under ~3 MB and images under ~1 MB; prefer PNG for UI, GIF/WebP/MP4 for motion.
- Side-by-side comparisons (themes, before/after) via `ffmpeg -i a.png -i b.png -filter_complex hstack=2 out.png`.
- Never include personal data, real customer data, API keys or private URLs in a capture.

## 3. Diagrams
- Mermaid (` ```mermaid `) renders natively on GitHub and GitLab: good for flows and architecture.
- ASCII box diagrams in a ` ```text ` block render everywhere, including npm and PyPI pages.

## Where to put assets
`docs/assets/` (or `.github/assets/`), referenced with relative paths. Commit them; never hot-link images from
someone else's server.
