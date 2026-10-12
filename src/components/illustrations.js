/**
 * Illustrations used until real photos are added in src/content/site.js.
 * Flat, realistic-leaning drawings of commercial network infrastructure.
 * All are decorative (aria-hidden); the surrounding text carries the meaning.
 */

const C = {
  navy: '#0d1f3c',
  navy2: '#1a3358',
  charcoal: '#2b3038',
  charcoal2: '#1e2228',
  slate: '#3b424d',
  steel: '#6b7686',
  line: '#c9d2de',
  wall: '#e7ecf3',
  pale: '#f3f6fa',
  floor: '#d6dde7',
  accent: '#2f6fe0',
  accent2: '#5b8ff0',
  accentPale: '#b9cef7',
  white: '#ffffff',
};

const range = (n) => Array.from({ length: n }, (_, i) => i);

function frame(id, inner, { bg = C.wall } = {}) {
  return `<svg class="illo illo-${id}" viewBox="0 0 560 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
  <rect width="560" height="420" fill="${bg}"/>
  ${inner}
</svg>`;
}

/* ---------- Network rack with patch panels, managers, switches ---------- */
function patchPanel(x, y, w, colors) {
  const ports = range(24)
    .map((i) => {
      const group = Math.floor(i / 6);
      const px = x + 16 + i * 7.3 + group * 6;
      const col = colors[i % colors.length];
      return `<rect x="${px.toFixed(1)}" y="${y + 9}" width="5.4" height="7" rx="1" fill="${C.charcoal2}"/>
        <rect x="${(px + 0.6).toFixed(1)}" y="${y + 10}" width="4.2" height="5" rx="0.8" fill="${col}"/>`;
    })
    .join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="22" rx="2" fill="${C.slate}"/>
    <rect x="${x + 16}" y="${y + 3}" width="${w - 32}" height="4" rx="1" fill="${C.pale}" opacity=".85"/>
    ${ports}`;
}

function manager(x, y, w) {
  const fingers = range(14)
    .map((i) => `<rect x="${x + 10 + i * ((w - 20) / 14)}" y="${y + 3}" width="6" height="16" rx="1" fill="${C.charcoal}"/>`)
    .join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="22" rx="2" fill="${C.charcoal2}"/>${fingers}`;
}

function switchUnit(x, y, w) {
  const ports = range(24)
    .map((i) => {
      const px = x + 20 + i * 7.3 + Math.floor(i / 12) * 8;
      return `<rect x="${px.toFixed(1)}" y="${y + 9}" width="5.4" height="7" rx="1" fill="${C.charcoal2}"/>`;
    })
    .join('');
  const leds = range(6)
    .map((i) => `<circle cx="${x + w - 20 - i * 6}" cy="${y + 11}" r="1.4" fill="${i % 3 === 0 ? C.accent2 : '#7ad19b'}"/>`)
    .join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="22" rx="2" fill="#cfd6e0"/>
    <rect x="${x}" y="${y}" width="${w}" height="3" rx="1" fill="#e2e7ee"/>
    ${ports}${leds}`;
}

function patchCords(x, yTop, yBottom, colors) {
  return range(24)
    .map((i) => {
      const group = Math.floor(i / 6);
      const px = x + 16 + i * 7.3 + group * 6 + 2.7;
      const sx = x + 20 + i * 7.3 + Math.floor(i / 12) * 8 + 2.7;
      const col = colors[i % colors.length];
      return `<path d="M${px.toFixed(1)} ${yTop} C ${px.toFixed(1)} ${yTop + 16}, ${sx.toFixed(1)} ${yBottom - 16}, ${sx.toFixed(1)} ${yBottom}" stroke="${col}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    })
    .join('');
}

