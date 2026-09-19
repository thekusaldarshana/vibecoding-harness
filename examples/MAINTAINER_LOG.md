# Maintainer Log

Example of what a project's `MAINTAINER_LOG.md` looks like after a few
SIGNIFICANT checkpoints, per the Maintainer Protocol in `dotfiles/CLAUDE.md`.
This file itself is generated per-project by the agent, not something you
write by hand — this is just a sample so you know what to expect.

---

## 2026-02-03 — Added Redis-backed rate limiter to the API gateway

**WHAT:** Introduced a token-bucket rate limiter middleware in front of all
`/api/*` routes, backed by Redis (`INCR` + `EXPIRE`) keyed on API key + route.

**WHY:** Considered an in-memory limiter first — rejected because it
resets on every deploy and doesn't share state across the 3 running
instances behind the load balancer. Redis was already in the stack for
sessions, so no new infra.

**HOW:** Depends on `REDIS_URL` being set (already required for sessions).
Sits in `middleware/rateLimit.ts`, registered before auth middleware so
abusive unauthenticated traffic is dropped early. If Redis goes down, the
limiter currently fails closed (blocks all traffic) — flagged as a
follow-up to change to fail-open with a warning log.

**Restated by you:** "Every API call checks a Redis counter first; if
you've made too many requests in the window it gets rejected before it
even reaches login. If Redis dies, the site currently goes down with it,
which we said we'd fix later."

---

## 2026-02-11 — Migrated `users.role` from a string column to an enum

**WHAT:** Changed `users.role` from `varchar` to a Postgres `role_enum`
(`admin`, `member`, `viewer`), with a migration backfilling existing rows.

**WHY:** Strings allowed typos like `"amdin"` to silently create a
role that matched nothing in the authorization checks — a real bug we hit
last week. Considered a check constraint instead, went with a native enum
because the ORM has first-class support for it and it self-documents in
`\d users`.

**HOW:** Every place that compares `user.role` against a string literal
still works (Postgres enums compare like strings), but any new role value
now has to go through a migration instead of being typo'd in application
code. Breaks if a client library still sends the old default `"user"`
value on signup — checked, it doesn't.

**Restated by you:** "Roles used to just be text, so a typo could create a
role that doesn't match anything. Now the database itself only accepts the
three real roles, so that class of bug can't happen anymore."
