# Storybook setup for agent-driven QA

What makes Storybook a reliable render target for an agent. Check each item in the repo; report missing ones to the user with the one-line fix. Ordered by payoff.

Package names and config keys move between Storybook majors: confirm against the docs for the installed version before installing anything.

## 1. Story ↔ Figma link (`parameters.design`)

Add `@storybook/addon-designs` and set on each story (or the meta):

```ts
parameters: { design: { type: 'figma', url: 'https://www.figma.com/design/<fileKey>/…?node-id=<nodeId>' } }
```

This makes pairing (step 1) a lookup instead of a guess, and shows the frame next to the story for humans. One story per Figma state frame.

## 2. Stable story index

The dev server and static build both serve `index.json` (story IDs, titles, tags, import paths). The agent enumerates stories from it and opens `iframe.html?id=…` directly. Keep titles stable; a renamed title changes the story ID.

Tag stories to scope QA, e.g. `tags: ['figma-qa']` or `!figma-qa` for stories that intentionally diverge.

## 3. Storybook MCP server

Storybook ships an MCP addon (`@storybook/addon-mcp`, Storybook 10+) that exposes the dev server as an MCP endpoint: list components, get story URLs, read component docs and prop types. With it the agent queries Storybook instead of grepping story files.

Component/prop documentation in it depends on docgen: keep `typescript.reactDocgen` enabled (`react-docgen` or `react-docgen-typescript`). Disabling docgen to silence parse warnings also blinds the agent to props.

## 4. Deterministic renders

Without these, every screenshot diff is noise:

- **Globals for every visual axis**: theme/mode, locale, density, direction via `globalTypes` + a decorator, so `&globals=theme:dark` works in the URL.
- **Fonts**: load the real web fonts in `preview-head.html` / preview; the agent waits on `document.fonts.ready`.
- **Motion off**: a decorator or global that disables transitions/animations (or honours `prefers-reduced-motion`, which the browser tool can emulate).
- **Frozen time and randomness**: mock `Date` (e.g. a `mockdate` decorator) and seed random/ID generators.
- **Network mocked**: `msw` + `msw-storybook-addon` (REST/GraphQL) or provider mocks per story, so stories render data states without a backend.
- **Viewport presets** matching Figma frame widths (`parameters.viewport` / `globals.viewport`).

## 5. Same styling pipeline as the app

Storybook must load the app's global CSS, design tokens, CSS framework plugin (e.g. Tailwind), and asset loaders (SVG-as-component). A missing plugin renders unstyled components that pass for "diffs".

## 6. Interaction states as stories

Hover/focus/pressed via `storybook-addon-pseudo-states` (`parameters.pseudo: { hover: true }`) or explicit args, so each state is a URL the agent can open rather than a gesture it must reproduce.

## 7. Stories as tests (visual regression lock)

Once a pair matches, lock it:

- `@storybook/addon-vitest` runs stories as Vitest browser tests (Playwright provider).
- Vitest browser mode `toMatchScreenshot` (Vitest 4+) or a hosted service (Chromatic) stores baselines, so drift after QA shows up in CI instead of in the next manual pass.

## 8. Figma Code Connect (reverse direction)

Map Figma components to code components (Code Connect). Then design-to-code agents emit the project's components and props instead of raw markup, so fewer diffs exist to find.
