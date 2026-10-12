/**
 * Contact form handler logic (no AWS SDK import, so it can be unit tested).
 * Wired to Amazon SES in index.mjs.
 *
 * AWS Lambda (Node.js 22) behind an API Gateway HTTP API.
 *
 * Receives the JSON form submission, validates it, and emails it to the business
 * through Amazon SES. Returns { ok: true } ONLY after SES accepts the message.
 *
 * Configuration comes from environment variables set by template.yaml.
 * No credentials live in this code: the function uses its IAM role.
 *   TO_EMAIL         Where inquiries are delivered
 *   FROM_EMAIL       SES-verified sender address (e.g. website@yourdomain.com)
 *   ALLOWED_ORIGINS  Comma-separated site origins allowed to post
 */
import { validate } from './validate.mjs';

const MAX_BODY_BYTES = 20_000;

function response(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

export function formatEmail(c) {
  const subject = `${c.requestType}: ${c.company} (${c.name})`.slice(0, 200);
  const text = [
    `New ${c.requestType.toLowerCase()} from the website`,
    '',
    `Name:              ${c.name}`,
    `Company:           ${c.company}`,
    `Email:             ${c.email}`,
    `Phone:             ${c.phone || '(not provided)'}`,
    `Project location:  ${c.location}`,
    `Service needed:    ${c.service}`,
    `Project timeline:  ${c.timeline}`,
    '',
    'Project description:',
    c.description,
    '',
    '—',
    'Reply to this email to respond directly to the sender.',
  ].join('\n');
  return { subject, text };
}

export function createHandler({ send, env = process.env } = {}) {
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);

  return async function handler(event) {
    const method = event?.requestContext?.http?.method || event?.httpMethod;
    if (method && method !== 'POST') return response(405, { ok: false, message: 'Method not allowed' });

    const headers = Object.fromEntries(Object.entries(event?.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
    const origin = (headers.origin || '').replace(/\/$/, '');
    if (allowed.length && !allowed.includes(origin)) {
      return response(403, { ok: false, message: 'Origin not allowed' });
    }

    let raw = event?.body || '';
    if (event?.isBase64Encoded) raw = Buffer.from(raw, 'base64').toString('utf8');
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return response(413, { ok: false, message: 'Request too large' });

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return response(400, { ok: false, message: 'Invalid request' });
    }

    // Spam trap: real visitors never see or fill the "website" field.
    // Bots get a generic response and nothing is sent.
    if (data && typeof data.website === 'string' && data.website.trim() !== '') {
      console.info('Honeypot triggered; submission discarded.');
      return response(200, { ok: true });
    }

    const { errors, clean } = validate(data);
    if (Object.keys(errors).length) return response(400, { ok: false, errors });

    if (!env.TO_EMAIL || !env.FROM_EMAIL) {
      console.error('TO_EMAIL or FROM_EMAIL is not configured.');
      return response(500, { ok: false, message: 'Form is not configured' });
    }

    const { subject, text } = formatEmail(clean);
    try {
      await send({
        FromEmailAddress: env.FROM_EMAIL,
        Destination: { ToAddresses: env.TO_EMAIL.split(',').map((s) => s.trim()) },
        ReplyToAddresses: [clean.email],
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: { Text: { Data: text, Charset: 'UTF-8' } },
          },
        },
      });
    } catch (err) {
      console.error('SES send failed:', err?.name, err?.message);
      return response(502, { ok: false, message: 'Message could not be delivered' });
    }

    return response(200, { ok: true });
  };
}
