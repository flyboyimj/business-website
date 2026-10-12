/**
 * Page shell: <head>, header, navigation, footer, and the mobile contact bar.
 */
import { business, nav, seo, services } from '../content/site.js';
import { esc, placeholder, each } from './util.js';
import { icon } from './icons.js';

/** Text wordmark, or the logo image once one is set in site.js. */
export function wordmark(ctx, { light = false } = {}) {
  if (business.logo?.src) {
    const src = light && business.logo.light ? business.logo.light : business.logo.src;
    return `<img class="logo-img" src="${ctx.asset(src)}" width="${business.logo.width}" height="${business.logo.height}" alt="${esc(business.name)}">`;
  }
  // Text-based wordmark. Replace by setting `business.logo` in site.js.
  return `<span class="wordmark" aria-label="${esc(business.name)}">
      <span class="wordmark-mark" aria-hidden="true"></span>
      <span class="wordmark-text" aria-hidden="true"><span class="wordmark-name">Surveil</span><span class="wordmark-sub">Technologies</span></span>
    </span>`;
}

export function phoneLink(className = '') {
  if (!business.phone) return placeholder('Phone number');
  return `<a class="${className}" href="tel:${esc(business.phone.tel)}">${esc(business.phone.display)}</a>`;
}

export function emailLink(className = '') {
  if (!business.email) return placeholder('Email address');
  return `<a class="${className}" href="mailto:${esc(business.email)}">${esc(business.email)}</a>`;
}

function header(ctx) {
  const current = ctx.page.slug;
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="${ctx.link('')}">${wordmark(ctx)}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-open">${icon('menu', { size: 22 })}</span>
      <span class="nav-toggle-close">${icon('close', { size: 22 })}</span>
      <span class="nav-toggle-label">Menu</span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        ${each(
          nav,
          (item) =>
            `<li><a href="${ctx.link(item.href)}"${item.href === current ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`,
        )}
      </ul>
      <a class="btn btn-primary btn-sm nav-cta" href="${ctx.link('contact')}?request=site-walk#request-form">Request a Site Walk</a>
    </nav>
  </div>
</header>`;
}

function footer(ctx) {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand brand-light" href="${ctx.link('')}">${wordmark(ctx, { light: true })}</a>
      <p>Disabled veteran-owned commercial cabling and security technology installation. Based in ${esc(business.baseCity)}, ${esc(business.baseRegion)}, serving ${esc(business.serviceArea)}.</p>
    </div>
    <div>
      <h2 class="footer-heading">Services</h2>
      <ul class="footer-links">
        ${each(services, (s) => `<li><a href="${ctx.link('services', s.id)}">${esc(s.title)}</a></li>`)}
      </ul>
    </div>
    <div>
      <h2 class="footer-heading">Company</h2>
      <ul class="footer-links">
        ${each(nav.filter((n) => n.href), (n) => `<li><a href="${ctx.link(n.href)}">${esc(n.label)}</a></li>`)}
      </ul>
    </div>
    <div>
      <h2 class="footer-heading">Contact</h2>
      <ul class="footer-contact">
        <li>${icon('phone', { size: 18 })}${phoneLink()}</li>
        <li>${icon('mail', { size: 18 })}${emailLink()}</li>
        <li>${icon('pin', { size: 18 })}<span>${esc(business.baseCity)}, TX · Serving the Houston area</span></li>
      </ul>
      <a class="btn btn-primary btn-sm" href="${ctx.link('contact')}?request=site-walk#request-form">Request a Site Walk</a>
    </div>
  </div>
  <div class="container">
    <div class="footer-bottom">
      <p>© ${year} ${esc(business.name)}. All rights reserved.</p>
      <p>Disabled veteran-owned business</p>
    </div>
  </div>
</footer>`;
}

/** Fixed bottom bar on phones with the two most important actions. */
function mobileBar(ctx) {
  const call = business.phone
    ? `<a class="mobile-bar-btn mobile-bar-call" href="tel:${esc(business.phone.tel)}">${icon('phone', { size: 18 })}<span>Call</span></a>`
    : '';
  // On the contact page the form is already on screen, so only offer the Call button.
  const onContact = ctx.page.slug === 'contact';
  if (onContact && !call) return '';
  const primary = onContact
    ? ''
    : `<a class="mobile-bar-btn mobile-bar-primary" href="${ctx.link('contact')}?request=site-walk#request-form">Request a Site Walk</a>`;
  return `<div class="mobile-bar${call && primary ? '' : ' mobile-bar-single'}" aria-label="Quick contact">
  ${call}
  ${primary}
</div>`;
}

export function hasMobileBar(ctx) {
  return !(ctx.page.slug === 'contact' && !business.phone);
}

function jsonLd(ctx) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description:
      'Disabled veteran-owned commercial network cabling, network rack, security camera, and wireless installation company.',
    areaServed: [
      { '@type': 'City', name: 'Houston, TX' },
      { '@type': 'City', name: 'League City, TX' },
    ],
    founder: { '@type': 'Person', name: business.owner.name },
  };
  if (business.siteUrl) data.url = business.siteUrl + '/';
    data.logo = business.siteUrl + '/assets/og-image.jpg';
  if (business.phone) data.telephone = business.phone.tel;
  if (business.email) data.email = business.email;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function layout(ctx, { body }) {
  const meta = seo[ctx.page.seoKey];
  const canonical = ctx.canonical(ctx.page.slug);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.classList.add('js')</script>
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(business.name)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
${canonical ? `<meta property="og:url" content="${canonical}">` : ''}
${business.siteUrl ? `<meta property="og:image" content="${business.siteUrl}/assets/og-image.jpg">\n<meta name="twitter:card" content="summary_large_image">` : ''}
<meta name="theme-color" content="#0d1f3c">
${ctx.page.noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" href="${ctx.asset('favicon.png')}" type="image/png">
<link rel="apple-touch-icon" href="${ctx.asset('apple-touch-icon.png')}">
<link rel="preload" href="${ctx.asset('fonts/barlow-semi-condensed-latin-700-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${ctx.asset('fonts/ibm-plex-sans-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${ctx.asset('css/main.css')}?v=${ctx.version}">
${ctx.page.seoKey === 'home' ? jsonLd(ctx) : ''}
<script src="${ctx.asset('js/main.js')}?v=${ctx.version}" defer></script>
</head>
<body class="page-${ctx.page.seoKey}${hasMobileBar(ctx) ? '' : ' no-mobile-bar'}">
<a class="skip-link" href="#main">Skip to main content</a>
${header(ctx)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(ctx)}
${mobileBar(ctx)}
</body>
</html>
`;
}
