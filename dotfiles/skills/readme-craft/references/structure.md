# Stage 2: decide the shape

## Pick the reader first
| Reader | Wants | Emphasise | Avoid |
| --- | --- | --- | --- |
| Non-technical user | "Will this help me, and can I install it?" | Outcome, visuals, per-OS copy-paste install, troubleshooting | Jargon, architecture first |
| Application developer | "Does it fit my stack, how fast can I try it?" | Quick start, minimal example, config, comparison | Marketing adjectives |
| Library user | "What is the API, is it maintained?" | Install line, a 10-line example, API link, versions supported | Long prose |
| Contributor | "How do I build and test it?" | CONTRIBUTING link, project map, dev setup | Mixing this into the user path |

A README can serve several readers, but its top screen serves the primary one.

## The 3-second test
Above the fold (what shows without scrolling): banner or title, a one-line tagline, one sentence of what it does
and for whom, badges, and a link bar. A stranger should know whether to keep reading.

## Default section order (drop what does not apply; never pad)
1. **Header**: banner (`<picture>` light/dark), tagline, one-paragraph pitch, badges, link bar.
2. **Show it**: a real GIF/screenshot beside a short "what you get" list (an HTML table puts them side by side).
3. **Why / features**: 4-6 rows, each a concrete benefit backed by code. A two-column emoji table scans well.
4. **Quick start**: prerequisites (per-OS `<details>`), install, first success in under five minutes.
5. **Usage**: the main commands or API with one realistic example each.
6. **Configuration / customisation**.
7. **How it works**: a small ASCII or Mermaid diagram plus a link to deeper docs.
8. **Troubleshooting / FAQ**: the top 3-5 real failure modes as a table.
9. **Roadmap** (task list), **Contributing**, **Security**, **License**, optional acknowledgements.

## Tone
Short sentences. Second person ("you"). Concrete nouns over adjectives: "renders a 64-second video in 40 s on a
4 GB laptop" beats "blazing fast". Explain jargon once or link it. Keep line length readable (~120 chars in source).
