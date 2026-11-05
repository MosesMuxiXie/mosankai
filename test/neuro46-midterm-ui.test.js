const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const file=path.join(__dirname,'../public/studyguides/neuroscience/guides/neuro46-midterm-ui.js');
const api=()=>{assert.ok(fs.existsSync(file),'midterm drill renderer must exist');return require(file);};
const q={id:'G-test',chapter:6,topic:'c6-t2',category:'method',term:'immunohistochemistry',accepted:['immunohistochemistry'],prompt:{zh:'写出技术英文全称。',en:'Write the full technique name.'},explanation:{zh:'抗体识别抗原。',en:'Antibodies recognize antigens.'},mistake:{zh:'荧光不能区分技术。',en:'Fluorescence alone does not distinguish techniques.'},sources:[['N6','p.2']]};
const t={id:'D-test',chapter:6,topic:'c6-t4',term:'Agonist',prompt:{zh:'定义术语。',en:'Define the term.'},model:'A ligand that binds and activates its receptor.',points:[{text:'结合受体',en:'Binds its receptor',marks:1},{text:'激活受体',en:'Activates the receptor',marks:1}],mistake:q.mistake,sources:q.sources};
test('spelling output hides the answer until checking and disables spelling assistance',()=>{
 const a=api(),html=a.renderSpelling(q,'<try>',{figure:'<svg aria-label="A labeled probe"></svg>'});
 assert.ok(!html.includes('immunohistochemistry'));assert.ok(html.includes('spellcheck="false"'));assert.ok(html.includes('autocorrect="off"'));assert.ok(html.includes('&lt;try&gt;'));
 const checked=a.renderSpelling(q,'immunohistochemstry',{figure:'<svg></svg>',checked:true,correct:false});
 assert.ok(checked.includes('immunohistochemistry'));assert.ok(checked.includes('Antibodies recognize antigens.'));
});
test('definitions reveal a two-point self rubric only on request and preserve explicit zero',()=>{
 const a=api();assert.ok(!a.renderDefinition(t,'',{}).includes(t.model));
 const html=a.renderDefinition(t,'',{show:true,self:[false,false]});assert.ok(html.includes(t.model));assert.ok(html.includes('0/2'));assert.equal((html.match(/data-definition-point=/g)||[]).length,2);
});
test('current score presentation keeps bonus separate and does not block a ready base result',()=>{
 const a=api(),html=a.renderCurrentScore({mcq:60,frq:30,figures:10,total:100,bonus:null},true);
 assert.ok(html.includes('100/100'));assert.ok(html.includes('Bonus'));assert.ok(!html.includes('110/100'));
 assert.ok(a.renderCurrentScore({mcq:0,frq:0,figures:0,total:0,bonus:0},true).includes('0/100'));
});

test('temporary drill printing restores ordinary reading even when the native printer throws',()=>{
 const a=api();assert.equal(typeof a.withPrintOutput,'function');
 const children=[],classes=new Set(),body={append:x=>children.push(x),classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},output={remove:()=>children.splice(children.indexOf(output),1)};
 assert.throws(()=>a.withPrintOutput(body,output,()=>{assert.deepEqual(children,[output]);assert.ok(classes.has('print-midterm'));throw Error('Printer unavailable');}),/Printer unavailable/);
 assert.deepEqual(children,[]);assert.equal(classes.size,0);
});

for(const printerThrows of [false,true])test(`lesson printing excludes every other section and restores visibility after ${printerThrows?'a printer error':'printing'}`,()=>{
 const a=api();assert.equal(typeof a.withPrintSection,'function');
 const learn={id:'learn',hidden:false},atlas={id:'atlas',hidden:false,figures:Array(81).fill('<svg></svg>')};
 const children=[{id:'home',hidden:false},{id:'exam-blueprint',hidden:false},learn,atlas,{id:'drills',hidden:false},{id:'sources',hidden:false},{id:'future-section',hidden:true}];
 learn.parentElement={children};
 const original=children.map(section=>section.hidden);
 const print=()=>{
  assert.deepEqual(children.filter(section=>!section.hidden).map(section=>section.id),['learn']);
  assert.equal(children.filter(section=>!section.hidden).flatMap(section=>section.figures||[]).length,0,'all 81 atlas figures are excluded');
  if(printerThrows)throw Error('Printer unavailable');
  return 'printed';
 };
 if(printerThrows)assert.throws(()=>a.withPrintSection(learn,print),/Printer unavailable/);
 else assert.equal(a.withPrintSection(learn,print),'printed');
 assert.deepEqual(children.map(section=>section.hidden),original,'including an already hidden section');
});

test('guide menu opens all links and closes after any link selection without relying on a hash change',()=>{
 const a=api();assert.equal(typeof a.initGuideMenu,'function');
 const listeners={},classes=new Set(),attributes={'aria-expanded':'false'};
 const button={getAttribute:key=>attributes[key],setAttribute:(key,value)=>attributes[key]=value,addEventListener:(event,run)=>listeners['button-'+event]=run};
 const links=Array.from({length:8},(_,i)=>({hash:i===7?'#drills':'#section-'+i}));
 const nav={children:links,classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name),remove:name=>classes.delete(name)},addEventListener:(event,run)=>listeners['nav-'+event]=run};
 a.initGuideMenu(button,nav);
 for(const link of links){
  listeners['button-click']();assert.equal(attributes['aria-expanded'],'true');assert.ok(classes.has('open'));
  let prevented=false;
  listeners['nav-click']({target:{closest:selector=>selector==='a'?link:null},preventDefault:()=>prevented=true});
  assert.equal(attributes['aria-expanded'],'false');assert.ok(!classes.has('open'));assert.equal(prevented,false,'anchor keyboard/default navigation remains available');
 }
 listeners['button-click']();listeners['button-click']();assert.equal(attributes['aria-expanded'],'false');assert.ok(!classes.has('open'));
});
