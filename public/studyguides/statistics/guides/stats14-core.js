(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Stats14Core=factory();})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 function summary(values){
  if(!Array.isArray(values)||values.length<2||values.some(v=>!Number.isFinite(v)))throw Error('At least two finite observations required');
  const a=[...values].sort((x,y)=>x-y),n=a.length,mid=x=>x.length%2?x[(x.length-1)/2]:(x[x.length/2-1]+x[x.length/2])/2;
  const mean=a.reduce((s,x)=>s+x,0)/n,median=mid(a),q1=mid(a.slice(0,Math.floor(n/2))),q3=mid(a.slice(Math.ceil(n/2))),iqr=q3-q1;
  return {mean,median,q1,q3,iqr,sd:Math.sqrt(a.reduce((s,x)=>s+(x-mean)**2,0)/(n-1)),outliers:a.filter(x=>x<q1-1.5*iqr||x>q3+1.5*iqr)};
 }
 function normalCDF(z){if(!Number.isFinite(z))throw Error('Finite z required');if(z===0)return .5;const x=Math.abs(z),t=1/(1+.2316419*x),poly=t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429)))),tail=Math.exp(-x*x/2)/Math.sqrt(2*Math.PI)*poly;return z>=0?1-tail:tail;}
 function normalQuantile(p){if(!(p>0&&p<1))throw Error('Probability must lie strictly between 0 and 1');let lo=-10,hi=10;for(let i=0;i<70;i++){const m=(lo+hi)/2;if(normalCDF(m)<p)lo=m;else hi=m;}return (lo+hi)/2;}
 function regression(points){
  if(!Array.isArray(points)||points.length<3||points.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v))))throw Error('At least three finite pairs required');
  const n=points.length,xbar=points.reduce((s,p)=>s+p[0],0)/n,ybar=points.reduce((s,p)=>s+p[1],0)/n,sxx=points.reduce((s,p)=>s+(p[0]-xbar)**2,0),syy=points.reduce((s,p)=>s+(p[1]-ybar)**2,0),sxy=points.reduce((s,p)=>s+(p[0]-xbar)*(p[1]-ybar),0);
  if(sxx===0||syy===0)throw Error('Both variables must vary');const slope=sxy/sxx,intercept=ybar-slope*xbar,residuals=points.map(([x,y])=>y-(intercept+slope*x)),sse=residuals.reduce((s,e)=>s+e*e,0),r=sxy/Math.sqrt(sxx*syy);
  return {slope,intercept,r,r2:Math.max(0,Math.min(1,1-sse/syy)),residuals,residualSD:Math.sqrt(sse/(n-2))};
 }
 function freshState(){return {version:1,answers:{},checked:[],assessed:{},learned:[],section:'overview',learnChapter:'1',chapter:'all',topic:'all',type:'all',level:'all',questionId:null,wrongOnly:false,mapTopic:'st14-c1-data'};}
 const question=(d,id)=>d.questions.find(q=>q.id===id);
 function setAnswer(d,s,id,value){const q=question(d,id);if(!q||(q.type==='mc'?(!Number.isInteger(value)||value<0||value>=q.options.length):(typeof value!=='string'||value.length>12000)))throw Error('Invalid answer');s.answers[id]=value;s.checked=s.checked.filter(x=>x!==id);if(q.type==='written')delete s.assessed[id];}
 function check(d,s,id){const q=question(d,id);if(q?.type!=='mc'||!Number.isInteger(s.answers[id]))throw Error('Choose a valid MCQ answer before checking');s.checked=[...new Set([...s.checked,id])];return s.answers[id]===q.answer;}
 function validateState(d,s){
  if(!s||s.version!==1||!s.answers||typeof s.answers!=='object'||Array.isArray(s.answers)||!s.assessed||typeof s.assessed!=='object'||Array.isArray(s.assessed)||!Array.isArray(s.checked)||s.checked.some(id=>question(d,id)?.type!=='mc')||!Array.isArray(s.learned)||s.learned.some(id=>!d.topics.some(t=>t.id===id)))throw Error('Invalid study state');
  const scratch=freshState();for(const [id,v]of Object.entries(s.answers))setAnswer(d,scratch,id,v);
  for(const id of s.checked)if(!Number.isInteger(s.answers[id]))throw Error('Checked answer missing');
  for(const [id,v]of Object.entries(s.assessed)){const q=question(d,id);if(q?.type!=='written'||!Array.isArray(v)||v.length!==q.rubric.length||v.some(x=>typeof x!=='boolean')||(!String(s.answers[id]||'').trim()&&v.some(Boolean)))throw Error('Invalid self assessment');}
  return clone(s);
 }
 function snapshot(d,s){const answers={},checked=[];for(const id of s.checked){if(question(d,id)?.type==='mc'&&Number.isInteger(s.answers[id])){answers[id]=s.answers[id];checked.push(id);}}return {state:clone(s),answers,checked,resume:{section:s.section,chapter:s.chapter,topic:s.topic,type:s.type,...(s.questionId?{questionId:s.questionId}:{})}};}
 function resolveTarget(d,s,{topicId,questionId,practice=false,resume=false}={}){
  const n=clone(s),t=d.topics.find(t=>t.id===topicId),q=question(d,questionId);
  if(t&&!resume){n.learnChapter=String(t.chapter);n.mapTopic=t.id;n.section=practice?'practice':'learn';if(practice){n.chapter=String(t.chapter);n.topic=t.id;n.type='all';n.level='all';n.wrongOnly=false;n.questionId=d.questions.find(q=>q.topic===t.id)?.id||null;}}
  if(q){n.section='practice';n.chapter=String(q.chapter);n.topic=q.topic;n.type=q.type;n.level='all';n.wrongOnly=false;n.questionId=q.id;}
  return n;
 }
 return {summary,normalCDF,normalQuantile,regression,freshState,setAnswer,check,validateState,snapshot,resolveTarget};
});
