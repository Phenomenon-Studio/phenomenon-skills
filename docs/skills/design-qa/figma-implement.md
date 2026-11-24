---
title: figma-implement
description: "Implement or fix UI to exact Figma spec values through a node-by-node ledger, measured in the browser before done. Use when the user shares a figma.com link to build, implement, port, or fix a screen, section, or component layout."
---

<!-- skills:start -->
Implement or fix UI to exact Figma spec values through a node-by-node ledger, measured in the browser before done. Use when the user shares a figma.com link to build, implement, port, or fix a screen, section, or component layout.

**User-invoked** — type `/figma-implement`, or the agent loads it when the task matches the description.

```bash
npx skills@latest add Phenomenon-Studio/phenomenon-skills --skill figma-implement
```

Part of [Figma design](./index.md) · [Source](https://github.com/Phenomenon-Studio/phenomenon-skills/tree/main/skills/design-qa/figma-implement)
<!-- skills:end -->

## When to use it

Hand the agent a `figma.com` link with a node id and ask it to build, port or fix that screen, section or component. The skill exists to stop UI that *looks* right but drifts from the design — lost padding, gap, size, colour or text style. A screenshot only shows where to look; every value closes on a number read from the browser.

| Use | Skip |
| --- | --- |
| New screen, section or component from a Figma frame | No Figma node to match — use [`emil-design-eng`](../../design.md) taste instead |
| Fixing layout that drifted from the design | Checking finished UI for the designer — use [`figma-qa`](./figma-qa.md) |
| Porting a design into an existing component library | Motion from Figma — see the Figma plugin's `figma-implement-motion` |

## Requirements

- **Figma MCP server** — `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot`. If the Figma tooling ships a design-to-code skill (e.g. `figma-design-to-code`), the agent loads it first; `figma-implement` adds the token map and ledger on top.
- **Browser automation** — to render the target and read `getComputedStyle` / `getBoundingClientRect`.
- **A render surface** — Storybook (or another component harness) if the project has one, otherwise a dev-server route.

## How it works

Three words carry every step:

- **Token map** — the project's own design tokens, read from its config this run, each paired with the Figma variable it expresses. A Figma variable with no token is marked `MISSING`.
- **Ledger** — one row per visible Figma node × property: the Figma value, the code that expresses it, and the measured value. Written to a scratch file outside the repo so it survives context compaction.
- **Measured** — a value read from the running page. A row closes on a measured value, never on a glance at a screenshot.

| Step | Done when |
| --- | --- |
| 1. Learn the project | Token sources, styling mechanism, component library and render surface found |
| 2. Read the whole node | Every visible node has high-fidelity design context |
| 3. Build the ledger | Every Figma variable has a token-map row; one block per visible node |
| 4. Map each value to code | Every value has a code expression — token first, prop or variant second, literal last |
| 5. Implement from the ledger | Every block ticked; every node in the screenshot has an element |
| 6. Measure | Every line inside tolerance (±0.5px sizes, exact weight, family, colour) or a known deviation |
| 7. Report | Ledger size, token-map gaps, lines fixed, intentional deviations |

Project rules outrank the skill: where `AGENTS.md` / `CLAUDE.md` set a convention for styling, tokens or deviations, the agent follows it.

## Example prompt

```text
Implement this card: https://www.figma.com/design/<fileKey>/<name>?node-id=12-345
```

After it lands, run [`figma-qa`](./figma-qa.md) on the same link for a diff report the designer can read.
