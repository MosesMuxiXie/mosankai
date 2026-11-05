const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const file=require('node:path').join(__dirname,'../public/studyguides/neuroscience/guides/neuro46-atlas.js');
const api=()=>fs.existsSync(file)?require(file):{};
const pair=p=>assert.ok(p&&p.zh&&p.en,'both teaching languages must be present');

test('atlas supplies questions for every actual classroom page with reciprocal source locators',()=>{
 const a=api();
 assert.ok(Array.isArray(a.figures),'figure bank is available');
 assert.ok(a.figures.length>=30);
 assert.equal(a.coverage.length,24);
 assert.equal(new Set(a.figures.map(f=>f.id)).size,a.figures.length);
 const expected=[];for(const [source,pages] of [['N4',6],['N5',12],['N6',6]])for(let page=1;page<=pages;page++)expected.push(`${source}:${page}`);
 assert.deepEqual(a.coverage.map(c=>`${c.source}:${c.page}`).sort(),expected.sort());
 for(const c of a.coverage){pair(c.note);assert.ok(c.figures.length);for(const id of c.figures){const f=a.figures.find(f=>f.id===id);assert.ok(f,id);assert.ok(f.sources.some(([s,p])=>s===c.source&&new RegExp(`^p\\.${c.page}(?: /|$)`).test(p)),id);}}
 for(const f of a.figures){assert.match(f.id,/^G-/);assert.match(f.topic,new RegExp(`^c${f.chapter}-t\\d+$`));assert.ok(f.accepted.includes(f.term));pair(a.categories[f.category]);for(const p of [f.prompt,f.explanation,f.mistake])pair(p);assert.match(f.prompt.en,/full (?:English )?(?:term|name)|abbreviation/i);assert.ok(f.sources.every(([s,p])=>/^N[456]$/.test(s)&&/^p\.\d+ \/ .+/.test(p)));}
});

test('bank identifies distinct required structures and calibrated experimental mechanisms',()=>{
 const a=api();assert.ok(a.figures);
 const required=['action potential','spike train','channelrhodopsin-2','halorhodopsin','voltage clamp','voltage-gated sodium channel','delayed rectifier potassium channel','absolute refractory period','relative refractory period','continuous conduction','saltatory conduction','node of Ranvier','axon initial segment','sensory initiation site','patch clamp','connexin','connexon','gap junction','electrical coupling','postsynaptic potential','dendrodendritic synapse','axospinous synapse','axodendritic synapse','axosomatic synapse','axoaxonic synapse','active zone','postsynaptic density','synaptic vesicle','dense-core vesicle','mitochondrion','Gray type I synapse','Gray type II synapse','neuromuscular junction','peptide synthesis and transport','small-molecule transmitter synthesis','calcium-triggered vesicle fusion','transmitter clearance','synaptic vesicle recycling','Loewi experiment','ionotropic receptor','G protein-coupled receptor','excitatory postsynaptic potential','inhibitory postsynaptic potential','spatial summation','temporal summation','quantal release','miniature postsynaptic potential','length constant','shunting inhibition','cAMP signaling cascade','gene expression','fluorescence in situ hybridization','immunohistochemistry','high-potassium evoked release','microiontophoresis','agonist','antagonist','radioligand binding','catechol','acetylcholine cycle','phenylalanine','tyrosine','L-DOPA','dopamine','norepinephrine','epinephrine','catecholamine synthesis','tryptophan','5-hydroxytryptophan','serotonin','glutamate','glycine','GABA','glutamate decarboxylase'];
 for(const term of required)assert.ok(a.figures.some(f=>f.term===term),term);
 const text=a.figures.map(f=>f.explanation.en).join(' ');
 for(const evidence of [/four domains/i,/pump/i,/synaptotagmin/i,/SNARE/i,/acetate and choline/i,/TPH/,/choline uptake/i,/antigen/i,/transcript/i,/AMPA/,/GABA-B/])assert.match(text,evidence);
});

test('source questions route to the existing explanatory topic for their scientific subject',()=>{
 const a=api();assert.ok(a.figures);const data=require('../public/studyguides/neuroscience/guides/neuro46-data');
 for(const item of [...a.figures,...a.terms])assert.ok(data.topics.some(t=>t.id===item.topic),item.id+' has a lesson route');
 for(const [id,topic] of [['G-ach-cycle','c6-t5'],['G-dopamine','c6-t6'],['G-serotonin','c6-t7'],['G-gaba','c6-t8'],['G-shunt','c5-t9'],['G-nmj','c5-t10'],['G-ihc','c6-t2'],['D-chat','c6-t5']])assert.equal(a.figures.concat(a.terms).find(f=>f.id===id).topic,topic,id);
});

