import { button, ctaLinks } from '../components/ui.js';

export const page = { slug: '404', seoKey: 'notFound', noindex: true, file: '404.html' };

export function render(ctx) {
  const cta = ctaLinks(ctx);
  return `
<section class="section">
  <div class="container narrow center">
    <p class="eyebrow">Page not found</p>
    <h1>We could not find that page</h1>
    <p class="lead">The link may be out of date, or the page may have moved.</p>
    <div class="btn-row btn-row-center">
      ${button(ctx.link(''), 'Go to the home page', 'primary')}
      ${button(cta.siteWalk.href, cta.siteWalk.label, 'secondary')}
    </div>
  </div>
</section>
`;
}
