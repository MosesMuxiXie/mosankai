const test=require('node:test'),assert=require('node:assert/strict');
const {createStore}=require('../public/studyguides/study-progress');
const catalog=require('../public/studyguides/catalog.json'),index=require('../public/studyguides/learning-index.json');
const id='literature-androids-13-18';
function setup(){const map=new Map();return {storage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)},map};}
test('new Androids guide is registered with all 96 indexed questions',()=>{
 assert.ok(catalog.materials.some(m=>m.id===id),'new material must be registered');assert.equal(index[id]?.questions.length,96);
});
test('new guide saves focus resume, validates state and isolates the old guide',()=>{
 const {storage}=setup(),store=createStore({storage,catalog,index,now:()=>2000});
 store.save(id,{resume:{section:'quiz',topic:'tone',chapter:'14',category:'analysis',type:'short',questionId:'c14-s03'},progress:{state:{version:1,answers:{'c14-s03':'A supported response.'},checked:['c14-s03'],submitted:[],assessed:{'c14-s03':[true,false,true]}}}});
 assert.equal(store.read(id).resume.topic,'tone');assert.equal(store.read(id).progress.state.answers['c14-s03'],'A supported response.');
 assert.equal(Object.keys(store.read('literature-androids-10-12').progress.state).length,0);
 assert.throws(()=>store.save(id,{progress:{state:{version:2}}}));
 assert.throws(()=>store.save(id,{progress:{state:{version:1,answers:{m01:1}}}}));
 const backup=JSON.parse(store.exportBackup());assert.ok(backup.records.some(r=>r.materialId===id));
});
test('new guide legacy drafts migrate within their own material namespace',()=>{
 const {storage}=setup();storage.setItem('dadoes-ch13-18-review-v1',JSON.stringify({version:1,answers:{'c13-m01':1},checked:['c13-m01'],submitted:[],assessed:{}}));
 const store=createStore({storage,catalog,index,now:()=>3000});assert.equal(store.read(id).progress.state.answers['c13-m01'],1);assert.ok(store.read(id).progress.results['c13-m01']);assert.equal(store.read('literature-androids-10-12').progress.results.m01,undefined);
});
