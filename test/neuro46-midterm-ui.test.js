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
