---
title: figma-qa
description: "Visual QA of implemented React UI against its Figma design — pairs each Figma node with a rendered story or route, measures computed styles against spec values, and reports every diff with evidence. Use when the user asks whether UI matches Figma, wants design QA / a pixel check / a visual diff, or hands over Figma links to verify an implementation, in a project without the storybook-figma-qa kit."
---

<!-- skills:start -->
Visual QA of implemented React UI against its Figma design — pairs each Figma node with a rendered story or route, measures computed styles against spec values, and reports every diff with evidence. Use when the user asks whether UI matches Figma, wants design QA / a pixel check / a visual diff, or hands over Figma links to verify an implementation, in a project without the storybook-figma-qa kit.

**User-invoked** — type `/figma-qa`, or the agent loads it when the task matches the description.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill figma-qa
```

Part of [Figma design](./index.md) · [Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/design-qa/figma-qa)
<!-- skills:end -->

## Projects with the kit

A project with [`@phenomenon-studio/storybook-figma-qa`](https://phenomenon-studio.github.io/storybook-figma-qa/) installed doesn't use this skill: the kit's own `figma-qa` skill runs its `figma-qa report` command and triages the result. See the kit's [Getting started](https://phenomenon-studio.github.io/storybook-figma-qa/getting-started/) to set it up, and [Agent skills](https://phenomenon-studio.github.io/storybook-figma-qa/skills/) for what it installs.
