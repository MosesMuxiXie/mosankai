import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const path = fileURLToPath(new URL('../public/studyguides/english/guides/androids-chapters-10-12.html', import.meta.url));
assert.ok(existsSync(path), 'The self-contained review page must exist');
const html = readFileSync(path, 'utf8');
const core = html.match(/<script id="review-core">([\s\S]*?)<\/script>/)?.[1];
assert.ok(core, 'The review must expose its embedded content and logic');
const context = vm.createContext({});
vm.runInContext(core, context);
const R = context.Review;
assert.ok(R, 'Review content and logic must load without a browser');
let passed = 0;
function test(name, run) { run(); passed++; console.log(`PASS ${name}`); }
const plain = value => JSON.parse(JSON.stringify(value));

test('36 questions with the agreed type/category distribution', () => {
  assert.equal(R.questions.length, 36);
  for (const [type, expected] of [['mc', {detail:10, concept:6, analysis:8}], ['short', {detail:4, concept:4, analysis:4}]]) {
    for (const [category, count] of Object.entries(expected)) {
      assert.equal(R.questions.filter(q=>q.type===type && q.category===category).length, count);
    }
  }
});
test('unique IDs, complete answers, and valid chapter evidence', () => {
  const ids = R.questions.map(q=>q.id);
  assert.equal(new Set(ids).size, 36);
  const scenes = new Map(R.scenes.map(s=>[s.id,s]));
  for (const q of R.questions) {
    assert.ok(q.prompt && q.explanation && q.chapters.length && q.evidence.length, q.id);
    assert.ok(q.chapters.every(c=>[10,11,12].includes(c)), q.id);
    assert.ok(q.evidence.every(id=>scenes.has(id)), q.id);
    if(q.type==='mc') {
      assert.equal(q.options.length,4,q.id);
      assert.equal(new Set(q.options).size,4,q.id);
      assert.ok(Number.isInteger(q.answer) && q.answer>=0 && q.answer<4,q.id);
      assert.equal(q.reasoning.length,4,q.id);
      assert.ok(q.reasoning.every(Boolean),q.id);
    } else {
      assert.ok(q.model && q.checklist.length>=2,q.id);
    }
  }
  for(const c of [10,11,12]) {
    assert.ok(R.questions.some(q=>q.type==='mc'&&q.chapters.includes(c)));
    assert.ok(R.questions.some(q=>q.type==='short'&&q.chapters.includes(c)));
  }
  assert.ok(R.questions.some(q=>q.chapters.length>1));
});
test('eight predictions reuse bank questions and explain classroom evidence', () => {
  assert.equal(R.predictions.length,8);
  assert.equal(new Set(R.predictions.map(p=>p.id)).size,8);
  for(const p of R.predictions) {
    assert.ok(R.questions.some(q=>q.id===p.id));
    assert.ok(['Higher Priority','Secondary Priority'].includes(p.priority));
    assert.ok(p.reason && p.source && p.slides);
    assert.ok(R.sources.some(s=>s.id===p.source));
  }
});
test('filters include applicable combined questions', () => {
  assert.equal(R.selectQuestions({chapter:'all',category:'all',type:'all'}).length,36);
  const filtered = R.selectQuestions({chapter:'11',category:'analysis',type:'mc'});
  assert.ok(filtered.length>0);
  assert.ok(filtered.every(q=>q.chapters.includes(11)&&q.category==='analysis'&&q.type==='mc'));
  assert.equal(R.selectQuestions({chapter:'99',category:'all',type:'all'}).length,0);
});
test('scores separate correct, incorrect, unanswered, and short answers', () => {
  const a=R.questions.find(q=>q.type==='mc'), b=R.questions.filter(q=>q.type==='mc')[1];
  const s=R.questions.find(q=>q.type==='short');
  const result=R.scoreMC([a.id,b.id,s.id],{[a.id]:a.answer});
  assert.deepEqual(plain(result),{correct:1,incorrect:0,unanswered:1,total:2});
  const wrong=R.scoreMC([a.id],{[a.id]:(a.answer+1)%4});
  assert.equal(wrong.incorrect,1);
  assert.equal(R.scoreMC([s.id],{}).total,0);
});
test('test answers stay hidden until their own submission', () => {
  assert.equal(R.canReveal('test',[],['m01'],'m01'),false);
  assert.equal(R.canReveal('test',['m01'],[],'m01'),true);
  assert.equal(R.canReveal('test',['m01'],['m02'],'m02'),false);
  assert.equal(R.canReveal('practice',[],['m01'],'m01'),true);
  assert.equal(R.canReveal('practice',[],[],'m01'),false);
});
test('retry selects only incorrect submitted multiple-choice answers', () => {
  const mc=R.questions.filter(q=>q.type==='mc');
  const answers={[mc[0].id]:mc[0].answer,[mc[1].id]:(mc[1].answer+1)%4};
  assert.deepEqual(plain(R.incorrectIds([mc[0].id,mc[1].id,mc[2].id,'s01'],answers)),[mc[1].id]);
});
test('saved state accepts valid answers and rejects invalid or corrupt data', () => {
  const good=R.restoreState(JSON.stringify({version:1,answers:{m01:0,s01:'A response'},checked:['m01'],submitted:['s01'],assessed:{s01:[true,false]}}));
  assert.equal(good.answers.m01,0);
  assert.equal(good.answers.s01,'A response');
  assert.equal(R.restoreState('{broken').answers.m01,undefined);
  const bad=R.restoreState(JSON.stringify({version:1,answers:{m01:12,m02:'wrong',s01:7,unknown:'bad'},checked:['bad'],submitted:['m01','unknown']}));
  assert.equal(Object.keys(bad.answers).length,0);
  assert.equal(bad.checked.length,0);
  assert.deepEqual(plain(bad.submitted),['m01']);
  assert.equal(Object.keys(R.restoreState(JSON.stringify({version:999,answers:{m01:0}})).answers).length,0);
});
test('chapter details preserve disputed claims and the two-stage shooting', () => {
  assert.ok(R.scenes.find(s=>s.id==='11:claim').status==='Claim, not proof');
  assert.ok(R.scenes.find(s=>s.id==='12:result').body.includes('human'));
  const death=R.scenes.find(s=>s.id==='12:death').body;
  assert.ok(death.includes('Resch')&&death.includes('wounds')&&death.includes('Deckard')&&death.includes('kills'));
});
test('website copy has six English sections and only same-origin learning assets', () => {
  assert.match(html,/<html[^>]*\blang="en"/);
  for(const section of ['story','map','types','quiz','templates','predictions']) assert.ok(html.includes(`id="${section}"`),section);
  assert.ok(!/<(?:script|link)[^>]+(?:src|href)=["']https?:|@import|fetch\(/i.test(html));
  assert.ok(!/[\u4e00-\u9fff]/u.test(html));
  assert.ok(html.includes('prefers-reduced-motion'));
});
test('embedded browser interface has valid JavaScript syntax', () => {
  const ui=html.match(/<script id="review-ui">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(ui);
  new vm.Script(ui);
});
test('editing either answer format invalidates earlier submission and self-assessment', () => {
  assert.equal(typeof R.recordAnswer,'function','Answer editing must explicitly invalidate old review state');
  const saved=R.restoreState(JSON.stringify({version:1,answers:{m01:0,s01:'First draft'},checked:['m01','s01'],submitted:['m01','s01','m02'],assessed:{s01:[true,true,true]}}));
  R.recordAnswer(saved,'m01',1);
  assert.equal(saved.answers.m01,1);
  assert.equal(R.canReveal('test',saved.submitted,saved.checked,'m01'),false);
  assert.equal(R.canReveal('practice',saved.submitted,saved.checked,'m01'),false);
  assert.ok(saved.submitted.includes('m02'),'Unrelated submitted questions stay submitted');
  R.recordAnswer(saved,'s01','Revised draft');
  assert.equal(saved.answers.s01,'Revised draft');
  assert.equal(R.canReveal('test',saved.submitted,saved.checked,'s01'),false);
  assert.equal(saved.assessed.s01,undefined);
});
test('story flow connects all twelve events in order and preserves chapter views', () => {
  assert.equal(typeof R.storyFlow,'function','The storyline must expose its connected event graph');
  const all=R.storyFlow('all');
  assert.equal(all.nodes.length,12);
  assert.equal(all.edges.length,11);
  assert.deepEqual(plain(all.nodes.map(s=>s.id)),plain(R.scenes.map(s=>s.id)));
  for(let i=0;i<11;i++){
    assert.equal(all.edges[i].from,R.scenes[i].id);
    assert.equal(all.edges[i].to,R.scenes[i+1].id);
    assert.ok(all.edges[i].label);
  }
  for(const [chapter,count] of [[10,4],[11,3],[12,5]]){
    const flow=R.storyFlow(chapter);
    assert.equal(flow.nodes.length,count);
    assert.equal(flow.edges.length,count-1);
    assert.ok(flow.nodes.every(s=>s.chapter===chapter));
  }
});
console.log(`\n${passed} checks passed. Content: 24 multiple-choice + 12 short-answer questions.`);
