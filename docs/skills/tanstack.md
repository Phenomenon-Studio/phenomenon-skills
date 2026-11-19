---
title: TanStack
description: Project patterns for TanStack Query, Router and Form.
sidebar:
  order: 4
---

For Vite + TanStack projects. These skills encode **our** conventions (query option factories, route guards, `useAppForm` composition), not just the library docs.

<!-- skills:start -->
Install the whole group:

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill tanstack-form tanstack-query tanstack-router
```

### `tanstack-form`

Build forms using TanStack Form with the project's useAppForm composition, composable field components, Zod validation schemas, FormFieldWrapper error tracking, and form.AppField vs form.Field patterns. Use when creating new forms, adding form fields, writing form validation, or working with TanStack Form in this project.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill tanstack-form
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/tanstack/tanstack-form)

### `tanstack-query`

TanStack Query patterns for this repo — queryOptions/mutationOptions factories, query key hierarchies, service layer integration, optimistic updates, Suspense usage, error handling, and TanStack Router data loading. Use when creating queries, mutations, API services, query keys, cache invalidation, optimistic updates, or integrating data fetching with routes.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill tanstack-query
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/tanstack/tanstack-query)

### `tanstack-router`

TanStack Router patterns for this repo — file-based routing, auth guards, search params, data loading, TanStack Query integration, navigation, and code splitting. Use when creating routes, adding pages, implementing auth flows, working with search/path params, or integrating loaders with TanStack Query.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill tanstack-router
```

[Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/tanstack/tanstack-router)
<!-- skills:end -->
