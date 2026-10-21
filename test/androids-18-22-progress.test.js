const test=require('node:test'),assert=require('node:assert/strict');
const {createStore}=require('../public/studyguides/study-progress');
const catalog=require('../public/studyguides/catalog.json'),index=require('../public/studyguides/learning-index.json');
const id='literature-androids-18-22';
function setup(){const map=new Map();return {storage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)},map};}
test('Chapters 18–22 is discoverable with all 96 questions',()=>{
 assert.ok(catalog.materials.some(m=>m.id===id));assert.equal(index[id]?.questions.length,96);
 assert.equal(index[id].questions.filter(q=>q.type==='written').length,36);
});
test('new review saves written feedback and resume without changing either earlier review',()=>{
 const {storage}=setup(),store=createStore({storage,catalog,index,now:()=>2000});
 store.save('literature-androids-13-18',{progress:{state:{version:1,answers:{'c18-m01':1},checked:['c18-m01'],submitted:[],assessed:{}}}});
 store.save(id,{resume:{section:'quiz',topic:'tone',chapter:'22',category:'analysis',type:'short',questionId:'c22-s06'},progress:{state:{version:1,answers:{'c22-s06':'The correction distinguishes preference from pleasure.'},checked:['c22-s06'],submitted:[],assessed:{'c22-s06':[false,false,true]}}}});
 assert.equal(store.read(id).resume.topic,'tone');assert.equal(store.read(id).progress.state.assessed['c22-s06'][2],true);
 assert.equal(store.read('literature-androids-13-18').progress.state.answers['c18-m01'],1);
 assert.equal(Object.keys(store.read('literature-androids-10-12').progress.state).length,0);
 const backup=store.exportBackup(),restored=createStore({storage:setup().storage,catalog,index,now:()=>3000});restored.importBackup(backup).commit();
 assert.equal(restored.read(id).resume.questionId,'c22-s06');assert.equal(restored.read('literature-androids-13-18').progress.state.answers['c18-m01'],1);
 assert.throws(()=>store.save(id,{progress:{state:{version:2}}}));assert.throws(()=>store.save(id,{progress:{state:{version:1,answers:{'c13-m01':1}}}}));
});
test('legacy 18–22 drafts migrate only into the new namespace',()=>{
 const {storage}=setup();storage.setItem('dadoes-ch18-22-review-v1',JSON.stringify({version:1,answers:{'c18-m01':1},checked:['c18-m01'],submitted:[],assessed:{}}));
 const store=createStore({storage,catalog,index,now:()=>3000});assert.equal(store.read(id).progress.state.answers['c18-m01'],1);
 assert.equal(store.read('literature-androids-13-18').progress.state.answers?.['c18-m01'],undefined);
});
