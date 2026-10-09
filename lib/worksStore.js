const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const seed = require('../data/works.seed.json');
const { validateWorks } = require('./works');
const KEY = 'site:works:v1';
const CAS = `local raw = redis.call('GET', KEYS[1])
local revision = 0
if raw then revision = cjson.decode(raw).revision end
if revision ~= tonumber(ARGV[1]) then return 0 end
redis.call('SET', KEYS[1], ARGV[2])
return 1`;

function conflict() { const error = new Error('作品已在其他位置更新，请重新读取后再保存'); error.status = 409; return error; }
function checked(record) {
  if (!record || !Number.isSafeInteger(record.revision) || record.revision < 0) throw new Error('作品存储版本无效');
  const validation = validateWorks(record.works);
  if (validation.error) throw new Error('作品存储数据无效');
  return { revision: record.revision, works: validation.works };
}

async function recoverExitedWriter(lock) {
  // Serialize recovery so a second recovery cannot unlink a newly acquired lock.
  let recovery;
  const guard = `${lock}.recovery`;
  try { recovery = await fs.open(guard, 'wx'); }
  catch (error) { if (error.code === 'EEXIST') return; throw error; }
  try {
    let owner;
    try { owner = JSON.parse(await fs.readFile(lock, 'utf8')); }
    catch (error) { if (error.code === 'ENOENT' || error instanceof SyntaxError) return; throw error; }
    if (!Number.isInteger(owner.pid) || owner.pid <= 0) return;
    try { process.kill(owner.pid, 0); }
    catch (error) {
      if (error.code === 'ESRCH') await fs.unlink(lock).catch(e => { if(e.code !== 'ENOENT') throw e; });
    }
  } finally { await recovery.close(); await fs.unlink(guard); }
}

function createWorksStore({ file = path.join(process.cwd(), 'works-data.json'), redisUrl, redisToken, production = false } = {}) {
  async function redis(command) {
    const response = await fetch(redisUrl, { method: 'POST', headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('作品存储不可用');
    const payload = await response.json();
    if (payload.error) throw new Error('作品存储不可用');
    return payload.result;
  }
  const hasRedis = Boolean(redisUrl && redisToken);
  async function get() {
    if (hasRedis) {
      const raw = await redis(['GET', KEY]);
      return checked(raw === null ? { revision: 0, works: seed } : JSON.parse(raw));
    }
    if (production) throw new Error('生产环境尚未配置作品持久化存储');
    try { return checked(JSON.parse(await fs.readFile(file, 'utf8'))); }
    catch (error) { if (error.code === 'ENOENT') return checked({ revision: 0, works: seed }); throw error; }
  }
  async function save(revision, works) {
    if (!Number.isSafeInteger(revision) || revision < 0) throw new Error('作品版本无效');
    const record = checked({ revision: revision + 1, works });
    if (hasRedis) {
      if (await redis(['EVAL', CAS, 1, KEY, revision, JSON.stringify(record)]) !== 1) throw conflict();
      return record;
    }
    if (production) throw new Error('生产环境尚未配置作品持久化存储');
    // A file lock protects compare-and-swap across local Node processes.
    const lock = `${file}.lock`;
    const temp = `${file}.${crypto.randomUUID()}.tmp`;
    let handle;
    const deadline = Date.now() + 5000;
    while (!handle) {
      try { handle = await fs.open(lock, 'wx'); }
      catch (error) { if (error.code !== 'EEXIST' || Date.now() > deadline) throw error; await recoverExitedWriter(lock); await new Promise(resolve => setTimeout(resolve, 20)); }
    }
    try {
      await handle.writeFile(JSON.stringify({ pid: process.pid, token: crypto.randomUUID() }));
      const current = await get();
      if (current.revision !== revision) throw conflict();
      await fs.writeFile(temp, JSON.stringify(record, null, 2), 'utf8');
      await fs.rename(temp, file);
      return record;
    } finally {
      await handle.close();
      await fs.unlink(lock);
      await fs.unlink(temp).catch(error => { if (error.code !== 'ENOENT') throw error; });
    }
  }
  return { get, save };
}

module.exports = { createWorksStore, CAS, KEY };
