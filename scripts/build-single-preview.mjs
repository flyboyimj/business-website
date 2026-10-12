#!/usr/bin/env node
/**
 * Builds a single-file, click-through PREVIEW of the whole site (all pages in
 * one HTML file, switched by #hash links, CSS/JS/fonts inlined). Used only for
 * sharing a preview; the real site is built by build.mjs.
 *
 *   node scripts/build-single-preview.mjs  → preview/surveil-preview.html
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (p) => import(pathToFileURL(path.join(root, p)).href);

const { layout } = await imp('src/components/layout.js');
const { seo } = await imp('src/content/site.js');
const mods = await Promise.all(['home', 'services', 'builders', 'about', 'contact'].map((p) => imp(`src/pages/${p}.js`)));

const token = (slug) => slug || 'home';
const baseCtx = (page) => ({
  page,
  version: 'preview',
  formEndpoint: '',
  link: (target, hash) => `#${hash || token(target)}`,
  asset: (p) => `assets/${p}`,
  canonical: () => null,
});

const sections = mods
  .map(
    (m) =>
      `<div class="preview-page" data-page="${token(m.page.slug)}" data-title="${seo[m.page.seoKey].title.replace(/"/g, '&quot;')}"${m.page.slug ? ' hidden' : ''}>${m.render(baseCtx(m.page))}</div>`,
  )
  .join('\n');

let html = layout(baseCtx(mods[0].page), { body: sections });

// Contact links carry query strings on the real site; the preview uses plain anchors.
html = html.replace(/href="#contact\?[^"]*"/g, 'href="#contact"');

// Inline CSS with fonts as data URIs.
let css = await fs.readFile(path.join(root, 'src/styles/main.css'), 'utf8');
for (const m of [...css.matchAll(/url\('\.\.\/fonts\/([^']+)'\)/g)]) {
  const b64 = (await fs.readFile(path.join(root, 'src/assets/fonts', m[1]))).toString('base64');
  css = css.replace(m[0], `url(data:font/woff2;base64,${b64})`);
}
css += `
:root { color-scheme: light; }
.site-header { top: env(safe-area-inset-top, 0px); }
.mobile-bar { padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px)); }
.preview-note { background: #fff4d6; color: #6b4200; font-size: .9rem; padding: 8px var(--gutter); text-align: center; border-bottom: 1px solid #e8c77a; }
`;
const favicon = (await fs.readFile(path.join(root, 'src/assets/favicon.png'))).toString('base64');
// Inline images referenced from assets/images/ so the single file is self-contained.
for (const m of [...new Set([...html.matchAll(/src="assets\/(images\/[^"]+)"/g)].map((x) => x[1]))]) {
  const ext = path.extname(m).slice(1).replace('jpg', 'jpeg');
  const b64 = (await fs.readFile(path.join(root, 'src/assets', m))).toString('base64');
  html = html.split(`src="assets/${m}"`).join(`src="data:image/${ext};base64,${b64}"`);
}
const js = await fs.readFile(path.join(root, 'src/scripts/main.js'), 'utf8');

const router = `
(function () {
  var pages = [].slice.call(document.querySelectorAll('.preview-page'));
  function show() {
    var t = (location.hash || '#home').slice(1) || 'home';
    var page = pages.find(function (p) { return p.dataset.page === t; });
    var target = null;
    if (!page) {
      target = document.getElementById(t);
      page = target ? target.closest('.preview-page') : pages[0];
    }
    pages.forEach(function (p) { p.hidden = p !== page; });
    document.title = page.dataset.title;
    document.querySelectorAll('.site-nav a:not(.btn)').forEach(function (a) {
      if (a.getAttribute('href') === '#' + page.dataset.page) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (target && target.closest('form') === null && target.id !== 'request-form') target.scrollIntoView();
    else if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', show);
  show();
})();`;

const head = html.slice(0, html.indexOf('<body'));
const title = head.match(/<title>.*?<\/title>/)[0];
const metas = (head.match(/<meta name="description"[^>]*>/) || [''])[0];
const bodyInner = html
  .slice(html.indexOf('>', html.indexOf('<body')) + 1, html.lastIndexOf('</body>'))
  .replace('<a class="skip-link"', '<p class="preview-note">Preview: the contact form is not connected yet, so submissions are not sent.</p>\n<a class="skip-link"');

const out = `<title>Surveil Technologies Website</title>
${metas}
<link rel="icon" href="data:image/png;base64,${favicon}">
<script>document.documentElement.classList.add('js')</script>
<style>${css}</style>
${bodyInner.replace(/<script src="[^"]*"[^>]*><\/script>/g, '')}
<script>${js}</script>
<script>${router}</script>
`;
void title;
await fs.mkdir(path.join(root, 'preview'), { recursive: true });
await fs.writeFile(path.join(root, 'preview/surveil-preview.html'), out);
console.log(`Preview written: preview/surveil-preview.html (${(out.length / 1024).toFixed(0)} KB)`);
