const test = require('node:test');
const assert = require('node:assert/strict');
const language = () => require('../public/studyguides/neuroscience/guides/neuro46-en.js');

test('paired review text keeps both languages readable and escapes authored text', () => {
  const html = language().pair('电流 < 0', 'Current < 0; "inward" & positive charge.');
  assert.equal(html, '<span lang="zh-CN">电流 &lt; 0</span><span class="translation" lang="en">Current &lt; 0; &quot;inward&quot; &amp; positive charge.</span>');
  assert.equal(language().pair('Na⁺ & K⁺'), 'Na⁺ &amp; K⁺');
});
