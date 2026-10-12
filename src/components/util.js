/**
 * Small helpers shared by all components.
 * Components are plain functions that return HTML strings — no framework.
 */

/** Escape text for safe use inside HTML. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** A visibly marked placeholder for business details that are not set yet. */
export function placeholder(label) {
  return `<span class="placeholder" title="Placeholder: set this in src/content/site.js">[${esc(label)}]</span>`;
}

/** Join class names, skipping empty values. */
export function cx(...names) {
  return names.filter(Boolean).join(' ');
}

/** Render a list of items with a mapper and join them. */
export function each(items, fn) {
  return (items || []).map(fn).join('');
}
