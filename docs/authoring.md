---
title: Authoring skills
description: Skill anatomy, where new skills go, and how the docs stay in sync.
sidebar:
  order: 3
---

## How skills activate

The agent reads only the `description` in each `SKILL.md` frontmatter to decide whether to load a skill. The body loads only when triggered, so the description must say **what** the skill does and **when** to use it.

## Anatomy

```
skills/<group>/<skill-name>/
├── SKILL.md        # required: frontmatter + concise instructions (<100 lines ideal)
├── REFERENCE.md    # optional: deep reference, loaded only when needed
└── scripts/        # optional: deterministic helper scripts
```

```markdown
---
name: skill-name
description: What it does. Use when <trigger situations>.
user-invocable: false   # optional: model-invoked only, hidden from the / menu
---
```

Principles:

- **Progressive disclosure** — keep `SKILL.md` short; push detail into `REFERENCE.md`.
- **Self-contained** — bundle what the agent needs so it doesn't search the web.
- **Don't duplicate upstream** — if [Matt Pocock's skills](https://github.com/mattpocock/skills) or another maintained skill covers it, link it in the docs instead.

For writing guidance, install [`writing-for-agents`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-for-agents).

## Adding a skill

1. Put it in the group folder that matches its purpose: `skills/<group>/<skill-name>/SKILL.md`. New group? Also create `docs/skills/<group>.md` with frontmatter, an intro, and the markers `<!-- skills:start -->` / `<!-- skills:end -->`.
2. Regenerate the docs:

   ```bash
   node scripts/build-docs.mjs
   ```

   This rewrites the skill list in the group page and the catalog in `README.md` from frontmatter. Never edit between the markers by hand — CI runs `--check` and fails if they are stale.
3. If the skill belongs in a recommended install step, add it to [Getting started](./getting-started.md).
4. Preview the site: `cd site && pnpm install && pnpm dev`.
