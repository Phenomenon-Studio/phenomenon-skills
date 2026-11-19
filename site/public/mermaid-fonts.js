// Mermaid sizes every box from label text measured at render time. If the brand fonts
// arrive after that, labels outgrow their boxes. Once the fonts are loaded, re-render each
// diagram whose labels don't fit (once), through astro-mermaid's own re-render hook: it
// re-runs on `astro:after-swap` for diagrams without `data-processed`.
const FONTS = ['400 15px "Albert Sans"', '700 15px "Albert Sans"', '600 15px "Bricolage Grotesque"'];
const fontsReady = Promise.all(
  FONTS.map((font) => {
    return document.fonts.load(font);
  }),
);
const retried = new WeakSet();

const overflows = (diagram) => {
  return [...diagram.querySelectorAll('foreignObject')].some((box) => {
    const label = box.firstElementChild;
    return (
      label !== null &&
      (label.scrollWidth > box.width.baseVal.value + 1 || label.scrollHeight > box.height.baseVal.value + 1)
    );
  });
};

const rerenderIfOverflowing = (diagram) => {
  if (retried.has(diagram) || !overflows(diagram)) {
    return;
  }
  retried.add(diagram);
  diagram.removeAttribute('data-processed');
  document.dispatchEvent(new Event('astro:after-swap'));
};

fontsReady.then(() => {
  document.querySelectorAll('pre.mermaid[data-processed]').forEach(rerenderIfOverflowing);
  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.target.matches('pre.mermaid[data-processed]')) {
        rerenderIfOverflowing(record.target);
      }
    });
  }).observe(document.body, { subtree: true, attributeFilter: ['data-processed'] });
});
