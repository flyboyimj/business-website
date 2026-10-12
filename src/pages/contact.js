import { contactForm } from '../components/contactForm.js';
import { contactDetails } from '../components/ui.js';
import { processSteps } from '../content/site.js';
import { esc, each } from '../components/util.js';

export const page = { slug: 'contact', seoKey: 'contact' };

export function render(ctx) {
  return `
<section class="page-hero page-hero-compact" aria-labelledby="page-title">
  <div class="container">
    <p class="eyebrow eyebrow-light">Contact</p>
    <h1 id="page-title" data-request-heading>Request a Site Walk</h1>
    <p class="page-hero-lead">Tell us about your space and what you need installed. We will review the details and follow up to discuss your project and, if it makes sense, schedule a time to walk the site.</p>
  </div>
</section>

<section class="section section-form">
  <div class="container contact-layout">
    <div class="form-panel">
      ${contactForm(ctx)}
    </div>
    <aside class="contact-aside" aria-labelledby="aside-title">
      <div class="contact-card">
        <h2 id="aside-title">Prefer to reach out directly?</h2>
        ${contactDetails()}
      </div>
      <div class="contact-card contact-card-plain">
        <h2>What happens next</h2>
        <ol class="mini-process">
          ${each(processSteps, (s) => `<li><strong>${esc(s.title)}</strong><span>${esc(s.text)}</span></li>`)}
        </ol>
      </div>
    </aside>
  </div>
</section>
`;
}
