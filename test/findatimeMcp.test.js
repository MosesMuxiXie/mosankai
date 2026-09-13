const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StreamableHTTPClientTransport } = require('@modelcontextprotocol/sdk/client/streamableHttp.js');

const meetingInput = {
  title: 'MCP scheduling', name: 'Alice', duration: 60, timezone: 'Asia/Shanghai',
  slots: ['2026-10-01T10:00:00+08:00', '2026-10-01T14:30:00+08:00']
};

async function startSite(t, extraEnv = {}, entrypoint = 'site') {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'findatime-mcp-'));
  const dataFile = path.join(directory, 'meetings.json');
  const reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const args = entrypoint === 'site' ? ['server.js'] : ['-e', `
    const app = require('express')();
    app.use(require('body-parser').json());
    app.all('/api/mcp', (req, res) => {
      req.query = { ...req.query, operation: 'mcp' };
      return require('./api/findatime/index')(req, res);
    });
    app.listen(process.env.PORT, '127.0.0.1', () => console.log('Server running'));
  `];
  const child = spawn(process.execPath, args, {
    cwd: path.resolve(__dirname, '..'), windowsHide: true,
    env: {
      ...process.env, PORT: String(port), NODE_ENV: 'production', FINDATIME_SKIP_ENV_FILE: 'true',
      UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '', KV_REST_API_URL: '', KV_REST_API_TOKEN: '',
      FINDATIME_DATA_FILE: dataFile, FINDATIME_MCP_PUBLIC_URL: 'https://mosankai.com',
      FINDATIME_MCP_ALLOWED_ORIGINS: 'https://client.example', ...extraEnv
    }, stdio: ['ignore', 'pipe', 'pipe']
  });
  let logs = '';
  child.stdout.on('data', chunk => { logs += chunk; });
  child.stderr.on('data', chunk => { logs += chunk; });
  t.after(async () => {
    if (child.exitCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
    // This exact directory was created by this test under os.tmpdir().
    fs.rmSync(directory, { recursive: true, force: true });
  });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Site did not start: ${logs}`)), 10000);
    child.stdout.on('data', () => {
      if (logs.includes('Server running')) { clearTimeout(timeout); resolve(); }
    });
    child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Site exited (${code}): ${logs}`)); });
    child.once('error', error => { clearTimeout(timeout); reject(error); });
  });
  const base = `http://127.0.0.1:${port}`;
  const client = new Client({ name: 'findatime-integration-test', version: '1.0.0' });
  t.after(() => client.close());
  await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/api/mcp`)));
  return { base, client, dataFile, logs: () => logs };
}

async function rest(base, route, body) {
  const response = await fetch(`${base}${route}`, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return { status: response.status, body: await response.json() };
}

async function call(client, name, args) {
  return client.callTool({ name: `findatime_${name}`, arguments: args });
}

function data(result) {
  assert.notEqual(result.isError, true, JSON.stringify(result.content));
  assert.equal(result.content[0].type, 'text');
  assert.ok(result.structuredContent);
  return result.structuredContent;
}

test('MCP exposes only scheduling tools and shares meetings with the web API', async t => {
  const site = await startSite(t);
  const listed = await site.client.listTools();
  assert.deepEqual(listed.tools.map(tool => tool.name).sort(), [
    'findatime_create_meeting', 'findatime_get_meeting', 'findatime_submit_availability'
  ]);
  const created = data(await call(site.client, 'create_meeting', meetingInput));
  assert.match(created.id, /^ua[a-f0-9]{14}$/);
  assert.equal(created.url, `https://mosankai.com/findatime/uuid/${created.id}`);
  assert.match(created.creatorToken, /^[A-Za-z0-9_-]{16,64}$/);
  const route = `/api/findatime/${created.id}`;
  const webRead = await rest(site.base, route);
  assert.equal(webRead.status, 200);
  assert.equal(webRead.body.slots[0].start, '2026-10-01T02:00:00.000Z');
  assert.equal(webRead.body.slots[0].votes, 1);

  const joined = data(await call(site.client, 'submit_availability', {
    id: created.id, name: 'Bob', availability: ['t1']
  }));
  assert.equal(joined.meeting.participantCount, 2);
  assert.equal(joined.meeting.slots[0].votes, 2);
  const updated = data(await call(site.client, 'submit_availability', {
    id: created.id, name: 'Bob', availability: ['t2'], participantToken: joined.participantToken
  }));
  assert.equal(updated.participantToken, joined.participantToken);
  assert.equal(updated.meeting.participantCount, 2);
  assert.deepEqual(updated.meeting.slots.map(slot => slot.votes), [1, 2]);
  const declined = data(await call(site.client, 'submit_availability', {
    id: created.id, name: 'Bob', unavailable: true, participantToken: joined.participantToken
  }));
  assert.equal(declined.meeting.participantCount, 2);
  assert.deepEqual(declined.meeting.unavailable, { count: 1, attendees: ['Bob'] });
  const queried = data(await call(site.client, 'get_meeting', { id: created.id }));
  assert.deepEqual(queried, (await rest(site.base, route)).body);
  assert.ok(!JSON.stringify(queried).includes('Token'));
  assert.ok(!JSON.stringify(queried).includes(created.creatorToken));
  assert.ok(!JSON.stringify(queried).includes(joined.participantToken));
  assert.ok(!site.logs().includes(created.creatorToken));
  assert.ok(!site.logs().includes(joined.participantToken));

  const webCreated = await rest(site.base, '/api/findatime', meetingInput);
  assert.equal(webCreated.status, 201);
  assert.equal(webCreated.body.url, `/findatime/uuid/${webCreated.body.id}`);
  const webUpdated = data(await call(site.client, 'submit_availability', {
    id: webCreated.body.id, name: 'Alice', availability: ['t2'], participantToken: webCreated.body.creatorToken
  }));
  assert.equal(webUpdated.meeting.participantCount, 1);
  assert.deepEqual(webUpdated.meeting.slots.map(slot => slot.votes), [0, 1]);
  assert.deepEqual(data(await call(site.client, 'get_meeting', { id: webCreated.body.id })), webUpdated.meeting);
});

