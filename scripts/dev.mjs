#!/usr/bin/env node
/**
 * Local development server. No dependencies.
 *
 *   npm run dev   → http://localhost:4321
 *
 * - Rebuilds the site whenever a file in src/ changes (refresh the browser to see it).
 * - Unless FORM_ENDPOINT is set, the form posts to a local test endpoint
 *   (/__dev/contact) that exists ONLY in this dev server. It validates the
 *   request and replies like the real API, without sending any email.
 *   Include "#fail" in the project description to preview the error message.
 */
import http from 'node:http';
import { promises as fs, watch } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, '.dev-build');
const port = Number(process.env.PORT) || 4321;
const formEndpoint = process.env.FORM_ENDPOINT || '/__dev/contact';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

function rebuild() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(root, 'scripts/build.mjs'), '--out', outDir], {
      env: { ...process.env, FORM_ENDPOINT: formEndpoint },
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    child.on('exit', resolve);
  });
}

let timer;
watch(path.join(root, 'src'), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    console.log('\n↻ Change detected, rebuilding…');
    await rebuild();
  }, 150);
});

async function devContact(req, res) {
  let body = '';
  for await (const chunk of req) body += chunk;
  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return send(400, { ok: false, message: 'Invalid JSON' });
  }
  // Reuse the real backend validation so dev behaves like production.
  const { validate } = await import(path.join(root, 'backend/src/contact/validate.mjs'));
  const { errors, clean } = validate(data);
  await new Promise((r) => setTimeout(r, 700));
  if (Object.keys(errors).length) return send(400, { ok: false, errors });
  if (clean.description.includes('#fail')) return send(500, { ok: false, message: 'Simulated failure' });
  console.log('\n[dev] Form submission received (not emailed):', clean);
  return send(200, { ok: true });
}

await rebuild();

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname === '/__dev/contact' && req.method === 'POST') return devContact(req, res);
    let filePath = path.join(outDir, decodeURIComponent(url.pathname));
    if (!filePath.startsWith(outDir)) {
      res.writeHead(403);
      return res.end();
    }
    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      const data = await fs.readFile(path.join(outDir, '404.html')).catch(() => 'Not found');
      res.writeHead(404, { 'Content-Type': types['.html'] });
      res.end(data);
    }
  })
  .listen(port, () => {
    console.log(`\nSurveil Technologies site running at http://localhost:${port}`);
    console.log(`Form endpoint: ${formEndpoint}${process.env.FORM_ENDPOINT ? '' : ' (local test endpoint — no email is sent)'}`);
  });
