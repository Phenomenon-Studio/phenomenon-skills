---
title: generate-browserslist
description: "Generate a project-wide browserslist configuration that is compatible with every declared dependency's own browserslist settings by intersecting the supported browser sets, then sync the result to Vite's build.target. Use when the user wants to create, update, or audit the `browserslist` field / `.browserslistrc`, keep Vite's `build.target` in lockstep with it, ensure dependency compatibility, or debug \"unsupported target\" build warnings."
---

<!-- skills:start -->
Generate a project-wide browserslist configuration that is compatible with every declared dependency's own browserslist settings by intersecting the supported browser sets, then sync the result to Vite's build.target. Use when the user wants to create, update, or audit the `browserslist` field / `.browserslistrc`, keep Vite's `build.target` in lockstep with it, ensure dependency compatibility, or debug "unsupported target" build warnings.

**User-invoked** — type `/generate-browserslist`, or the agent loads it when the task matches the description.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill generate-browserslist
```

Part of [Dependencies](./index.md) · [Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/dependencies/generate-browserslist)
<!-- skills:end -->
