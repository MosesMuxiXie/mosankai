(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Neuro46MidtermUI=factory();})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pair=p=>`<span lang="zh-CN">${esc(p?.zh)}</span><span class="translation" lang="en">${esc(p?.en)}</span>`;
 const refs=q=>`<p class="source-refs">${q.sources.map(([s,p])=>`<span>${esc(s)} · ${esc(p)}</span>`).join('')}</p>`;
 function renderSpelling(q,answer,{figure='',checked=false,correct=false,exam=false,locked=false,print=false}={}){
  const shown=checked?`<div class="feedback" data-spelling-feedback><strong class="${correct?'correct':'incorrect'}">${correct?'拼写正确 / Correct':'核对拼写 / Review spelling'}</strong><p class="canonical" lang="en">${esc(q.term)}</p>${pair(q.explanation)}<p><strong>易混点 / Watch for</strong> ${pair(q.mistake)}</p>${refs(q)}</div>`:'';
  return `<article class="question-card spelling-card"><p class="eyebrow">CHAPTER ${q.chapter} · IDENTIFY & SPELL</p><h3>${pair(q.prompt)}</h3><figure class="question-figure">${figure}<figcaption>教学示意图 / Teaching schematic</figcaption></figure>${!print?`<button class="enlarge-figure" data-enlarge-figure="${esc(q.id)}" data-figure-answers="false">放大图示 / Enlarge figure</button>`:''}${print?'<div class="print-response">Answer: ___________________________________</div>':`<label>英文答案 / English answer<input type="text" data-spelling-answer="${esc(q.id)}"${exam?' data-mid-exam':''} value="${esc(answer)}" maxlength="200" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off"${locked?' disabled':''}></label>`}${!exam&&!print?`<button data-check-spelling="${esc(q.id)}">检查拼写 / Check spelling</button>`:''}${shown}</article>`;
 }
 function renderDefinition(q,answer,{show=false,self,exam=false,locked=false,print=false}={}){
  const model=show?`<div class="feedback" data-definition-feedback><h4>英文定义 / Model definition</h4><p class="model" lang="en">${esc(q.model)}</p><div class="rubric">${q.points.map((p,i)=>`<label><input type="checkbox" data-definition-point="${i}" data-definition-id="${esc(q.id)}"${exam?' data-mid-exam':''}${self?.[i]?' checked':''}${print?' disabled':''}><span>${pair({zh:p.text,en:p.en})} <small>1 分 / 1 mark</small></span></label>`).join('')}</div>${!print?`<button data-definition-zero="${esc(q.id)}"${exam?' data-mid-exam':''}>本题按 0 分记录 / Record zero</button>`:''}<output class="definition-score">${self?`${self.filter(Boolean).length}/2`:'尚未自评 / Not assessed'}</output><p>${pair(q.mistake)}</p>${refs(q)}</div>`:'';
  return `<article class="question-card definition-card"><p class="eyebrow">CHAPTER ${q.chapter} · DEFINE · 2 MARKS</p><h3 lang="en">${esc(q.term)}</h3><p>${pair(q.prompt)}</p>${print?'<div class="print-response">Definition: ___________________________________________________________<br>_____________________________________________________________________</div>':`<label>你的英文定义 / Your English definition<textarea data-definition-answer="${esc(q.id)}"${exam?' data-mid-exam':''} maxlength="12000"${locked?' disabled':''}>${esc(answer)}</textarea></label>`}${!show&&!exam&&!print?`<button data-definition-show="${esc(q.id)}">查看定义与两点评分 / Model & two-point rubric</button>`:''}${model}</article>`;
 }
 function renderCurrentScore(score,submitted){
  if(!submitted)return '<strong>独立草稿 / Separate draft</strong><p>30 MCQ + 6 FRQ + 10 识图 + 5 Bonus 定义。提交后显示解析；空白 MCQ／识图记零，FRQ 和定义对照要点自评。<span class="translation" lang="en">Submit to reveal answers. Blank MCQs and identification items earn zero; assess written responses against the rubric.</span></p>';
  return `<strong>MCQ ${score.mcq}/60 · 识图 / Identification ${score.figures}/10 · FRQ ${score.frq===null?'待自评 / Pending':score.frq+'/30'}</strong><p class="base-score">正卷 / Base ${score.total===null?'待六道 FRQ 自评 / Awaiting six FRQ assessments':score.total+'/100'}</p><p>Bonus ${score.bonus===null?'待五道定义自评 / Awaiting five definition assessments':score.bonus+'/10'}</p>${score.total!==null&&score.bonus!==null?`<p>含加分 / Including bonus ${score.total+score.bonus}/110</p>`:''}<p class="small">FRQ 与定义为自评分；Bonus 不影响正卷成绩显示。空白题请明确记零。<span class="translation" lang="en">Written marks are self-assessed. Bonus assessment does not block the base result. Explicitly record blanks as zero.</span></p>`;
 }
 function withPrintOutput(body,output,runPrint){body.append(output);body.classList.add('print-midterm');try{return runPrint();}finally{body.classList.remove('print-midterm');output.remove();}}
 function withPrintSection(section,runPrint){
  const visibility=[...section.parentElement.children].map(node=>[node,node.hidden]);
  try{for(const [node] of visibility)node.hidden=node!==section;return runPrint();}
  finally{for(const [node,hidden] of visibility)node.hidden=hidden;}
 }
 function initGuideMenu(button,nav){
  const setOpen=open=>{button.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);};
  button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
  nav.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false);});
 }
 function create({data:d,core:c,atlas:a,getState,questionHTML,sourceRefs=items=>refs({sources:items}),message=()=>{},onScore=()=>{}}){
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],shown=new Set();
  const state=()=>getState(),paper=()=>d.mocks.find(p=>p.id===state().mock),attempt=()=>state().exams[paper().id]||(state().exams[paper().id]=c.freshAttempt(paper()));
  const ensure=()=>{const s=state();s.spelling||={answers:{},checked:{}};s.definitions||={answers:{},self:{},selfAnswers:{}};s.drill||={type:'spelling',questionId:null,chapter:'all',category:'all',wrongOnly:false};return s.drill;};
  function rows(){const f=ensure(),s=state();return (f.type==='definition'?d.terms:d.figures).filter(q=>(!f.chapter||f.chapter==='all'||q.chapter===Number(f.chapter))&&(!f.category||f.category==='all'||f.type==='definition'||q.category===f.category)&&(!f.wrongOnly||f.type==='spelling'&&Object.hasOwn(s.spelling.checked,q.id)&&s.spelling.checked[q.id]===s.spelling.answers[q.id]&&!c.checkSpelling(q,s.spelling.answers[q.id])));}
  function figureHTML(q,answers=false){return a.renderFigure(q.id,{answers});}
  function renderDrills(){
   if(!$('#drill-area'))return;const f=ensure(),s=state(),bank=rows();let q=bank.find(q=>q.id===f.questionId)||bank[0];f.questionId=q?.id||null;
   $('#drill-type').value=f.type;$('#drill-chapter').value=f.chapter||'all';$('#drill-category').value=f.category||'all';$('#drill-category').disabled=f.type==='definition';$('#drill-wrong').disabled=f.type==='definition';$('#drill-wrong').setAttribute('aria-pressed',String(!!f.wrongOnly));
   $('#drill-status').textContent=`${bank.length} 项 / items · ${f.type==='spelling'?'先辨认，再独立拼写 / Recognize, then spell independently':'先定义，再核对两个要点 / Define, then check two points'}`;
   $('#drill-select').innerHTML=bank.map((q,i)=>`<option value="${esc(q.id)}">${i+1} · Chapter ${q.chapter}${f.type==='definition'?' · '+esc(q.term):''}</option>`).join('');$('#drill-select').value=q?.id||'';
   if(!q){$('#drill-area').innerHTML='<p class="empty">暂无匹配条目。先完成检查，或放宽筛选。 / No matches. Check answers first or relax filters.</p>';}
   else if(f.type==='spelling')$('#drill-area').innerHTML=renderSpelling(q,s.spelling.answers[q.id]||'',{figure:figureHTML(q),checked:Object.hasOwn(s.spelling.checked,q.id)&&s.spelling.checked[q.id]===s.spelling.answers[q.id],correct:c.checkSpelling(q,s.spelling.answers[q.id]||'')});
   else $('#drill-area').innerHTML=renderDefinition(q,s.definitions.answers[q.id]||'',{show:shown.has(q.id)||Object.hasOwn(s.definitions.self,q.id),self:s.definitions.self[q.id]});
   const index=bank.indexOf(q);$('#drill-prev').disabled=index<=0;$('#drill-next').disabled=index<0||index===bank.length-1;
   if(q&&s.section==='drills')s.questionId=q.id;
  }
  function renderAtlas(){
   const ch=$('#atlas-chapter').value,cat=$('#atlas-category').value;
   const bank=d.figures.filter(q=>(ch==='all'||q.chapter===+ch)&&(cat==='all'||q.category===cat));
   $('#atlas-status').textContent=`${bank.length} 图 / figures · ${a.coverage.length} 页课堂覆盖 / classroom pages mapped`;
   $('#atlas-content').innerHTML=bank.map(q=>`<details class="atlas-card"><summary>${esc(q.term)} <small>Ch.${q.chapter} · ${pair(a.categories[q.category])}</small></summary><figure>${figureHTML(q,true)}</figure><p>${pair(q.explanation)}</p><p><strong>易混点 / Watch for</strong> ${pair(q.mistake)}</p>${sourceRefs(q.sources)}<div class="topic-actions"><button data-enlarge-figure="${esc(q.id)}" data-figure-answers="true">放大图示 / Enlarge figure</button><a class="button" href="#topic-${esc(q.topic)}">回到精讲 / Read lesson ↗</a><button data-atlas-practice="${esc(q.id)}">隐藏名称练拼写 / Practice ↗</button></div></details>`).join('');
   $('#atlas-coverage').innerHTML=a.coverage.map(p=>`<li><strong>${esc(p.source)} p.${p.page}</strong> · ${p.figures.length} 图 / figures · ${pair(p.note)} <span>${p.figures.map(id=>{const q=d.figures.find(f=>f.id===id);return q?esc(q.term):'';}).join(' · ')}</span></li>`).join('');
  }
  function renderMockScore(){const p=paper(),x=attempt();$('#mock-score').innerHTML=renderCurrentScore(c.scoreMock(d,p,x),x.submitted);$('#mock-status').textContent=`${p.title} · 6 道 FRQ 必答 / Six required FRQs · ${x.submitted?'已提交，草稿锁定 / Submitted, locked':'独立草稿 / Separate draft'}`;$('#submit-mock').disabled=x.submitted;$('#start-mock').disabled=!!x.startedAt||x.submitted;$('#start-mock').textContent=x.startedAt?'计时中 / Timer running':'开始计时 / Start timer';}
  function renderMock(){
   const p=paper(),x=attempt();$('#mock-select').value=p.id;$('#mock-mcq').innerHTML=p.mcq.map(id=>questionHTML(d.mcq.find(q=>q.id===id),x.answers,{exam:true,submitted:x.submitted})).join('');$('#mock-frq').innerHTML=p.frq.map(id=>questionHTML(d.frq.find(q=>q.id===id),x.answers,{exam:true,submitted:x.submitted,selected:true})).join('');
   $('#mock-figures').innerHTML=p.figures.map(id=>{const q=d.figures.find(q=>q.id===id);return renderSpelling(q,x.answers[id]||'',{figure:figureHTML(q),exam:true,locked:x.submitted,checked:x.submitted,correct:c.checkSpelling(q,x.answers[id]||'')});}).join('');
   $('#mock-terms').innerHTML=p.terms.map(id=>{const q=d.terms.find(q=>q.id===id);return renderDefinition(q,x.answers[id]||'',{exam:true,locked:x.submitted,show:x.submitted,self:x.self[id]});}).join('');renderMockScore();
  }
  function printDrill(answers){
   const f=ensure(),bank=rows(),out=document.createElement('section');out.id='midterm-print';
   out.innerHTML=`<h1>${f.type==='spelling'?'识图与拼写 / Identify & spell':'术语定义 / Define terms'} · ${answers?'讲解版 / Answer edition':'空白练习 / Blank practice'}</h1>`+bank.map(q=>f.type==='spelling'?renderSpelling(q,'',{figure:figureHTML(q,answers),checked:answers,correct:true,print:true}):renderDefinition(q,'',{show:answers,print:true})).join('');
   withPrintOutput(document.body,out,()=>window.print());
  }
  function init(){
   for(const id of ['drill-category','atlas-category'])$('#'+id).innerHTML='<option value="all">全部图类 / All categories</option>'+Object.entries(a.categories).map(([key,p])=>`<option value="${esc(key)}">${esc(p.zh)} / ${esc(p.en)}</option>`).join('');
   const current=d.mocks.filter(p=>p.format==='midterm2026'),legacy=d.mocks.filter(p=>!p.format);
   $('#mock-select').innerHTML=`<optgroup label="本次期中 / Current midterm">${current.map(p=>`<option value="${p.id}">${esc(p.title)}</option>`).join('')}</optgroup><optgroup label="历史版本 · 旧制 60+40 / Historical format">${legacy.map(p=>`<option value="${p.id}">${esc(p.title)} · 旧版 / Legacy</option>`).join('')}</optgroup>`;
   renderDrills();renderAtlas();
   document.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(!b)return;
    if(b.dataset.enlargeFigure){const q=d.figures.find(q=>q.id===b.dataset.enlargeFigure);if(!q)return;const dialog=document.createElement('dialog');dialog.className='diagram-dialog';dialog.setAttribute('aria-label','放大图示 / Enlarged figure');dialog.innerHTML='<button data-close-diagram>关闭 / Close · Esc</button><p class="small">横向滑动查看完整结构 / Scroll horizontally to inspect the full diagram.</p><div class="diagram-pan">'+figureHTML(q,b.dataset.figureAnswers==='true')+'</div>';dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.querySelector('button').addEventListener('click',()=>dialog.close());document.body.append(dialog);dialog.showModal();}
    if(b.dataset.checkSpelling){const id=b.dataset.checkSpelling,s=state();s.spelling.answers[id]||='';s.spelling.checked[id]=s.spelling.answers[id];renderDrills();}
    if(b.dataset.definitionShow){shown.add(b.dataset.definitionShow);renderDrills();}
    if(b.dataset.definitionZero){const id=b.dataset.definitionZero,exam=b.hasAttribute('data-mid-exam');if(exam&&!attempt().submitted)return;const target=exam?attempt():state().definitions;target.self[id]=[false,false];target.selfAnswers[id]=target.answers[id]||'';if(exam){renderMock();onScore();}else renderDrills();}
    if(b.dataset.atlasPractice){const f=ensure();f.type='spelling';f.chapter='all';f.category='all';f.wrongOnly=false;f.questionId=b.dataset.atlasPractice;state().section='drills';renderDrills();location.hash='drills';}
    if(b.id==='drill-wrong'){const f=ensure();f.wrongOnly=!f.wrongOnly;renderDrills();}
    if(b.id==='drill-prev'||b.id==='drill-next'){const bank=rows(),f=ensure(),i=bank.findIndex(q=>q.id===f.questionId);f.questionId=bank[i+(b.id==='drill-next'?1:-1)]?.id||f.questionId;renderDrills();}
    if(b.id==='print-drill-blank'||b.id==='print-drill-answers')printDrill(b.id==='print-drill-answers');
   });
   document.addEventListener('change',ev=>{
    const el=ev.target,f=ensure();if(['drill-type','drill-chapter','drill-category'].includes(el.id)){f[{'drill-type':'type','drill-chapter':'chapter','drill-category':'category'}[el.id]]=el.value;if(f.type==='definition')f.wrongOnly=false;f.questionId=null;renderDrills();}
    if(el.id==='drill-select'){f.questionId=el.value;renderDrills();}
    if(['atlas-chapter','atlas-category'].includes(el.id))renderAtlas();
    if(el.dataset.definitionId){const id=el.dataset.definitionId,exam=el.hasAttribute('data-mid-exam'),target=exam?attempt():state().definitions;if(exam&&!target.submitted)return;
     if(!String(target.answers[id]||'').trim()){el.checked=false;message('空白定义不能得分；可明确记零。 / A blank cannot earn marks; record zero explicitly.');return;}
     target.self[id]||=[false,false];target.self[id][Number(el.dataset.definitionPoint)]=el.checked;target.selfAnswers[id]=target.answers[id];el.closest('.feedback').querySelector('.definition-score').textContent=target.self[id].filter(Boolean).length+'/2';if(exam){renderMockScore();onScore();}
    }
   });
   document.addEventListener('input',ev=>{
    const el=ev.target,id=el.dataset.spellingAnswer||el.dataset.definitionAnswer;if(!id)return;const exam=el.hasAttribute('data-mid-exam');if(exam&&attempt().submitted)return;
    const spelling=!!el.dataset.spellingAnswer,target=exam?attempt():spelling?state().spelling:state().definitions;target.answers[id]=el.value;
    if(spelling&&!exam)delete target.checked[id];if(!spelling){delete target.self[id];delete target.selfAnswers[id];}
    if(!exam){const card=el.closest('.question-card');if(spelling)card.querySelector('[data-spelling-feedback]')?.remove();else{card.querySelectorAll('.rubric input').forEach(x=>x.checked=false);const out=card.querySelector('.definition-score');if(out)out.textContent='尚未自评 / Not assessed';}}
   });
  }
  return {init,renderDrills,renderAtlas,renderMock,renderMockScore,printDrill};
 }
 return {renderSpelling,renderDefinition,renderCurrentScore,withPrintOutput,withPrintSection,initGuideMenu,create};
});
