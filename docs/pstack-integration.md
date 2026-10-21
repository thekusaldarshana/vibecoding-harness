# pstack ideas in vcharn

This integration is an original implementation based on the two supplied
articles by Lauren (@poteto): [Part 1](https://x.com/poteto/article/2094457600259842065?lang=en)
and [Part 2](https://x.com/poteto/article/2097732320606507506).
It adapts the workflows described in the articles. It does not vendor the
pstack plugin or claim to reproduce all of its skills or playbooks.

| Article concept | vcharn implementation |
| --- | --- |
| poteto-mode | `vcharn` skill and `vcharn prompt work`, with references loaded by task |
| Create verification skill | `verify-app` setup workflow, `verify init`, real project control tools |
| Maintain verification skill | `vcharn prompt maintain`, run on demand or with user-requested scheduling |
| Build the lever | Reusable argv checks, documented project control CLI, evidence reports |
| Feature maps | `.vcharn/features/`, journey templates and observed runtime coverage |
| how / why | `vcharn prompt how` / `why`, code traces and sourced history |
| teach | Enhanced `learn-mode`, preserving six parts and optional lessons |
| recall | Agent-neutral Markdown handoffs and literal local search |
| Architect / prototype | Caller-first sketches, competing experiments, empirical comparison |
| Multi-phase plan | Proof per task and `vcharn plan check` |
| Technical writing | Purpose-based writing reference; existing readme-craft for READMEs |

The Maintainer Protocol remains central: significant work gets WHAT / WHY /
HOW and a restatement checkpoint. Learning stays optional. Verification and
historical research strengthen what the maintainer reviews and learns.

The CLI is the reusable tooling layer; the agent supplies judgment. Project
control commands must be built for the actual stack. No universal browser
controller is fabricated. Cloud agents, parallel model runners, private
transcript access, and external service connectors are optional capabilities
of the chosen agent. Sequential local work remains a complete workflow.

See [CLI reference](cli.md) for exact behavior and limits.