export function rackIllustration() {
  const x = 176;
  const w = 208;
  const blue = [C.accent, C.accent, C.accent, C.accent2, C.accent, C.pale];
  const white = [C.pale, C.pale, C.accentPale, C.pale];
  const bundle = range(7)
    .map((i) => {
      const off = i * 4;
      const col = i % 3 === 0 ? C.pale : i % 3 === 1 ? C.accent : C.accent2;
      return `<path d="M${470 - off} 34 L${410 - off} 34 C ${396 - off} 34, ${398 + off * 0.2} 44, ${398 + off * 0.2} 62 L ${398 + off * 0.2} 330" stroke="${col}" stroke-width="3.2" fill="none"/>`;
    })
    .join('');
  const straps = [90, 170, 250]
    .map((y) => `<rect x="394" y="${y}" width="32" height="6" rx="2" fill="${C.navy}"/>`)
    .join('');
  const rungs = range(12)
    .map((i) => `<rect x="${300 + i * 22}" y="26" width="4" height="16" fill="#9aa5b4"/>`)
    .join('');
  return frame(
    'rack',
    `
  <rect y="342" width="560" height="78" fill="${C.floor}"/>
  <rect x="120" y="0" width="1" height="342" fill="${C.line}"/>
  <!-- ladder rack -->
  <rect x="296" y="24" width="264" height="4" fill="#8894a4"/>
  <rect x="296" y="40" width="264" height="4" fill="#8894a4"/>
  ${rungs}
  ${bundle}
  ${straps}
  <ellipse cx="${x + w / 2}" cy="372" rx="150" ry="10" fill="#b8c2cf" opacity=".6"/>
  <!-- rack frame -->
  <rect x="${x - 18}" y="44" width="${w + 36}" height="324" rx="4" fill="${C.charcoal}"/>
  <rect x="${x - 6}" y="56" width="${w + 12}" height="300" fill="#15191f"/>
  ${range(40).map((i) => `<rect x="${x - 13}" y="${60 + i * 7.4}" width="3" height="3" fill="#4a525e"/><rect x="${x + w + 10}" y="${60 + i * 7.4}" width="3" height="3" fill="#4a525e"/>`).join('')}
  ${patchCords(x, 76, 122, blue)}
  ${patchCords(x, 174, 220, white)}
  ${patchPanel(x, 62, w, blue)}
  ${manager(x, 86, w)}
  ${switchUnit(x, 110, w)}
  ${patchPanel(x, 160, w, white)}
  ${manager(x, 184, w)}
  ${switchUnit(x, 208, w)}
  <rect x="${x}" y="236" width="${w}" height="22" rx="2" fill="${C.charcoal}"/>
  <rect x="${x}" y="262" width="${w}" height="44" rx="2" fill="#262b33"/>
  ${range(16).map((i) => `<rect x="${x + 24 + i * 8}" y="274" width="4" height="20" rx="1" fill="#1a1e24"/>`).join('')}
  <rect x="${x + w - 44}" y="276" width="26" height="6" rx="1" fill="${C.slate}"/>
  <circle cx="${x + w - 24}" cy="292" r="2" fill="${C.accent2}"/>
  <rect x="${x}" y="312" width="${w}" height="36" rx="2" fill="#20252c"/>
  <rect x="${x + 12}" y="322" width="${w - 24}" height="4" rx="1" fill="#2e343d"/>
  <rect x="${x + 12}" y="332" width="${w - 24}" height="4" rx="1" fill="#2e343d"/>
  <!-- vertical manager on the right -->
  <rect x="${x + w + 18}" y="44" width="30" height="324" rx="3" fill="${C.charcoal2}"/>
  `,
  );
}

