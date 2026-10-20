# Stage 5: verify before you hand over

Run `node <skill-dir>/scripts/check-readme.mjs README.md`. It checks, offline: relative links and images point to
files that exist, `#anchors` match a heading or `<a id>`, every image has alt text, and that no obvious secrets
(API-key shapes, `.env` lines) or local absolute paths slipped in. Fix everything it reports.

Then confirm by hand:
- [ ] Every command in the README was run (or is listed as unverified in your hand-over), on the claimed OSes.
- [ ] Versions match the manifests (runtime, package, minimum OS).
- [ ] Every feature claim maps to code you read. Numbers come from real runs or the source.
- [ ] Badges are true today (license matches `LICENSE`; no CI badge without running CI).
- [ ] Both banner versions viewed as PNGs; text fits; contrast is fine in light and dark.
- [ ] Images: real, small (GIF < ~3 MB), meaningful alt text, no personal data.
- [ ] The top screen passes the 3-second test for the primary reader.
- [ ] Quick start reaches a visible success in under five minutes.
- [ ] Links to CONTRIBUTING, SECURITY, LICENSE, issues and discussions exist (or remove them).
- [ ] Spelling and tone: consistent product name and capitalisation everywhere.
- [ ] Preview it: GitHub web editor "Preview", VS Code Markdown preview, or `npx -y markserv README.md`.

Owner-only follow-ups to mention: repository description and topics, social preview image (a PNG of the banner),
enabling Discussions or private vulnerability reporting if the README links to them, and GitHub Pages if any.
