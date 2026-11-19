<!--
  New skill template. Rules: https://phenomenon-studio.github.io/phenomenon-skills/contributing/
  Not a new skill? Use the default template: remove `template=new-skill.md` from this page's URL.
-->

## Skill

- **Name:** `skill-name`
- **Group:** `skills/<group>/` <!-- new group? say why and link the agreed issue -->
- **Invocation:** <!-- model-invoked (`user-invocable: false`) or user-invoked (`/skill-name`) -->

<!-- Closes #… (proposal issue, required for a new group) -->

## Problem it solves

<!-- What goes wrong without it. Why it's ours: the studio convention it encodes, and which upstream skills you checked (Matt Pocock, Emil Kowalski, Modern Web Guidance, …). -->

## How it was tried

<!-- Project and prompt you ran it with. Did it load when it should, and stay out when it shouldn't? What did the agent produce? -->

## Checklist

See [Contributing → Review checklist](https://phenomenon-studio.github.io/phenomenon-skills/contributing/#review-checklist). The **Check** workflow covers trigger, naming, size, links and secrets — the rest is on you and the reviewer.

- [ ] **Trigger** — `description` says what and when; no overlap with another skill
- [ ] **Invocation** — `user-invocable: false` set or omitted on purpose
- [ ] **Size** — `SKILL.md` under ~100 lines; detail in reference files
- [ ] **Ours** — studio convention, not covered by the model or an upstream skill
- [ ] **Self-contained** — no web lookups needed; scripts deterministic, no secrets
- [ ] **Clean** — no client names, credentials, internal URLs or project data
- [ ] **Tried** — run in a real session (see above)
- [ ] **Lint** — `pnpm lint` has no errors; any warning explained above
- [ ] **Docs** — `node scripts/build-docs.mjs` run and committed; Getting started updated if it belongs in an install layer
- [ ] **Credit** — source and license named if adapted

<!-- Not applicable? Tick it and say why. -->