test('MCP rejects invalid scheduling input without writing data', async t => {
  const { client, dataFile } = await startSite(t);
  for (const input of [
    { ...meetingInput, title: ' ' }, { ...meetingInput, name: ' ' },
    { ...meetingInput, duration: 45 }, { ...meetingInput, timezone: 'Invalid/Zone' },
    { ...meetingInput, timezone: undefined }, { ...meetingInput, slots: [] },
    { ...meetingInput, slots: ['2026-10-01T10:00:00'] },
    { ...meetingInput, slots: ['not-a-date'] }
  ]) {
    assert.equal((await call(client, 'create_meeting', input)).isError, true);
  }
  assert.equal(fs.existsSync(dataFile), false);
  const created = data(await call(client, 'create_meeting', meetingInput));
  const before = fs.readFileSync(dataFile, 'utf8');
  for (const input of [
    { id: created.id, name: 'Bob', availability: [] },
    { id: created.id, name: 'Bob', availability: ['t99'] },
    { id: created.id, name: '', availability: ['t1'] },
    { id: created.id, name: 'Bob', availability: ['t1'], participantToken: 'bad' },
    { id: 'ua00000000000000', name: 'Bob', availability: ['t1'] }
  ]) {
    assert.equal((await call(client, 'submit_availability', input)).isError, true);
  }
  for (const id of ['bad', 'ua00000000000000']) {
    assert.equal((await call(client, 'get_meeting', { id })).isError, true);
  }
  assert.equal(fs.readFileSync(dataFile, 'utf8'), before);
});

