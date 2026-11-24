---
name: figma-qa
description: Visual QA of implemented React UI against its Figma design — pairs each Figma node with a rendered story or route, measures computed styles against spec values, and reports every diff with evidence. Use when the user asks whether UI matches Figma, wants design QA / a pixel check / a visual diff, or hands over Figma links to verify an implementation, in a project without the storybook-figma-qa kit.
---

# figma-qa

Read-only by default: produce a **diff report**. Fix diffs only when the user asks.

A project with `@phenomenon-studio/storybook-figma-qa` installed runs this check through the kit's own `figma-qa` skill and CLI: use that one there.

Two leading words run through every step:

- **pair**: one Figma node + one rendered target (Storybook story or app route) in the same state, theme and viewport width.
- **spec value**: the exact number Figma stores (token, px, hex, font). Spec values outrank pixels: a screenshot shows a diff exists, a spec value proves what it is.

## Prerequisites

- **Figma access**: a Figma MCP server (or REST token) able to return node screenshots, variables and layout values.
- **Browser automation**: any tool that can open a URL, set viewport width, take a screenshot, and run JavaScript in the page (`getComputedStyle`).
- **A render target**: Storybook running, or the app dev server. Storybook is far stronger; see [STORYBOOK-SETUP.md](STORYBOOK-SETUP.md) before the first run in a repo, and tell the user which items are missing.

## Steps

### 1. Build the pair list

Collect Figma nodes from the user (links → `fileKey` + `nodeId`, `-` → `:`). For each node, find its target:

- Story: search `*.stories.*` for a `parameters.design` URL holding the node ID, then by component name. Read the story list from `<storybook>/index.json` for exact story IDs.
- Route: when the node is a full screen, map it to the app route plus the data/state needed to reach that state.

Figma files hold many frames per view (states, breakpoints, themes): pair each frame with the story/args that reproduce that exact state.

**Done when** every node in scope is a pair, or is listed as `unpaired` with the reason (no story, state unreachable, no matching component).

### 2. Read the spec

Per pair, from Figma: screenshot at 2× of the node, its variables/tokens, and layout values (size, auto-layout direction/gap/padding, radius, stroke, effects, text style). Record the frame width — that is the viewport for step 3.

**Done when** each pair has a screenshot plus a spec value for every property in [CHECKLIST.md](CHECKLIST.md) that the node uses.

### 3. Render the target deterministically

Open the story isolated: `<storybook>/iframe.html?id=<storyId>&viewMode=story&args=<k:v;…>&globals=<k:v;…>`, or the route. Then:

- viewport width = Figma frame width; device scale factor 2 when possible;
- theme/locale/mode matched through `globals` or the app's own switch;
- wait for `document.fonts.ready` and network idle; animations finished or reduced-motion forced;
- data, dates and random values fixed (mocks, seeded args).

Screenshot the same region as the Figma node.

**Done when** two renders of the same pair produce the same screenshot.

### 4. Measure

Run JavaScript in the page to read `getComputedStyle` and `getBoundingClientRect` for the root and each meaningful child (text, icons, containers). Compare against the spec values property by property using [CHECKLIST.md](CHECKLIST.md). Then compare screenshots side by side for what measurement misses: missing/extra elements, order, clipping, icon glyph, image crop.

Classify each diff with [TRIAGE.md](TRIAGE.md): **structure**, **behaviour**, **value**, **token**, **mapping**, **harness** or **deliberate**. Fix mapping and harness diffs in the pair and re-measure before classifying the rest.

**Done when** every checklist property of every pair is marked `match`, `diff`, or `n/a`, and every diff has a class.

### 5. Report

One section per pair:

```
## <Component/Screen> — <state>  ·  Figma <nodeId>  ·  <story id | route>
Verdict: match | N diffs | blocked (<reason>)
| # | Class | Property / element | Figma (spec value) | Rendered (computed) | Source location |
```

Rank diffs: structure → behaviour → value → token → deliberate. Point each diff at the file and line that owns the value (component class, token file, theme). End with the `unpaired` list and any setup gaps that weakened the run.

Figma is the spec unless the project records an accepted deviation; when one is recorded, mark the diff `accepted` and cite where. A **deliberate** diff with no record yet is proposed as a deviation for the user to confirm.

**Done when** every pair has a verdict and every diff carries both values plus a source location.
