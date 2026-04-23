# Phenomenon Studio skills

This is a collection of skills for Phenomenon Studio.
It contains a combination of internal custom skills, and open-source skills.

This repo contains skills divided by such groups:
- **Common** - Skills that are common to all projects (`./common`).
- **FE** - Skills that are specific to FE projects (`./fe`).
- **BE** - Skills that are specific to BE projects (`./be`).

Skills are organized into the following categories:

- **Planning & design**
- **Implementation**
  - **FE - Common**
  - **BE - Common**
  - **FE - Vite-based projects**
  - **FE - Next.js-based projects**
  - **FE - Shadcn/UI-based projects**
- **Quality and security**
- **Tooling and Meta**

## CLAUDE.md

The root CLAUDE.md file defines project-level instructions that override default AI behavior. Prefer [progressive disclosure](https://www.humanlayer.dev/blog/writing-a-good-claude-md) for this file. It sets:
- Conciseness — replies must be short, key info only, no fluff or long code snippets.
- Documentation-first — when working with any third-party library, the AI must look up official docs using the `DocsExplorer` subagent before writing code.
- Project context — points to README.md for tech stack/structure and `package.json` for dependencies/scripts.


### Skill System Overview
Skills are modular instruction sets that Claude Code loads on demand. Each skill lives in `.claude/skills/<skill-name>/` with a required `SKILL.md` and optional `REFERENCE.md`, `EXAMPLES.md`, or `scripts/`.

### How skills activate

Claude reads only the description field in SKILL.md frontmatter to decide which skill to load. The full skill content is loaded into context only when triggered — this is critical for context optimization.

### Structure

```
skill-name/
├── SKILL.md           # Main instructions (required, <100 lines ideal)
├── REFERENCE.md       # Deep reference docs (loaded only when needed)
└── scripts/           # Deterministic helper scripts (optional)
```

### Key design principles
- Progressive disclosure — SKILL.md stays concise; deep details go in REFERENCE.md.
- Lazy loading — only the relevant skill is loaded into context, not all skills.
- Self-contained — each skill bundles everything the AI needs, reducing web lookups.


## Planning & design

Work the issues/feature out to give the output to implementation skills.

- `grill-me` [Link](https://github.com/mattpocock/skills/tree/main/grill-me) - Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.
  ```bash
  npx skills@latest add mattpocock/skills/grill-me
  ```
- `to-prd` [Link](./common/to-prd/SKILL.md) - Turn the current conversation context into a PRD and submit it as a Markdown file. Use when user wants to create a PRD from the current context.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/common/to-prd
  ```
- `to-issue` [Link](./common/to-issue/SKILL.md) -Break the PRD or conversation context into independently-grabbable Markdown files using tracer-bullet vertical slices. Use when user wants to convert a prd into issues, create implementation plan, or break down conversation context into issue or issues.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/common/to-issue
  ```
- `do-work` [Link](./common/do-work/SKILL.md) - Execute a complete unit of work: plan it, build it, validate it. Use when user wants to do work, build a feature, fix a bug, or implement the issue
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/common/do-work
  ```
- `zoom-out` [Link](https://github.com/mattpocock/skills/tree/main/zoom-out) - Zoom out and give broader context or a higher-level perspective. Use when you're unfamiliar with a section of code or need to understand how it fits into the bigger picture.
  ```bash
  npx skills@latest add mattpocock/skills/zoom-out
  ```

## Implementation

### FE - Common 
- `react` [Link](./fe/react/SKILL.md) - Build clean, modern React components that apply common best practices and avoid common pitfalls like unnecessary state management or useEffect usage.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/react
  ```
- `typescript` [Link](./fe/typescript/SKILL.md) - Write clean, efficient TypeScript code that follows project conventions and advanced type patterns. Use when writing or reviewing TypeScript code, defining types, creating generics, handling errors, or working with React components, Zod schemas, and TanStack libraries.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/typescript
  ```
- `accessible-html-jsx` [Link](./fe/accessible-html-jsx/SKILL.md) - Write clean, modern, and highly accessible HTML & JSX code, using semantically correct elements and attributes. Use when writing or reviewing HTML/JSX markup, creating forms, handling ARIA attributes, building interactive widgets, or implementing keyboard navigation.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/accessible-html-jsx
  ```
- `tanstack-query` [Link](./fe/tansatck-query/SKILL.md) - TanStack Query patterns for this repo — queryOptions/mutationOptions factories, query key hierarchies, service layer integration, optimistic updates, Suspense usage, error handling, and TanStack Router data loading. Use when creating queries, mutations, API services, query keys, cache invalidation, optimistic updates, or integrating data fetching with routes.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/tanstack-query
  ```
- `tanstack-form` [Link](./fe/tanstack-form/SKILL.md) - TanStack Form patterns for this repo — form composition, field components, Zod validation schemas, error tracking, form instance usage, and layout helpers. Use when creating new forms, adding form fields, writing form validation, or working with TanStack Form in this project.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/tanstack-form
  ```

### BE - Common 

TBD

### FE - Vite-based projects

- `tanstack-router` [Link](./fe/tanstack-router/SKILL.md) - TanStack Router patterns for this repo — file-based routing, auth guards, search params, data loading, TanStack Query integration, navigation, and code splitting. Use when creating routes, adding pages, implementing auth flows, working with search/path params, or integrating loaders with TanStack Query.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/tanstack-router
  ```
- `generate-browserslist` [Link](./fe/generate-browserlist-config/SKILL.md) - Generate a project-wide browserslist configuration that is compatible with every declared dependency's own browserslist settings by intersecting the supported browser sets, then sync the result to Vite's build.target. Use when the user wants to create, update, or audit the `browserslist` field / `.browserslistrc`, keep Vite's `build.target` in lockstep with it, ensure dependency compatibility, or debug "unsupported target" build warnings.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/generate-browserslist
  ```

### FE - Next.js-based projects

- `next-best-practices` [Link]([./next-best-practices/SKILL.md](https://github.com/vercel-labs/next-skills/tree/main/skills/next-best-practices)) - Agent skills for common Next.js workflows.
  ```bash
  npx skills add vercel-labs/next-skills --skill next-best-practices
  ```

### FE - Shadcn/UI-based projects

- `shadcn` [Link](./fe/shadcn/SKILL.md) - Shadcn/UI patterns for this repo — adding, searching, fixing, debugging, styling, and composing UI. Use when creating or adding components, searching for components, fixing styling issues, debugging components, styling components, or composing UI.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/shadcn
  ```

### Quality and security

- `npm-audit-install` [Link](./common/npm-audit-install/SKILL.md) - Audit npm packages for security vulnerabilities before installing them using npq. Use when user wants to install a new npm package, add a dependency, audit a package for security issues, or check if a package is safe.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/common/npm-audit-install
  ```
- `npm-audit-update` [Link](./common/npm-audit-update/SKILL.md) - Check project dependencies for available updates, audit each candidate for security, and safely update package.json and reinstall. Use when the user wants to update dependencies, check for outdated packages, upgrade versions, or refresh a lockfile safely. Complements npm-audit-install (single-package installs).
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/common/npm-audit-update
  ```
- `web-security` [Link](./fe/web-security/SKILL.md) - Enforce web security and avoid security vulnerabilities.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/web-security
  ```

### Tooling and Meta

- `write-a-skill` [Link](https://github.com/mattpocock/skills/blob/main/write-a-skill/SKILL.md) - Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.
  ```bash
  npx skills@latest add mattpocock/skills/write-a-skill
  ```

## Feature/Issue Development lifecycle

```
Idea → PRD → Issue → Phase Implementation → Validation → Review
   │       │       │           │                  │           │
   │       │       │           │                  │           └─ /code-review
   │       │       │           │                  └─ npm run tsc + lint
   │       │       │           └─ /do-work (per issue)
   │       │       └─ /to-issue
   │       └─ /to-prd
   └─ /grill-me (optional, at any stage)
```

## Context Management Recommendations

| Practice | Why |
|----------|-----|
| Start phases in fresh conversations | Each plan phase is self-contained. A fresh conversation avoids accumulated context from prior phases polluting decision-making. |
| Reference plans by file path, not paste | Say "implement Phase 3 from `./plans/user-onboarding.md`" instead of pasting the plan. The AI reads only what it needs. |
| Keep PRDs in Local files | PRDs stored as snapshots don't consume context until explicitly fetched and contain only partitions needed and are AI-readable. |
| Use /grill-me in a separate conversation | Design interviews generate long back-and-forth. Do this before implementation, in its own context. |
| Let skills handle library knowledge | Don't paste TanStack docs into the conversation — skills already encode project-specific patterns. The `DocsExplorer` subagent handles anything not covered. |
| One concern per conversation | Don't mix a bug fix with a feature implementation. Each gets its own context. |
| Validate early, validate often | Running `tsc` + `lint` after each change catches issues before they compound and require re-reading large code sections. |

