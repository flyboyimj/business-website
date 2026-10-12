/**
 * Validation shared by the Lambda function and the local dev server.
 * Mirrors the checks in the browser, which can be bypassed, so the
 * server never trusts the front end.
 */

const LIMITS = {
  name: 100,
  company: 150,
  email: 200,
  phone: 30,
  location: 150,
  service: 100,
  timeline: 100,
  description: 4000,
  requestType: 50,
};

const oneLine = (v) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim();

export function validate(input) {
  const data = input && typeof input === 'object' ? input : {};
  const clean = {};
  for (const key of Object.keys(LIMITS)) {
    const raw = key === 'description' ? String(data[key] ?? '').trim() : oneLine(data[key]);
    clean[key] = raw.slice(0, LIMITS[key]);
  }

  const errors = {};
  if (!clean.name) errors.name = 'Enter your name.';
  if (!clean.company) errors.company = 'Enter your company.';
  if (!clean.email) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) errors.email = 'Enter a valid email address.';
  if (clean.phone && clean.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a phone number with area code, or leave this blank.';
  if (!clean.location) errors.location = 'Enter your project location.';
  if (!clean.service) errors.service = 'Select the service you need.';
  if (!clean.timeline) errors.timeline = 'Select a project timeline.';
  if (!clean.description) errors.description = 'Describe your project.';
  else if (clean.description.length < 20) errors.description = 'Add a little more detail (at least 20 characters).';

  for (const [key, max] of Object.entries(LIMITS)) {
    if (String(data[key] ?? '').length > max && !errors[key]) errors[key] = `Please shorten this to ${max} characters or fewer.`;
  }

  if (!clean.requestType) clean.requestType = 'Site walk request';
  return { errors, clean };
}
