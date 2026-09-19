# Token bucket algorithm

Status: `introduced`

Example of what a single concept file in `~/dev-knowledge/` looks like
after a `/learn-mode` session, following the six-part teaching shape from
`dotfiles/skills/learn-mode/SKILL.md`. This one would be linked from
`index.md` under **CS & SWE theory**.

## 1. The snippet

```ts
const allowed = await redis.eval(`
  local count = redis.call('INCR', KEYS[1])
  if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return count <= tonumber(ARGV[2])
`, 1, `rate:${apiKey}`, WINDOW_SECONDS, MAX_REQUESTS)
```

## 2. What it does

Counts requests for a given key within a fixed time window, and returns
whether the count is still under the allowed maximum. Once the window
expires, the counter resets and the caller gets a fresh allowance.

## 3. Its purpose here

Used to reject API calls once a client exceeds its request quota for the
current window, so one caller can't overwhelm the gateway or degrade
service for everyone else.

## 4. Its name

**Token bucket algorithm** (this specific implementation is technically a
*fixed window counter*, the simpler cousin of token bucket — worth
knowing both names, since token bucket is the one that comes up in
interviews and most rate-limiter libraries).

## 5. The problem it solves

Rate limiting in general: bounding how much of a shared resource (API
calls, bandwidth, login attempts) one actor can consume in a given time
period, without needing to track every individual request forever —
just a counter and a reset time.

## 6. What it connects to

- `redis-incr-atomicity` (`introduced`) — why `INCR` is safe to call
  concurrently from multiple gateway instances without a race condition.
- `distributed-systems-shared-state` (`unseen`) — the broader problem of
  multiple stateless instances needing to agree on one number.
