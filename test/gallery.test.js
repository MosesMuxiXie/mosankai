const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');

test('gallery routing and real HTTP admin workflow preserve privacy, edits and source boundaries', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mosankai-gallery-'));
  const reservation = net.createServer().listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: path.resolve(__dirname, '..'), windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port), FINDATIME_SKIP_ENV_FILE: 'true', NODE_ENV: 'test', VERCEL: '',
      WORKS_DATA_FILE: path.join(dir, 'works.json'), BLOG_ADMIN_DATA_FILE: path.join(dir, 'admin.json'),
      UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', KV_REST_API_URL: '', KV_REST_API_TOKEN: '' }
  });
  t.after(async () => { if (child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; } await fs.rm(dir, { recursive: true, force: true }); });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server startup timeout')), 15000);
    child.stdout.on('data', data => { if (data.toString().includes('Server running')) { clearTimeout(timer); resolve(); } });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited ${code}`)); });
  });
  const base = `http://127.0.0.1:${port}`;
  for (const asset of ['gallery.js','gallery.css','admin.js','admin.css']) {
    const response = await fetch(base + '/gallery/' + asset);
    assert.equal(response.status, 200);
    assert.doesNotMatch(response.headers.get('content-type'), /text\/html/, asset);
    assert.doesNotMatch(await response.text(), /<!DOCTYPE html>/, asset);
  }
  for (const route of ['/gallery', '/gallery/', '/gallery/crystallization', '/gallery/not-present']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), /gallery\.js/);
  }
  const publicResponse = await fetch(base + '/api/works');
  assert.equal(publicResponse.status, 200);
  const publicData = await publicResponse.json();
  assert.equal(publicData.works.length, 9);
  assert.equal(publicData.revision, undefined);
  assert.equal((await fetch(base + '/api/works?admin=1')).status, 401);
  assert.equal((await fetch(base + '/api/works', { method: 'PUT', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify({ revision: 0, works: [] }) })).status, 401);
  const login = await fetch(base + '/api/blogs/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'Admin', password: '123456' }) });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const headers = { Cookie: cookie, 'Content-Type': 'application/json', Origin: base };
  let record = await (await fetch(base + '/api/works?admin=1', { headers })).json();
  assert.equal(record.revision, 0);
  const hidden = { ...record.works[0], slug: 'tenth-work', title: '第十个作品', visible: false, featured: false, links: {} };
  const works = [...record.works, hidden];
  let response = await fetch(base + '/api/works', { method: 'PUT', headers: { ...headers, Origin: 'https://evil.test' }, body: JSON.stringify({ revision: 0, works }) });
  assert.equal(response.status, 403);
  response = await fetch(base + '/api/works', { method: 'PUT', headers, body: JSON.stringify({ revision: 0, works }) });
  assert.equal(response.status, 200);
  record = await response.json();
  assert.equal(record.revision, 1);
  assert.equal(record.works.length, 10);
  assert.equal((await (await fetch(base + '/api/works')).json()).works.length, 9);
  response = await fetch(base + '/api/works', { method: 'PUT', headers, body: JSON.stringify({ revision: 0, works: [] }) });
  assert.equal(response.status, 409);
  const changed = [ { ...hidden, visible: true }, ...record.works.filter(w => w.slug !== hidden.slug) ];
  response = await fetch(base + '/api/works', { method: 'PUT', headers, body: JSON.stringify({ revision: 1, works: changed }) });
  assert.equal(response.status, 200);
  assert.equal((await (await fetch(base + '/api/works')).json()).works[0].slug, 'tenth-work');
  response = await fetch(base + '/api/works', { method: 'PUT', headers, body: JSON.stringify({ revision: 2, works: [{ ...hidden, links: { demo: 'javascript:alert(1)' } }] }) });
  assert.equal(response.status, 400);
  assert.equal((await (await fetch(base + '/api/works?admin=1', { headers })).json()).revision, 2);
  assert.equal((await fetch(base + '/api/site-settings')).status, 200);
  const config = JSON.parse(await fs.readFile(path.resolve(__dirname, '../vercel.json'), 'utf8'));
  assert.equal(config.rewrites.find(r => r.source === '/api/works').destination, '/api/site-settings?section=works');
  assert.ok(config.functions['api/site-settings.js'].includeFiles.includes('works.seed.json'));
  assert.equal((await fs.readdir(path.resolve(__dirname, '../api'))).includes('works.js'), false);
});
