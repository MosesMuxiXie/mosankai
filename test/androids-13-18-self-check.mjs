import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const target=process.argv[2]||new URL('../public/studyguides/english/guides/androids-chapters-13-18.html',import.meta.url);
assert.ok(existsSync(target),'The new Chapters 13–18 review must exist');
const html=readFileSync(target,'utf8');
const script=id=>html.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'))?.[1];
const ctx=vm.createContext({});vm.runInContext(script('review-core'),ctx);const R=ctx.Review;
let passed=0;const plain=x=>JSON.parse(JSON.stringify(x));
function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('96 questions with the approved distribution',()=>{
 assert.equal(R.questions.length,96);
 for(const [type,counts] of [['mc',{detail:42,concept:6,analysis:12}],['short',{detail:6,concept:6,analysis:24}]])for(const [cat,count]of Object.entries(counts))assert.equal(R.questions.filter(q=>q.type===type&&q.category===cat).length,count,type+cat);
 for(let c=13;c<=18;c++){assert.equal(R.questions.filter(q=>q.owner===c&&q.type==='mc').length,10);assert.equal(R.questions.filter(q=>q.owner===c&&q.type==='short').length,6);}
});
test('analysis balances focus and passage/recall forms',()=>{
 const a=R.questions.filter(q=>q.type==='short'&&q.category==='analysis');
 for(const focus of ['behavior','tone','thought'])assert.equal(a.filter(q=>q.focus===focus).length,8);
 for(const form of ['passage','recall'])assert.equal(a.filter(q=>q.form===form).length,12);
 assert.ok(a.filter(q=>q.form==='passage').every(q=>q.passage&&q.passageLabel==='Paraphrased scene cue — not a quotation'));
});
test('every answer has a valid source scene and complete feedback',()=>{
 assert.equal(new Set(R.questions.map(q=>q.id)).size,96);
 const ids=new Set(R.scenes.map(s=>s.id));
 for(const q of R.questions){assert.ok(q.prompt&&q.explanation&&q.chapters.includes(q.owner));assert.ok(q.chapters.every(c=>c>=13&&c<=18));assert.ok(q.evidence.length&&q.evidence.every(id=>ids.has(id)));if(q.type==='mc'){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.equal(q.reasoning.length,4);assert.ok(q.reasoning.every(x=>x.length>15));}else{assert.ok(q.model.split(/\s+/).length>=30,q.id);assert.ok(q.checklist.length>=3);assert.ok(q.mistake&&q.alternative);}}
 assert.ok(R.questions.some(q=>q.chapters.length>1));
});
test('at least 12 sourced detail cards per chapter',()=>{
 for(let c=13;c<=18;c++){const cards=R.details.filter(d=>d.chapter===c);assert.ok(cards.length>=12);for(const d of cards)assert.ok(d.prompt&&d.answer&&d.pitfall&&d.page&&R.scenes.some(s=>s.id===d.scene));}
});
test('story graph covers six chapters with source locations and substantial explanations',()=>{
 for(const s of R.scenes){assert.ok(s.chapter>=13&&s.chapter<=18);assert.ok(s.body&&s.cause&&s.effect&&s.focus&&s.page&&s.track);assert.ok(s.details.join(' ').split(/\s+/).length>=65,s.id);assert.ok(s.themes.every(id=>R.themes.some(t=>t.id===id)));}
 const graph=R.storyFlow('all');assert.equal(graph.edges.length,R.scenes.length-1);
 for(let i=0;i<graph.edges.length;i++){assert.equal(graph.edges[i].from,R.scenes[i].id);assert.equal(graph.edges[i].to,R.scenes[i+1].id);assert.ok(graph.edges[i].label);}
 for(let c=13;c<=18;c++){const g=R.storyFlow(c);assert.ok(g.nodes.length>=3);assert.equal(g.edges.length,g.nodes.length-1);}
});
test('earlier context, characters, glossary and seven themes support first-time readers',()=>{
 assert.ok(R.context.length>=4);assert.ok(R.glossary.length>=10);assert.equal(R.themes.length,7);assert.equal(R.branches.length,8);
 for(const name of ['Rick Deckard','Rachael Rosen','John Isidore','Pris Stratton','Roy Baty','Irmgard Baty','Iran Deckard','Wilbur Mercer','Buster Friendly'])assert.ok(R.characters.some(c=>c.name===name&&c.goal&&c.significance));
 for(const t of R.themes)assert.ok(t.claim&&t.background&&t.explanation&&t.caution&&t.evidence.length>=2);
 assert.ok(R.synthesis.length>=4);assert.ok(R.characterReadings.length>=12);
 for(const c of R.characterReadings)assert.ok(c.cue&&c.analysis&&c.limit&&c.scene&&['behavior','tone','thought'].includes(c.focus));
});
test('six short quotations are bounded and located',()=>{
 assert.equal(R.quotations.length,6);assert.ok(R.quotations.reduce((n,q)=>n+q.text.split(/\s+/).length,0)<=25);
 for(const q of R.quotations)assert.ok(q.speaker&&q.pdfPage&&q.webPage&&q.context&&q.analysis&&q.limits&&R.scenes.some(s=>s.id===q.scene));
});
test('12 priorities reuse questions with six detail and six analysis',()=>{
 assert.equal(R.predictions.length,12);assert.equal(new Set(R.predictions.map(p=>p.id)).size,12);
 for(const cat of ['detail','analysis'])assert.equal(R.predictions.filter(p=>R.questions.find(q=>q.id===p.id)?.category===cat).length,6);
 for(const p of R.predictions)assert.ok(p.reason&&p.slides&&R.sources.some(s=>s.id===p.source));
});
test('chapter, category, type and analysis focus filters intersect',()=>{
 assert.equal(R.selectQuestions({}).length,96);
 const f=R.selectQuestions({chapter:'14',category:'analysis',type:'short',focus:'tone'});assert.ok(f.length);assert.ok(f.every(q=>q.chapters.includes(14)&&q.focus==='tone'&&q.type==='short'));
 assert.equal(R.selectQuestions({chapter:'99'}).length,0);assert.equal(R.selectQuestions({category:'detail',focus:'tone'}).length,0);
 const cross=R.questions.find(q=>q.chapters.length>1);for(const c of cross.chapters)assert.ok(R.selectQuestions({chapter:String(c)}).some(q=>q.id===cross.id));
});
test('MC scoring distinguishes wrong, blank and short answers',()=>{
 const [a,b]=R.questions.filter(q=>q.type==='mc'),s=R.questions.find(q=>q.type==='short');
 assert.deepEqual(plain(R.scoreMC([a.id,b.id,s.id],{[a.id]:a.answer})),{correct:1,incorrect:0,unanswered:1,total:2});
 assert.equal(R.scoreMC([a.id],{[a.id]:(a.answer+1)%4}).incorrect,1);
 assert.deepEqual(plain(R.incorrectIds([a.id,b.id],{[a.id]:(a.answer+1)%4})),[a.id]);
});
test('only checked/submitted responses reveal answers and edits invalidate review',()=>{
 const a=R.questions[0],s=R.questions.find(q=>q.type==='short');
 assert.equal(R.canReveal('test',[],[a.id],a.id),false);assert.equal(R.canReveal('test',[a.id],[],a.id),true);assert.equal(R.canReveal('practice',[],[a.id],a.id),true);
 const state=R.restoreState(JSON.stringify({version:1,answers:{[a.id]:0,[s.id]:'draft'},checked:[a.id,s.id],submitted:[a.id,s.id],assessed:{[s.id]:[true,true,true]}}));
 R.recordAnswer(state,s.id,'revised');assert.ok(!state.submitted.includes(s.id));assert.equal(state.assessed[s.id],undefined);assert.ok(state.submitted.includes(a.id));
 R.recordAnswer(state,a.id,1);assert.ok(!state.checked.includes(a.id));assert.ok(!state.submitted.includes(a.id));
});
test('saved state rejects corrupt, unknown and out-of-range responses',()=>{
 const a=R.questions[0];assert.equal(Object.keys(R.restoreState('{').answers).length,0);
 assert.equal(Object.keys(R.restoreState(JSON.stringify({version:2,answers:{[a.id]:1}})).answers).length,0);
 const state=R.restoreState(JSON.stringify({version:1,answers:{[a.id]:9,unknown:1},checked:['unknown'],submitted:[]}));assert.equal(Object.keys(state.answers).length,0);assert.equal(state.checked.length,0);
});
test('chapter boundaries and important distinctions stay explicit',()=>{
 assert.ok(R.details.some(d=>d.chapter===15&&d.answer.includes('down payment')&&d.answer.includes('3,000')));
 assert.ok(R.details.some(d=>d.chapter===16&&d.answer.includes('fake')&&d.prompt.includes('laser')));
 assert.ok(R.details.some(d=>d.chapter===18&&d.answer.includes('Irmgard')&&d.prompt.includes('scissors')));
 assert.ok(R.scenes.at(-1).body.includes('alarm'));assert.ok(R.scenes.at(-1).body.includes('vision'));
});
test('ambiguous source counts are anchored to the stated stage',()=>{
 const legs=R.questions.find(q=>q.id==='c18-m04');
 assert.match(legs.prompt,/explicit count.*before Roy/i);
 assert.match(legs.explanation,/another cut/i);
 assert.ok(!R.scenes.find(s=>s.id==='18:cruelty').body.includes('four legs in total'));
 const encounters=R.questions.find(q=>q.id==='c17-m05');assert.ok(!encounters.prompt.includes('prior encounters'));
});
test('concept models supply the definitions their prompts require',()=>{
 for(const [id,term] of [['c14-s01','Dramatic irony'],['c15-s01','Situational irony'],['c18-s01','Juxtaposition']])assert.ok(R.questions.find(q=>q.id===id).model.startsWith(term),id);
});
test('document and UI stay English, self-contained and accessible',()=>{
 assert.match(html,/<html[^>]*lang="en"/);assert.ok(!/[\u4e00-\u9fff]/u.test(html));
 for(const s of ['context','story','details','characters','themes','evidence','map','types','quiz','templates','predictions'])assert.ok(html.includes('id="'+s+'"'),s);
 assert.ok(html.includes('prefers-reduced-motion'));assert.ok(html.includes('filter-focus'));assert.ok(html.includes('dadoes-ch13-18-review-v1'));
 assert.ok(!/<link[^>]+href=["']https?:|@import|fetch\(/i.test(html));
 assert.ok(!html.includes('dadoes-ch10-12-review-v1'));new vm.Script(script('review-ui'));
});
console.log(`\n${passed} checks passed. 60 MC + 36 short answers; ${R.details.length} detail cards.`);