/* ---------- Patch panel close-up with labeled cables ---------- */
export function cablingIllustration() {
  const ports = range(8)
    .map((i) => {
      const px = 66 + i * 56 + (i >= 4 ? 18 : 0);
      const col = i === 3 || i === 6 ? C.pale : C.accent;
      const label = `A-${String(i + 1).padStart(2, '0')}`;
      const endX = 250 + i * 10;
      return `
      <text x="${px + 20}" y="104" font-size="13" font-family="IBM Plex Sans, Arial, sans-serif" font-weight="600" fill="${C.charcoal}" text-anchor="middle">${label}</text>
      <rect x="${px}" y="116" width="40" height="40" rx="4" fill="${C.charcoal2}"/>
      <path d="M${px + 20} 176 C ${px + 20} 250, ${endX} 280, ${endX} 420" stroke="${col}" stroke-width="12" fill="none"/>
      <rect x="${px + 5}" y="120" width="30" height="42" rx="4" fill="${col}"/>
      <rect x="${px + 9}" y="160" width="22" height="22" rx="3" fill="${col === C.pale ? '#d7dee8' : '#2459bd'}"/>
      ${i % 2 === 0 ? `<g transform="translate(${px + 26} ${200}) rotate(-8)"><rect width="46" height="20" rx="3" fill="${C.white}" stroke="${C.line}"/><text x="23" y="14" font-size="11" font-family="IBM Plex Sans, Arial, sans-serif" font-weight="600" fill="${C.navy}" text-anchor="middle">${label}</text></g>` : ''}`;
    })
    .join('');
  return frame(
    'cabling',
    `
  <rect x="30" y="72" width="500" height="112" rx="6" fill="#39414c"/>
  <rect x="42" y="84" width="476" height="26" rx="3" fill="${C.pale}"/>
  <circle cx="44" cy="150" r="5" fill="#59616d"/><circle cx="516" cy="150" r="5" fill="#59616d"/>
  ${ports}
  <rect x="240" y="330" width="100" height="16" rx="4" fill="${C.navy}"/>
  `,
    { bg: '#e9eef5' },
  );
}

/* ---------- Exterior bullet camera + soffit dome camera ---------- */
export function cameraIllustration() {
  const panels = range(6)
    .map((i) => `<rect x="0" y="${70 + i * 46}" width="560" height="1.5" fill="#d3dae4"/>`)
    .join('');
  return frame(
    'camera',
    `
  <rect width="560" height="420" fill="#e4e9f0"/>
  ${panels}
  <!-- soffit -->
  <rect x="0" y="0" width="560" height="54" fill="${C.navy2}"/>
  <rect x="0" y="54" width="560" height="8" fill="${C.navy}"/>
  <!-- storefront glass -->
  <rect x="300" y="170" width="260" height="250" fill="#2a3a52"/>
  <rect x="300" y="170" width="260" height="250" fill="url(#glass)"/>
  <rect x="420" y="170" width="6" height="250" fill="#8c98a8"/>
  <rect x="300" y="166" width="260" height="8" fill="#8c98a8"/>
  <defs>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".18"/>
      <stop offset=".5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity=".08"/>
    </linearGradient>
  </defs>
  <!-- field of view -->
  <path d="M186 168 L 20 420 L 300 420 Z" fill="${C.accent}" opacity=".09"/>
  <!-- wall mount + bullet camera -->
  <rect x="96" y="108" width="44" height="60" rx="6" fill="#f7f9fc" stroke="${C.line}"/>
  <rect x="130" y="128" width="30" height="16" rx="4" fill="#eef2f7" stroke="${C.line}"/>
  <g transform="rotate(24 170 140)">
    <rect x="146" y="116" width="112" height="46" rx="12" fill="${C.white}" stroke="${C.line}" stroke-width="1.5"/>
    <rect x="138" y="108" width="128" height="14" rx="6" fill="#f2f5f9" stroke="${C.line}" stroke-width="1.5"/>
    <rect x="252" y="120" width="12" height="38" rx="4" fill="${C.charcoal}"/>
    <circle cx="258" cy="139" r="11" fill="#1a1f26"/>
    <circle cx="258" cy="139" r="6" fill="#28476f"/>
    <circle cx="255" cy="136" r="2" fill="#9dbcf5"/>
  </g>
  <!-- conduit -->
  <rect x="112" y="62" width="10" height="48" fill="#cdd4de"/>
  <!-- soffit dome camera -->
  <path d="M430 62 h72 v10 a36 36 0 0 1 -72 0z" fill="${C.white}" stroke="${C.line}" stroke-width="1.5"/>
  <path d="M442 72 a24 24 0 0 0 48 0z" fill="#27313f"/>
  <circle cx="466" cy="82" r="6" fill="#3e5f8c"/>
  <!-- sidewalk -->
  <rect x="0" y="392" width="300" height="28" fill="#c9d1dc"/>
  `,
  );
}

