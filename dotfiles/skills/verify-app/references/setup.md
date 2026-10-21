# Build the verification loop

1. Inspect the app, existing tests, development commands, and debugging
   surfaces. Define representative user outcomes and their failure paths.
2. Run `vcharn verify init`. Populate `.vcharn/verification.json` with
   version 1 and checks having `name` (lowercase slug), `argv` (string
   array), `kind` (`test` or `runtime`), `expected` (observable result), and
   `timeoutMs` (integer, 1..3600000). Start with the smallest useful checks.
   An empty config deliberately fails readiness and cannot produce a pass.
3. Prefer existing control tools. When needed, create a small project-owned
   CLI for health, navigation, input, inspection, screenshots, seeding, or
   cleanup. Document setup, test users, safe environment boundaries, and
   recovery. Side-effecting tools should support dry runs where practical.
   Never invent a generic browser control program that cannot drive this app.
4. Catalog real journeys with `vcharn feature add <slug>`. Fill in user
   outcome, entry point, prerequisites, control commands, expected results,
   failure/recovery, sources, limitations, and verified revision. Link the
   pages from `.vcharn/features/README.md`; do not claim unobserved coverage.
5. Exercise commands and journeys. Confirm a deliberately failing condition
   causes a nonzero exit where practical. Use `vcharn doctor` and inspect a
   `vcharn verify run` report. Add `.vcharn/evidence/` to the project's git
   ignore file without overwriting existing entries.

The CLI can execute existing programs with literal argv and capture evidence.
It cannot discover acceptance criteria, seed arbitrary apps, or supply
missing browser/desktop tools itself. Configure those using the actual stack.
