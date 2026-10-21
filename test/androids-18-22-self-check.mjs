import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const target=process.argv[2]||new URL('../public/studyguides/english/guides/androids-chapters-18-22.html',import.meta.url);
assert.ok(existsSync(target),'The Chapters 18–22 review must exist');
const html=readFileSync(target,'utf8');
const script=id=>html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'))?.[1];
const ctx=vm.createContext({});vm.runInContext(script('review-core'),ctx);const R=ctx.Review;
let passed=0;const plain=x=>JSON.parse(JSON.stringify(x));
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('96 questions cover five chapters with the specified balance',()=>{
 assert.equal(R.questions.length,96);
 for(const [type,counts] of [['mc',{detail:42,concept:6,analysis:12}],['short',{detail:6,concept:6,analysis:24}]])for(const [cat,count]of Object.entries(counts))assert.equal(R.questions.filter(q=>q.type===type&&q.category===cat).length,count,type+cat);
 for(let c=18;c<=22;c++){assert.equal(R.questions.filter(q=>q.owner===c&&q.type==='mc').length,12);assert.equal(R.questions.filter(q=>q.owner===c&&q.type==='short').length,c===22?8:7);}
});
test('analytical practice balances behavior, tone, thought and passage/recall',()=>{
 const a=R.questions.filter(q=>q.type==='short'&&q.category==='analysis');
 for(const focus of ['behavior','tone','thought'])assert.equal(a.filter(q=>q.focus===focus).length,8);
 for(const form of ['passage','recall'])assert.equal(a.filter(q=>q.form===form).length,12);
 assert.ok(a.filter(q=>q.form==='passage').every(q=>q.passage&&q.passageLabel==='Paraphrased scene cue — not a quotation'));
});
test('answers have unique IDs, valid evidence and complete option feedback',()=>{
 assert.equal(new Set(R.questions.map(q=>q.id)).size,96);const ids=new Set(R.scenes.map(s=>s.id));
 for(const q of R.questions){assert.ok(q.prompt&&q.explanation&&q.chapters.includes(q.owner),q.id);assert.ok(q.chapters.every(c=>c>=18&&c<=22));assert.ok(q.evidence.length&&q.evidence.every(id=>ids.has(id)),q.id);if(q.type==='mc'){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.equal(q.reasoning.length,4);assert.ok(q.reasoning.every(x=>x.length>15));}else{assert.ok(q.model&&q.checklist.length>=2&&q.mistake&&q.alternative,q.id);if(q.category==='analysis'){assert.ok(q.model.split(/\s+/).length>=40,q.id+' exam answer');assert.ok(q.explanation.split(/\s+/).length>=90,q.id+' detailed analysis');}}}
 assert.ok(R.questions.some(q=>q.chapters.length>1));
});
test('75 detail cards cover precise facts with source locators',()=>{
 assert.ok(R.details.length>=75);for(let c=18;c<=22;c++){const cards=R.details.filter(d=>d.chapter===c);assert.ok(cards.length>=15);for(const d of cards)assert.ok(d.prompt&&d.answer&&d.pitfall&&d.page&&R.scenes.some(s=>s.id===d.scene&&s.chapter===c));}
});
test('20 close readings cover all three focuses within every chapter',()=>{
 assert.ok(R.characterReadings.length>=20);for(let c=18;c<=22;c++){const list=R.characterReadings.filter(x=>x.chapter===c);assert.ok(list.length>=4);for(const f of ['behavior','tone','thought'])assert.ok(list.some(x=>x.focus===f));}
 for(const r of R.characterReadings)assert.ok(r.cue&&r.analysis&&r.limit&&R.scenes.some(s=>s.id===r.scene));
});
test('story and supporting material link to real scenes and themes',()=>{
 const ids=new Set(R.scenes.map(s=>s.id));assert.equal(ids.size,R.scenes.length);
 for(let c=18;c<=22;c++)assert.ok(R.scenes.filter(s=>s.chapter===c).length>=3);
 for(const s of R.scenes){assert.ok(s.chapter>=18&&s.chapter<=22);assert.ok(s.body&&s.cause&&s.effect&&s.focus&&s.page&&s.track);assert.ok(s.details.join(' ').split(/\s+/).length>=65,s.id);assert.ok(s.themes.every(id=>R.themes.some(t=>t.id===id)));}
 for(const t of R.themes)assert.ok(t.claim&&t.background&&t.explanation&&t.caution&&t.evidence.length>=2&&t.evidence.every(id=>ids.has(id)));
 assert.ok(R.context.length>=4&&R.glossary.length>=10&&R.synthesis.length>=4);assert.equal(R.themes.length,7);assert.equal(R.branches.length,8);
 for(const c of R.characters)assert.ok(c.role&&c.goal&&c.significance&&ids.has(c.scene));
 for(const b of R.branches)for(const [,id]of b.points)assert.ok(ids.has(id));
 const graph=R.storyFlow('all');assert.equal(graph.edges.length,R.scenes.length-1);for(let i=0;i<graph.edges.length;i++){assert.equal(graph.edges[i].from,R.scenes[i].id);assert.equal(graph.edges[i].to,R.scenes[i+1].id);}
});
test('short original fragments and predictions are bounded and sourced',()=>{
 assert.ok(R.quotations.length>=5);assert.ok(R.quotations.reduce((n,q)=>n+q.text.split(/\s+/).length,0)<=25);
 for(const q of R.quotations)assert.ok(q.speaker&&q.pdfPage&&q.context&&q.analysis&&q.limits&&R.scenes.some(s=>s.id===q.scene));
 assert.equal(R.predictions.length,12);assert.equal(new Set(R.predictions.map(p=>p.id)).size,12);for(const cat of ['detail','analysis'])assert.equal(R.predictions.filter(p=>R.questions.find(q=>q.id===p.id)?.category===cat).length,6);
 for(const p of R.predictions)assert.ok(p.reason&&p.slides&&R.sources.some(s=>s.id===p.source));
});
test('filters intersect and combined questions appear in each relevant chapter',()=>{
 assert.equal(R.selectQuestions({}).length,96);const list=R.selectQuestions({chapter:'22',type:'short',category:'analysis',focus:'tone'});assert.ok(list.length);assert.ok(list.every(q=>q.owner===22&&q.focus==='tone'));assert.equal(R.selectQuestions({category:'detail',focus:'tone'}).length,0);
 const cross=R.questions.find(q=>q.chapters.length>1);for(const c of cross.chapters)assert.ok(R.selectQuestions({chapter:String(c)}).some(q=>q.id===cross.id));
});
test('scores and retry exclude written answers and unassessed blanks',()=>{
 const [a,b]=R.questions.filter(q=>q.type==='mc'),s=R.questions.find(q=>q.type==='short');assert.deepEqual(plain(R.scoreMC([a.id,b.id,s.id],{[a.id]:a.answer})),{correct:1,incorrect:0,unanswered:1,total:2});assert.deepEqual(plain(R.incorrectIds([a.id,b.id],{[a.id]:(a.answer+1)%4})),[a.id]);
});
test('models remain hidden before assessment and edits invalidate feedback',()=>{
 const a=R.questions[0],s=R.questions.find(q=>q.type==='short');assert.equal(R.canReveal('test',[],[a.id],a.id),false);assert.equal(R.canReveal('test',[a.id],[],a.id),true);assert.equal(R.canReveal('practice',[],[a.id],a.id),true);
 const state=R.restoreState(JSON.stringify({version:1,answers:{[s.id]:'draft'},checked:[s.id],submitted:[s.id],assessed:{[s.id]:[true,true]}}));R.recordAnswer(state,s.id,'new');assert.ok(!state.checked.includes(s.id)&&!state.submitted.includes(s.id));assert.equal(state.assessed[s.id],undefined);
});
test('state restoration validates answers and preserves non-leading checklist selections',()=>{
 const a=R.questions[0],s=R.questions.find(q=>q.type==='short');assert.equal(Object.keys(R.restoreState('{').answers).length,0);assert.equal(Object.keys(R.restoreState(JSON.stringify({version:2,answers:{[a.id]:1}})).answers).length,0);const st=R.restoreState(JSON.stringify({version:1,answers:{[a.id]:9,unknown:1,[s.id]:'draft'},assessed:{[s.id]:[false,true]}}));assert.equal(st.answers[a.id],undefined);assert.equal(st.answers.unknown,undefined);assert.equal(st.answers[s.id],'draft');assert.equal(st.assessed[s.id][1],true);
});
test('browser scripts parse and local page has no external runtime resources',()=>{
 new vm.Script(script('review-ui'));assert.ok(!/<script[^>]+src="https?:|<link[^>]+(?:stylesheet|preload)/i.test(html));assert.ok(html.includes("dadoes-ch18-22-review-v1"));assert.ok(!/[\u4e00-\u9fff]/.test(html));
});
console.log(`${passed} checks passed.`);