/* ---------- Ceiling-mounted wireless access point ---------- */
export function wirelessIllustration() {
  const grid = [
    ...range(9).map((i) => `<rect x="${i * 70}" y="0" width="3" height="420" fill="#c7d0dc"/>`),
    ...range(6).map((i) => `<rect x="0" y="${i * 84}" width="560" height="3" fill="#c7d0dc"/>`),
  ].join('');
  return frame(
    'wireless',
    `
  <rect width="560" height="420" fill="#eef1f5"/>
  ${range(40).map((i) => `<circle cx="${(i * 97) % 560}" cy="${(i * 53) % 420}" r="1.2" fill="#d9dfe7"/>`).join('')}
  ${grid}
  <!-- light fixtures -->
  <rect x="73" y="87" width="67" height="165" fill="#fbfcfe" stroke="#d3dae4"/>
  <rect x="423" y="171" width="67" height="165" fill="#fbfcfe" stroke="#d3dae4"/>
  <!-- signal rings -->
  <circle cx="280" cy="210" r="96" fill="none" stroke="${C.accent}" stroke-opacity=".22" stroke-width="2"/>
  <circle cx="280" cy="210" r="140" fill="none" stroke="${C.accent}" stroke-opacity=".14" stroke-width="2"/>
  <circle cx="280" cy="210" r="186" fill="none" stroke="${C.accent}" stroke-opacity=".08" stroke-width="2"/>
  <!-- access point -->
  <rect x="226" y="160" width="112" height="112" rx="22" fill="#c9d1dc" opacity=".55" transform="translate(6 8)"/>
  <rect x="226" y="156" width="108" height="108" rx="22" fill="${C.white}" stroke="#d3dae4" stroke-width="1.5"/>
  <rect x="244" y="174" width="72" height="72" rx="14" fill="#f5f7fa"/>
  <circle cx="280" cy="210" r="4" fill="${C.accent}"/>
  `,
  );
}

