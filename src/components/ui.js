/**
 * Reusable page building blocks.
 */
import { business, photos, processSteps } from '../content/site.js';
import { esc, cx, each } from './util.js';
import { icon } from './icons.js';
import { illustrations } from './illustrations.js';
import { phoneLink, emailLink } from './layout.js';

export function button(href, label, variant = 'primary', { size, iconName } = {}) {
  return `<a class="${cx('btn', `btn-${variant}`, size && `btn-${size}`)}" href="${href}">${esc(label)}${iconName ? icon(iconName, { size: 18 }) : ''}</a>`;
}

/** Eyebrow + heading + optional lead paragraph. */
export function sectionHead({ eyebrow, title, lead, level = 2, id, align }) {
  return `<div class="${cx('section-head', align === 'center' && 'section-head-center')}">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h${level}${id ? ` id="${id}"` : ''}>${esc(title)}</h${level}>
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
  </div>`;
}

/**
 * A photo if one is configured in site.js, otherwise the matching illustration.
 */
export function media(ctx, photoKey, illustrationKey, className = '', { eager = false } = {}) {
  const p = photos[photoKey];
  if (p?.src) {
    return `<figure class="${cx('media', className)}"><img src="${ctx.asset(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;
  }
  const draw = illustrations[illustrationKey];
  return `<div class="${cx('media', 'media-illustration', className)}">${draw ? draw() : ''}</div>`;
}

export function serviceCard(ctx, s, level = 3) {
  return `<article class="service-card">
    <div class="service-card-media">${illustrations[s.illustration]()}</div>
    <div class="service-card-body">
      <h${level}>${esc(s.title)}</h${level}>
      <p>${esc(s.short)}</p>
      <a class="text-link" href="${ctx.link('services', s.id)}">Learn more<span class="visually-hidden"> about ${esc(s.title)}</span>${icon('arrow', { size: 16 })}</a>
    </div>
  </article>`;
}

export function checkList(items, className = '') {
  return `<ul class="${cx('check-list', className)}">${each(items, (i) => `<li>${icon('check', { size: 18 })}<span>${esc(i)}</span></li>`)}</ul>`;
}

export function processList({ headingLevel = 3 } = {}) {
  return `<ol class="process">
    ${each(
      processSteps,
      (step, i) => `<li class="process-step">
        <span class="process-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h${headingLevel}><span class="visually-hidden">Step ${i + 1}: </span>${esc(step.title)}</h${headingLevel}>
        <p>${esc(step.text)}</p>
      </li>`,
    )}
  </ol>`;
}

/** Navy call-to-action band used near the bottom of pages. */
export function ctaBand(ctx, { title, text, primary, secondary, id }) {
  return `<section class="cta-band" ${id ? `aria-labelledby="${id}"` : ''}>
    <div class="container cta-band-inner">
      <div>
        <h2 ${id ? `id="${id}"` : ''}>${esc(title)}</h2>
        <p>${esc(text)}</p>
      </div>
      <div class="btn-row">
        ${primary ? button(primary.href, primary.label, 'primary') : ''}
        ${secondary ? button(secondary.href, secondary.label, 'outline-light') : ''}
      </div>
    </div>
  </section>`;
}

/** Direct contact details block (phone, email, service area). */
export function contactDetails({ dark = false } = {}) {
  return `<ul class="${cx('contact-details', dark && 'contact-details-dark')}">
    <li>
      <span class="contact-icon">${icon('phone')}</span>
      <span><span class="contact-label">Phone</span>${phoneLink()}</span>
    </li>
    <li>
      <span class="contact-icon">${icon('mail')}</span>
      <span><span class="contact-label">Email</span>${emailLink()}</span>
    </li>
    <li>
      <span class="contact-icon">${icon('pin')}</span>
      <span><span class="contact-label">Service area</span>Based in ${esc(business.baseCity)}, serving Houston and the surrounding metro area</span>
    </li>
  </ul>`;
}

/** Links for the two primary calls to action. */
export function ctaLinks(ctx) {
  return {
    siteWalk: { href: `${ctx.link('contact')}?request=site-walk#request-form`, label: 'Request a Site Walk' },
    discuss: { href: `${ctx.link('contact')}?request=project#request-form`, label: 'Discuss Your Project' },
  };
}
