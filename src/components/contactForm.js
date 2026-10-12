/**
 * Contact / site walk request form.
 *
 * The form posts JSON to the endpoint set by the FORM_ENDPOINT environment
 * variable at build time (see README). The endpoint is a public URL, not a
 * secret. No keys or credentials ever go in the front end.
 */
import { business, services, form } from '../content/site.js';
import { esc, each } from './util.js';

function field({ id, label, required = true, hint, input }) {
  const hintId = hint ? `${id}-hint` : '';
  return `<div class="field" data-field="${id}">
    <label for="${id}">${esc(label)} ${required ? '<span class="req" aria-hidden="true">*</span>' : '<span class="optional">(optional)</span>'}</label>
    ${hint ? `<p class="field-hint" id="${hintId}">${esc(hint)}</p>` : ''}
    ${input(hintId)}
    <p class="field-error" id="${id}-error" hidden></p>
  </div>`;
}

const describedBy = (id, hintId) => `aria-describedby="${[hintId, `${id}-error`].filter(Boolean).join(' ')}"`;

export function contactForm(ctx) {
  const serviceOptions = [
    ...services.map((s) => ({ value: s.title, id: s.id })),
    ...form.extraServiceOptions.map((v) => ({ value: v })),
  ];
  const contactAttrs = [
    business.email ? `data-contact-email="${esc(business.email)}"` : '',
    business.phone ? `data-contact-phone="${esc(business.phone.display)}" data-contact-tel="${esc(business.phone.tel)}"` : '',
  ].join(' ');

  return `<form class="request-form" id="request-form" novalidate data-endpoint="${esc(ctx.formEndpoint || '')}" ${contactAttrs} aria-labelledby="form-title">
  <h2 id="form-title" class="form-title">Tell us about your project</h2>
  <p class="form-intro">Fields marked <span class="req" aria-hidden="true">*</span><span class="visually-hidden">with an asterisk</span> are required.</p>

  <div class="form-summary" id="form-summary" tabindex="-1" hidden>
    <h3>Please correct the following:</h3>
    <ul></ul>
  </div>

  <input type="hidden" name="requestType" id="requestType" value="Site walk request">

  <div class="field-grid">
    ${field({
      id: 'name',
      label: 'Name',
      input: (h) => `<input id="name" name="name" type="text" autocomplete="name" required maxlength="100" ${describedBy('name', h)}>`,
    })}
    ${field({
      id: 'company',
      label: 'Company',
      input: (h) => `<input id="company" name="company" type="text" autocomplete="organization" required maxlength="150" ${describedBy('company', h)}>`,
    })}
    ${field({
      id: 'email',
      label: 'Email',
      input: (h) => `<input id="email" name="email" type="email" autocomplete="email" required maxlength="200" ${describedBy('email', h)}>`,
    })}
    ${field({
      id: 'phone',
      label: 'Phone',
      required: false,
      input: (h) => `<input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="30" ${describedBy('phone', h)}>`,
    })}
  </div>

  ${field({
    id: 'location',
    label: 'Project location',
    hint: 'City or general area is fine, for example “League City” or “Houston Galleria area.”',
    input: (h) => `<input id="location" name="location" type="text" required maxlength="150" ${describedBy('location', h)}>`,
  })}

  <div class="field-grid">
    ${field({
      id: 'service',
      label: 'Service needed',
      input: (h) => `<select id="service" name="service" required ${describedBy('service', h)}>
        <option value="">Select a service</option>
        ${each(serviceOptions, (o) => `<option${o.id ? ` data-id="${o.id}"` : ''}>${esc(o.value)}</option>`)}
      </select>`,
    })}
    ${field({
      id: 'timeline',
      label: 'Project timeline',
      input: (h) => `<select id="timeline" name="timeline" required ${describedBy('timeline', h)}>
        <option value="">Select a timeline</option>
        ${each(form.timelineOptions, (o) => `<option>${esc(o)}</option>`)}
      </select>`,
    })}
  </div>

  ${field({
    id: 'description',
    label: 'Project description',
    hint: 'What needs to be installed, the type and size of the space, and anything we should know about scheduling or access.',
    input: (h) => `<textarea id="description" name="description" rows="6" required minlength="20" maxlength="4000" ${describedBy('description', h)}></textarea>`,
  })}

  <!-- Spam trap: hidden from people and assistive technology. Leave empty. -->
  <div class="hp" aria-hidden="true">
    <label for="website">Leave this field empty</label>
    <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
  </div>

  <p class="privacy-note">We use the information you submit only to respond to your inquiry and discuss your project.</p>

  <div class="form-actions">
    <button class="btn btn-primary btn-lg" type="submit">
      <span class="btn-label">Send Request</span>
    </button>
  </div>

  <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
</form>

<div class="form-success" id="form-success" tabindex="-1" hidden>
  <h2>Thank you. Your request was received.</h2>
  <p>We will review your project details and follow up using the contact information you provided.</p>
  <p><a class="text-link" href="${ctx.link('')}">Return to the home page</a></p>
</div>`;
}
