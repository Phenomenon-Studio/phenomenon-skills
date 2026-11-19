<!-- Generated from .github/PULL_REQUEST_TEMPLATE/update.md by scripts/build-docs.mjs — edit that file. -->
<!--
  Update template: fixes and improvements to existing skills, docs, site, tooling, CI.
  Adding a new skill? Switch to the new-skill template:
  add `&template=new-skill.md` to this page's URL (`?template=new-skill.md` if it has no `?`),
  or run `gh pr create --template new-skill.md`.
-->

## What

<!-- One or two sentences: what changed. -->

## Why

<!-- The problem it fixes or the reason for the change. Link the issue: Closes #… -->

## Type

- [ ] Skill fix / improvement
- [ ] External skill recommendation (docs only)
- [ ] Docs / site
- [ ] Tooling / CI

## How it was checked

<!-- Commands you ran, pages you previewed. Changed a skill's behaviour? The project and prompt you ran it with, and what the agent produced. -->

## Checklist

- [ ] **Check** — `pnpm lint` has no errors (any warning explained above); `node scripts/build-docs.mjs` run and committed
- [ ] **Skill changed?** — still loads when it should and follows the [review checklist](https://phenomenon-studio.github.io/phenomenon-skills/contributing/#review-checklist); tried in a real session
- [ ] **Install layers changed?** — [Getting started](https://phenomenon-studio.github.io/phenomenon-skills/getting-started/) updated
- [ ] **Clean** — no client names, credentials, internal URLs or project data

<!-- Not applicable? Tick it and say why. -->
