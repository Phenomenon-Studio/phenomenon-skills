---
title: React core
description: React, TypeScript and accessible markup conventions for every frontend project.
sidebar:
  order: 3
---

Baseline for any React frontend. These skills are model-invoked: the agent loads them automatically when it writes components, types or markup.

Pair them with Google Chrome's [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) so the agent prefers modern platform APIs over legacy workarounds — see [Getting started](../getting-started.md#2-frontend-base).

<!-- skills:start -->
Install the whole group:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill accessible-html-jsx react typescript
```

### `accessible-html-jsx`

Write clean, modern, and highly accessible HTML & JSX code, using semantically correct elements and attributes. Use when writing or reviewing HTML/JSX markup, creating forms, handling ARIA attributes, building interactive widgets, or implementing keyboard navigation.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill accessible-html-jsx
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/react-core/accessible-html-jsx)

### `react`

Build clean, modern React components that apply common best practices and avoid common pitfalls like unnecessary state management or useEffect usage.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill react
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/react-core/react)

### `typescript`

Write clean, efficient TypeScript code that follows project conventions and advanced type patterns. Use when writing or reviewing TypeScript code, defining types, creating generics, handling errors, or working with React components, Zod schemas, and TanStack libraries.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill typescript
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/react-core/typescript)
<!-- skills:end -->
