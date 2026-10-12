import { business, photos } from '../content/site.js';
import { esc } from '../components/util.js';
import { icon } from '../components/icons.js';
import { button, media, ctaBand, ctaLinks, sectionHead } from '../components/ui.js';

export const page = { slug: 'about', seoKey: 'about' };

export function render(ctx) {
  const cta = ctaLinks(ctx);
  const ownerPhoto = photos.owner?.src ? media(ctx, 'owner', null, 'media-portrait') : '';
  return `
<section class="page-hero" aria-labelledby="page-title">
  <div class="container">
    <p class="eyebrow eyebrow-light">About</p>
    <h1 id="page-title">A disabled veteran-owned installation partner for Houston-area businesses</h1>
    <p class="page-hero-lead">Surveil Technologies is a commercial cabling and security technology company based in ${esc(business.baseCity)}, Texas, serving businesses, contractors, and property managers across ${esc(business.serviceArea)}.</p>
  </div>
</section>

<section class="section" aria-labelledby="leader-title">
  <div class="container ${ownerPhoto ? 'split split-top' : 'narrow'}">
    ${ownerPhoto}
    <div class="prose">
      <p class="eyebrow">Leadership</p>
      <h2 id="leader-title">Meet ${esc(business.owner.name)}</h2>
      <p>Surveil Technologies is a disabled veteran-owned business led by ${esc(business.owner.name)}, a U.S. Navy veteran. His professional background is in information technology and cybersecurity, where the details of how systems are built and maintained matter.</p>
      <p>That background is the reason Surveil Technologies approaches cabling and camera work the way it does. The cable in the ceiling, the rack in the closet, and the cameras on the building are all part of the systems a business depends on. They should be installed with care, organized so they can be supported, and explained clearly to the people who own them.</p>
      <p>Surveil Technologies brings that approach to commercial projects in the Houston area.</p>
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="values-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'What you can expect',
      title: 'How we approach every project',
      id: 'values-title',
    })}
    <div class="values-grid">
      <div class="value">
        <span class="customer-icon">${icon('clipboard', { size: 26 })}</span>
        <h3>Plan before we pull cable</h3>
        <p>A site walk and a written proposal come first, so the scope is clear to everyone before work starts.</p>
      </div>
      <div class="value">
        <span class="customer-icon">${icon('check', { size: 26 })}</span>
        <h3>Leave it organized</h3>
        <p>Routed, labeled, and tested work that the next technician, tenant, or IT provider can follow.</p>
      </div>
      <div class="value">
        <span class="customer-icon">${icon('phone', { size: 26 })}</span>
        <h3>Communicate plainly</h3>
        <p>Straight answers about what is being installed, why, and what comes next, without unnecessary jargon.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="area-title">
  <div class="container narrow center">
    ${sectionHead({
      eyebrow: 'Service area',
      title: 'Based in League City, working across the Houston area',
      id: 'area-title',
      align: 'center',
      lead: 'We work with commercial customers in League City, Houston, and the surrounding metro area. If your project is in the region, get in touch and we will let you know whether it is a fit.',
    })}
  </div>
</section>

${ctaBand(ctx, {
  id: 'about-cta',
  title: 'Have a project in mind?',
  text: 'Tell us about your space and what you need installed. We will follow up to talk it through.',
  primary: cta.siteWalk,
  secondary: cta.discuss,
})}
`;
}
