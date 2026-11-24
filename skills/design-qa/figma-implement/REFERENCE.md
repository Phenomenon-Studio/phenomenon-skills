# figma-implement reference

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

Check these on every run of step 6; each slips past a visual pass.

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
