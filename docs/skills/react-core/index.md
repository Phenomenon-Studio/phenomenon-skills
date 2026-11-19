---
title: React core
description: React, TypeScript and accessible markup conventions for every frontend project.
sidebar:
  order: 3
---

Baseline for any React frontend. These skills are model-invoked: the agent loads them automatically when it writes components, types or markup.

**Role in the lifecycle:** **Build** and **Review**. Nobody types them; the agent loads them while `/implement` writes code and `code-review` checks it against our standards.

Pair them with Google Chrome's [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) so the agent prefers modern platform APIs over legacy workarounds — see [Getting started](../../getting-started.md#2-frontend-base).

<!-- skills:start -->
## Skills

- [`accessible-html-jsx`](./accessible-html-jsx.md) — Write clean, modern, and highly accessible HTML & JSX code, using semantically correct elements and attributes. Use when writing or reviewing HTML/JSX markup, creating forms, handling ARIA attributes, building interactive widgets, or implementing keyboard navigation.
- [`react`](./react.md) — Build clean, modern React components that apply common best practices and avoid common pitfalls like unnecessary state management or useEffect usage. Use when writing, refactoring, or reviewing React components and hooks.
- [`typescript`](./typescript.md) — Write clean, efficient TypeScript code that follows project conventions and advanced type patterns. Use when writing or reviewing TypeScript code, defining types, creating generics, handling errors, or working with React components, Zod schemas, and TanStack libraries.

Install the whole group:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill accessible-html-jsx react typescript
```
<!-- skills:end -->
