---
title: Getting started
description: Install the base skill set for every project, then add skills per stack.
sidebar:
  order: 1
---

Install in layers: a **base** every project gets, a **frontend base** for web UIs, then **stack add-ons** only when the project uses that stack. Fewer skills means less for the agent to choose between — install only what the project needs.

All commands run from the project root.

## Two ways to install our skills

**Claude Code plugin — all skills at once.** One `phenomenon` plugin bundles every skill in this repo. Run in a Claude Code session, one line at a time:

```claude
/plugin marketplace add Phenomenon-Studio/phenomenon-skills
/plugin install phenomenon@phenomenon-skills
/reload-plugins
```

Or from the terminal:

```bash
claude plugin install phenomenon --marketplace Phenomenon-Studio/phenomenon-skills
```

Skills run as `/phenomenon:<skill>`, e.g. `/phenomenon:react`. To get new and changed skills, see [Updating the plugin](#updating-the-plugin). With the plugin, skip the `Phenomenon-Studio/phenomenon-skills` commands below — you only need the external skills (Matt Pocock, Modern Web Guidance, Next.js).

**`skills` CLI — pick per project, any agent.** The layered steps below. `npx skills` detects your agent (Claude Code, Cursor, Codex, …) and installs into its skills folder; add `-a <agent>` to choose explicitly or `-g` to install globally. For Codex, skills land in `.agents/skills/`:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills -a codex --skill react
```

### Updating the plugin

Third-party marketplaces don't auto-update by default, so the plugin stays on the commit you installed until you update it. The plugin has no pinned version: every commit to `main` counts as a new version.

From the terminal — refresh the marketplace, then update the plugin:

```bash
claude plugin marketplace update phenomenon-skills
claude plugin update phenomenon@phenomenon-skills
```

Or in a Claude Code session: `/plugin` → **Marketplaces** → `phenomenon-skills` → **Update marketplace** (refreshes the list and updates the installed plugin). Then apply it to the running session:

```claude
/reload-plugins
```

A new session picks up the update without a reload.

**Auto-update (recommended):** `/plugin` → **Marketplaces** → `phenomenon-skills` → turn auto-update on. Claude Code then checks in the background a few minutes after a session starts and tells you to run `/reload-plugins` when an update lands.

## 1. Base — every project

### 1.1 Matt Pocock's skills

The workflow layer: grilling, specs, tickets, TDD, code review, PRs. Read [Workflow](./workflow.md) for the philosophy behind it.

Claude Code (updates itself):

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

Any other agent:

```bash
npx skills@latest add mattpocock/skills
```

Then run once per repo:

```claude
/setup-matt-pocock-skills
```

> Use one install method per agent — installing both gives every skill twice.

### 1.2 Dependency safety and security

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill pnpm-audit-install pnpm-audit-update web-security
```

See [Dependencies](./skills/dependencies/index.md) and [Security](./skills/security/index.md).

### 1.3 Claude Code project config (optional)

[`claude-config/`](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/claude-config) is a template for the project's `.claude/` folder:

| File | Copy to | What it does |
| --- | --- | --- |
| `settings.json` | `.claude/settings.json` | Denies reading `.env*` files, allows `pnpm run *`, runs Prettier after every edit |
| `hooks/block-dangerous-git.sh` | `.claude/hooks/` | Blocks destructive git commands |
| `commands/code-review.md` | `.claude/commands/` | `/code-review [BUGS,SECURITY,PERFORMANCE]` full-codebase review |

Keep `CLAUDE.md` short and point it at the README and `package.json` — [progressive disclosure](https://www.humanlayer.dev/blog/writing-a-good-claude-md) beats one huge file.

## 2. Frontend base

### 2.1 React core

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill react typescript accessible-html-jsx
```

See [React core](./skills/react-core/index.md).

### 2.2 Modern Web Guidance (Google Chrome)

Web platform best practices and browser-compatibility data, so the agent uses modern APIs instead of legacy workarounds. Recommended install (updates automatically):

```bash
npx modern-web-guidance@latest install
```

Alternative via the skills CLI (manual updates):

```bash
npx skills@latest add GoogleChrome/modern-web-guidance
```

Without a configured Baseline target it defaults to **Baseline Widely available**. Other agents and options: [Get started with Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance/get-started).

## 3. Stack add-ons

Add only the rows that match the project.

| Project uses | Install |
| --- | --- |
| Vite + TanStack | `npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill tanstack-query tanstack-router tanstack-form generate-browserslist` |
| Next.js | `npx skills@latest add vercel-labs/next-skills --skill next-best-practices` |
| shadcn/ui | `npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill shadcn` |
| A backend with Swagger/OpenAPI | `npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill swagger-to-md` |

Details: [TanStack](./skills/tanstack/index.md), [UI kit](./skills/ui-kit/index.md), [API docs](./skills/api-docs/index.md), [Dependencies](./skills/dependencies/index.md).

## 4. Keep skills current

```bash
npx skills@latest list     # what is installed
npx skills@latest update   # pull latest versions
```
