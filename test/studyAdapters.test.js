const test=require('node:test');const assert=require('node:assert/strict');
const {assessedResults,rebaseState}=require('../public/studyguides/guide-adapters');
const bank=[{id:'a',type:'mc',answer:1,options:['x','y']},{id:'s',type:'written'}];
test('drafts and blanks do not become wrong answers, and a corrected checked answer replaces the last result',()=>{
 assert.deepEqual(assessedResults(bank,{a:0},[],{},10),{});
 const wrong=assessedResults(bank,{a:0},['a'],{},20);assert.equal(wrong.a.status,'incorrect');
 assert.equal(assessedResults(bank,{a:1},[],wrong,30).a.status,'incorrect','wrong history remains while a new attempt is ungraded');
 assert.equal(assessedResults(bank,{a:1},['a'],wrong,40).a.status,'correct');
 assert.deepEqual(assessedResults(bank,{},['a','s'],{},50),{});
});
test('ordinary navigation retains result timestamps; a new submitted attempt updates them',()=>{
 const prior={a:{status:'incorrect',updatedAt:12}};
 assert.equal(assessedResults(bank,{a:0},['a'],prior,30).a.updatedAt,12);
 assert.equal(assessedResults(bank,{a:0},['a'],prior,40,['a']).a.updatedAt,40);
});
test('a tab saves only its changed answers and preserves answers added by another tab',()=>{
 const merged=rebaseState({answers:{a:0},checked:['a']},{answers:{a:1},checked:[]},{answers:{a:0,b:2},checked:['a','b']});
 assert.deepEqual(merged,{answers:{a:1,b:2},checked:['b']});
 const cleared=rebaseState({notes:{s:'old'}},{notes:{}},{notes:{s:'old',other:'remote'}});
 assert.deepEqual(cleared,{notes:{other:'remote'}});
});
