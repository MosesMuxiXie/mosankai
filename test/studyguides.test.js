const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const net = require('node:net');

const root = path.resolve(__dirname, '..');
const readCatalog = () => JSON.parse(fs.readFileSync(path.join(root, 'public/studyguides/catalog.json'), 'utf8'));

test('study catalog contains all 30 materials with valid files and original hashes', () => {
  const catalog = readCatalog();
  assert.deepEqual(catalog.subjects.map(subject => subject.id), ['statistics', 'neuroscience', 'english']);
  assert.equal(catalog.materials.length, 30);
  assert.equal(new Set(catalog.materials.map(item => item.id)).size, 30);
  assert.equal(new Set(catalog.materials.map(item => item.href)).size, 30);
  const totals = { statistics: [1, 7], neuroscience: [2, 8], english: [2, 10] };
  for (const [subject, [guides, sources]] of Object.entries(totals)) {
    assert.equal(catalog.materials.filter(item => item.subject === subject && item.kind === 'guide').length, guides);
    assert.equal(catalog.materials.filter(item => item.subject === subject && item.kind === 'source').length, sources);
  }
  for (const item of catalog.materials) {
    assert.ok(Object.hasOwn(totals, item.subject));
    assert.ok(['guide', 'source'].includes(item.kind));
    assert.ok(item.title.en && item.title['zh-CN'] && item.scope.en && item.scope['zh-CN']);
    assert.ok(item.href.startsWith(`/studyguides/${item.subject}/`));
    const file = path.resolve(root, 'public', '.' + decodeURIComponent(item.href));
    assert.ok(file.startsWith(path.join(root, 'public/studyguides') + path.sep));
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, item.bytes);
    if (item.kind === 'source') {
      assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), item.sha256);
    } else {
      const html = bytes.toString('utf8');
      assert.ok(html.includes('data-studyguide-return'));
      assert.ok(html.includes(`/studyguides/${item.subject}`));
      assert.ok(!/[CD]:[\\/]|file:\/\/\//.test(html), 'Published guides must not expose local source paths');
    }
  }
});

test('study routes, direct subject visits, downloads, and existing pages work locally', async t => {
  const reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, PORT: String(port), FINDATIME_SKIP_ENV_FILE: 'true' }
  });
  t.after(async () => {
    if (child.exitCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Site did not start')), 15000);
    child.stdout.on('data', data => {
      if (data.toString().includes('Server running')) { clearTimeout(timeout); resolve(); }
    });
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Site exited: ${code}`)); });
  });
  const base = `http://127.0.0.1:${port}`;
  for (const route of ['/studyguides', '/studyguides/', '/studyguides/statistics', '/studyguides/statistics/', '/studyguides/neuroscience', '/studyguides/english']) {
    const response = await fetch(base + route, { signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), /id="study-catalog"/);
  }
  assert.equal((await fetch(base + '/studyguides/unknown')).status, 404);
  for (const route of ['/', '/blog', '/findatime', '/admin']) {
    assert.equal((await fetch(base + route)).status, 200, route);
  }
  const catalog = readCatalog();
  for (const item of catalog.materials) {
    const response = await fetch(base + item.href, { method: 'HEAD' });
    assert.equal(response.status, 200, item.href);
    assert.equal(Number(response.headers.get('content-length')), item.bytes);
  }
  const pdf = catalog.materials.find(item => item.format === 'PDF');
  const response = await fetch(base + pdf.href, { headers: { Range: 'bytes=0-7' } });
  assert.equal(response.status, 206);
  assert.match(response.headers.get('content-type'), /application\/pdf/);
  assert.match(await response.text(), /^%PDF-/);
});
