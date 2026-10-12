import { business, services, customerTypes } from '../content/site.js';
import { esc, each } from '../components/util.js';
import { icon } from '../components/icons.js';
import { button, sectionHead, media, serviceCard, processList, contactDetails, ctaLinks } from '../components/ui.js';

export const page = { slug: '', seoKey: 'home' };

const customerIcons = ['hardhat', 'keys', 'building', 'store'];

export function render(ctx) {
  const cta = ctaLinks(ctx);
  return `
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="hero-badge">${icon('flag', { size: 16 })}Disabled veteran-owned · ${esc(business.baseCity)}, Texas</p>
      <h1 id="hero-title">Commercial Cabling &amp; Security Solutions for Houston Businesses</h1>
      <p class="hero-lead">We install structured network cabling, network racks, security cameras, and wireless networks for offices, retail spaces, and commercial construction projects across the Houston area. We work with business owners, property managers, and contractors who want organized installations and clear communication from the first conversation to handoff.</p>
      <div class="btn-row">
        ${button(cta.siteWalk.href, cta.siteWalk.label, 'primary', { size: 'lg' })}
        ${button(cta.discuss.href, cta.discuss.label, 'outline-light', { size: 'lg' })}
      </div>
    </div>
    <div class="hero-media">
      ${media(ctx, 'hero', 'rack', 'media-hero', { eager: true })}
    </div>
  </div>
</section>

<section class="facts" aria-label="At a glance">
  <div class="container facts-grid">
    <p><strong>Disabled veteran-owned</strong><span>Led by a U.S. Navy veteran</span></p>
    <p><strong>Commercial focus</strong><span>Offices, retail, and construction projects</span></p>
    <p><strong>Local</strong><span>Based in League City, serving the Houston metro</span></p>
  </div>
</section>

<section class="section" aria-labelledby="services-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'What we install',
      title: 'Technology infrastructure your business runs on every day',
      id: 'services-title',
      lead: 'From the cable in the walls to the cameras on the building, we install the systems that keep your team connected and your property covered.',
    })}
    <div class="card-grid">
      ${each(services, (s) => serviceCard(ctx, s))}
    </div>
    <div class="section-foot">
      ${button(ctx.link('services'), 'View all services', 'secondary', { iconName: 'arrow' })}
    </div>
  </div>
</section>

<section class="section section-alt" aria-labelledby="customers-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Who we work with',
      title: 'Built for commercial projects',
      id: 'customers-title',
      lead: 'We focus on commercial spaces and the people responsible for them.',
    })}
    <ul class="customer-grid">
      ${each(
        customerTypes,
        (c, i) => `<li class="customer-card">
          <span class="customer-icon">${icon(customerIcons[i] || 'building', { size: 26 })}</span>
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.text)}</p>
        </li>`,
      )}
    </ul>
    <p class="inline-cta">Working on a new build or tenant improvement? <a href="${ctx.link('builders')}">See how we support contractors and property managers</a>.</p>
  </div>
</section>

<section class="section" aria-labelledby="approach-title">
  <div class="container split">
    <div>
      ${sectionHead({
        eyebrow: 'How we work',
        title: 'Organized work. Clear communication.',
        id: 'approach-title',
      })}
      <div class="principles">
        <div class="principle">
          <h3>Neat, labeled installations</h3>
          <p>Cables are routed, dressed, and labeled so the next person who opens the ceiling or the network closet can understand what they are looking at.</p>
        </div>
        <div class="principle">
          <h3>You know what is happening</h3>
          <p>You get a written proposal before work begins and plain-language answers to your questions along the way.</p>
        </div>
        <div class="principle">
          <h3>Planned around your operations</h3>
          <p>We plan installation work with your schedule in mind, so your business or your construction project can keep moving.</p>
        </div>
      </div>
    </div>
    ${media(ctx, 'cabling', 'cabling', 'media-rounded')}
  </div>
</section>

<section class="section section-navy" aria-labelledby="veteran-title">
  <div class="container veteran">
    <div class="veteran-mark" aria-hidden="true">${icon('flag', { size: 40 })}</div>
    <div>
      <p class="eyebrow eyebrow-light">Disabled veteran-owned business</p>
      <h2 id="veteran-title">Led by a Navy veteran with an IT and cybersecurity background</h2>
      <p>Surveil Technologies is a disabled veteran-owned business, owned and led by ${esc(business.owner.name)}, a U.S. Navy veteran whose professional background is in information technology and cybersecurity. That experience shapes how we approach every installation: plan it carefully, do it right, and leave it organized for the people who depend on it.</p>
      ${button(ctx.link('about'), 'About Surveil Technologies', 'outline-light', { iconName: 'arrow' })}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="process-title">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Our process',
      title: 'A simple path from first call to finished install',
      id: 'process-title',
      lead: 'Every project is scoped individually. There is no published price list; your proposal is based on what we see on the site walk and what you need installed.',
    })}
    ${processList()}
    <div class="section-foot">
      ${button(cta.siteWalk.href, cta.siteWalk.label, 'primary')}
    </div>
  </div>
</section>

<section class="section section-alt" id="contact" aria-labelledby="contact-title">
  <div class="container contact-home">
    <div>
      ${sectionHead({
        eyebrow: 'Contact',
        title: 'Let’s talk about your space',
        id: 'contact-title',
        lead: 'Tell us what you are planning. We will follow up to talk through the details and, if it makes sense, schedule a site walk.',
      })}
      <div class="btn-row">
        ${button(cta.siteWalk.href, cta.siteWalk.label, 'primary', { size: 'lg' })}
        ${button(cta.discuss.href, cta.discuss.label, 'secondary', { size: 'lg' })}
      </div>
    </div>
    <div class="contact-card">
      <h3>Reach us directly</h3>
      ${contactDetails()}
    </div>
  </div>
</section>
`;
}
