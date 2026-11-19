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


## Getting started

You are able to add multiple skills at once by using the `npx skills@latest add` command.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills
  ```
  This will show the multi-selection menu of skills to add.

To add a single skill, you can use the `npx skills@latest add Phenomenon-Studio/phenomenon-skills/<skill-name>` command.

The selection menu groups skills by the plugins declared in `.claude-plugin/marketplace.json` (`Phenomenon Common`, `Phenomenon Frontend`, `Phenomenon Backend`). When adding a new skill, list its folder under the matching plugin's `skills` array — otherwise it shows up under `Other`.

### Install via Claude Code plugin marketplace

The same manifest makes this repo a Claude Code plugin marketplace. Run these inside a Claude Code session, one at a time.

1. Add the marketplace (once):
    ```
    /plugin marketplace add Phenomenon-Studio/phenomenon-skills
    ```
2. Install the plugins you need:
    ```
    /plugin install phenomenon-common@phenomenon-skills
    ```
    ```
    /plugin install phenomenon-frontend@phenomenon-skills
    ```
    ```
    /plugin install phenomenon-backend@phenomenon-skills
    ```

Or from the terminal, in one step (adds the marketplace if missing):
```bash
claude plugin install phenomenon-frontend --marketplace Phenomenon-Studio/phenomenon-skills
```

Plugin skills are namespaced, e.g. `/phenomenon-frontend:react`. Update with `/plugin marketplace update phenomenon-skills`.

### Install for Codex

Use the `skills` CLI with the `codex` agent — skills are copied into `.agents/skills/` (add `-g` for `~/.agents/skills/`):
```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills -a codex
```
Single skill:
```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills -a codex --skill react
```


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

Work the issue/feature out before implementation. Planning is covered by [Matt Pocock's skills](https://github.com/mattpocock/skills) — use them for the common **grill → spec → tickets → implement** loop (see [Feature/Issue Development lifecycle](#featureissue-development-lifecycle)).

Install them once (Claude Code plugin, updates itself):
```bash
claude plugin install mattpocock-skills@claude-plugins-official
```
Or as editable files for any other agent (include `setup-matt-pocock-skills` when asked):
```bash
npx skills@latest add mattpocock/skills
```
Then run `/setup-matt-pocock-skills` once per repo — it configures the issue tracker, triage labels, and where docs are saved.

Skills used in the loop:
- `grill-with-docs` [Link](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) - Grilling session that also builds the project's domain model, updating `GLOSSARY.md` and ADRs inline. Use `grill-me` [Link](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) for non-code plans.
- `to-spec` [Link](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-spec) - Turn the current conversation into a spec and publish it to the issue tracker.
- `to-tickets` [Link](https://github.com/mattpocock/skills/tree/main/skills/engineering/to-tickets) - Break a plan, spec, or conversation into tracer-bullet tickets with blocking edges.
- `implement` [Link](https://github.com/mattpocock/skills/tree/main/skills/engineering/implement) - Build the work from a spec or tickets, driving `tdd` at agreed seams and closing out with `code-review`. For a whole spec on one branch with parallel subagents, use `implement-spec` [Link](https://github.com/mattpocock/skills/tree/main/skills/engineering/implement-spec).
- `code-review` [Link](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review) - Two-axis review of the diff: Standards and Spec.

Other useful ones: `tdd`, `diagnosing-bugs`, `prototype`, `wayfinder` (work too big for one session), `handoff`, `improve-codebase-architecture`. Full list in the [repo README](https://github.com/mattpocock/skills#reference).

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
- `tanstack-query` [Link](./fe/tanstack-query/SKILL.md) - TanStack Query patterns for this repo — queryOptions/mutationOptions factories, query key hierarchies, service layer integration, optimistic updates, Suspense usage, error handling, and TanStack Router data loading. Use when creating queries, mutations, API services, query keys, cache invalidation, optimistic updates, or integrating data fetching with routes.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/tanstack-query
  ```
- `tanstack-form` [Link](./fe/tanstack-form/SKILL.md) - TanStack Form patterns for this repo — form composition, field components, Zod validation schemas, error tracking, form instance usage, and layout helpers. Use when creating new forms, adding form fields, writing form validation, or working with TanStack Form in this project.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/tanstack-form
  ```

### BE - Common 

- `swagger-to-md` [Link](./be/swagger-to-md/SKILL.md) - Fetch a remote Swagger/OpenAPI (v2 or v3) spec from a URL and emit a directory of Markdown files (one per tag) documenting all endpoints, parameters, request payloads, and responses. Refs are inlined; request bodies are rendered as example JSON payloads. Use when user wants to convert a Swagger/OpenAPI URL to Markdown, document a remote API, snapshot endpoints from a backend, or asks "swagger to md" / "openapi to markdown".
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/be/swagger-to-md
  ```

