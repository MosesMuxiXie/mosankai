const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = path.join(__dirname, '../public/studyguides/neuroscience/guides');
const dataPath = path.join(base, 'neuro46-data.js');
const corePath = path.join(base, 'neuro46-core.js');
function content() { assert.ok(fs.existsSync(dataPath), 'shared review content must exist'); return require(dataPath); }
function core() { assert.ok(fs.existsSync(corePath), 'real grading/state core must exist'); return require(corePath); }

test('each chapter has a complete, source-traceable bank and five-point FRQs', () => {
  const d = content();
  assert.equal(d.mcq.length, 90); assert.equal(d.frq.length, 30);
  assert.equal(new Set([...d.mcq,...d.frq].map(q=>q.id)).size,120);
  for (const chapter of [4,5,6]) { assert.equal(d.mcq.filter(q=>q.chapter===chapter).length,30); assert.equal(d.frq.filter(q=>q.chapter===chapter).length,10); }
  for(const q of [...d.mcq,...d.frq]) {
    assert.ok(d.topics.some(t=>t.id===q.topic)); assert.ok(q.sources.length);
    for(const ref of q.sources) assert.ok(d.sources[ref[0]] && ref[1], q.id+' needs an actual source locator');
    if(q.options) { assert.equal(q.options.length,4); assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4); assert.equal(q.rationale.length,4); }
    else { assert.equal(q.points.reduce((n,p)=>n+p.marks,0),5); assert.ok(q.model.length>120); assert.ok(q.mistake); }
  }
});

test('three mock papers partition the bank and expose no duplicate questions',()=>{
 const d=content(), seen=[];
 for(const [i,paper] of d.mocks.entries()) {
   assert.equal(paper.mcq.length,30); assert.equal(paper.frq.length,10);
   for(const ch of [4,5,6]) assert.equal(paper.mcq.filter(id=>d.mcq.find(q=>q.id===id)?.chapter===ch).length,10);
   assert.deepEqual([4,5,6].map(ch=>paper.frq.filter(id=>d.frq.find(q=>q.id===id)?.chapter===ch).length),[[4,3,3],[3,4,3],[3,3,4]][i]);
   seen.push(...paper.mcq,...paper.frq);
 }
 assert.equal(seen.length,120);assert.equal(new Set(seen).size,120);
});

test('mock totals wait for selected written self-assessment; blanks cannot earn marks',()=>{
 const d=content(), c=core(), paper=d.mocks[0];
 const attempt=c.freshAttempt();attempt.answers[paper.mcq[0]]=d.mcq.find(q=>q.id===paper.mcq[0]).answer;
 let score=c.scoreMock(d,paper,attempt);assert.equal(score.mcq,2);assert.equal(score.total,null);
 attempt.selected=paper.frq.slice(0,8);attempt.submitted=true;
 score=c.scoreMock(d,paper,attempt);assert.equal(score.total,null);
 for(const id of attempt.selected){attempt.answers[id]='Mechanistic response';attempt.self[id]=[true,true,true,true,true];}
 score=c.scoreMock(d,paper,attempt);assert.equal(score.frq,40);assert.equal(score.total,42);
 attempt.answers[attempt.selected[0]]='';score=c.scoreMock(d,paper,attempt);assert.equal(score.total,null);
 assert.throws(()=>c.validateAttempt(d,paper,{...attempt,selected:paper.frq.slice(0,9)}));
});

test('assessment excludes drafts and practice/exam sessions stay independent',()=>{
 const d=content(),c=core(),s=c.freshState(),q=d.mcq[0];
 s.answers[q.id]=q.answer;assert.deepEqual(c.assessment(d,s),{answers:{},checked:[]});
 s.checked=[q.id];assert.equal(c.assessment(d,s).answers[q.id],q.answer);
 s.exams.mock1=c.freshAttempt();s.exams.mock1.answers[q.id]=(q.answer+1)%4;
 assert.equal(s.answers[q.id],q.answer);assert.equal(c.assessment(d,s).answers[q.id],q.answer);
 const bad=JSON.parse(JSON.stringify(s));bad.exams.mock1.selected=['not-a-question'];assert.throws(()=>c.validateState(d,bad));
 assert.throws(()=>c.validateState(d,{...s,version:2}));
});