/* ---------- Floor plan with cable runs, cameras, access points ---------- */
export function floorplanIllustration() {
  const drop = (x, y) => `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${C.charcoal}"/>`;
  const cam = (x, y, r) =>
    `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 L 34 -14 L 34 14 Z" fill="${C.accent}" opacity=".18"/><circle r="7" fill="${C.navy}"/></g>`;
  const ap = (x, y) =>
    `<circle cx="${x}" cy="${y}" r="11" fill="${C.white}" stroke="${C.accent}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="3" fill="${C.accent}"/>`;
  const run = (d) =>
    `<path d="${d}" stroke="${C.accent}" stroke-width="2.4" stroke-dasharray="7 5" fill="none"/>`;
  const labelStyle = `font-family="IBM Plex Sans, Arial, sans-serif" font-size="12" font-weight="600" fill="${C.steel}" letter-spacing=".08em"`;
  return frame(
    'floorplan',
    `
  <rect width="560" height="420" fill="#fbfcfd"/>
  ${range(29).map((i) => `<rect x="${i * 20}" y="0" width="1" height="420" fill="#eef1f5"/>`).join('')}
  ${range(22).map((i) => `<rect x="0" y="${i * 20}" width="560" height="1" fill="#eef1f5"/>`).join('')}
  <!-- network room -->
  <rect x="40" y="40" width="110" height="90" fill="#e6ecf5"/>
  <rect x="70" y="66" width="44" height="36" fill="${C.navy}"/>
  <rect x="76" y="72" width="32" height="4" fill="${C.accentPale}"/><rect x="76" y="80" width="32" height="4" fill="${C.accentPale}"/><rect x="76" y="88" width="32" height="4" fill="${C.accentPale}"/>
  <!-- runs -->
  ${run('M114 84 H 330 V 110')}
  ${run('M114 90 H 250 V 250 H 300')}
  ${run('M114 96 H 200 V 250 H 360')}
  ${run('M92 102 V 300 H 130')}
  ${run('M100 102 V 200 H 150')}
  ${run('M114 84 H 440 V 110')}
  ${run('M250 170 H 330')}
  <!-- walls -->
  <path d="M40 40 H 520 V 380 H 40 Z" fill="none" stroke="${C.navy}" stroke-width="7"/>
  <path d="M150 40 V 130 H 40" fill="none" stroke="${C.navy}" stroke-width="5"/>
  <path d="M40 160 H 180 V 380" fill="none" stroke="${C.navy}" stroke-width="5"/>
  <path d="M180 250 H 150" fill="none" stroke="${C.navy}" stroke-width="5"/>
  <path d="M380 40 V 150 H 520" fill="none" stroke="${C.navy}" stroke-width="5"/>
  <path d="M470 150 V 250" fill="none" stroke="${C.navy}" stroke-width="0"/>
  <!-- door gaps -->
  <rect x="120" y="126" width="26" height="9" fill="#fbfcfd"/>
  <rect x="176" y="190" width="9" height="30" fill="#fbfcfd"/>
  <rect x="400" y="146" width="30" height="9" fill="#fbfcfd"/>
  <rect x="330" y="376" width="80" height="9" fill="#fbfcfd"/>
  <!-- desks -->
  ${[250, 330, 410].map((x) => `<rect x="${x - 30}" y="230" width="60" height="40" rx="3" fill="#eef1f5" stroke="#d3dae4"/>`).join('')}
  <rect x="410" y="60" width="90" height="60" rx="6" fill="#eef1f5" stroke="#d3dae4"/>
  ${drop(330, 110)}${drop(440, 110)}${drop(300, 250)}${drop(360, 250)}${drop(130, 300)}${drop(150, 200)}${drop(330, 170)}
  ${ap(300, 190)}${ap(110, 330)}${ap(450, 300)}
  ${cam(360, 368, -90)}${cam(512, 48, 135)}${cam(48, 372, -45)}
  <!-- legend -->
  <rect x="40" y="394" width="10" height="10" fill="${C.charcoal}"/><text x="56" y="404" ${labelStyle}>DROP</text>
  <circle cx="126" cy="399" r="6" fill="${C.white}" stroke="${C.accent}" stroke-width="2.5"/><text x="138" y="404" ${labelStyle}>ACCESS POINT</text>
  <circle cx="258" cy="399" r="5" fill="${C.navy}"/><text x="270" y="404" ${labelStyle}>CAMERA</text>
  <path d="M346 399 H 372" stroke="${C.accent}" stroke-width="2.4" stroke-dasharray="7 5"/><text x="380" y="404" ${labelStyle}>CABLE RUN</text>
  `,
  );
}

