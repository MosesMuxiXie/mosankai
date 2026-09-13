const { createMeeting, MeetingError } = require('../../lib/findatimeService');
const { recordVisit } = require('../../lib/findatimeAdminStore');

function sendError(res, status, error, code) {
  return res.status(status).json({ error, ...(code ? { code } : {}) });
}

async function handleVisit(req, res) {
  try {
    const visitorId = String(req.body?.visitorId || '');
    const recorded = await recordVisit(visitorId);
    if (!recorded) return sendError(res, 400, '无效的访客标识');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return sendError(res, 500, '暂时无法记录访问');
  }
}

module.exports = async function handler(req, res) {
  // Keep the public MCP URL on the existing function to stay within deployment function limits.
  if (String(req.query?.operation || '') === 'mcp') return require('../../lib/findatimeMcpHttp')(req, res);
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed');
  if (String(req.query?.operation || '') === 'visit') return handleVisit(req, res);

  try {
    return res.status(201).json(await createMeeting(req.body || {}));
  } catch (error) {
    if (error instanceof MeetingError) return sendError(res, error.status, error.message, error.code);
    console.error(error);
    return sendError(res, 500, '暂时无法创建约会，请稍后重试');
  }
};
