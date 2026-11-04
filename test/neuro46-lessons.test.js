const test=require('node:test');
const assert=require('node:assert/strict');
const data=require('../public/studyguides/neuroscience/guides/neuro46-data');
const lessonAPI=()=>require('../public/studyguides/neuroscience/guides/neuro46-lessons');

test('every existing topic renders a bilingual beginner path and ungraded understanding check',()=>{
 const api=lessonAPI();
 assert.equal(api.foundations.length,6);
 assert.deepEqual(Object.keys(api.lessons).sort(),data.topics.map(t=>t.id).sort());
 for(const topic of data.topics){
  const lesson=api.lessons[topic.id];
  for(const pair of [lesson.summary,lesson.why,...lesson.terms.flat(),...lesson.steps.flat(),...lesson.example,lesson.check.prompt,lesson.check.answer])assert.ok(pair.zh&&pair.en,topic.id);
  const html=api.renderLesson(topic.id);
  assert.ok(html.includes('lang="zh-CN"')&&html.includes('lang="en"'));
  assert.ok(html.includes('<ol')&&html.includes('<dl'));
  assert.ok(html.includes('<details class="lesson-check-answer">'));
  assert.ok(!/<input|<textarea|data-question-id|data-qid|data-rubric/.test(html),'understanding checks must not enter assessed answers');
  assert.ok(!html.includes('undefined'));
 }
 assert.equal(api.renderLesson('unknown'), '');
});

test('lesson renderer escapes both languages and exposes understanding answers only in print output',()=>{
 const api=lessonAPI(),original=api.lessons['c4-t1'].check;
 try{
  api.lessons['c4-t1'].check={prompt:{zh:'<img src=x onerror=alert(1)>',en:'A & B'},answer:{zh:'电流 < 0',en:'Current < 0'}};
  const html=api.renderLesson('c4-t1');
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(html.includes('A &amp; B')&&!html.includes('<img'));
  assert.ok(html.includes('<details class="lesson-check-answer">'));
  assert.ok(api.renderLesson('c4-t1',{print:true}).includes('<details class="lesson-check-answer" open>'));
 }finally{api.lessons['c4-t1'].check=original;}
});
test('printing expands every foundation while ordinary reading starts with one open unit',()=>{
 const api=lessonAPI(),normal=api.renderFoundations(),printed=api.renderFoundations({print:true});
 assert.equal((normal.match(/<details class="foundation-unit"[^>]* open>/g)||[]).length,1);
 assert.equal((printed.match(/<details class="foundation-unit"[^>]* open>/g)||[]).length,6);
 assert.ok(!/<input|<textarea|data-question-id/.test(printed));
 assert.equal(api.renderMapSummary('unknown'),'');
});