/* ---------- Support: checklist and cable tester ---------- */
export function supportIllustration() {
  const rows = range(5)
    .map((i) => {
      const y = 132 + i * 44;
      const done = i < 4;
      return `<rect x="96" y="${y}" width="22" height="22" rx="4" fill="${done ? C.accent : C.white}" stroke="${done ? C.accent : C.line}" stroke-width="2"/>
        ${done ? `<path d="M101 ${y + 11} l5 5 l8 -10" stroke="${C.white}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        <rect x="132" y="${y + 4}" width="${[130, 110, 146, 96, 124][i]}" height="6" rx="3" fill="#c7d0dc"/>
        <rect x="132" y="${y + 14}" width="${[80, 96, 64, 88, 70][i]}" height="5" rx="2.5" fill="#e0e6ee"/>`;
    })
    .join('');
  const wiremap = range(8)
    .map((i) => `<rect x="376" y="${150 + i * 13}" width="${[88, 88, 88, 88, 88, 88, 88, 88][i]}" height="6" rx="2" fill="${i % 2 ? '#7ad19b' : '#9fd9b4'}"/>`)
    .join('');
  return frame(
    'support',
    `
  <rect width="560" height="420" fill="#e9eef5"/>
  <rect y="330" width="560" height="90" fill="#dde4ed"/>
  <!-- clipboard -->
  <rect x="66" y="74" width="250" height="310" rx="12" fill="${C.navy2}"/>
  <rect x="80" y="96" width="222" height="276" rx="6" fill="${C.white}"/>
  <rect x="150" y="62" width="82" height="30" rx="8" fill="#9aa5b4"/>
  <rect x="162" y="70" width="58" height="12" rx="4" fill="#6b7686"/>
  ${rows}
  <!-- cable tester -->
  <rect x="352" y="104" width="136" height="236" rx="18" fill="${C.charcoal}"/>
  <rect x="364" y="134" width="112" height="130" rx="6" fill="#16202e"/>
  ${wiremap}
  <circle cx="420" cy="300" r="20" fill="#3b424d"/>
  <circle cx="420" cy="300" r="10" fill="${C.accent}"/>
  <rect x="396" y="74" width="48" height="34" rx="6" fill="#3b424d"/>
  <path d="M420 74 C 420 30, 500 40, 540 10" stroke="${C.accent}" stroke-width="7" fill="none"/>
  `,
  );
}

/* ---------- Conference room: display, wall plate, ceiling speakers ---------- */
export function avIllustration() {
  const speaker = (x) =>
    `<circle cx="${x}" cy="30" r="20" fill="${C.white}" stroke="#cfd6e0" stroke-width="2"/>
     ${range(3).map((i) => `<circle cx="${x}" cy="30" r="${5 + i * 4.5}" fill="none" stroke="#dde3eb" stroke-width="1.5"/>`).join('')}`;
  const run = (d, col = C.accent) => `<path d="${d}" stroke="${col}" stroke-width="2.6" stroke-dasharray="8 6" fill="none" opacity=".75"/>`;
  return frame(
    'av',
    `
  <rect width="560" height="420" fill="#e8edf3"/>
  <!-- ceiling -->
  <rect width="560" height="54" fill="#f4f6f9"/>
  <rect y="54" width="560" height="3" fill="#d3dae4"/>
  ${speaker(110)}${speaker(450)}
  <!-- cable runs inside wall and ceiling -->
  ${run('M110 50 V 66 H 280 V 92')}
  ${run('M450 50 V 66 H 280')}
  ${run('M280 262 V 296', C.navy2)}
  ${run('M300 262 V 280 H 420 V 330', C.navy2)}
  <!-- display -->
  <rect x="120" y="92" width="320" height="180" rx="8" fill="${C.charcoal2}"/>
  <rect x="130" y="102" width="300" height="160" rx="3" fill="#1d3150"/>
  <path d="M130 262 L 300 102 H 430 V 262 Z" fill="#ffffff" opacity=".04"/>
  <rect x="160" y="132" width="120" height="10" rx="3" fill="#3d5a86"/>
  <rect x="160" y="152" width="200" height="6" rx="3" fill="#2d4770"/>
  <rect x="160" y="166" width="170" height="6" rx="3" fill="#2d4770"/>
  <rect x="160" y="200" width="70" height="40" rx="4" fill="${C.accent}" opacity=".85"/>
  <rect x="240" y="200" width="70" height="40" rx="4" fill="#3d5a86"/>
  <rect x="320" y="200" width="70" height="40" rx="4" fill="#3d5a86"/>
  <!-- wall plate -->
  <rect x="262" y="296" width="44" height="62" rx="5" fill="${C.white}" stroke="#cfd6e0" stroke-width="1.5"/>
  <rect x="273" y="308" width="22" height="10" rx="2" fill="${C.charcoal}"/>
  <rect x="273" y="326" width="22" height="10" rx="2" fill="${C.charcoal}"/>
  <circle cx="284" cy="347" r="3.5" fill="${C.accent}"/>
  <!-- floor and table -->
  <rect y="370" width="560" height="50" fill="${C.floor}"/>
  <path d="M330 330 H 548 L 560 352 H 318 Z" fill="#9aa5b4"/>
  <rect x="318" y="352" width="242" height="10" fill="#7b8696"/>
  <rect x="404" y="324" width="36" height="8" rx="2" fill="${C.charcoal}"/>
  <rect x="412" y="326" width="8" height="4" rx="1" fill="${C.accent2}"/>
  <rect x="424" y="326" width="8" height="4" rx="1" fill="${C.pale}"/>
  `,
  );
}

export const illustrations = {
  av: avIllustration,
  rack: rackIllustration,
  cabling: cablingIllustration,
  camera: cameraIllustration,
  wireless: wirelessIllustration,
  floorplan: floorplanIllustration,
  support: supportIllustration,
};
