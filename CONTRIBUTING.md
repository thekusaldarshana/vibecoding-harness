# Contributing

vcharn combines portable agent instructions with a small dependency-free
Node.js CLI. Useful contributions improve real verification, evidence-backed
investigation, maintainers' understanding, and cross-agent portability.

Keep the Maintainer Protocol's significant-change restatement checkpoint
and the Learning Journal's optional six-part lessons. Explain intentional
changes to those behaviors. Explicit user instructions take precedence over
the default protocols.

Keep skill descriptions precise, load detailed references only as needed,
and avoid dependencies on specific models, cloud agents, or connectors.
Scripts should use plain Node.js 18+ APIs and literal argv. Preserve existing
project files during installation and support dry runs for mutations.
Never include personal details, credentials, or real private transcripts.

Run `npm test` for CLI changes and `npm run check:readme` for documentation.
Exercise new runtime behavior, including relevant failures. Skill changes
should be checked for valid frontmatter, local links, appropriate scope,
and evidence requirements. Update [CLI docs](docs/cli.md) when behavior changes.
