# figma-qa checklist

Properties to compare per pair. Default tolerances in brackets; a project may tighten them.

## Layout

- Width / height, including fill vs hug vs fixed behaviour when the viewport changes [±1px]
- Padding per side; gap between children (auto-layout `itemSpacing` ↔ CSS `gap`) [±1px]
- Alignment: main axis + cross axis (Figma `primaryAxisAlignItems` / `counterAxisAlignItems` ↔ `justify-content` / `align-items`)
- Direction and wrapping; child order
- Overflow / clipping (`clipsContent` ↔ `overflow: hidden`)
- Breakpoint behaviour: re-pair at each Figma breakpoint frame width

## Typography

- Font family, weight, style [exact]
- Font size, line height, letter spacing [±0.5px]; Figma `%` letter spacing = `em / 100`
- Text transform, decoration, alignment
- Truncation / line clamp; wrapping with real-length content
- Text colour (see Colour)

## Colour and fills

- Background, text, border, icon colours [ΔE ≤ 2 or exact hex]
- Opacity on node vs on fill (CSS `opacity` vs alpha channel)
- Gradients: type, angle, stops
- Light and dark mode both paired when Figma variables have modes
- Value bound to a Figma variable → code should reference the matching token, not a literal

## Shape and effects

- Corner radius per corner [±1px]
- Stroke width, position (inside/center/outside ↔ `border` / `outline` / `box-shadow inset`), dash
- Shadows: x, y, blur, spread, colour, inner vs drop; multiple layers in order
- Blur: layer blur ↔ `filter: blur`, background blur ↔ `backdrop-filter`
- Blend modes

## Content

- Icon: same glyph, size, colour, optical alignment
- Images: aspect ratio, crop / object-fit, radius
- Copy matches Figma text (flag copy diffs separately; copy often changes outside design)

## States

Each state is its own pair: default, hover, focus-visible, pressed, disabled, loading, empty, error, selected. Force hover/focus through the browser tool, or a story arg / pseudo-state addon.
