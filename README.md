# Phenomenon Studio skills

Agent skills used across Phenomenon Studio projects: our own project conventions, plus a curated install path for the open-source skills we build on ([Matt Pocock's skills](https://github.com/mattpocock/skills), [Emil Kowalski's skills](https://github.com/emilkowalski/skills), [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance), [Next.js skills](https://github.com/vercel-labs/next-skills)).

📖 **Docs:** https://phenomenon-studio.github.io/phenomenon-skills/ (source in [`docs/`](docs/))

## Quick start

Claude Code — all skills as one plugin (run as `/phenomenon:<skill>`):

```bash
claude plugin install phenomenon --marketplace Phenomenon-Studio/phenomenon-skills
```

Any agent — pick skills with the `skills` CLI:

```bash
# pick skills from an interactive list
npx skills@latest add Phenomenon-Studio/phenomenon-skills

# or install specific ones
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill react typescript
```

For the recommended base setup and per-stack add-ons, follow [Getting started](docs/getting-started.md).

## Catalog

<!-- skills:start -->
| Group | Skills |
| --- | --- |
| [api-docs](docs/skills/api-docs/index.md) | `swagger-to-md` |
| [client](docs/skills/client/index.md) | `client-brief`, `decision-request` |
| [dependencies](docs/skills/dependencies/index.md) | `generate-browserslist`, `pnpm-audit-install`, `pnpm-audit-update` |
| [design-qa](docs/skills/design-qa/index.md) | `figma-qa` |
| [react-core](docs/skills/react-core/index.md) | `accessible-html-jsx`, `react`, `typescript` |
| [security](docs/skills/security/index.md) | `web-security` |
| [tanstack](docs/skills/tanstack/index.md) | `tanstack-form`, `tanstack-query`, `tanstack-router` |
| [triage](docs/skills/triage/index.md) | `triage-audit`, `triage-feedback` |
| [ui-kit](docs/skills/ui-kit/index.md) | `shadcn` |
<!-- skills:end -->

Workflow skills (grilling, specs, tickets, TDD, code review) come from [Matt Pocock's skills](https://github.com/mattpocock/skills) — see [Workflow](docs/workflow.md). Design and motion skills come from [Emil Kowalski's skills](https://github.com/emilkowalski/skills) — see [Design](docs/design.md).

## Repository layout

```
skills/<group>/<skill>/SKILL.md   skills, grouped by purpose
docs/                             documentation (rendered by the site)
docs/skills/<group>.md            one page per group; skill lists are generated
.claude-plugin/marketplace.json   Claude Code plugin manifest; skills list is generated
claude-config/                    Claude Code project template: settings, hooks, commands
scripts/build-docs.mjs            regenerates skill lists and CONTRIBUTING.md
eslint-plugins/                   custom ESLint plugins; skills.mjs lints skills (`pnpm lint`, editor, CI)
site/                             Astro Starlight site, deployed to GitHub Pages
CONTRIBUTING.md                   generated from docs/contributing.md
.github/PULL_REQUEST_TEMPLATE/    pull request templates: update.md (default), new-skill.md
.github/ISSUE_TEMPLATE/           issue forms: new skill proposal, skill update
```

Adding or changing a skill: see [Contributing](CONTRIBUTING.md) for the process and review checklist, and [Authoring skills](docs/authoring.md) for how to write one.

Skills are linted against our skill rules (frontmatter, naming, trigger in the description, size, links, no secrets). Run it locally — your editor also underlines problems as you type:

```bash
pnpm install
pnpm lint
```

CI runs the same lint on every pull request: errors block the merge, warnings need a fix or a reason in the PR. Details: [Contributing → Skill rules](CONTRIBUTING.md#skill-rules).
