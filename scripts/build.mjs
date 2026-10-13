#!/usr/bin/env node
/**
 * Static site build. No dependencies — just Node 18+.
 *
 *   node scripts/build.mjs            → production build in ./dist (clean URLs: /services/)
 *   node scripts/build.mjs --flat     → single-folder build (services.html) that also opens from disk
 *   node scripts/build.mjs --check    → list missing business details / launch config, exit 1 if any
 *
 * Environment:
 *   FORM_ENDPOINT   Public URL of the contact form API (see backend/). Not a secret.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

export async function build({
  outDir = path.join(root, 'dist'),
  flat = false,
  formEndpoint = process.env.FORM_ENDPOINT || '',
  quiet = false,
} = {}) {
  // Fresh imports each time so the dev server picks up content edits.
  const bust = `?t=${Date.now()}`;
  const imp = (p) => import(pathToFileURL(path.join(root, p)).href + bust);
  const [{ layout }, site, ...pages] = await Promise.all([
    imp('src/components/layout.js'),
    imp('src/content/site.js'),
    imp('src/pages/home.js'),
    imp('src/pages/services.js'),
    imp('src/pages/builders.js'),
    imp('src/pages/about.js'),
    imp('src/pages/contact.js'),
    imp('src/pages/not-found.js'),
  ]);

  // FORM_ENDPOINT (environment) overrides form.endpoint in site.js.
  formEndpoint = formEndpoint || site.form.endpoint || '';

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(path.join(outDir, 'assets'), { recursive: true });

  // Static assets
  await fs.cp(path.join(root, 'src/assets'), path.join(outDir, 'assets'), { recursive: true });
  await fs.mkdir(path.join(outDir, 'assets/css'), { recursive: true });
  await fs.mkdir(path.join(outDir, 'assets/js'), { recursive: true });
  const css = await fs.readFile(path.join(root, 'src/styles/main.css'), 'utf8');
  const js = await fs.readFile(path.join(root, 'src/scripts/main.js'), 'utf8');
  await fs.writeFile(path.join(outDir, 'assets/css/main.css'), css);
  await fs.writeFile(path.join(outDir, 'assets/js/main.js'), js);
  await fs.cp(path.join(root, 'public'), outDir, { recursive: true }).catch(() => {});
  const version = crypto.createHash('sha1').update(css + js).digest('hex').slice(0, 10);

  const siteUrl = site.business.siteUrl ? site.business.siteUrl.replace(/\/$/, '') : null;

  for (const mod of pages) {
    const page = mod.page;
    const isRootAbsolute = !flat && page.file === '404.html';
    const depth = flat || !page.slug || page.file ? 0 : 1;
    const prefix = isRootAbsolute ? '/' : '../'.repeat(depth);
    const link = (target, hash) => {
      let href;
      if (flat) href = target ? `${target}.html` : 'index.html';
      else href = target ? `${prefix}${target}/` : prefix || './';
      return hash ? `${href}#${hash}` : href;
    };
    const ctx = {
      page,
      version,
      formEndpoint,
      link,
      asset: (p) => `${prefix}assets/${p}`,
      canonical: (slug) => (siteUrl && !page.noindex ? `${siteUrl}/${slug ? `${slug}/` : ''}` : null),
    };
    const html = layout(ctx, { body: mod.render(ctx) });
    const file = page.file || (flat ? (page.slug ? `${page.slug}.html` : 'index.html') : page.slug ? `${page.slug}/index.html` : 'index.html');
    await fs.mkdir(path.dirname(path.join(outDir, file)), { recursive: true });
    await fs.writeFile(path.join(outDir, file), html);
  }

  // robots.txt and sitemap.xml
  let robots = 'User-agent: *\nAllow: /\n';
  if (siteUrl) {
    const urls = pages
      .filter((m) => !m.page.noindex)
      .map((m) => `  <url><loc>${siteUrl}/${m.page.slug ? `${m.page.slug}/` : ''}</loc></url>`)
      .join('\n');
    await fs.writeFile(
      path.join(outDir, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
    robots += `Sitemap: ${siteUrl}/sitemap.xml\n`;
  }
  await fs.writeFile(path.join(outDir, 'robots.txt'), robots);

  const report = launchReport(site, formEndpoint);
  if (!quiet) {
    console.log(`Built ${pages.length} pages → ${path.relative(root, outDir) || '.'}${flat ? ' (flat preview)' : ''}`);
    printReport(report);
  }
  return report;
}

function launchReport(site, formEndpoint) {
  const b = site.business;
  const required = [];
  const optional = [];
  if (!b.siteUrl) required.push('business.siteUrl — your domain (canonical URLs, sitemap)');
  if (!b.phone) required.push('business.phone — phone number (shows as a placeholder; Call button hidden)');
  if (!b.email) required.push('business.email — public email address (shows as a placeholder)');
  if (!formEndpoint) required.push('form.endpoint — contact form address in site.js (form cannot send without it)');
  if (!b.logo) optional.push('business.logo — using the text wordmark');
  const noPhotos = Object.entries(site.photos)
    .filter(([, p]) => !p.src)
    .map(([k]) => k);
  if (noPhotos.length) optional.push(`photos — using illustrations for: ${noPhotos.join(', ')}`);
  return { required, optional };
}

function printReport({ required, optional }) {
  if (required.length) {
    console.log('\n⚠  Needed before launch:');
    required.forEach((r) => console.log(`   • ${r}`));
  }
  if (optional.length) {
    console.log('\nℹ  Optional:');
    optional.forEach((r) => console.log(`   • ${r}`));
  }
  if (!required.length) console.log('\n✓ All required launch details are set.');
}

// CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const flat = args.includes('--flat');
  const outDir = argValue('--out') ? path.resolve(argValue('--out')) : path.join(root, flat ? 'dist-preview' : 'dist');
  const report = await build({ outDir, flat });
  if (args.includes('--check') && report.required.length) {
    console.error('\nLaunch check failed: fill in the items above.');
    process.exit(1);
  }
}
