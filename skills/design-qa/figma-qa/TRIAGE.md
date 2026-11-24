# figma-qa triage

How to classify a **diff** once both values are measured, and where its fix lives. Spec values outrank pixels: classify from the property that differs, and use the screenshots only for what measurement can't see.

## Classes

| Class | Means | Owner |
| --- | --- | --- |
| **structure** | An element is missing, extra or reordered; a glyph or label Figma draws that the code doesn't. | Component markup |
| **behaviour** | One state (hover, focus, pressed, disabled, selected) differs while its siblings match. | The component's state styles, or how the pair forces that state |
| **value** | A measurable mismatch beyond tolerance: size, padding, gap, radius, font. | The component's classes, spacing and type tokens |
| **token** | Right value from the wrong source (a literal where Figma binds a variable, or another token), or a token whose value drifted from Figma. | The component's class, or the token file |
| **mapping** | The target renders another state or content than the Figma node: wrong args, a hard-coded label, a different glyph. | The story, route state or pair |
| **harness** | A measurement artefact, not the UI: a wrapper adding size, an overlay covering the target, a missing font face, an animation frame, mismatched viewport. | The render setup (step 3) |
| **deliberate** | A difference the code means: a comment, ADR or design decision explains it. | A recorded deviation the user confirms |

Fix **mapping** and **harness** first and re-measure: they make every other diff of that pair untrustworthy.

## Signals

| Signal | Usual class | Check |
| --- | --- | --- |
| Same token on both sides, colour off by a little | token | The token's value drifted from Figma: fix the token, the component is right. |
| Different tokens on each side | token | The component uses the wrong token for this element. |
| Figma colour no token holds, far from every token | deliberate or token | Figma uses a colour the kit lacks: ask design, or add the token. |
| Code colour passes WCAG contrast (1.4.3 text, 1.4.11 non-text) where Figma's fails | deliberate | An accessibility fix: record it with the criterion; keep the code's colour. |
| One state off while sibling states match | behaviour | That state's style uses another token or value than Figma's state. |
| Every pair of a component off by the same amount | token or value | One shared token or base class. |
| Every child offset by the same amount | value | One container size, padding or gap upstream: fix it and re-measure before the children. |
| Text differs from Figma's copy | mapping | The pair feeds fixed content; render Figma's text, or flag copy separately (copy often changes outside design). |
| Width or height off, inner content matches | harness or value | A wrapper or layout context adds size: measure the component's own root. |
| Fallback font rendered | harness | The font face for that weight isn't loaded where the target renders. |
| Pixel-only diff, every measured property matches | structure or behaviour | Shadow, stroke, fill opacity, glyph: compare the screenshots region by region. |
| Animated element a few percent off | harness | Freeze the animation or force reduced motion. |

## Deliberate

Before reporting value or behaviour drift as a bug, search the component for its reason: comments citing a Figma node, a WCAG criterion or an ADR, and the project's decision records. A documented reason makes the diff a deviation candidate: report it as **deliberate**, cite the source, and propose recording it the way the project records deviations. The user confirms every one.
