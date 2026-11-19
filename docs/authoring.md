---
title: Authoring skills
description: How to create a skill — structure, template, writing it with /writing-for-agents, and keeping the docs in sync.
sidebar:
  order: 6
---

Before you write: [Contributing](./contributing.md) covers what belongs here and how a skill gets reviewed.

## How skills activate

The agent reads only the `description` in each `SKILL.md` frontmatter to decide whether to load a skill. The body loads only when triggered, so the description must say **what** the skill does and **when** to use it.

## Anatomy

```
skills/<group>/<skill-name>/
├── SKILL.md        # required: frontmatter + concise instructions (<100 lines ideal)
├── REFERENCE.md    # optional: deep reference, loaded only when needed
└── scripts/        # optional: deterministic helper scripts
```

`<skill-name>` is kebab-case and matches `name` in the frontmatter. Name reference files after what they hold (`CHECKLIST.md`, `rules/forms.md`) when one `REFERENCE.md` isn't enough.

## SKILL.md template

```markdown
---
name: skill-name
description: What it does, in one sentence. Use when <trigger situation>, <another distinct trigger>.
user-invocable: false   # optional: model-invoked only, hidden from the / menu
---

One or two lines: what the agent produces and the bar it must meet.

## Steps

1. First action — ends on a checkable condition ("every route has a loader").
2. Next action.

## Rules

- Rule the agent applies, stated as what to do, with the reason when it isn't obvious.

## Reference

- [REFERENCE.md](REFERENCE.md) — read when <condition>.
```

Keep only the sections the skill needs: a review skill may be all rules, a recipe all steps.

Principles:

- **Progressive disclosure** — keep `SKILL.md` short; push detail into reference files behind a pointer that says when to read them.
- **Self-contained** — bundle what the agent needs so it doesn't search the web.
- **Don't duplicate upstream** — if [Matt Pocock's skills](https://github.com/mattpocock/skills) or another maintained skill covers it, link it in the docs instead.

## Writing it with `/writing-for-agents`

[`writing-for-agents`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-for-agents) from Matt Pocock's skills is the reference for any document an agent reads — skills, `CLAUDE.md`, `AGENTS.md`. It comes with the [base install](./getting-started.md#11-matt-pococks-skills); on its own:

```bash
npx skills@latest add mattpocock/skills --skill writing-for-agents
```

Draft and edit with it loaded:

```claude
/writing-for-agents draft a skill for <what it does>, triggered when <situations>. Our conventions: <paste or point at files>.
```

```claude
/writing-for-agents review skills/<group>/<skill-name>/SKILL.md and tighten it
```

What it pushes you towards:

- **Description as a pointer** — front-load the leading word, one trigger per distinct case, no synonyms.
- **Information hierarchy** — steps first, reference on demand, the rest disclosed into separate files.
- **Completion criteria** — every step ends on a condition the agent can check.
- **Positive instructions** — state the behaviour you want rather than banning the one you don't.
- **Pruning** — delete lines the model already follows by default and anything the repo already says (`package.json`, config files).

## Linting

Every skill must pass the lint before it can merge. The mechanical half of the [review checklist](./contributing.md#review-checklist) runs as ESLint rules on every `.md` file under `skills/`, through [`@eslint/markdown`](https://github.com/eslint/markdown). Rules live in [`eslint-plugins/skills.mjs`](https://github.com/Phenomenon-Studio/phenomenon-skills/blob/main/eslint-plugins/skills.mjs), configured in `eslint.config.mjs`.

```bash
pnpm install
pnpm lint
```

| Rule | Level | Checks |
| --- | --- | --- |
| `skills/require-frontmatter` | error | `SKILL.md` opens with frontmatter holding `name` and `description` |
| `skills/name-format` | error | `name` is kebab-case, at most 64 characters |
| `skills/name-matches-folder` | error | `name` equals the skill folder |
| `skills/unique-name` | error | No other skill uses the same `name` |
| `skills/description-trigger` | error | `description` says when to use it ("Use when …") |
| `skills/description-max-length` | error | `description` is at most 1024 characters |
| `skills/user-invocable-boolean` | error | `user-invocable` is `true` or `false` |
| `skills/max-lines` | warning | `SKILL.md` is at most 100 lines |
| `skills/no-broken-links` | error | Relative links and images point at files that exist (all skill `.md` files) |
| `skills/no-secrets` | error | No private keys or AWS, GitHub, Slack or API secret keys (all skill `.md` files) |

A skill folder without `SKILL.md` fails `node scripts/build-docs.mjs` instead — that's a folder problem, not a file one.

**In the editor.** Run `pnpm install` at the repo root and open the root as the project — editors use the project's own ESLint. The repo ships the editor settings:

| Editor | Repo settings | You do |
| --- | --- | --- |
| VS Code, Cursor, Windsurf | `.vscode/settings.json` validates Markdown; `.vscode/extensions.json` recommends the extension | Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) |
| Zed | `.zed/settings.json` adds the built-in `eslint` server to Markdown | Nothing |
| JetBrains (WebStorm, IntelliJ) | `.idea/jsLinters/eslint.xml` adds `md` to *Run for files* (automatic configuration) | Nothing |

Nothing underlined? Restart the ESLint server (VS Code: *ESLint: Restart ESLint Server*; Zed: *editor: restart language server*) and compare with `pnpm lint`.

**CI.** The **Check** workflow runs on every pull request and push to `main`: two steps, **Lint skills** (`pnpm lint`) and **Check skill docs** (`node scripts/build-docs.mjs --check` — every skill has its docs page and the generated lists are current). Both run on every push, so one run reports problems from each. Errors fail it and block the merge; warnings pass but the reviewer asks you to fix or justify them — see [Errors and warnings](./contributing.md#errors-and-warnings).

## Trying it locally

Copy the skill folder into a real project's `.claude/skills/` (or `.agents/skills/` for Codex), start a fresh session, and give a task that should trigger it — then one that shouldn't. Fix the `description` if it loads at the wrong time; fix the body if the output misses our conventions.

## Adding a skill

1. Put it in the group folder that matches its purpose: `skills/<group>/<skill-name>/SKILL.md`. New group? Also create `docs/skills/<group>/index.md` with frontmatter (`title`, `description`, `sidebar.order`), an intro on what the group is for and where it sits in the [workflow](./workflow.md), and the markers `<!-- skills:start -->` / `<!-- skills:end -->`.
2. Regenerate the docs:

   ```bash
   node scripts/build-docs.mjs
   ```

   This rewrites, from frontmatter and folders: the skill list in the group's `index.md`, one page per skill at `docs/skills/<group>/<skill-name>.md` (created if missing; title is the skill name; hand-written notes go after `<!-- skills:end -->` and are kept), the catalog in `README.md`, and the `phenomenon` plugin's `skills` array in `.claude-plugin/marketplace.json` (so Claude Code plugin installs include the new skill), the root `CONTRIBUTING.md` from `docs/contributing.md`, and the default `.github/pull_request_template.md` from `.github/PULL_REQUEST_TEMPLATE/update.md`. Never edit these by hand — CI runs `--check` and fails if they are stale.
3. If the skill belongs in a recommended install step, add it to [Getting started](./getting-started.md).
4. Preview the site: `cd site && pnpm install && pnpm dev`.

## Diagrams

Group pages and guides use [Mermaid](https://mermaid.js.org/syntax/flowchart.html) flowcharts. The site restyles them to match the brand, so use these shapes and classes, not inline `style` or `classDef`:

| Element | Syntax |
| --- | --- |
| Step (skill name bold, output muted) | ``id["`**/to-spec**`` ↵ ``write the spec`"]`` |
| Decision | `id{{Parallel?}}` |
| Where the flow starts / what it ships | `:::entry` / `:::exit` |
| A Phenomenon skill (orange outline) | `:::ours` |
| Numbered stage | `subgraph id ["01 · Plan"]` with `direction LR` |

Keep diagrams top-down (`flowchart TD`); put a horizontal row inside a stage. A subgraph keeps its `direction` only when edges connect to the subgraph itself, not to nodes inside it.