### FE - Vite-based projects

- `tanstack-router` [Link](./fe/tanstack-router/SKILL.md) - TanStack Router patterns for this repo — file-based routing, auth guards, search params, data loading, TanStack Query integration, navigation, and code splitting. Use when creating routes, adding pages, implementing auth flows, working with search/path params, or integrating loaders with TanStack Query.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/tanstack-router
  ```
- `generate-browserslist` [Link](./fe/generate-browserslist/SKILL.md) - Generate a project-wide browserslist configuration that is compatible with every declared dependency's own browserslist settings by intersecting the supported browser sets, then sync the result to Vite's build.target. Use when the user wants to create, update, or audit the `browserslist` field / `.browserslistrc`, keep Vite's `build.target` in lockstep with it, ensure dependency compatibility, or debug "unsupported target" build warnings.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/generate-browserslist
  ```

### FE - Next.js-based projects

- `next-best-practices` [Link](https://github.com/vercel-labs/next-skills/tree/main/skills/next-best-practices) - Agent skills for common Next.js workflows.
  ```bash
  npx skills add vercel-labs/next-skills --skill next-best-practices
  ```

### FE - Shadcn/UI-based projects

- `shadcn` [Link](./fe/shadcn/SKILL.md) - Shadcn/UI patterns for this repo — adding, searching, fixing, debugging, styling, and composing UI. Use when creating or adding components, searching for components, fixing styling issues, debugging components, styling components, or composing UI.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/shadcn
  ```

### Quality and security

- `triage-feedback` [Link](./common/triage-feedback/SKILL.md) - Triage a short piece of feedback into an engineer-ready report — claim, verdict, root cause, fix options, plan, guardrail. Use when the user pastes or points at client feedback, a QA ticket, or another agent's review finding.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/common/triage-feedback
  ```
- `triage-audit` [Link](./common/triage-audit/SKILL.md) - Triage an audit — a document listing many feedback points from a client, QA, or an auditor agent — into a summary report plus per-point verdicts checked against the codebase. Use for multi-item audits; for one point, use `triage-feedback`.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/common/triage-audit
  ```
- `web-security` [Link](./fe/web-security/SKILL.md) - Enforce web security and avoid security vulnerabilities.
  ```bash
  npx skills@latest add Phenomenon-Studio/phenomenon-skills/fe/web-security
  ```

### Tooling and Meta

- `writing-for-agents` [Link](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-for-agents) - Write documents for agents: skills, AGENTS.md/CLAUDE.md, and any doc an agent reaches by a pointer. Use when creating or editing skills. Included in the Matt Pocock skills install above.

## Feature/Issue Development lifecycle

Uses [Matt Pocock's skills](https://github.com/mattpocock/skills) for the loop; project skills (`react`, `typescript`, `tanstack-*`, …) load automatically during implementation.

```
Idea → Grill → Spec → Tickets → Implement (per ticket) → Validation → Review
  │       │       │        │              │                   │           │
  │       │       │        │              │                   │           └─ /code-review
  │       │       │        │              │                   └─ npm run tsc + lint
  │       │       │        │              └─ /implement  (or /implement-spec for whole spec)
  │       │       │        └─ /to-tickets
  │       │       └─ /to-spec
  │       └─ /grill-with-docs  (or /grill-me)
  └─ /setup-matt-pocock-skills (once per repo)
```

Feedback/audit entry point: `/triage-feedback` or `/triage-audit` → verdicts with fix plans → `/to-tickets` → continue the loop from **Implement**.

## Context Management Recommendations

| Practice | Why |
|----------|-----|
| Start phases in fresh conversations | Each plan phase is self-contained. A fresh conversation avoids accumulated context from prior phases polluting decision-making. |
| Reference plans by file path, not paste | Say "implement Phase 3 from `./plans/user-onboarding.md`" instead of pasting the plan. The AI reads only what it needs. |
| Keep specs in the issue tracker or local files | Specs stored as snapshots don't consume context until explicitly fetched and contain only partitions needed and are AI-readable. |
| Use /grill-me in a separate conversation | Design interviews generate long back-and-forth. Do this before implementation, in its own context. |
| Let skills handle library knowledge | Don't paste TanStack docs into the conversation — skills already encode project-specific patterns. The `DocsExplorer` subagent handles anything not covered. |
| One concern per conversation | Don't mix a bug fix with a feature implementation. Each gets its own context. |
| Validate early, validate often | Running `tsc` + `lint` after each change catches issues before they compound and require re-reading large code sections. |

