# Verifiable execution plans

Use after grounding the problem and resolving the design's consequential
unknowns with code or experiments. Break work into units with an observable
outcome, concrete verification command, and expected result. Include runtime
journeys for application behavior and the relevant regression tests.

For machine validation, create JSON with a `tasks` array. Each task has a
unique lowercase `id`, an `outcome`, a nonempty `verify` argv array, and an
`expected` observation. Run `vcharn plan check <plan.json>`. This validates
structure only; it neither executes the plan nor proves it correct.

Execute in dependency order and record evidence for each unit. Tests alone
do not establish that a UI or service integration works. Exercise the
runtime path where the change requires it. If blocked, keep the unit pending
and state the prerequisite. No automatic commits, PRs, or merges are implied.
Keep durable decisions in handoffs; remove temporary plans only within the
user's scope and without deleting unrelated work.