test('decay and ion-driving-force examples compute their physical limits',()=>{
 const c=core();assert.ok(Math.abs(c.passivePSP(10,1,1)-3.678794)<0.00001);
 assert.equal(c.ionCurrent(0,-65,55),0);assert.equal(c.ionCurrent(2,55,55),0);assert.equal(c.ionCurrent(2,-65,55),-240);
});

test('new study materials restore and export independent practice/exam drafts with validated self-scores',()=>{
 const d=content(),c=core(),{createStore}=require('../public/studyguides/study-progress');
 const catalog=require('../public/studyguides/catalog.json'),index=require('../public/studyguides/learning-index.json');
 const id='neuroscience-ch4-6-review';assert.ok(catalog.materials.some(m=>m.id===id),'new guide must be discoverable');
 assert.equal(index[id].questions.length,120);
 const make=()=>{const map=new Map();return createStore({storage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)},catalog,index,now:()=>2000});};
 const store=make(),s=c.freshState();s.answers['C4-F01']='My written draft';s.exams.mock1=c.freshAttempt();s.exams.mock1.answers['C4-M01']=2;
 store.save(id,{progress:{state:s}});store.save('neuroscience-review',{progress:{state:{frq:{'FRQ-001':'Earlier material'}}}});
 const restored=make();restored.importBackup(store.exportBackup()).commit();
 assert.equal(restored.read(id).progress.state.exams.mock1.answers['C4-M01'],2);
 assert.equal(restored.read('neuroscience-review').progress.state.frq['FRQ-001'],'Earlier material');
 const bad=JSON.parse(JSON.stringify(s));bad.exams.mock1.selected=['C6-F10'];assert.throws(()=>store.save(id,{progress:{state:bad}}));
 bad.exams.mock1=c.freshAttempt();bad.exams.mock1.self['C4-F01']=[true];assert.throws(()=>store.save(id,{progress:{state:bad}}));
});

test('the real page snapshot is accepted by the shared resume contract and never aliases exam answers into practice',()=>{
 const d=content(),c=core(),{createStore}=require('../public/studyguides/study-progress');
 assert.equal(typeof c.snapshot,'function');
 const catalog=require('../public/studyguides/catalog.json'),index=require('../public/studyguides/learning-index.json');
 const store=createStore({storage:{getItem:()=>null,setItem(){}},catalog,index,now:()=>2000}),s=c.freshState();
 s.answers['C4-M01']=1;s.checked=['C4-M01'];s.exams.mock1=c.freshAttempt();s.exams.mock1.answers['C4-M01']=0;s.exams.mock1.submitted=true;s.section='mocks';
 const snap=c.snapshot(d,s);assert.equal(snap.answers['C4-M01'],0);assert.equal(snap.state.answers['C4-M01'],1);
 assert.doesNotThrow(()=>store.save('neuroscience-ch4-6-review',{resume:snap.resume,progress:{state:snap.state}}));
});

test('returning from a submitted exam cannot regrade an older practice answer without a new check',()=>{
 const api=require('../public/studyguides/guide-adapters');assert.equal(typeof api.assessmentIds,'function');
 const snap={answers:{'C4-M01':1},checked:['C4-M01']},last={answers:{'C4-M01':0},checked:['C4-M01']};
 assert.deepEqual(api.assessmentIds('neuroscience-ch4-6-review',snap,last,[]),[]);
 assert.deepEqual(api.assessmentIds('neuroscience-ch4-6-review',snap,last,['C4-M01']),['C4-M01']);
 assert.deepEqual(api.assessmentIds('neuroscience-review',snap,last,[]),['C4-M01']);
});

test('a question deep link overrides stale chapter, priority, topic and wrong-only filters',()=>{
 const d=content(),c=core();assert.equal(typeof c.resolveTarget,'function');
 const s={...c.freshState(),chapter:'5',topic:'c5-t9',priority:'2',type:'written',wrongOnly:true};
 const next=c.resolveTarget(d,s,{questionId:'C6-M16'});
 assert.equal(next.questionId,'C6-M16');assert.equal(next.chapter,'6');assert.equal(next.topic,'c6-t6');assert.equal(next.priority,'all');assert.equal(next.type,'mc');assert.equal(next.wrongOnly,false);
 const linked=c.resolveTarget(d,s,{topicId:'c4-t1',section:'practice'});assert.equal(linked.priority,'all');assert.equal(linked.type,'mc');assert.equal(linked.topic,'c4-t1');
});
