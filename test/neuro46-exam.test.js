const test=require('node:test');
const assert=require('node:assert/strict');
const exam=()=>require('../public/studyguides/neuroscience/guides/neuro46-exam');
test('original exam walkthrough preserves disputed originals without treating them as single-answer practice',()=>{
 const e=exam();assert.equal(e.mcq.length,35);assert.equal(e.frq.length,10);
 for(const q of e.mcq){assert.ok(q.prompt.zh&&q.prompt.en);assert.equal(q.options.length,4);assert.equal(q.rationale.length,4);assert.ok(q.page>=3&&q.page<=8);assert.ok(q.explanation.zh&&q.explanation.en);for(const x of [...q.options,...q.rationale])assert.ok(x.zh&&x.en);}
 assert.deepEqual(e.mcq.find(q=>q.number===30).answers,[1,2]);
 assert.deepEqual(e.mcq.find(q=>q.number===34).answers,[]);
 assert.equal(e.mcq.find(q=>q.number===13).duplicateOf,12);
 assert.equal(e.mcq.find(q=>q.number===9).answers[0],1);
 assert.equal(e.mcq.find(q=>q.number===21).answers[0],1);
 for(const q of e.frq){assert.ok(q.prompt.zh&&q.prompt.en);assert.ok(q.points.length>=4);assert.ok(q.model.zh&&q.model.en);assert.ok(q.msNotes.length>0);for(const p of [...q.points,...q.msNotes])assert.ok(p.zh&&p.en);}
 assert.equal(e.frq.find(q=>q.number===4).missingFigure,true);
});
test('original questions expose only ungraded reference disclosures and preserve original options',()=>{
 const e=exam(),html=e.renderMCQ(34),frq=e.renderFRQ(4);
 assert.ok(html.includes('Tyrosine')&&!html.includes('<input'));
 assert.ok(html.includes('<details class="exam-explanation">'));
 assert.ok(frq.includes('Figure 2')&&frq.includes('MS'));
 assert.ok(!/data-question-id|data-qid|data-rubric|<textarea/.test(html+frq));
 assert.equal(e.renderMCQ(999),'');assert.equal(e.renderFRQ(999),'');
});
test('original reference links resolve only known exam identities',()=>{
 const e=exam();assert.equal(e.target('#original-exam'),'original-exam');
 assert.equal(e.target('#original-mcq-34'),'original-mcq-34');
 assert.equal(e.target('#original-frq-4'),'original-frq-4');
 assert.equal(e.target('#original-frq-11'),null);assert.equal(e.target('#original-mcq-999'),null);
 assert.equal(e.target('#original-mcq-1]'),null);
});
test('reload retains a newer practice position instead of replaying an older original-question fragment',()=>{
 const e=exam();assert.equal(e.resumeTarget('#original-frq-4',null),'original-frq-4');
 assert.equal(e.resumeTarget('#original-frq-4',{section:'practice'}),null);
 assert.equal(e.resumeTarget('#original-frq-4',{section:'sources',hash:'#original-frq-5'}),'original-frq-5');
 assert.equal(e.restoreHash('#original-frq-4',{section:'practice'}),'#practice');
 assert.equal(e.restoreHash('#original-frq-4',{section:'sources',hash:'#original-frq-5'}),'#original-frq-5');
 assert.equal(e.restoreHash('#original-frq-4',null),'#original-frq-4');
});
