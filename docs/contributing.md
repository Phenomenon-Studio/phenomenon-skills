---
title: Contributing
description: How to propose a skill, open a pull request, and what reviewers check.
sidebar:
  order: 5
---

Anyone at the studio can add or improve a skill. A skill earns its place when it encodes how **we** work — a convention, a pattern, a process — that an agent can't get from its training data or from a maintained upstream skill.

## What to contribute

| Contribution | Where it goes |
| --- | --- |
| A new skill for our conventions | `skills/<group>/<skill-name>/` — follow [Authoring skills](./authoring.md) |
| A fix or improvement to an existing skill | Edit its `SKILL.md` / reference files |
| An external skill worth recommending | Link it from [Getting started](./getting-started.md) or a guide — don't copy it into `skills/` |
| Docs or site changes | `docs/` and `site/` |

## Before you start

- **Check upstream.** If [Matt Pocock's skills](https://github.com/mattpocock/skills), [Emil Kowalski's skills](https://github.com/emilkowalski/skills), [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) or another maintained skill already covers it, recommend that one instead.
- **Check this repo.** Extend an existing skill when the new material shares its trigger; add a new skill when it has its own.
- **Big change? Open an issue first.** A new group, a skill that replaces another, or a change to the install layers — describe the problem and the proposed skill before writing it. Fixes and small skills go straight to a pull request.
- **Issues:** [New issue](https://github.com/Phenomenon-Studio/phenomenon-skills/issues/new/choose) offers two forms — **New skill proposal** and **Skill update** (a problem with a skill, or an improvement).

## Skill rules

Every skill is linted. These rules are checked automatically — in your editor as you type, and in CI on every pull request:

- `SKILL.md` opens with frontmatter holding `name` and `description`.
- `name` is kebab-case (at most 64 characters), matches the skill folder, and no other skill uses it.
- `description` says what the skill does **and when to use it** — include a "Use when …" clause — in at most 1024 characters.
- `user-invocable`, if set, is `true` or `false`.
- `SKILL.md` stays under 100 lines; move detail into reference files.
- Relative links and images in the skill's `.md` files point at files that exist.
- No credentials: private keys, API keys or tokens.

The full rule list, with rule IDs and editor setup, is in [Authoring → Linting](./authoring.md#linting).

### Errors and warnings

| Level | In the editor | `pnpm lint` and CI | What happens to the pull request |
| --- | --- | --- | --- |
| **Error** | Red underline | Exits with code 1; the **Check** workflow fails | Blocked — it can't merge until every error is fixed |
| **Warning** | Yellow underline | Reported, exit code 0; **Check** passes | Can merge — fix it, or say in the pull request why the skill needs the exception; the reviewer decides |

Fix the problem rather than silencing the rule — don't add `<!-- eslint-disable -->` comments to skills. If a rule is wrong, change it in [`eslint-plugins/skills.mjs`](https://github.com/Phenomenon-Studio/phenomenon-skills/blob/main/eslint-plugins/skills.mjs) in its own pull request.

## Steps

1. **Branch** from `main`: `feat/<skill-name>` for a new skill, `fix/<skill-name>` for a fix, `docs/<topic>` for docs.
2. **Write the skill** — [Authoring skills](./authoring.md) covers the structure and writing it with `/writing-for-agents`.
3. **Try it** in a real project session: it loads when the task matches, stays out when it doesn't, and the result follows our conventions.
4. **Lint, regenerate the docs**, and commit the result — CI runs both and fails on [lint errors](#errors-and-warnings) or stale docs:

   ```bash
   pnpm install   # once: ESLint for the skill rules
   pnpm lint
   node scripts/build-docs.mjs
   ```

   With the ESLint extension in your editor, the same rules underline problems as you type — see [Authoring → Linting](./authoring.md#linting).

5. **Preview the site** if you touched `docs/`: `cd site && pnpm install && pnpm dev`.
6. **Commit** with [Conventional Commits](https://www.conventionalcommits.org/): `feat(skills): add figma-qa`, `fix(react): …`, `docs: …`.
7. **Open a pull request** with the template that fits, and fill every checklist item or say why it doesn't apply:

   | Template | For | Pick it |
   | --- | --- | --- |
   | `update.md` (default) | Fixes and improvements to existing skills, docs, site, tooling, CI | Opens automatically |
   | `new-skill.md` | A new skill | Add `&template=new-skill.md` to the pull request page's URL (`?template=new-skill.md` if it has no `?`) |

   GitHub's web UI has no template picker for pull requests — only the URL parameter. From the terminal, `gh pr create` asks which template to use, or pass `--template new-skill.md`.

## Review checklist

Reviewers check every item. The pull request template carries the same list. Items marked **(CI)** are also enforced by the [skill lint rules](./authoring.md#linting) in the **Check** workflow; the rest are judgement calls.

- **Trigger (CI)** — `description` says what the skill does and when to use it ("Use when …", under 1024 characters), with distinct trigger situations; it doesn't collide with another skill's description.
- **Invocation (CI)** — `name` is kebab-case and matches the folder, unique across the repo; `user-invocable: false` for disciplines the agent should apply on its own; left out for skills someone types as `/<name>`.
- **Size (CI, warning)** — `SKILL.md` stays short (under ~100 lines); detail sits in reference files behind a pointer.
- **Ours** — encodes a studio convention, not general knowledge the model already has or an upstream skill covers.
- **Self-contained (CI)** — everything the agent needs ships in the skill folder and relative links resolve; scripts are deterministic and need no secrets.
- **Clean (CI for credentials)** — no client names, credentials, internal URLs or project data.
- **Tried** — run in at least one real session; the pull request says where and how it went.
- **Docs** — `node scripts/build-docs.mjs --check` passes; [Getting started](./getting-started.md) updated if the skill belongs in an install layer; hand-written notes on the skill page if it needs more than its description.
- **Credit** — adapted from someone else's work? The source and license are named in the skill folder.

## Merging

Merge after one approving review and a green **Check** workflow — its **Lint skills** step (no errors) and **Check skill docs** step (every skill has its page, generated files current); a new group or install-layer change also needs agreement in its issue first. After merge, plugin users get the change on their next update — see [Updating the plugin](./getting-started.md#updating-the-plugin).
