const test=require('node:test');
const assert=require('node:assert/strict');
const c=require('../public/studyguides/neuroscience/guides/neuro46-core');
const adapters=require('../public/studyguides/guide-adapters');
const {createStore}=require('../public/studyguides/study-progress');
const copy=x=>JSON.parse(JSON.stringify(x));
const d={topics:[{id:'topic',chapter:4}],mcq:Array.from({length:30},(_,i)=>({id:'m'+i,chapter:4,topic:'topic',options:['a','b','c','d'],answer:0})),frq:Array.from({length:10},(_,i)=>({id:'f'+i,chapter:4,topic:'topic',points:Array.from({length:5},()=>({marks:1}))})),figures:Array.from({length:10},(_,i)=>({id:'p'+i,chapter:4,topic:'topic',term:'Axon hillock',accepted:['initial-segment']})),terms:Array.from({length:5},(_,i)=>({id:'t'+i,chapter:4,topic:'topic',points:[{marks:1},{marks:1}]}))};
d.mocks=[{id:'old',mcq:d.mcq.map(q=>q.id),frq:d.frq.map(q=>q.id)},{id:'midterm2026-a',format:'midterm2026',mcq:d.mcq.map(q=>q.id),frq:d.frq.slice(0,6).map(q=>q.id),figures:d.figures.map(q=>q.id),terms:d.terms.map(q=>q.id),requiredFrq:6,minutes:90}];
const p=d.mocks[1], id='neuroscience-ch4-6-review';
function grade(a,ids,bank){for(const qid of ids){const q=bank.find(q=>q.id===qid);a.answers[qid]='response';a.self[qid]=q.points.map(()=>true);a.selfAnswers[qid]='response';}}
function store(data=d){const desc={questions:[...data.mcq.map(q=>({...q,type:'mc'})),...data.frq.map(q=>({...q,type:'written',rubricCount:5})),...(data.figures||[]).map(q=>({...q,type:'written',subtype:'spelling'})),...(data.terms||[]).map(q=>({...q,type:'written',subtype:'definition',rubricCount:2}))],cardIds:['topic'],mocks:data.mocks};const map=new Map();return createStore({storage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)},catalog:{materials:[{id}]},index:{[id]:desc},now:()=>2000});}
test('spelling accepts canonical and explicit aliases after conservative normalization only',()=>{
 assert.equal(typeof c.checkSpelling,'function');
 for(const text of ['  AXON   hillock ','INITIAL–segment'])assert.equal(c.checkSpelling(d.figures[0],text),true);
 for(const text of ['axon hilock','initial segment','axon-hillock',''])assert.equal(c.checkSpelling(d.figures[0],text),false);
});
test('midterm scores base 100 independently from bonus and requires submitted explicit FRQ grading',()=>{
 const a=c.freshAttempt(p);assert.deepEqual(a.selected,p.frq);assert.ok(a.selfAnswers);
 for(const q of d.mcq)a.answers[q.id]=0;for(const q of d.figures)a.answers[q.id]='axon hillock';
 grade(a,p.frq,d.frq);assert.deepEqual(c.scoreMock(d,p,a),{mcq:60,figures:10,frq:null,total:null,bonus:null});
 a.submitted=true;assert.deepEqual(c.scoreMock(d,p,a),{mcq:60,figures:10,frq:30,total:100,bonus:null});
 grade(a,p.terms,d.terms);assert.equal(c.scoreMock(d,p,a).bonus,10);
 a.answers.f0='changed';assert.equal(c.scoreMock(d,p,a).total,null);
});
test('blank positive rubrics and malformed identities fail while explicit blank zero remains valid',()=>{
 const a=c.freshAttempt(p);a.submitted=true;
 for(const qid of p.frq){a.self[qid]=[false,false,false,false,false];a.selfAnswers[qid]='';}
 assert.equal(c.scoreMock(d,p,a).total,0);assert.doesNotThrow(()=>c.validateAttempt(d,p,a));
 a.self.f0[0]=true;assert.throws(()=>c.validateAttempt(d,p,a));a.self.f0[0]=false;
 assert.throws(()=>c.validateAttempt(d,p,{...a,selected:p.frq.slice(1)}));
 assert.throws(()=>c.validateAttempt(d,p,{...a,answers:{unknown:'x'}}));
 assert.throws(()=>c.validateAttempt(d,p,{...a,self:{t0:[true]}}));
 const s=c.freshState();s.checked=['p0'];assert.throws(()=>c.validateState(d,s));
});
test('validated legacy v1 restore binds legitimate FRQ marks without rewriting and retains 60 plus 40 scoring',()=>{
 const old={mcq:d.mcq,frq:d.frq,topics:d.topics,mocks:[d.mocks[0]]},s=c.freshState();s.answers.f0='old answer';s.assessed.f0=[true,false,false,false,false];
 const restored=c.validateState(old,s);assert.deepEqual(restored.assessed.f0,[true,false,false,false,false]);assert.equal(restored.assessedAnswers.f0,'old answer');assert.ok(restored.spelling);assert.ok(restored.definitions);
 const a=c.freshAttempt();a.selected=d.mocks[0].frq.slice(0,8);a.submitted=true;for(const q of d.mcq)a.answers[q.id]=0;for(const qid of a.selected){a.answers[qid]='legacy';a.self[qid]=[true,true,true,true,true];}
 assert.deepEqual(c.scoreMock(old,d.mocks[0],a),{mcq:60,frq:40,total:100});assert.throws(()=>c.validateAttempt(old,d.mocks[0],{...a,selected:d.mocks[0].frq.slice(0,9)}));
});
test('sanitize removes answer-mismatched practice, spelling, definition and exam assessments without mutating input',()=>{
 const s=c.freshState();s.answers.f0='new';s.assessed.f0=[true,false,false,false,false];s.assessedAnswers={f0:'old'};
 s.spelling={answers:{p0:'new'},checked:{p0:'old'}};s.definitions={answers:{t0:'new'},self:{t0:[true,true]},selfAnswers:{t0:'old'}};
 const a=c.freshAttempt(p);grade(a,p.frq,d.frq);a.answers.f0='new';s.exams[p.id]=a;
 const clean=c.sanitizeState(d,s);assert.deepEqual(clean.assessed,{});assert.deepEqual(clean.spelling.checked,{});assert.deepEqual(clean.definitions.self,{});assert.equal(clean.exams[p.id].self.f0,undefined);assert.ok(s.assessed.f0);
 assert.throws(()=>c.validateState(d,{...s,spelling:{answers:{unknown:'x'},checked:{}}}));
 assert.throws(()=>c.validateState(d,{...s,definitions:{answers:{t0:'x'},self:{t0:[true]},selfAnswers:{}}}));
});
test('new drill deep links reveal the matching drill while shared results remain MCQ only',()=>{
 const s=c.freshState();s.spelling={answers:{p0:'axon hillock'},checked:{p0:'axon hillock'}};s.answers.m0=0;s.checked=['m0'];
 for(const [qid,type]of [['p0','spelling'],['t0','definition']]){const next=c.resolveTarget(d,s,{questionId:qid});assert.equal(next.section,'drills');assert.equal(next.drill.type,type);assert.equal(next.drill.questionId,qid);}
 assert.deepEqual(c.snapshot(d,s).checked,['m0']);assert.deepEqual(c.snapshot(d,s).answers,{m0:0});
});
test('both stale merge directions discard checks and rubrics bound to replaced responses',()=>{
 assert.equal(typeof adapters.rebaseNeuroState,'function');
 const before=c.freshState();before.answers={m0:0,f0:'old'};before.spelling={answers:{p0:'old'},checked:{}};before.definitions={answers:{t0:'old'},self:{},selfAnswers:{}};
 const graded=copy(before);graded.checked=['m0'];graded.assessed.f0=[true,false,false,false,false];graded.assessedAnswers={f0:'old'};graded.spelling.checked.p0='old';graded.definitions.self.t0=[true,true];graded.definitions.selfAnswers.t0='old';
 const edited=copy(before);edited.answers={m0:1,f0:'new'};edited.spelling.answers.p0='new';edited.definitions.answers.t0='new';
 for(const [current,latest]of [[graded,edited],[edited,graded]]){const merged=adapters.rebaseNeuroState(before,current,latest);assert.deepEqual(merged.checked,[]);assert.deepEqual(merged.assessed,{});assert.deepEqual(merged.spelling.checked,{});assert.deepEqual(merged.definitions.self,{});}
 const forced=adapters.rebaseNeuroState(before,graded,edited,['m0']);assert.equal(forced.answers.m0,0);assert.deepEqual(forced.checked,['m0']);
});
test('stale exam merges keep submitted drafts locked and permit a reset only after observing submission',()=>{
 const before=c.freshState();before.exams[p.id]=c.freshAttempt(p);before.exams[p.id].answers.f0='draft';
 const submitted=copy(before);submitted.exams[p.id].answers.f0='final';submitted.exams[p.id].submitted=true;
 const stale=copy(before);stale.exams[p.id].answers.f0='stale edit';
 for(const [current,latest]of [[stale,submitted],[submitted,stale]]){const merged=adapters.rebaseNeuroState(before,current,latest);assert.equal(merged.exams[p.id].submitted,true);assert.equal(merged.exams[p.id].answers.f0,'final');}
 const reset=copy(submitted);reset.exams[p.id]=c.freshAttempt(p);const merged=adapters.rebaseNeuroState(submitted,reset,submitted);assert.equal(merged.exams[p.id].submitted,false);assert.deepEqual(merged.exams[p.id].answers,{});
});
test('new and old backups retain v1, sanitize bindings, and reject malformed drill data atomically',()=>{
 const s=c.freshState();s.spelling={answers:{p0:'axon hillock'},checked:{p0:'other'}};s.definitions={answers:{t0:'definition'},self:{t0:[true,false]},selfAnswers:{t0:'definition'}};s.exams[p.id]=c.freshAttempt(p);
 const a=store();a.save(id,{progress:{state:s}});const backup=JSON.parse(a.exportBackup());assert.equal(backup.version,1);const b=store();b.importBackup(backup).commit();const restored=b.read(id).progress.state;assert.deepEqual(restored.spelling.checked,{});assert.deepEqual(restored.definitions.self.t0,[true,false]);
 const legacy=c.freshState();delete legacy.spelling;delete legacy.definitions;delete legacy.assessedAnswers;legacy.answers.f0='legacy';legacy.assessed.f0=[true,false,false,false,false];backup.records[0].progress.state=legacy;backup.records[0].updatedAt=3000;b.importBackup(backup).commit();assert.equal(b.read(id).progress.state.assessedAnswers.f0,'legacy');
 backup.records[0].progress.state.definitions={answers:{t0:''},self:{t0:[true,false]},selfAnswers:{t0:''}};assert.throws(()=>b.importBackup(backup));
});
test('unbound bonus and new exam rubrics do not grant live marks, and malformed blank definition marks are rejected',()=>{
 const a=c.freshAttempt(p);a.submitted=true;grade(a,p.frq,d.frq);grade(a,p.terms,d.terms);delete a.selfAnswers.t0;assert.equal(c.scoreMock(d,p,a).bonus,null);delete a.selfAnswers.f0;assert.equal(c.scoreMock(d,p,a).total,null);
 const s=c.freshState();s.definitions.self.t0=[true,false];assert.throws(()=>c.validateState(d,s));assert.throws(()=>store().save(id,{progress:{state:s}}));
});
test('stale matching rubric arrays cannot move an explicit old binding onto a new answer',()=>{
 const before=c.freshState();before.answers.f0='old';before.assessed.f0=[true,false,false,false,false];before.assessedAnswers.f0='old';
 const current=copy(before);current.answers.f0='new';const latest=copy(before);latest.assessed.f0=[true,true,false,false,false];
 for(const [local,remote]of [[current,latest],[latest,current]])assert.deepEqual(adapters.rebaseNeuroState(before,local,remote).assessed,{});
 const b=c.freshState();b.exams[p.id]=c.freshAttempt(p);b.exams[p.id].answers.f0='old';const graded=copy(b);graded.exams[p.id].self.f0=[true,false,false,false,false];graded.exams[p.id].selfAnswers.f0='old';const edited=copy(b);edited.exams[p.id].answers.f0='new';
 for(const [local,remote]of [[graded,edited],[edited,graded]])assert.deepEqual(adapters.rebaseNeuroState(b,local,remote).exams[p.id].self,{});
});
test('an observed new round from another tab stays reset during unrelated local edits',()=>{
 const before=c.freshState();before.exams[p.id]=c.freshAttempt(p);before.exams[p.id].submitted=true;before.exams[p.id].answers.f0='old final';
 const current=copy(before);current.section='learn';const latest=copy(before);latest.exams[p.id]=c.freshAttempt(p);
 const merged=adapters.rebaseNeuroState(before,current,latest);assert.equal(merged.exams[p.id].submitted,false);assert.deepEqual(merged.exams[p.id].answers,{});
});
test('unbound current-format rubrics remain pending through restore and rebase instead of acquiring answer bindings',()=>{
 const a=c.freshAttempt(p);a.submitted=true;a.answers.f0='new format';a.self.f0=[true,false,false,false,false];const clean=c.validateAttempt(d,p,a);assert.deepEqual(clean.self,{});
 const s=c.freshState();s.exams[p.id]=a;const backup=store();backup.save(id,{progress:{state:s}});assert.deepEqual(backup.read(id).progress.state.exams[p.id].self,{});
 const before=c.freshState(),current=copy(before);current.definitions.answers.t0='unbound';current.definitions.self.t0=[true,false];const merged=adapters.rebaseNeuroState(before,current,before);assert.deepEqual(merged.definitions.self,{});
 const mergedExam=adapters.rebaseNeuroState(before,s,before);assert.deepEqual(mergedExam.exams[p.id].self,{});
});
test('all Unicode dash punctuation is normalized without accepting missing punctuation',()=>{
 assert.equal(c.checkSpelling(d.figures[0],'initial\u058Asegment'),true);assert.equal(c.checkSpelling(d.figures[0],'initialsegment'),false);
});
test('shared MCQ results cannot use answers rejected by the submitted-attempt lock',()=>{
 assert.equal(typeof adapters.neuroAssessmentIds,'function');
 const s=c.freshState();s.section='mocks';s.mock=p.id;s.exams[p.id]=c.freshAttempt(p);s.exams[p.id].submitted=true;s.exams[p.id].answers.m0=1;
 const snap=c.snapshot(d,s),rebased=copy(s);rebased.exams[p.id].answers.m0=0;
 assert.deepEqual(adapters.neuroAssessmentIds(snap,rebased,['m0']),[]);assert.deepEqual(adapters.neuroAssessmentIds(snap,s,['m0']),['m0']);
 rebased.exams[p.id].submitted=false;assert.deepEqual(adapters.neuroAssessmentIds(snap,rebased,['m0']),[]);
 const practice=c.freshState();practice.answers.m0=1;practice.checked=['m0'];assert.deepEqual(adapters.neuroAssessmentIds(c.snapshot(d,practice),practice,['m0']),['m0']);
});