test('MCP validates origins, uses JSON without sessions, and handles protocol errors', async t => {
  const { base } = await startSite(t);
  const rpc = (body, headers = {}) => fetch(`${base}/api/mcp`, {
    method: 'POST', headers: {
      'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...headers
    }, body: JSON.stringify(body)
  });
  const list = { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} };
  for (const origin of [undefined, 'https://mosankai.com', 'https://client.example']) {
    const response = await rpc(list, origin ? { Origin: origin } : {});
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/json/);
    assert.equal(response.headers.get('mcp-session-id'), null);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.json()).result.tools.length, 3);
    if (origin) assert.equal(response.headers.get('access-control-allow-origin'), origin);
  }
  for (const origin of ['https://evil.example', 'https://mosankai.com.evil.example', 'null', 'http://localhost:3000']) {
    assert.equal((await rpc(list, { Origin: origin })).status, 403);
  }
  const preflight = await fetch(`${base}/api/mcp`, {
    method: 'OPTIONS', headers: { Origin: 'https://client.example', 'Access-Control-Request-Method': 'POST' }
  });
  assert.equal(preflight.status, 204);
  assert.match(preflight.headers.get('access-control-allow-headers'), /mcp-protocol-version/i);
  for (const method of ['GET', 'DELETE']) {
    assert.equal((await fetch(`${base}/api/mcp`, { method })).status, 405);
  }
  const unknownMethod = await rpc({ ...list, method: 'does/not/exist' });
  assert.equal((await unknownMethod.json()).error.code, -32601);
  const unknownTool = await rpc({ ...list, method: 'tools/call', params: { name: 'admin_dashboard', arguments: {} } });
  const unknown = await unknownTool.json();
  assert.ok(unknown.error || unknown.result?.isError);
  const malformed = await rpc({ hello: 'world' });
  assert.equal(malformed.status, 400);
  assert.ok((await malformed.json()).error);
  const invalidJson = await fetch(`${base}/api/mcp`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken'
  });
  assert.equal(invalidJson.status, 400);
  assert.equal((await invalidJson.json()).error.code, -32700);
  const forgedHost = await rpc({ ...list, method: 'tools/call', params: {
    name: 'findatime_create_meeting', arguments: meetingInput
  } }, { Host: 'attacker.example', 'X-Forwarded-Host': 'attacker.example' });
  assert.match((await forgedHost.json()).result.structuredContent.url, /^https:\/\/mosankai\.com\//);
});

test('standalone serverless entrypoint accepts a pre-parsed body across independent requests', async t => {
  const { client } = await startSite(t, {}, 'serverless');
  const created = data(await call(client, 'create_meeting', meetingInput));
  const queried = data(await call(client, 'get_meeting', { id: created.id }));
  assert.equal(queried.title, 'MCP scheduling');
  assert.equal(queried.slots[0].votes, 1);
});

test('MCP returns a safe tool error on storage failure', async t => {
  const { client, dataFile, logs } = await startSite(t);
  // An existing directory cannot be replaced by the store's JSON file write.
  fs.mkdirSync(dataFile);
  const result = await call(client, 'create_meeting', meetingInput);
  assert.equal(result.isError, true);
  assert.equal(result.structuredContent.code, 'storageError');
  assert.ok(!JSON.stringify(result).includes(dataFile));
  assert.ok(!logs().includes(dataFile));
});

test('development origins and a configured public URL are supported', async t => {
  const { base, client } = await startSite(t, {
    NODE_ENV: 'development', FINDATIME_MCP_PUBLIC_URL: 'https://schedule.example'
  });
  const response = await fetch(`${base}/api/mcp`, {
    method: 'OPTIONS', headers: { Origin: 'http://localhost:4567' }
  });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:4567');
  const created = data(await call(client, 'create_meeting', meetingInput));
  assert.equal(created.url, `https://schedule.example/findatime/uuid/${created.id}`);
});
