const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const parseJson = require('body-parser').json({ limit: '3mb', strict: false });
const { createMcpServer } = require('./findatimeMcp');

function rpcError(res, status, code, message) {
  return res.status(status).json({ jsonrpc: '2.0', error: { code, message }, id: null });
}

function publicOrigin() {
  const url = new URL(process.env.FINDATIME_MCP_PUBLIC_URL || 'https://mosankai.com');
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Invalid MCP public URL configuration');
  }
  return url.origin;
}

function allowedOrigin(origin, siteOrigin) {
  if (origin === undefined) return true;
  if (typeof origin !== 'string' || !origin || origin === 'null') return false;
  const allowed = new Set([siteOrigin, ...(process.env.FINDATIME_MCP_ALLOWED_ORIGINS || '')
    .split(',').map(value => value.trim()).filter(Boolean)]);
  if (allowed.has(origin)) return true;
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) return false;
  try {
    const url = new URL(origin);
    return url.origin === origin && ['http:', 'https:'].includes(url.protocol)
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');
  let server;
  try {
    const siteOrigin = publicOrigin();
    const origin = req.headers.origin;
    if (!allowedOrigin(origin, siteOrigin)) return rpcError(res, 403, -32000, 'Origin not allowed');
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return rpcError(res, 405, -32000, 'Method not allowed');
    }
    // Vercel supplies req.body; the local route runs before the site's global parser.
    if (req.body === undefined) {
      try {
        await new Promise((resolve, reject) => parseJson(req, res, error => error ? reject(error) : resolve()));
      } catch (error) {
        return rpcError(res, error.status === 413 ? 413 : 400, -32700,
          error.status === 413 ? 'Request body too large' : 'Invalid JSON body');
      }
    }
    server = createMcpServer(siteOrigin);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch {
    if (!res.headersSent) return rpcError(res, 500, -32603, 'Internal server error');
  } finally {
    if (server) await server.close();
  }
};
