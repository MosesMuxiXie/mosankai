const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../public/studyguides/study-progress');
const catalog = {materials:[{id:'statistics-review',kind:'guide',subject:'statistics',href:'/studyguides/statistics/guides/statistics-review.html'},{id:'lit-source',kind:'source',subject:'english',href:'/studyguides/english/sources/a.pdf'}]};
const index = {'statistics-review': {questions:[{id:'STAT-001',type:'mc',answer:1,options:['a','b','c','d'],prompt:'Question'},{id:'STAT-002',type:'written',prompt:'Explain'}],cardIds:['0','1']}};
function setup(blocked=false){ const data=new Map();let tick=1000;const storage={getItem:k=>data.get(k)||null,setItem(k,v){if(blocked)throw Error('blocked');data.set(k,v);},removeItem:k=>data.delete(k)};return {data,storage,store:createStore({storage,catalog,index,now:()=>++tick})}; }
test('independent records and patch saves preserve favorites and prior answers',()=>{
 const {store,storage}=setup(); store.save('statistics-review',{favorite:true});store.save('statistics-review',{progress:{state:{choices:{'STAT-001':0}}}});store.save('lit-source',{favorite:true});
 assert.equal(store.read('statistics-review').favorite,true);assert.equal(store.read('statistics-review').progress.state.choices['STAT-001'],0);
 assert.equal(createStore({storage,catalog,index}).read('lit-source').favorite,true);
 assert.throws(()=>store.save('../evil',{favorite:true}));
});
test('only checked MC results enter wrong answers; completion is distinct from correcting',()=>{
 const {store}=setup();store.save('statistics-review',{progress:{state:{choices:{'STAT-001':0}}}});assert.equal(store.wrongItems().length,0);
 store.save('statistics-review',{progress:{results:{'STAT-001':{status:'incorrect',updatedAt:1100}}}});assert.equal(store.reviewItems().length,1);
 store.save('statistics-review',{reviewed:{'STAT-001':1200}});assert.equal(store.reviewItems().length,0);assert.equal(store.wrongItems().length,1);
 store.save('statistics-review',{progress:{results:{'STAT-001':{status:'incorrect',updatedAt:1300}}}});assert.equal(store.reviewItems().length,1);
 store.save('statistics-review',{progress:{results:{'STAT-001':{status:'correct',updatedAt:1400}}}});assert.equal(store.wrongItems().length,0);
 assert.throws(()=>store.save('statistics-review',{progress:{results:{'STAT-002':{status:'incorrect',updatedAt:1400}}}}));
});
test('backup preview does not mutate, merges newer records and rejects malformed input atomically',()=>{
 const {store}=setup();store.save('statistics-review',{favorite:true});const backup=JSON.parse(store.exportBackup());backup.records[0].favorite=false;backup.records[0].updatedAt=9999;
 const preview=store.importBackup(backup);assert.equal(preview.overwritten,1);assert.equal(store.read('statistics-review').favorite,true);
 preview.commit();assert.equal(store.read('statistics-review').favorite,false);
 const duplicate=store.importBackup(backup);assert.equal(duplicate.skipped,1);
 backup.records.push({materialId:'unknown',version:1});assert.equal(store.importBackup(backup).skipped,2);
 const bad=JSON.parse(store.exportBackup());bad.records.push({...bad.records[0],materialId:'lit-source',favorite:'yes'});
 assert.throws(()=>store.importBackup(bad));assert.equal(store.read('statistics-review').favorite,false);
 assert.throws(()=>store.importBackup('{'));assert.throws(()=>store.importBackup({version:999,records:[]}));
});
test('blocked storage preserves session progress in exports and reports persistence failure',()=>{
 const {store}=setup(true);const result=store.save('statistics-review',{favorite:true});assert.equal(result.persisted,false);
 assert.equal(store.read('statistics-review').favorite,true);assert.equal(JSON.parse(store.exportBackup()).records[0].favorite,true);
});
test('invalid question IDs, answers and unsafe resume fields cannot enter records',()=>{
 const {store}=setup();assert.throws(()=>store.save('statistics-review',{resume:{href:'https://evil.example'}}));
 assert.throws(()=>store.save('statistics-review',{progress:{state:{choices:{'STAT-001':8}}}}));
 assert.throws(()=>store.save('statistics-review',{progress:{state:{choices:{'bad':1}}}}));
 store.save('statistics-review',{pending:{material:true,questions:['STAT-002']}});assert.equal(store.reviewItems().length,2);
});
test('legacy migrations preserve real wrong IDs without inventing neuro answers and run only once',()=>{
 const realCatalog=require('../public/studyguides/catalog.json'),realIndex=require('../public/studyguides/learning-index.json');
 const {storage}=setup();storage.setItem('neuro-guide-v1',JSON.stringify({learned:[],wrong:[0,1000,-1],seen:[0,1]}));
 storage.setItem('dadoes-ch10-12-review-v1',JSON.stringify({version:1,answers:{m01:1},checked:['m01'],submitted:['m02'],assessed:{}}));
 const store=createStore({storage,catalog:realCatalog,index:realIndex,now:()=>5000});
 assert.equal(store.read('neuroscience-review').progress.results['MCQ-001'].status,'incorrect');
 assert.equal(store.read('neuroscience-review').progress.state.answers,undefined);
 assert.deepEqual(store.read('neuroscience-review').progress.state.wrong,[0]);
 assert.equal(store.read('literature-androids-10-12').progress.results.m01.status,'incorrect');
 assert.equal(store.read('literature-androids-10-12').progress.results.m02,undefined);
 store.save('neuroscience-review',{favorite:true});
 assert.equal(createStore({storage,catalog:realCatalog,index:realIndex}).read('neuroscience-review').favorite,true);
 assert.ok(storage.getItem('neuro-guide-v1'),'legacy source remains available');
});
test('backup storage failure rolls back earlier writes and retains both existing records',()=>{
 const {store,storage}=setup();store.save('statistics-review',{favorite:true});store.save('lit-source',{favorite:true});
 const backup=JSON.parse(store.exportBackup());backup.records.forEach(r=>{r.updatedAt=9999;r.favorite=false;});
 const original=storage.setItem.bind(storage);storage.setItem=(key,value)=>{if(key.endsWith('lit-source')&&!JSON.parse(value).favorite)throw Error('Quota');original(key,value);};
 assert.throws(()=>store.importBackup(backup).commit());assert.equal(store.read('statistics-review').favorite,true);assert.equal(store.read('lit-source').favorite,true);
});
test('storage events refresh other tabs and independent patches preserve another tab’s changes',()=>{
 const {storage}=setup();let listener;const store=createStore({storage,catalog,index,events:{addEventListener(name,fn){listener=fn;}}});const other=createStore({storage,catalog,index});
 let notified=null;store.subscribe(id=>{notified=id;});other.save('statistics-review',{favorite:true});listener({key:'mosankai:study:v1:statistics-review'});
 assert.equal(notified,'statistics-review');store.save('statistics-review',{pending:{material:true}});assert.equal(store.read('statistics-review').favorite,true);
});
test('a corrupt existing record remains recoverable while new session edits can still be exported',()=>{
 const {storage}=setup();storage.setItem('mosankai:study:v1:statistics-review','corrupt original');const store=createStore({storage,catalog,index});
 store.read('statistics-review');const result=store.save('statistics-review',{favorite:true});assert.equal(result.persisted,false);
 assert.equal(storage.getItem('mosankai:study:v1:statistics-review'),'corrupt original');assert.equal(JSON.parse(store.exportBackup()).records[0].favorite,true);
});
test('invalid native attempt booleans and latest-review state versions are rejected before import',()=>{
 const realCatalog=require('../public/studyguides/catalog.json'),realIndex=require('../public/studyguides/learning-index.json'),{storage}=setup();
 const store=createStore({storage,catalog:realCatalog,index:realIndex});
 assert.throws(()=>store.save('neuroscience-review',{progress:{state:{session:{queue:[0],answers:[1],pos:0,isMock:false,submitted:'false',reviewWrong:false}}}}));
 assert.throws(()=>store.save('literature-androids-10-12',{progress:{state:{version:2}}}));
});
