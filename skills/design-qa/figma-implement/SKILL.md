---
name: figma-implement
description: Implement or fix UI to exact Figma spec values through a node-by-node ledger, measured in the browser before done. Use when the user shares a figma.com link to build, implement, port, or fix a screen, section, or component layout.
---

# figma-implement

The failure this skill exists to stop: UI that _looks_ right but drifts from the design — lost padding, gap, size, inner spacing, element, colour, or text style. Looking right is not evidence. Three leading words carry every step:

- **token map**: the project's own design tokens, read from its configuration this run, each resolved to its value and paired with the Figma variable it expresses. Every styling decision goes through it.
- **ledger**: one row per visible Figma node × property, holding the Figma value, the code that expresses it, and the measured rendered value. The ledger is the spec; the screenshot only shows where to look.
- **measured**: a value read from the running page with `getComputedStyle` / `getBoundingClientRect`. A row closes on a measured value, never on a glance at a screenshot.

Project rules outrank this skill. Where the project's agent docs set a convention (styling approach, where deviations are recorded, how tokens are added), follow it; this skill supplies the defaults where they are silent.

If a design-to-code skill ships with the Figma tooling (e.g. `figma-design-to-code`), load it before the first `get_design_context` call; this skill adds the token map and ledger on top of it.

## Steps

### 1. Learn the project

Read the project's agent docs (`AGENTS.md`, `CLAUDE.md`, and any styling or design docs they point to). Then locate the design system from the codebase itself, not from memory:

- **Token sources**: wherever the project defines colours, spacing, radii, shadows, type, and breakpoints — CSS custom properties, a Tailwind config or CSS `@theme` block, a theme object, a tokens JSON / Style Dictionary build, SCSS variables. Follow imports until every source is found.
- **Composite styles**: text styles, elevation, or surface classes that bundle several properties into one name. List what each sets.
- **Styling mechanism**: how components express a token (utility class, CSS variable, theme key, styled prop) and the syntax for a one-off literal.
- **Component library**: the shared primitives to reuse, and their docs or stories.
- **Render surface**: an isolated component harness (Storybook, Ladle, Histoire, …) if the project has one, otherwise the dev-server route.
- **Fonts**: the families loaded and the OpenType features they actually support (`tnum`, `ss01`, …), plus any project helper that works around a missing one.

Start the token map in the ledger file (step 3) with every token resolved to its final value.

**Done when** every token source is found and resolved, and the styling mechanism, component library, and render surface are named.

### 2. Read the whole node

From the link take `fileKey` + `nodeId` (`-` → `:`). Fetch:

- `get_metadata` on the node: the full tree, every child id, size, and position. This is the inventory source.
- `get_design_context` on the node, plus a parallel batch on every child frame it returns sparse or truncated.
- `get_variable_defs` on the node: the Figma variables behind colours, spacing, radii, type.
- `get_screenshot`: visual target.

Note the frame width: that is the viewport for step 6. Note every hidden node (`visible=false`) so it stays out of the ledger.

**Done when** every visible node in the metadata tree has high-fidelity design context (directly or through a child call).

### 3. Build the ledger

Write the ledger to a scratch file outside the repo (session scratchpad), so it survives context compaction. It opens with the token map, completed now against `get_variable_defs`:

```
<figma variable> = <value> → <project token> (<value>)   | MISSING
```

Pair by name first, by resolved value second. A Figma variable with no project token is `MISSING`: handle it as project rules say for new tokens, or ask the user.

Then walk the metadata tree depth-first. One block per visible node:

```
<nodeId> <layer name> (<frame|text|instance|vector|image>) → <file>:<element>
  box      W×H, fill|hug|fixed per axis, min/max
  layout   direction, gap, padding T R B L, align main/cross, wrap, clip
  shape    radius per corner, stroke width + position + colour, shadow, blur, opacity
  fill     colour (variable name) or gradient
  text     family weight size/line-height letter-spacing, colour (variable), align, transform, truncation
  content  icon glyph + icon box size, image ratio/fit, copy
```

Skip lines a node does not use; write every line it does use with Figma's exact value. A wrapper with no own styling may merge into its parent: mark it `merged → <parentId>` rather than dropping it.

**Done when** every Figma variable has a token-map row, and count of ledger blocks + `merged` marks equals count of visible nodes in the metadata tree.

### 4. Map each value to code

Next to every value write the code that will express it, in the project's styling mechanism: a token from the token map first, a component prop or variant second, a one-off literal only when no token matches by name or value. A Figma literal equal to a token's value uses that token; a literal where the token map has a token is a ledger error.

Reused components carry their own padding, gap, height, and type. Read their source and record what they already apply; where it differs from the ledger, the ledger wins (variant, prop, or override).

**Done when** every value in the ledger has a code expression.

### 5. Implement from the ledger

Build or edit the code one ledger block at a time, depth-first, following project conventions and reusing existing components. Tick each block as its code lands.

**Done when** every ledger block is ticked, and every node of the screenshot has a matching element in code.

### 6. Measure

Render the target on the render surface from step 1 at the Figma frame width, after `document.fonts.ready`. Give each element a temporary `data-fx="<nodeId>"` attribute, or select it by a stable selector, and read every ledger property with the script in [REFERENCE.md → Measure script](REFERENCE.md#measure-script).

Write each measured value into its ledger line. Tolerance: ±0.5px for sizes and spacing, exact for weight, family, and colour. Distance between siblings is gap measured from their rects, not the `gap` value alone. Fix every mismatch at its source and re-measure. Walk [REFERENCE.md → Where values get lost](REFERENCE.md#where-values-get-lost); each item slips past a visual pass. Then compare screenshots side by side for what numbers miss: missing or extra element, order, icon glyph, clipping, image crop. Remove temporary `data-fx` attributes when finished.

**Done when** every ledger line carries a measured value inside tolerance, or an intentional deviation the user knows about.

### 7. Report

Reply with: ledger size (nodes, lines), token-map gaps (`MISSING` rows and how each was resolved), lines fixed during step 6, and each intentional deviation with its reason. Record deviations wherever project rules put them; when they are silent, the reply is the record.
