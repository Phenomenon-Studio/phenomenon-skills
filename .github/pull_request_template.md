## What

<!-- One or two sentences: the skill (or change) and the problem it solves. -->

## Type

- [ ] New skill
- [ ] Skill fix / improvement
- [ ] External skill recommendation (docs only)
- [ ] Docs / site / tooling

## How it was tried

<!-- Project and prompt you ran it with, whether it loaded when expected, and what the agent produced. -->

## Checklist

See [Contributing → Review checklist](https://phenomenon-studio.github.io/phenomenon-skills/contributing/#review-checklist). The **Check** CI workflow (`pnpm lint`) covers trigger, naming, size, links and secrets — the rest is on you and the reviewer.

- [ ] **Trigger** — `description` says what and when; no overlap with another skill
- [ ] **Invocation** — `user-invocable: false` set or omitted on purpose
- [ ] **Size** — `SKILL.md` under ~100 lines; detail in reference files
- [ ] **Ours** — studio convention, not covered by the model or an upstream skill
- [ ] **Self-contained** — no web lookups needed; scripts deterministic, no secrets
- [ ] **Clean** — no client names, credentials, internal URLs or project data
- [ ] **Tried** — run in a real session (see above)
- [ ] **Lint** — `pnpm lint` has no errors; any warning is explained under **How it was tried**
- [ ] **Docs** — `node scripts/build-docs.mjs` run and committed; Getting started updated if needed
- [ ] **Credit** — source and license named if adapted

<!-- Not applicable? Tick it and say why. -->
