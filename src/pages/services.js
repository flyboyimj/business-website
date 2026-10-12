import { services } from '../content/site.js';
import { esc, each, cx } from '../components/util.js';
import { icon } from '../components/icons.js';
import { button, media, checkList, ctaBand, ctaLinks, sectionHead } from '../components/ui.js';

export const page = { slug: 'services', seoKey: 'services' };

export function render(ctx) {
  const cta = ctaLinks(ctx);
  const serviceSection = (s, i) => `
  <section class="${cx('section', 'service-detail', i % 2 === 1 && 'section-alt')}" id="${s.id}" aria-labelledby="${s.id}-title">
    <div class="container split ${i % 2 === 1 ? 'split-reverse' : ''}">
      <div class="service-copy">
        <p class="eyebrow">Service ${String(i + 1).padStart(2, '0')}</p>
        <h2 id="${s.id}-title">${esc(s.title)}</h2>
        <p class="lead">${esc(s.intro)}</p>
        <h3 class="list-heading">What this includes</h3>
        ${checkList(s.includes)}
        <div class="outcome">
          <h3>The result</h3>
          <p>${esc(s.outcome)}</p>
        </div>
        ${s.note ? `<p class="service-note">${esc(s.note)}</p>` : ''}
        ${button(`${ctx.link('contact')}?request=site-walk&amp;service=${s.id}#request-form`, s.cta, 'primary', { iconName: 'arrow' })}
      </div>
      ${media(ctx, s.photo, s.illustration, 'media-rounded')}
    </div>
  </section>`;

  const first = services.slice(0, 3);
  const rest = services.slice(3);

  return `
<section class="page-hero" aria-labelledby="page-title">
  <div class="container">
    <p class="eyebrow eyebrow-light">Services</p>
    <h1 id="page-title">Commercial cabling, cameras, and network installation</h1>
    <p class="page-hero-lead">We install and organize the technology infrastructure behind Houston-area offices, retail spaces, and commercial properties. Each service below can be scoped on its own or combined into a single project.</p>
    <nav class="jump-links" aria-label="Services on this page">
      <ul>
        ${each(services, (s) => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`)}
      </ul>
    </nav>
  </div>
</section>

${first.map((s, i) => serviceSection(s, i)).join('')}

${ctaBand(ctx, {
  id: 'mid-cta',
  title: 'Not sure which services you need?',
  text: 'Many projects combine cabling, a rack, cameras, and wireless. Describe what you are trying to accomplish and we will help sort out the scope.',
  primary: cta.discuss,
  secondary: cta.siteWalk,
})}

${rest.map((s, i) => serviceSection(s, i + 3)).join('')}

<section class="section section-alt" aria-labelledby="pricing-title">
  <div class="container narrow center">
    ${sectionHead({
      title: 'Proposals based on your scope',
      id: 'pricing-title',
      align: 'center',
      lead: 'We do not publish prices because every space is different. Cable distances, ceiling types, equipment choices, and schedule all affect the work. After a site walk, you receive a written proposal for your specific project.',
    })}
    <div class="btn-row btn-row-center">
      ${button(cta.siteWalk.href, cta.siteWalk.label, 'primary', { size: 'lg' })}
      ${button(cta.discuss.href, cta.discuss.label, 'secondary', { size: 'lg' })}
    </div>
  </div>
</section>
`;
}
