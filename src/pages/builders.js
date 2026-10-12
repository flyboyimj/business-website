import { esc, each } from '../components/util.js';
import { icon } from '../components/icons.js';
import { button, media, checkList, ctaBand, ctaLinks, sectionHead } from '../components/ui.js';

export const page = { slug: 'builders', seoKey: 'builders' };

const projectTypes = [
  {
    title: 'New construction',
    text: 'Network cabling, rack locations, camera and access point locations planned early, with rough-in timed before walls and ceilings close.',
  },
  {
    title: 'Tenant improvements',
    text: 'Cabling and technology for suites being prepared for a new tenant, coordinated with the rest of the build-out.',
  },
  {
    title: 'Retail spaces & strip centers',
    text: 'Point-of-sale and back-office connections, cameras at entrances and registers, and wireless for storefronts and multi-tenant centers.',
  },
  {
    title: 'Office build-outs',
    text: 'Drops for workstations, conference rooms, printers, and access points, terminated into an organized rack or network closet.',
  },
];

const coordination = [
  { title: 'Review the scope', text: 'We look at the drawings, device locations, and scope documents you have and ask questions early.' },
  { title: 'Walk the site', text: 'We see conditions in person and confirm routing, rack location, and anything that affects the schedule.' },
  { title: 'Rough-in on schedule', text: 'Cable is pulled at the right stage of construction, with coordination through your superintendent or project manager.' },
  { title: 'Trim-out and termination', text: 'Devices, jacks, patch panels, cameras, and access points are installed after finishes are in place.' },
  { title: 'Label and test', text: 'Every run is labeled and tested before handoff.' },
  { title: 'Clean closeout', text: 'We walk the owner or tenant through what was installed and how it is organized.' },
];

export function render(ctx) {
  const cta = ctaLinks(ctx);
  const discussHref = `${ctx.link('contact')}?request=project&amp;service=buildouts#request-form`;
  return `
<section class="page-hero" aria-labelledby="page-title">
  <div class="container page-hero-split">
    <div>
      <p class="eyebrow eyebrow-light">Builders &amp; Commercial Projects</p>
      <h1 id="page-title">A technology installer that fits your project schedule</h1>
      <p class="page-hero-lead">For general contractors, builders, and property managers in the Houston area, Surveil Technologies handles network cabling, racks, cameras, and wireless installation on commercial projects, and keeps you informed about what is being done and when.</p>
      <div class="btn-row">
        ${button(discussHref, 'Discuss Scope & Schedule', 'primary', { size: 'lg' })}
        ${button(cta.siteWalk.href, cta.siteWalk.label, 'outline-light', { size: 'lg' })}
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="audience-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Who this is for',
      title: 'Working with contractors and property teams',
      id: 'audience-title',
    })}
    <div class="audience-grid">
      <article class="audience-card">
        <span class="customer-icon">${icon('hardhat', { size: 26 })}</span>
        <h3>General contractors &amp; builders</h3>
        <p>You need a technology subcontractor who shows up when scheduled, coordinates with the other trades, communicates with your superintendent, and does not leave loose ends at closeout. We plan our work around your schedule and keep you updated on progress.</p>
        <p class="small-note">For builders, we can also discuss cabling on residential projects under a builder contract.</p>
      </article>
      <article class="audience-card">
        <span class="customer-icon">${icon('keys', { size: 26 })}</span>
        <h3>Property managers</h3>
        <p>Between tenants, suites often need cabling updated, cameras adjusted, or a network closet cleaned up. We can help prepare spaces for new tenants and keep shared infrastructure organized so the next change is easier.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="types-title">
  <div class="container split">
    <div>
      ${sectionHead({
        eyebrow: 'Project types',
        title: 'Commercial projects we support',
        id: 'types-title',
      })}
      <div class="type-list">
        ${each(
          projectTypes,
          (t) => `<div class="type-item">
            <h3>${esc(t.title)}</h3>
            <p>${esc(t.text)}</p>
          </div>`,
        )}
      </div>
    </div>
    ${media(ctx, 'buildouts', 'floorplan', 'media-rounded media-sticky')}
  </div>
</section>

<section class="section" aria-labelledby="coord-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Coordination',
      title: 'How we fit into your project',
      id: 'coord-title',
      lead: 'Technology work touches framing, ceilings, electrical, and finishes. We coordinate so that cabling and devices go in at the right time.',
    })}
    <ol class="coord-grid">
      ${each(
        coordination,
        (c, i) => `<li class="coord-step">
          <span class="process-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.text)}</p>
        </li>`,
      )}
    </ol>
  </div>
</section>

<section class="section section-alt" aria-labelledby="bring-title">
  <div class="container split split-top">
    <div>
      ${sectionHead({
        eyebrow: 'Getting started',
        title: 'What helps us give you an accurate proposal',
        id: 'bring-title',
      })}
      <p>You do not need everything below to start a conversation, but the more we know about the project, the more accurate the proposal will be.</p>
    </div>
    <div>
      ${checkList([
        'Drawings or a floor plan showing device and drop locations, if available',
        'The project schedule and key milestones',
        'Your point of contact on site',
        'Equipment the owner or tenant is providing, if any',
        'Access requirements or working-hour restrictions',
      ])}
    </div>
  </div>
</section>

${ctaBand(ctx, {
  id: 'builders-cta',
  title: 'Let’s talk about scope, schedule, and coordination',
  text: 'Send us the project details and we will follow up to discuss what you need and when.',
  primary: { href: discussHref, label: 'Discuss Your Project' },
  secondary: cta.siteWalk,
})}
`;
}
