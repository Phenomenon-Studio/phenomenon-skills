# figma-implement reference

## Ledger block

One block per visible node, depth-first. Lines a node does not use are left out.

```
<nodeId> <layer name> (<frame|text|instance|vector|image>) → <file>:<element>
  box      W×H, fill|hug|fixed per axis, min/max
  layout   direction, gap, padding T R B L, align main/cross, wrap, clip
  shape    radius per corner, stroke width + position + colour, shadow, blur, opacity
  fill     colour (variable name) or gradient
  text     family weight size/line-height letter-spacing, colour (variable), align, transform, truncation
  content  icon glyph + icon box size, image ratio/fit, copy
  note     A<n>.<claim> <the applied claim, one line>
```

## Read annotations

Annotations sit on any node of the subtree, often deep inside an instance (a vector in an icon, with an id like `I12:345;67:890`). Reading only the target node misses them.

**Plugin API** (preferred: carries category and markdown). Read-only `use_figma` call; load the Figma tooling's `figma-use` skill first if it ships one.

```js
const root = await figma.getNodeByIdAsync('<nodeId>');
const cats = await figma.annotations.getAnnotationCategoriesAsync();
const category = Object.fromEntries(cats.map(c => [c.id, c.label]));
const out = [];
const visit = (n, path) => {
  const here = path ? `${path} / ${n.name}` : n.name;
  for (const a of ('annotations' in n && n.annotations) || []) {
    out.push({ id: n.id, path: here, visible: n.visible,
      category: a.categoryId ? category[a.categoryId] ?? a.categoryId : null,
      text: a.labelMarkdown || a.label || '', properties: a.properties ?? [] });
  }
  if ('children' in n) n.children.forEach(c => visit(c, here));
};
visit(root, '');
return out;
```

**REST fallback** when `use_figma` is unavailable: `GET https://api.figma.com/v1/files/<fileKey>/nodes?ids=<nodeId>` with `X-Figma-Token`, then walk `document` for `annotations[]`. REST returns only plain `label`: no category, no markdown, no pinned properties. Record the category as `unknown` and classify by content.

`properties` are pinned design properties (e.g. `width`, `fills`): they point at ledger lines the designer cares about; make sure those lines exist.

## Annotation check

Number annotations `A1…An` and write one entry each in the ledger file:

```
A<n> <nodeId> <path> [<category>] → <ledger block | hidden node>
  A<n>.1  <claim>  ⇢ <source: file:line | ADR / decision id | ledger line | A<m>>  <verdict> — <reason>
```

**Split into claims.** One checkable statement each: a state, a rule, a copy string, a limit, a behaviour. "Two states only: neutral when connected, red when offline; no separate state for syncing" is three claims.

**Route by category.** Categories are per file; route by meaning:

| Category | Treat as |
| --- | --- |
| Development, Interaction, Accessibility | Behaviour or structure to build: check, then `applied` / `conflict` / `open` |
| Content | Copy, data, overflow, truncation, empty states: check against copy / i18n sources and the data model |
| Discussion | Context. `out of scope` unless it states a rule, then check that rule |
| Question | `open`, unless a decision record answers it: cite the record and check its answer |
| `unknown` or custom | Classify by content, then route as above |

**Fact-check each claim** against every source that bears on it:

- **Code**: the variant, prop, state, or token it names exists and behaves as claimed ("use the state variants in the Design System" → find them).
- **Decision records**: ADRs, decision logs, specs, tickets. A recorded decision outranks a note.
- **Domain language**: the glossary's term for the thing; a note using another name for an existing concept is a claim to map, not a new concept.
- **The frame**: the ledger and sibling variants. A note saying "two states" beside a frame with three is a `conflict`.
- **Other annotations**: two notes that disagree are both `conflict`.

**Verdicts:**

- `applied`: agrees with every source, or adds behaviour none of them contradicts. Becomes a `note` ledger line.
- `conflict`: contradicts code, a recorded decision, the frame, or another note. Code and records hold until the user rules.
- `open`: unanswered question, ambiguous wording, or names something the project lacks (a variant, an endpoint, a data field). Needs the user or designer.
- `out of scope`: on a hidden node, about a screen or flow outside this node, or Discussion without a rule.

An annotation's verdict is its weakest claim: `conflict` over `open` over `applied`.

## Annotation report

```
| A# | Node | Category | Verdict | Claims | Evidence or reason |
| A1 | Status Icon / Glyph | Development | applied | 3/3 applied | StatusIcon `status` prop; stories Online, Offline |
| A2 | Alerts Button | Development | open | 2 applied, 1 open | No error variant in the Icon set |
```

`applied` rows cite the code and the rendered state from step 7. `conflict` and `open` rows cite both sides and say who decides. Every fetched annotation has a row; none are left out silently.

## Measure script

Run on the render surface at the Figma frame width, after `document.fonts.ready`. Every element carries a temporary `data-fx="<nodeId>"`.

```js
[...document.querySelectorAll('[data-fx]')].map(el => {
  const s = getComputedStyle(el), r = el.getBoundingClientRect();
  return { id: el.dataset.fx, w: r.width, h: r.height,
    pad: s.padding, gap: s.gap, radius: s.borderRadius, border: s.border,
    bg: s.backgroundColor, color: s.color, font: `${s.fontFamily} ${s.fontWeight} ${s.fontSize}/${s.lineHeight} ${s.letterSpacing}`,
    shadow: s.boxShadow, opacity: s.opacity };
});
```

## Where values get lost

Check these on every run of step 7; each slips past a visual pass.

- **Composite styles bundle properties.** A text or surface style sets several properties at once; a later single-property class or declaration overrides one of them. The measured line proves which won.
- **Figma line-height and letter-spacing in %.** Line-height `%` is of font size; letter-spacing `%` is `em / 100`.
- **Space-between vs gap.** Auto-layout `SPACE_BETWEEN` is `justify-content: space-between`; a fixed `itemSpacing` is `gap`. They diverge at other widths.
- **Fill vs hug.** Figma `FILL` on a child is `flex: 1` / `width: 100%` / `align-self: stretch`; `HUG` is content size. Wrong choice is invisible at one width and wrong at every other.
- **Stacked padding.** Reused card / sheet / list-row components already pad; adding the Figma padding on top doubles it. Measure the content box against the frame.
- **Icon box vs glyph.** Figma icon frames are often 24 with a 20 glyph inside; size the box the frame says.
- **Stroke position.** Inside stroke counts in the box (`border` + `box-sizing: border-box`); outside does not (`outline` / box-shadow ring).
- **Opacity on layer vs fill.** Layer opacity is `opacity`; fill alpha is a colour with alpha. They differ on children.
- **Instance overrides.** An instance may override text style, colour, or hide a child; read the instance node, not the main component.
- **Font features the font lacks.** `font-variant-numeric: tabular-nums` and similar do nothing when the loaded font has no matching OpenType feature; use the project's workaround from step 1, or flag it.
