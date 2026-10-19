const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const file = path.resolve(__dirname, '../public/studyguides/english/guides/kochai-phantom-pain-essay-toolkit.html');
const html = () => fs.readFileSync(file, 'utf8');
const plain = value => value.replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ');

test('the published toolkit supplies two reading parts and eight complete whole-story models', () => {
  const source = html();
  assert.equal((source.match(/<h2\b/g) || []).length, 2);
  const models = [...source.matchAll(/<div class="model-text"[^>]*>([\s\S]*?)<\/div>/g)];
  assert.equal(models.length, 8);
  for (const [i, model] of models.entries()) {
    const words = plain(model[1]).match(/\b[\w]+(?:['’-][\w]+)*\b/g) || [];
    assert.ok(words.length >= 650 && words.length <= 850, `Model ${i + 1}: ${words.length} words`);
    assert.ok((model[1].match(/<p\b/g) || []).length >= 5);
    const scenes = [...model[1].matchAll(/data-scenes="([^"]+)"/g)].flatMap(m => m[1].split(' '));
    assert.ok(new Set(scenes).size >= 3, `Model ${i + 1} must develop evidence across the story`);
    for (const role of ['thesis', 'evidence', 'commentary', 'complexity']) {
      assert.ok(model[1].includes(`data-role="${role}"`), `Model ${i + 1}: ${role}`);
    }
  }
  assert.ok((source.match(/class="evidence-card"/g) || []).length >= 24);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'Deep links must be unique');
  for (const match of source.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Broken link ${match[1]}`);
  assert.ok(!/[CD]:[\\/]|file:\/\/\//.test(source), 'No private machine paths in published content');
});

test('evidence search combines the selected theme with a case-insensitive text query', () => {
  const script = html().match(/<script id="toolkit-core">([\s\S]*?)<\/script>/)[1];
  const context = vm.createContext({});
  vm.runInContext(script, context);
  const records = [
    { text: 'Soil and the father’s damaged body', topics: ['bodies', 'family'] },
    { text: 'A gentle father at the bedroom door', topics: ['family'] },
    { text: 'The cave reflects the player', topics: ['ending'] }
  ];
  const filter = (query, theme) => Array.from(context.Toolkit.filterEvidence(records, query, theme), r => r.text);
  assert.deepEqual(filter(' FATHER ', 'all'), ['Soil and the father’s damaged body', 'A gentle father at the bedroom door']);
  assert.deepEqual(filter('father', 'bodies'), ['Soil and the father’s damaged body']);
  assert.deepEqual(filter('father', 'ending'), []);
  assert.equal(filter('', 'all').length, 3);
  assert.deepEqual(filter('BODY', 'all'), ['Soil and the father’s damaged body']);
});

test('the study center can discover and resume the new guide without changing assessment records', () => {
  const catalog = require('../public/studyguides/catalog.json');
  const entry = catalog.materials.find(m => m.id === 'literature-kochai-phantom-pain');
  assert.ok(entry, 'The guide must be listed in the study center');
  assert.equal(entry.subject, 'english');
  const {createStore} = require('../public/studyguides/study-progress');
  const data = new Map();
  const storage = {getItem: k => data.get(k) || null, setItem: (k,v) => data.set(k,v)};
  const store = createStore({catalog, storage});
  store.save(entry.id, {favorite: true, pending: {material: true}, resume: {hash: '#essay-08'}});
  const reopened = createStore({catalog, storage}).read(entry.id);
  assert.equal(reopened.favorite, true);
  assert.equal(reopened.pending.material, true);
  assert.equal(reopened.resume.hash, '#essay-08');
  assert.deepEqual(reopened.progress.results, {});
});
