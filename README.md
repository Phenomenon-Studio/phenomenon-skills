# Phenomenon Studio skills

Agent skills used across Phenomenon Studio projects: our own project conventions, plus a curated install path for the open-source skills we build on ([Matt Pocock's skills](https://github.com/mattpocock/skills), [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance), [Next.js skills](https://github.com/vercel-labs/next-skills)).

📖 **Docs:** https://phenomenon-studio.github.io/phenomenon-skills/ (source in [`docs/`](docs/))

## Quick start

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
| [api-docs](docs/skills/api-docs.md) | `swagger-to-md` |
| [dependencies](docs/skills/dependencies.md) | `generate-browserslist`, `pnpm-audit-install`, `pnpm-audit-update` |
| [react-core](docs/skills/react-core.md) | `accessible-html-jsx`, `react`, `typescript` |
| [security](docs/skills/security.md) | `web-security` |
| [tanstack](docs/skills/tanstack.md) | `tanstack-form`, `tanstack-query`, `tanstack-router` |
| [ui-kit](docs/skills/ui-kit.md) | `shadcn` |
<!-- skills:end -->

Workflow skills (grilling, specs, tickets, TDD, code review) come from [Matt Pocock's skills](https://github.com/mattpocock/skills) — see [Workflow](docs/workflow.md).

## Repository layout

```
skills/<group>/<skill>/SKILL.md   skills, grouped by purpose
docs/                             documentation (rendered by the site)
docs/skills/<group>.md            one page per group; skill lists are generated
claude-config/                    Claude Code project template: settings, hooks, commands
scripts/build-docs.mjs            regenerates skill lists from SKILL.md frontmatter
site/                             Astro Starlight site, deployed to GitHub Pages
```

Adding or changing a skill: see [Authoring skills](docs/authoring.md).
