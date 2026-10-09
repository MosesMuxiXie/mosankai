const { validateCoverImage } = require('./siteSettings');
const CATEGORIES = ['minecraft', 'tools', 'research', 'story'];
const LINK_NAMES = ['source', 'docs', 'demo', 'download', 'read'];

function safeLink(value) {
  if (typeof value !== 'string' || value.length > 2048 || /[\s\\\u0000-\u001f]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return !value.split(/[?#]/)[0].split('/').includes('..');
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

function bilingual(value, max, required = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const result = {};
  for (const language of ['zh-CN', 'en']) {
    if (typeof value[language] !== 'string' || value[language].length > max) return null;
    result[language] = value[language].trim();
    if (required && !result[language]) return null;
  }
  return result;
}

function validateWorks(value) {
  const error = message => ({ error: message });
  if (!Array.isArray(value) || value.length > 100) return error('作品清单须为数组，最多 100 项');
  if (JSON.stringify(value).length > 2400000) return error('作品清单或封面总大小超过限制');
  const slugs = new Set();
  const works = [];
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return error('作品格式无效');
    const { slug, title, category, visible, featured } = item;
    if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80 || slugs.has(slug)) return error('作品地址须为唯一的小写字母、数字或连字符');
    if (typeof title !== 'string' || !title.trim() || title.length > 120) return error('作品名称需要 1–120 个字符');
    if (!CATEGORIES.includes(category)) return error('作品分类无效');
    if (typeof visible !== 'boolean' || typeof featured !== 'boolean') return error('显示与精选设置无效');
    const summary = bilingual(item.summary, 400, true);
    if (!summary) return error('请填写有效的中英文简介');
    const details = {};
    for (const name of ['problem', 'approach', 'outcome']) {
      details[name] = bilingual(item.details?.[name], 5000);
      if (!details[name]) return error('作品详情须提供中英文文本，每项最多 5000 字符');
    }
    if (!Array.isArray(item.tags) || item.tags.length > 10 || item.tags.some(tag => typeof tag !== 'string' || !tag.trim() || tag.length > 40)) return error('技术标签格式无效');
    if (!item.links || typeof item.links !== 'object' || Array.isArray(item.links)) return error('作品链接格式无效');
    const links = {};
    for (const name of LINK_NAMES) {
      const link = item.links[name];
      if (link === undefined || link === '') continue;
      if (!safeLink(link)) return error('链接须为安全的站内地址或 HTTPS 地址');
      links[name] = link;
    }
    const cover = item.cover;
    if (typeof cover !== 'string') return error('封面格式无效');
    if (cover) {
      if (cover.startsWith('data:')) {
        if (cover.length > 400000 || validateCoverImage(cover).error) return error('封面须为有效的 JPG、PNG 或 WebP 图片，处理后不超过 300 KB');
      } else if (!/^\/(?:gallery\/assets|img)\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(cover)) return error('封面须为本地上传图片或站内图片文件');
    }
    slugs.add(slug);
    works.push({ slug, title: title.trim(), category, visible, featured, summary, details, tags: [...new Set(item.tags.map(tag => tag.trim()))], links, cover });
  }
  return { works };
}

function publicWorks(works) { return works.filter(work => work.visible); }

function sameOrigin(req) {
  try {
    const origin = req.headers.origin;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const expected = new URL(`${protocol}://${req.headers.host}`).origin;
    return typeof origin === 'string' && origin !== 'null' && new URL(origin).origin === origin && origin === expected;
  } catch { return false; }
}

module.exports = { CATEGORIES, LINK_NAMES, validateWorks, publicWorks, sameOrigin };
