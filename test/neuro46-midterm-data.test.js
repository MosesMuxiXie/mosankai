const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const file=path.join(__dirname,'../public/studyguides/neuroscience/guides/neuro46-midterm-data.js');
const api=()=>{assert.ok(fs.existsSync(file),'new midterm content module must exist');return require(file);};

test('current papers sample 6/9/15 MCQs and six required FRQs without cross-paper repetition',()=>{
 const m=api(),old=require('../public/studyguides/neuroscience/guides/neuro46-data');
 const mcq=[...old.mcq.filter(q=>Number(q.id.split('M')[1])<=30),...m.extraMCQ];
 const figures=Array.from({length:60},(_,i)=>({id:'G-'+i,category:['method','synapse','molecule','receptor','other'][i%5]}));
 const terms=Array.from({length:30},(_,i)=>({id:'D-'+i,chapter:4+i%3}));
 const papers=m.makeMocks({mcq,frq:old.frq,figures,terms}),seenMC=[],seenFR=[];
 assert.equal(papers.length,3);
 for(const p of papers){
  assert.deepEqual([4,5,6].map(ch=>p.mcq.filter(id=>mcq.find(q=>q.id===id).chapter===ch).length),[6,9,15]);
  assert.deepEqual([4,5,6].map(ch=>p.frq.filter(id=>old.frq.find(q=>q.id===id).chapter===ch).length),[1,2,3]);
  assert.equal(p.requiredFrq,6);assert.equal(p.format,'midterm2026');
  assert.equal(p.figures.length,10);assert.equal(p.terms.length,5);
  assert.equal(new Set(p.figures).size,10);assert.equal(new Set(p.terms).size,5);
  for(const category of ['method','synapse','molecule','receptor'])assert.ok(p.figures.some(id=>figures.find(q=>q.id===id).category===category));
  seenMC.push(...p.mcq);seenFR.push(...p.frq);
 }
 assert.equal(new Set(seenMC).size,90);assert.equal(new Set(seenFR).size,18);
});

test('15 added C6 questions have unique answers, source locators and paired option reasoning',()=>{
 const m=api();assert.equal(m.extraMCQ.length,15);
 assert.deepEqual(m.extraMCQ.map(q=>q.id),Array.from({length:15},(_,i)=>'C6-M'+String(i+31)));
 for(const q of m.extraMCQ){assert.equal(q.chapter,6);assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.equal(q.rationale.length,4);assert.equal(q.rationaleEn.length,4);assert.ok(q.sources.every(s=>s[0]&&s[1]));}
 assert.equal(m.blueprint.base,100);assert.equal(m.blueprint.bonus,10);
});

test('real current papers reference complete banks and a blank submitted paper can be graded zero independently of bonus',()=>{
 const d=require('../public/studyguides/neuroscience/guides/neuro46-data'),c=require('../public/studyguides/neuroscience/guides/neuro46-core');
 assert.ok(d.figures.length>=30,'classroom figure bank must be present');assert.ok(d.terms.length>=30);
 for(const p of d.mocks.filter(p=>p.format==='midterm2026')){
  assert.equal(p.mcq.length,30);assert.equal(p.frq.length,6);assert.equal(p.figures.length,10);assert.equal(p.terms.length,5);
  for(const id of p.figures)assert.ok(d.figures.some(q=>q.id===id));for(const id of p.terms)assert.ok(d.terms.some(q=>q.id===id));
  const x=c.freshAttempt(p);x.submitted=true;assert.equal(c.scoreMock(d,p,x).total,null);
  for(const id of p.frq){x.self[id]=[false,false,false,false,false];x.selfAnswers[id]='';}
  const score=c.scoreMock(d,p,x);assert.equal(score.total,0);assert.equal(score.bonus,null);assert.doesNotThrow(()=>c.validateAttempt(d,p,x));
 }
});