test('cholinergic and serotonergic source drawings distinguish complete molecules, enzymes and pathway roles',()=>{
 const a=api();assert.ok(a.figures);
 for(const term of ['acetylcholine','choline acetyltransferase','acetylcholinesterase','serotonin synthesis'])assert.ok(a.figures.some(f=>f.term===term),term);
 const render=term=>a.renderFigure(a.figures.find(f=>f.term===term).id);
 assert.match(render('acetylcholine'),/>N⁺<\/text>/);
 assert.match(render('serotonin synthesis'),/>TPH<\/text>/);assert.match(render('serotonin synthesis'),/>AADC<\/text>/);
 assert.ok(!render('choline acetyltransferase').includes('ChAT'));
 assert.ok(!render('acetylcholinesterase').includes('AChE'));
});

test('definitions have two independent English scoring points and bilingual teaching support',()=>{
 const a=api();assert.ok(Array.isArray(a.terms));assert.ok(a.terms.length>=30);
 const required=['action potential','refractory period','saltatory conduction','voltage clamp','patch clamp','synapse','synaptic contact','synaptic vesicle','transmitter release','spatial summation','temporal summation','shunting inhibition','length constant','immunohistochemistry','fluorescence in situ hybridization','microiontophoresis','agonist','antagonist','precursor','choline acetyltransferase','acetylcholinesterase','G protein-coupled receptor'];
 for(const term of required)assert.ok(a.terms.some(t=>t.term===term),term);
 for(const t of a.terms){assert.match(t.id,/^D-/);pair(t.prompt);pair(t.mistake);assert.ok(t.model.length>35);assert.equal(t.points.length,2);assert.notEqual(t.points[0].en,t.points[1].en);for(const p of t.points){assert.ok(p.text&&p.en);assert.equal(p.marks,1);}assert.ok(t.sources.length);}
});

test('SVG questions hide answers accessibly and answer mode exposes instructional labels',()=>{
 const a=api();assert.equal(typeof a.renderFigure,'function');assert.equal(a.renderFigure('missing'),'');
 for(const f of a.figures){const hidden=a.renderFigure(f.id,{answers:false}),answer=a.renderFigure(f.id,{answers:true});assert.match(hidden,/^<svg /);assert.match(hidden,/viewBox="0 0 760 360"/);assert.match(hidden,/role="img"/);assert.match(hidden,/aria-labelledby=/);assert.match(hidden,/>A<\/text>/);assert.ok(!/undefined|NaN|<script|onload=/.test(hidden),f.id);assert.ok(!hidden.toLowerCase().includes(f.term.toLowerCase()),`answer leak: ${f.id}`);assert.ok(answer.includes(f.term),f.id);assert.notEqual(hidden,answer);}
 const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),sandbox);assert.equal(typeof sandbox.window.Neuro46Atlas.renderFigure,'function');
});

test('scientifically distinct diagrams have distinct evidence and chemical atoms and bonds',()=>{
 const a=api();assert.ok(a.figures);
 const render=term=>a.renderFigure(a.figures.find(f=>f.term===term).id);
 for(const [one,two] of [['absolute refractory period','relative refractory period'],['continuous conduction','saltatory conduction'],['channelrhodopsin-2','halorhodopsin'],['synaptic vesicle recycling','transmitter clearance'],['fluorescence in situ hybridization','immunohistochemistry'],['microiontophoresis','patch clamp'],['Gray type I synapse','Gray type II synapse']])assert.notEqual(render(one).replace(/<title[^>]*>.*?<\/title>/g,''),render(two).replace(/<title[^>]*>.*?<\/title>/g,''));
 for(const term of ['phenylalanine','tyrosine','L-DOPA','dopamine','norepinephrine','epinephrine','tryptophan','5-hydroxytryptophan','serotonin','glutamate','glycine','GABA']){const svg=render(term);assert.match(svg,/>NH(?:[₂2]|<)|>HN|>N</,term);assert.ok((svg.match(/<line /g)||[]).length>=4,term);assert.ok(!svg.includes('COOH—'),term);}
 assert.match(render('serotonin'),/>N<\/text>.*>H<\/text>/);assert.match(render('5-hydroxytryptophan'),/>N<\/text>.*>H<\/text>/);
 assert.match(render('microiontophoresis'),/nA/);assert.match(render('length constant'),/37%/);
});
