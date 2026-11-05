(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Neuro46Core=factory();})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const has=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
 const bank=data=>[...data.mcq,...data.frq,...(data.figures||[]),...(data.terms||[])];
 const written=data=>[...data.frq,...(data.terms||[])];
 const response=(answers,id)=>answers[id]===undefined?'':answers[id];
 function freshAttempt(paper){return {answers:{},selected:paper?.format==='midterm2026'?[...paper.frq]:[],submitted:false,self:{},selfAnswers:{},startedAt:0,elapsed:0};}
 function freshState(){return {version:1,answers:{},checked:[],assessed:{},assessedAnswers:{},spelling:{answers:{},checked:{}},definitions:{answers:{},self:{},selfAnswers:{}},learned:[],exams:{},section:'priorities',learnChapter:4,chapter:'all',topic:'all',priority:'all',type:'mc',questionId:null,mock:'mock1',wrongOnly:false};}
 function safeJSON(value,depth=0){if(depth>12)throw Error('Invalid review state');if(value===null||typeof value==='boolean')return;if(typeof value==='number'&&Number.isFinite(value))return;if(typeof value==='string'&&value.length<=12000)return;if(Array.isArray(value)&&value.length<=1000){value.forEach(x=>safeJSON(x,depth+1));return;}if(!plain(value)||Object.keys(value).length>1000)throw Error('Invalid review state');for(const [key,v]of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))throw Error('Invalid review state');safeJSON(v,depth+1);}}
 function validAnswers(data,answers,allowed){if(!plain(answers))throw Error('Invalid answers');for(const [id,value]of Object.entries(answers)){const q=bank(data).find(q=>q.id===id);if(!q||(allowed&&!allowed.includes(id)))throw Error('Invalid answer identity');if(q.options){if(!Number.isInteger(value)||value<0||value>=q.options.length)throw Error('Invalid choice');}else if(typeof value!=='string'||value.length>12000)throw Error('Invalid written answer');}}
 function validBindings(bindings,allowed){if(bindings===undefined)return;if(!plain(bindings))throw Error('Invalid assessment bindings');for(const [id,value]of Object.entries(bindings))if(!allowed.includes(id)||typeof value!=='string'||value.length>12000)throw Error('Invalid assessment binding');}
 function cleanSelf(data,self,answers,bindings,allowed,legacy){
  if(!plain(self))throw Error('Invalid self-assessment');validBindings(bindings,allowed);const clean={},bound={};
  for(const [id,value]of Object.entries(self)){
   const q=written(data).find(q=>q.id===id);if(!q||!allowed.includes(id)||!Array.isArray(value)||value.length!==q.points.length||value.some(x=>typeof x!=='boolean'))throw Error('Invalid rubric');
   const answer=response(answers,id);
   if(bindings&&has(bindings,id)&&bindings[id]!==answer)continue;
   if(!answer.trim()&&value.some(Boolean))throw Error('Blank response cannot earn marks');
   if(!has(bindings||{},id)&&(!legacy||!data.frq.some(q=>q.id===id)))continue;clean[id]=[...value];bound[id]=answer;
  }
  return {self:clean,bindings:bound};
 }
 function validateAttempt(data,paper,a){
  if(!plain(a)||typeof a.submitted!=='boolean'||!Array.isArray(a.selected)||new Set(a.selected).size!==a.selected.length||a.selected.some(id=>!paper.frq.includes(id))||![a.startedAt,a.elapsed].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('Invalid exam attempt');
  if(paper.format==='midterm2026'?a.selected.length!==paper.frq.length||paper.frq.some(id=>!a.selected.includes(id)):a.selected.length>8)throw Error('Invalid exam selection');
  safeJSON(a);const ids=[...paper.mcq,...paper.frq,...(paper.figures||[]),...(paper.terms||[])],rubrics=[...paper.frq,...(paper.terms||[])];validAnswers(data,a.answers,ids);
  const cleaned=cleanSelf(data,a.self,a.answers,a.selfAnswers,rubrics,paper.format!=='midterm2026');return {...clone(a),self:cleaned.self,selfAnswers:cleaned.bindings};
 }
 function sanitizeState(data,s){
  if(!plain(s)||s.version!==1||!Array.isArray(s.checked)||s.checked.some(id=>!data.mcq.some(q=>q.id===id))||!Array.isArray(s.learned)||s.learned.some(id=>!data.topics.some(t=>t.id===id))||!plain(s.exams))throw Error('Invalid review state');
  safeJSON(s);validAnswers(data,s.answers);const next=clone(s),frqIds=data.frq.map(q=>q.id),assessed=cleanSelf(data,s.assessed,s.answers,s.assessedAnswers,frqIds,true);next.assessed=assessed.self;next.assessedAnswers=assessed.bindings;
  const spelling=s.spelling===undefined?{answers:{},checked:{}}:s.spelling;if(!plain(spelling))throw Error('Invalid spelling state');validAnswers(data,spelling.answers,(data.figures||[]).map(q=>q.id));validBindings(spelling.checked,(data.figures||[]).map(q=>q.id));if(!plain(spelling.checked))throw Error('Invalid spelling checks');next.spelling={...clone(spelling),checked:Object.fromEntries(Object.entries(spelling.checked).filter(([id,text])=>has(spelling.answers,id)&&text===spelling.answers[id]))};
  const definitions=s.definitions===undefined?{answers:{},self:{},selfAnswers:{}}:s.definitions;if(!plain(definitions))throw Error('Invalid definitions state');const termIds=(data.terms||[]).map(q=>q.id);validAnswers(data,definitions.answers,termIds);const terms=cleanSelf(data,definitions.self,definitions.answers,definitions.selfAnswers,termIds,false);next.definitions={...clone(definitions),self:terms.self,selfAnswers:terms.bindings};
  for(const [key,a]of Object.entries(s.exams)){const paper=data.mocks.find(p=>p.id===key);if(!paper)throw Error('Invalid exam');next.exams[key]=validateAttempt(data,paper,a);}return next;
 }
 function validateState(data,s){return sanitizeState(data,s);}
 function checkSpelling(q,text){if(typeof text!=='string')return false;const normalize=value=>String(value).toLowerCase().trim().replace(/[\p{Dash_Punctuation}\u2212]/gu,'-').replace(/\s+/g,' ');const answer=normalize(text);return !!answer&&[q.term,...(q.accepted||[])].filter(x=>typeof x==='string').some(x=>normalize(x)===answer);}
 function assessment(data,s){const answers={},checked=[];for(const id of s.checked){const q=data.mcq.find(q=>q.id===id);if(q&&Number.isInteger(s.answers[id])){answers[id]=s.answers[id];checked.push(id);}}return {answers,checked};}
 function snapshot(data,s){const p=data.mocks.find(p=>p.id===s.mock),a=p&&s.exams[p.id];const results=s.section==='mocks'&&a?.submitted?{answers:Object.fromEntries(p.mcq.filter(id=>Number.isInteger(a.answers[id])).map(id=>[id,a.answers[id]])),checked:p.mcq.filter(id=>Number.isInteger(a.answers[id]))}:assessment(data,s);return {state:clone(s),...results,resume:{section:s.section,questionId:s.questionId,chapter:s.chapter,topic:s.topic,type:s.type}};}
 function resolveTarget(data,s,{topicId,questionId,section,resume=false}={}){const next=clone(s),t=data.topics.find(t=>t.id===topicId),q=bank(data).find(q=>q.id===questionId);if(t&&!resume){next.topic=t.id;next.chapter=String(t.chapter);next.learnChapter=t.chapter;next.section=section==='practice'?'practice':'learn';next.priority='all';next.wrongOnly=false;next.questionId=null;if(next.section==='practice')next.type='mc';}if(q){next.questionId=q.id;next.chapter=String(q.chapter);next.topic=q.topic;next.priority='all';next.type=q.options?'mc':'written';next.section='practice';next.wrongOnly=false;if((data.figures||[]).some(v=>v.id===q.id)||(data.terms||[]).some(v=>v.id===q.id)){next.section='drills';next.drill={...next.drill,chapter:'all',category:'all',wrongOnly:false,type:(data.figures||[]).some(v=>v.id===q.id)?'spelling':'definition',questionId:q.id};}}return next;}
 function scoreMock(data,paper,a){
  const mcq=paper.mcq.reduce((n,id)=>n+(Number.isInteger(a.answers[id])&&a.answers[id]===data.mcq.find(q=>q.id===id).answer?2:0),0),midterm=paper.format==='midterm2026';
  const ready=ids=>a.submitted&&ids.every(id=>{const q=written(data).find(q=>q.id===id),marks=a.self[id],answer=response(a.answers,id);return q&&Array.isArray(marks)&&marks.length===q.points.length&&marks.every(v=>typeof v==='boolean')&&(midterm?has(a.selfAnswers||{},id)&&a.selfAnswers[id]===answer:!has(a.selfAnswers||{},id)||a.selfAnswers[id]===answer)&&(answer.trim()||marks.every(v=>v===false));});
  const sum=ids=>ids.reduce((n,id)=>n+written(data).find(q=>q.id===id).points.reduce((v,p,i)=>v+(a.self[id][i]?p.marks:0),0),0);
  const selected=midterm?paper.frq:a.selected,selection=midterm?a.selected.length===paper.frq.length&&paper.frq.every(id=>a.selected.includes(id)):a.selected.length===8;
  const frq=selection&&ready(selected)?sum(selected):null;
  if(!midterm)return {mcq,frq,total:frq===null?null:mcq+frq};
  const figures=(paper.figures||[]).reduce((n,id)=>n+(checkSpelling((data.figures||[]).find(q=>q.id===id),a.answers[id])?1:0),0),bonus=ready(paper.terms||[])?sum(paper.terms||[]):null;
  return {mcq,figures,frq,total:frq===null?null:mcq+frq+figures,bonus};
 }
 function mapTarget(data,saved,entry,hash,resume){const valid=id=>data.topics.some(t=>t.id===id),node=String(hash||'').startsWith('#node-')?hash.slice(6):null;return valid(node)?node:!resume&&valid(entry)?entry:valid(saved)?saved:valid(entry)?entry:data.topics[0].id;}
 function passivePSP(v,x,lambda){return lambda>0?v*Math.exp(-x/lambda):0;}
 function ionCurrent(g,vm,e){return g===0||vm===e?0:g*(vm-e);}
 return {freshAttempt,freshState,checkSpelling,sanitizeState,validateAttempt,validateState,assessment,snapshot,resolveTarget,mapTarget,scoreMock,passivePSP,ionCurrent};
});
