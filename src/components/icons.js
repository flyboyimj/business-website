/** Inline SVG icons (stroke-based, inherit currentColor). Decorative by default. */
const paths = {
  phone:
    '<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  clipboard:
    '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  building: '<path d="M4 21V5l8-2v18M12 7l8 2v12M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2M2 21h20"/>',
  store: '<path d="M4 10v11h16V10M3 5l1.5-2h15L21 5v3a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM10 21v-6h4v6"/>',
  keys: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
  hardhat: '<path d="M3 17h18M5 17v-3a7 7 0 0 1 14 0v3M10 7V5h4v2M3 17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"/>',
};

export function icon(name, { size = 20, label } = {}) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="icon icon-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${paths[name] || ''}</svg>`;
}
