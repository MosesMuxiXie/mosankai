const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { validateWorks, publicWorks, sameOrigin } = require('../lib/works');
const { createWorksStore } = require('../lib/worksStore');
const seed = require('../data/works.seed.json');

test('nine real projects have valid bilingual content and three default featured works', () => {
  assert.equal(seed.length, 9);
  assert.equal(validateWorks(seed).error, undefined);
  assert.deepEqual(seed.filter(w => w.featured).map(w => w.slug), ['crystallization', 'netease-world-converter', 'operation-sigrdrifa']);
  assert.equal(new Set(seed.map(w => w.links.source)).size, 9);
});

test('rejects duplicate slugs, unsafe URLs, invalid categories, malformed images and booleans', () => {
  assert.ok(validateWorks([seed[0], seed[0]]).error);
  for (const change of [
    { slug: '../admin' }, { category: 'other' }, { visible: 'false' },
    { cover: 'data:image/png;base64,SGVsbG8=' }, { cover: '//evil.test/a.png' },
    { cover: '/gallery/assets/../admin.png' },
    { links: { source: 'javascript:alert(1)' } },
    { links: { demo: '//evil.test' } }, { links: { demo: '/\\evil.test' } },
    { links: { source: 'https://user:password@example.com/' } },
    { summary: { 'zh-CN': '介绍', en: '' } }
  ]) assert.ok(validateWorks([{ ...seed[0], ...change }]).error, JSON.stringify(change));
  assert.equal(validateWorks([{ ...seed[0], cover: '', links: {} }]).error, undefined);
});

test('public catalogue removes hidden works and source requests are bound to the same origin', () => {
  assert.deepEqual(publicWorks([{ ...seed[0], visible: false }, seed[1]]), [seed[1]]);
  const req = origin => ({ headers: { host: 'localhost:3000', origin }, protocol: 'http' });
  assert.equal(sameOrigin(req('http://localhost:3000')), true);
  for (const origin of ['https://evil.test', 'null', undefined, 'http://localhost:3001']) assert.equal(sameOrigin(req(origin)), false);
});

test('atomic local saves reject concurrent/stale writes and preserve an empty saved catalogue', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mosankai-works-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const store = createWorksStore({ file: path.join(dir, 'works.json') });
  assert.equal((await store.get()).works.length, 9);
  const saves = await Promise.allSettled([store.save(0, [seed[0]]), store.save(0, [seed[1]])]);
  assert.equal(saves.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(saves.find(r => r.status === 'rejected').reason.status, 409);
  const record = await store.get();
  assert.equal(record.revision, 1);
  assert.equal(record.works.length, 1);
  await assert.rejects(store.save(0, []), { status: 409 });
  await store.save(1, []);
  assert.deepEqual(await store.get(), { revision: 2, works: [] });
  assert.deepEqual(await createWorksStore({ file: path.join(dir, 'works.json') }).get(), { revision: 2, works: [] });
});

test('storage corruption and production without Redis never silently replace stored works', async t => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mosankai-works-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'works.json');
  await fs.writeFile(file, 'broken');
  await assert.rejects(createWorksStore({ file }).get());
  await assert.rejects(createWorksStore({ file, production: true }).save(0, seed));
  assert.equal(await fs.readFile(file, 'utf8'), 'broken');
});

test('local saves recover a lock left by an exited writer without replacing an active owner', async t => {
  const { spawn } = require('node:child_process');
  const { once } = require('node:events');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'mosankai-works-lock-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'works.json');
  const child = spawn(process.execPath, ['-e', ''], { windowsHide: true });
  await once(child, 'exit');
  await fs.writeFile(file + '.lock', JSON.stringify({ pid: child.pid, token: 'exited-writer' }));
  const store = createWorksStore({ file });
  await store.save(0, [seed[0]]);
  assert.equal((await store.get()).revision, 1);
  assert.equal((await fs.readdir(dir)).some(name => name.endsWith('.lock')), false);
});
