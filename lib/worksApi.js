const { requireAdmin } = require('./blogAdminAuth');
const { createWorksStore } = require('./worksStore');
const { validateWorks, publicWorks, sameOrigin } = require('./works');
const store = createWorksStore({
  file: process.env.WORKS_DATA_FILE,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  production: process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL)
});

module.exports = async function worksHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    if (req.method === 'GET') {
      const admin = req.query.admin === '1';
      if (admin && !(await requireAdmin(req, res))) return;
      const record = await store.get();
      return res.status(200).json(admin ? record : { works: publicWorks(record.works) });
    }
    if (req.method === 'PUT') {
      if (!(await requireAdmin(req, res))) return;
      if (!sameOrigin(req)) return res.status(403).json({ error: '请从本站后台保存作品' });
      if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return res.status(415).json({ error: '请使用 JSON 格式提交作品' });
      const { revision, works } = req.body || {};
      if (!Number.isSafeInteger(revision) || revision < 0) return res.status(400).json({ error: '作品版本无效' });
      const validation = validateWorks(works);
      if (validation.error) return res.status(400).json({ error: validation.error });
      return res.status(200).json(await store.save(revision, validation.works));
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Works request failed:', error.message);
    return res.status(error.status || 503).json({ error: error.status === 409 ? error.message : '作品服务暂时不可用，请稍后重试' });
  }
};
