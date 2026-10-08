const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../public/studyguides/english/guides');
const map = fs.readFileSync(path.join(root, 'ap-literature-map.html'), 'utf8');
const review = fs.readFileSync(path.join(root, 'ap-literature-review.html'), 'utf8');
const embedded = review.match(/<iframe[^>]*\bsrcdoc="([\s\S]*?)"><\/iframe>/)[1]
  .replace(/&(?:quot|#x27|#39|lt|gt|amp);/g, entity => ({
    '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>', '&amp;': '&'
  })[entity]);

function runTheme(html, { search = '', saved = null, blocked = false } = {}) {
  const attributes = {};
  const button = { setAttribute() {}, addEventListener(name, handler) { this[name] = handler; } };
  const label = {};
  const media = { matches: false, addEventListener(name, handler) { this[name] = handler; } };
  const storage = {
    getItem() { if (blocked) throw new Error('Storage blocked'); return saved; },
    setItem(key, value) { if (blocked) throw new Error('Storage blocked'); saved = value; }
  };
  const context = vm.createContext({
    URLSearchParams, localStorage: storage, Archify: {}, viewerText: key => key,
    window: { location: { search }, matchMedia: () => media },
    document: {
      documentElement: {
        setAttribute: (key, value) => { attributes[key] = value; },
        getAttribute: key => attributes[key]
      },
      getElementById: id => id === 'btn-theme' ? button : label
    }
  });
  const firstPaint = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  vm.runInContext(firstPaint, context);
  const initial = attributes['data-theme'];
  const runtime = html.match(/Archify\.theme = \(function \(\) \{[\s\S]*?\n    \}\)\(\);/)[0];
  vm.runInContext(runtime, context);
  return { initial, attributes, button, media, storage };
}

for (const [name, html] of [['standalone', map], ['embedded', embedded]]) {
  test(`${name} map defaults to dusk light and preserves explicit theme preferences`, () => {
    for (const options of [{}, { saved: 'invalid' }, { blocked: true }]) {
      const result = runTheme(html, options);
      assert.equal(result.initial, 'light', 'First paint must use dusk light even on a dark OS');
      assert.equal(result.attributes['data-theme'], 'light');
      result.media.change({ matches: false });
      assert.equal(result.attributes['data-theme'], 'light');
    }
    for (const saved of ['light', 'dark']) {
      const result = runTheme(html, { saved });
      assert.equal(result.initial, saved);
      assert.equal(result.attributes['data-theme'], saved);
      result.media.change({ matches: false });
      assert.equal(result.attributes['data-theme'], saved);
    }
    const overridden = runTheme(html, { search: '?theme=light', saved: 'dark' });
    assert.equal(overridden.initial, 'light');
    assert.equal(overridden.attributes['data-theme'], 'light');
    const toggled = runTheme(html);
    toggled.button.click();
    assert.equal(toggled.attributes['data-theme'], 'dark');
    assert.equal(toggled.storage.getItem(), 'dark');
    const dark = runTheme(html, { search: '?theme=dark', saved: 'light' });
    assert.equal(dark.initial, 'dark');
    assert.equal(dark.attributes['data-theme'], 'dark');
  });
}
