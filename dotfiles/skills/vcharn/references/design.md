# Architect and prototype

First ground the user outcome, affected boundaries, and constraints using
current code and available history. Sketch the caller's usage, public types
or signatures, data ownership, and error behavior before filling in bodies.
For shared APIs, write a short usage tutorial to expose awkward call sites.

When a design choice is consequential and uncertain, compare a few viable
candidates against the same acceptance criteria. Use independent candidate
agents if available; otherwise sketch them sequentially. Do not require a
multi-model service or parallelism to proceed.

Resolve concrete unknowns with small disposable prototypes: exercise the
actual interaction, benchmark the hot path, or compile the caller sketch.
Record commands, observations, and limitations for each candidate. For UI
choices, capture real screenshots when tools permit; do not invent captures.
Keep variants isolated and avoid disturbing existing user work.

Choose using observed behavior, interface simplicity, failure handling, and
maintenance cost. Repeated workarounds or forced type escapes justify
revisiting the boundary. Implement the chosen sketch, verify the actual user
path, and explain material deviations. Honor an explicit request to review
the design before implementation; otherwise continue authorized work.
