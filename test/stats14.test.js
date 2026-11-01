const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=path.join(__dirname,'../public/studyguides/statistics/guides');
const load=()=>{assert.ok(fs.existsSync(path.join(base,'stats14-data.js')),'new bilingual data must be available');return require(path.join(base,'stats14-data'));};
const core=()=>{assert.ok(fs.existsSync(path.join(base,'stats14-core.js')),'statistical and assessment core must be available');return require(path.join(base,'stats14-core'));};
const near=(got,want,tol=1e-8)=>assert.ok(Math.abs(got-want)<tol,`${got} ≈ ${want}`);
test('all four chapters provide bilingual teaching, 16 examples and 48 uniquely addressable practice tasks',()=>{
 const d=load(),pair=p=>{assert.equal(typeof p.zh,'string');assert.equal(typeof p.en,'string');assert.ok(p.zh.trim()&&p.en.trim());};
 assert.equal(d.topics.length,24);assert.equal(d.examples.length,16);assert.equal(d.questions.length,48);
 assert.equal(new Set([...d.topics,...d.examples,...d.questions].map(x=>x.id)).size,88);
 for(const ch of [1,2,3,4]){assert.equal(d.examples.filter(x=>x.chapter===ch).length,4);assert.equal(d.questions.filter(x=>x.chapter===ch&&x.type==='mc').length,8);assert.equal(d.questions.filter(x=>x.chapter===ch&&x.type==='written').length,4);}
 for(const t of d.topics){for(const k of ['title','takeaway','when','formula','explain','trap','frame'])pair(t[k]);assert.ok(t.sources.length);}
 for(const x of [...d.examples,...d.questions]){assert.ok(d.topics.some(t=>t.id===x.topic));pair(x.title);pair(x.prompt);assert.ok(x.sources.length);if(x.steps){x.steps.forEach(pair);pair(x.model);pair(x.trap);}else if(x.type==='mc'){assert.equal(x.options.length,4);x.options.forEach(pair);assert.equal(x.rationale.length,4);x.rationale.forEach(pair);assert.ok(Number.isInteger(x.answer)&&x.answer>=0&&x.answer<4);}else{pair(x.model);pair(x.trap);assert.ok(x.rubric.length>=3);x.rubric.forEach(pair);}}
 for(const t of d.topics)assert.ok(d.questions.some(q=>q.topic===t.id),t.id+' must link to practice');
});
test('independent numeric fixtures catch wrong SD denominators, quartiles and normal tails',()=>{
 const c=core(),s=c.summary([2,3,4,5,6,7,8,9,10,20]);near(s.mean,7.4);near(s.median,6.5);near(s.q1,4);near(s.q3,9);near(s.sd,Math.sqrt(236.4/9));assert.deepEqual(s.outliers,[20]);
 assert.throws(()=>c.summary([1]));assert.throws(()=>c.summary([1,NaN]));
 near(c.normalCDF(0),.5,1e-7);near(c.normalCDF(1.5)-c.normalCDF(-1),.7745375,1e-6);near(1-c.normalCDF(2),.02275013,1e-6);near(c.normalQuantile(.9),1.281551566,1e-6);assert.throws(()=>c.normalQuantile(1));
 const r=c.regression([[1,2],[2,4],[3,5]]);near(r.slope,1.5);near(r.intercept,2/3);near(r.r2,27/28);near(r.residuals[0],-1/6);near(r.residualSD,Math.sqrt(1/6));assert.throws(()=>c.regression([[1,2],[1,3],[1,4]]));
});
test('draft changes never assess MCQs, and a new answer clears checked state',()=>{
 const d=load(),c=core(),q=d.questions.find(x=>x.type==='mc'),s=c.freshState();c.setAnswer(d,s,q.id,(q.answer+1)%4);assert.deepEqual(c.snapshot(d,s).checked,[]);assert.equal(c.check(d,s,q.id),false);assert.deepEqual(c.snapshot(d,s).checked,[q.id]);c.setAnswer(d,s,q.id,q.answer);assert.deepEqual(c.snapshot(d,s).checked,[]);assert.equal(c.check(d,s,q.id),true);assert.throws(()=>c.setAnswer(d,s,q.id,6));
 const written=d.questions.find(x=>x.type==='written');assert.throws(()=>c.check(d,s,written.id));c.setAnswer(d,s,written.id,'My reasoning');assert.equal(c.snapshot(d,s).answers[written.id],undefined);
});
test('deep links override stale filters and resume retains newer topic selections',()=>{
 const d=load(),c=core(),s={...c.freshState(),chapter:'1',topic:'st14-c1-data',type:'written',wrongOnly:true};
 const q=d.questions.find(x=>x.chapter===4&&x.type==='mc');const n=c.resolveTarget(d,s,{questionId:q.id});assert.equal(n.chapter,'4');assert.equal(n.topic,q.topic);assert.equal(n.type,'mc');assert.equal(n.wrongOnly,false);assert.equal(n.questionId,q.id);
 const resumed=c.resolveTarget(d,{...s,chapter:'3'},{topicId:'st14-c1-data',resume:true});assert.equal(resumed.chapter,'3');
});
test('new records survive backups independently and reject invalid rubric checklists',()=>{
 const d=load(),c=core(),{createStore}=require('../public/studyguides/study-progress');
 const catalog=require('../public/studyguides/catalog.json'),index=require('../public/studyguides/learning-index.json');
 assert.equal(index['statistics-ch1-4-review']?.questions.length,48,'new bank must be discoverable');
 const make=()=>{const m=new Map();return createStore({storage:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)},catalog,index});};
 const store=make(),s=c.freshState(),q=d.questions.find(q=>q.type==='written');s.answers[q.id]='A written draft';s.assessed[q.id]=q.rubric.map(()=>false);
 store.save('statistics-ch1-4-review',{progress:{state:s}});store.save('statistics-review',{progress:{state:{notes:{'STAT-001':'Earlier draft'}}}});
 const backup=store.exportBackup(),next=make();next.importBackup(backup).commit();assert.equal(next.read('statistics-ch1-4-review').progress.state.answers[q.id],'A written draft');assert.equal(next.read('statistics-review').progress.state.notes['STAT-001'],'Earlier draft');
 const bad=structuredClone(s);bad.assessed[q.id]=[true];assert.throws(()=>store.save('statistics-ch1-4-review',{progress:{state:bad}}));
 bad.assessed[q.id]=q.rubric.map(()=>true);bad.answers[q.id]='';assert.throws(()=>store.save('statistics-ch1-4-review',{progress:{state:bad}}));
});
test('concurrent drafts invalidate review markers bound to a different answer',()=>{
 const d=load(),c=core(),api=require('../public/studyguides/guide-adapters'),before=c.freshState(),mc=d.questions.find(q=>q.type==='mc'),frq=d.questions.find(q=>q.type==='written');
 assert.equal(typeof api.rebaseStatsState,'function');
 const reviewed=structuredClone(before),draft=structuredClone(before);reviewed.answers[mc.id]=1;reviewed.checked=[mc.id];draft.answers[mc.id]=0;
 let merged=api.rebaseStatsState(before,draft,reviewed);assert.equal(merged.answers[mc.id],0);assert.deepEqual(merged.checked,[]);
 reviewed.answers[frq.id]='Reviewed text';reviewed.assessed[frq.id]=frq.rubric.map(()=>true);draft.answers[frq.id]='Different, unreviewed text';
 merged=api.rebaseStatsState(before,draft,reviewed);assert.equal(merged.answers[frq.id],'Different, unreviewed text');assert.equal(merged.assessed[frq.id],undefined);
 const old=structuredClone(before);old.answers[mc.id]=1;const local=structuredClone(old);local.checked=[mc.id];const latest=structuredClone(old);latest.answers[mc.id]=0;
 merged=api.rebaseStatsState(old,local,latest,[mc.id]);assert.equal(merged.answers[mc.id],1);assert.deepEqual(merged.checked,[mc.id]);
});
