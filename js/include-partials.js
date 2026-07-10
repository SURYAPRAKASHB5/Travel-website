/**
 * Simple client-side HTML partial loader.
 * Replaces elements with data-include="<path>" with the fetched HTML.
 * No build step required; keeps UI/output identical.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const nodes = document.querySelectorAll('[data-include]');
  if (!nodes.length) return;

  await Promise.all(
    Array.from(nodes).map(async (node) => {
      const src = node.getAttribute('data-include');
      if (!src) return;

      try {
        const res = await fetch(src, { cache: 'no-store' });
        if (!res.ok) return;
        const html = await res.text();
        node.outerHTML = html;
      } catch (e) {
        // Fail silently to avoid breaking page render.
      }
    })
  );
});

