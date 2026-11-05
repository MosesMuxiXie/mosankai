(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else factory().boot(root).catch(() => {
    const note = document.createElement('p');note.className='study-tools-error';note.setAttribute('role','status');
    note.textContent=document.documentElement.lang==='en'?'Learning records unavailable. Reload to retry.':'学习记录暂不可用，请刷新重试。';document.body.append(note);
  });
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  function assessedResults(bank, answers, checked, previous, now, force = []) {
    const results = {...previous}, ids = new Set(checked);
    for (const q of bank) if(q.type==='mc' && ids.has(q.id) && Number.isInteger(answers[q.id]) && answers[q.id]>=0 && answers[q.id]<q.options.length) {
      const status=answers[q.id]===q.answer?'correct':'incorrect';
      results[q.id]={status,updatedAt:previous[q.id]?.status===status&&!force.includes(q.id)?previous[q.id].updatedAt:now};
    }
    return results;
  }
  function assessmentIds(id,snap,last,force){
    const changed=['neuroscience-ch4-6-review','statistics-ch1-4-review'].includes(id)?[]:snap.checked.filter(qid=>!last.checked.includes(qid)||last.answers[qid]!==snap.answers[qid]);
    return [...new Set([...force,...changed])];
  }
  // Rebase only locally edited fields onto the freshest record from another tab.
  function rebaseState(before, current, latest, key = '') {
    if (JSON.stringify(before) === JSON.stringify(current)) return latest;
    if (Array.isArray(current)) {
      if (['learned','wrong','seen','checked','submitted','graded','mastery'].includes(key)) {
        const old = before || [], removed = old.filter(v=>!current.includes(v));
        return [...new Set([...(latest||[]).filter(v=>!removed.includes(v)),...current.filter(v=>!old.includes(v))])];
      }
      return current;
    }
    if (!current || typeof current !== 'object' || key === 'session') return current;
    const merged = {...latest};
    for (const field of new Set([...Object.keys(before||{}),...Object.keys(current)])) {
      if (!(field in current)) {if (field in (before||{})) delete merged[field];}
      else merged[field]=rebaseState(before?.[field],current[field],latest?.[field],field);
    }
    return merged;
  }
  // A review marker describes a particular answer, not merely a question ID.
  // Merging an answer from another tab must not attach an older marker to it.
  function rebaseStatsState(before,current,latest,force=[]) {
    const merged=rebaseState(before,current,latest),sources=[current,latest];
    merged.answers=merged.answers||{};merged.checked=merged.checked||[];
    for(const id of force)if(current.checked?.includes(id)&&Number.isInteger(current.answers?.[id])){
      merged.answers[id]=current.answers[id];merged.checked=[...new Set([...merged.checked,id])];
    }
    merged.checked=merged.checked.filter(id=>sources.some(s=>s.checked?.includes(id)&&s.answers?.[id]===merged.answers[id]));
    for(const id of Object.keys(merged.assessed||{}))if(!sources.some(s=>Array.isArray(s.assessed?.[id])&&s.answers?.[id]===merged.answers[id]&&JSON.stringify(s.assessed[id])===JSON.stringify(merged.assessed[id])))delete merged.assessed[id];
    return merged;
  }
  function rebaseNeuroState(before,current,latest,force=[]) {
    // rebaseState may return latest by reference when no fields changed.
    const clone=value=>JSON.parse(JSON.stringify(value));
    const merged=clone(rebaseState(before,current,latest)),sources=[current,latest];
    const own=(obj,key)=>Object.prototype.hasOwnProperty.call(obj||{},key);
    const answer=(s,id)=>s?.answers?.[id]===undefined?'':s.answers[id];
    const cleanRubrics=(target,variants,marksKey,bindingsKey,allowUnbound=true)=>{
      target[marksKey]=target[marksKey]||{};target[bindingsKey]=target[bindingsKey]||{};
      for(const id of Object.keys(target[marksKey])){
        const match=variants.find(s=>Array.isArray(s?.[marksKey]?.[id])&&JSON.stringify(s[marksKey][id])===JSON.stringify(target[marksKey][id])&&answer(s,id)===answer(target,id)&&(own(s[bindingsKey],id)?s[bindingsKey][id]===answer(s,id):allowUnbound&&!own(s,bindingsKey)));
        if(match)target[bindingsKey][id]=answer(target,id);else{delete target[marksKey][id];delete target[bindingsKey][id];}
      }
      for(const id of Object.keys(target[bindingsKey]))if(!own(target[marksKey],id))delete target[bindingsKey][id];
    };
    merged.answers=merged.answers||{};merged.checked=merged.checked||[];
    for(const id of force)if(current.checked?.includes(id)&&Number.isInteger(current.answers?.[id])){merged.answers[id]=current.answers[id];merged.checked=[...new Set([...merged.checked,id])];}
    merged.checked=merged.checked.filter(id=>sources.some(s=>s.checked?.includes(id)&&s.answers?.[id]===merged.answers[id]));
    cleanRubrics(merged,sources,'assessed','assessedAnswers');
    merged.spelling=merged.spelling||{answers:{},checked:{}};merged.spelling.checked=merged.spelling.checked||{};
    for(const id of Object.keys(merged.spelling.checked))if(!sources.some(s=>own(s.spelling?.checked,id)&&s.spelling.checked[id]===merged.spelling.answers?.[id]&&s.spelling.answers?.[id]===merged.spelling.answers?.[id]))delete merged.spelling.checked[id];
    merged.definitions=merged.definitions||{answers:{},self:{},selfAnswers:{}};
    cleanRubrics(merged.definitions,sources.map(s=>s.definitions),'self','selfAnswers',false);
    merged.exams=merged.exams||{};
    for(const id of new Set([...Object.keys(current.exams||{}),...Object.keys(latest.exams||{})])){
      const prior=before.exams?.[id],local=current.exams?.[id],remote=latest.exams?.[id];
      // Only the original v1 papers predate response-bound exam grading.
      const legacy=['mock1','mock2','mock3'].includes(id);
      // A new round is deliberate only in a tab which observed this submitted round.
      if(prior?.submitted&&local&&!local.submitted){merged.exams[id]=clone(local);cleanRubrics(merged.exams[id],[local],'self','selfAnswers',legacy);continue;}
      if(prior?.submitted&&remote&&!remote.submitted){merged.exams[id]=clone(remote);continue;}
      const locked=remote?.submitted?remote:local?.submitted?local:null;
      if(locked){
        const target=merged.exams[id]||{};merged.exams[id]={...target,answers:clone(locked.answers),selected:clone(locked.selected),submitted:true,startedAt:locked.startedAt,elapsed:Math.max(locked.elapsed,target.elapsed||0)};
      }
      if(merged.exams[id])cleanRubrics(merged.exams[id],[local,remote],'self','selfAnswers',legacy);
    }
    return merged;
  }
  function neuroAssessmentIds(snap,rebased,ids){
    const paper=snap.state.mock,exam=snap.state.section==='mocks'&&snap.state.exams?.[paper]?.submitted;
    const final=exam?rebased.exams?.[paper]:rebased;
    if(exam&&!final?.submitted)return [];
    return ids.filter(id=>final?.answers?.[id]===snap.answers[id]);
  }
  async function boot(win) {
    const doc=win.document,id=doc.documentElement.dataset.studyMaterial;if(!id)return;
    const en=doc.documentElement.lang==='en',text=(zh,english)=>en?english:zh;
    // Native content is readable while loading, but editing starts after restoration.
    const gates=[...doc.body.children].filter(n=>!['SCRIPT','STYLE','LINK'].includes(n.tagName)&&!n.hasAttribute('data-studyguide-return')).map(node=>({node,inert:node.inert}));
    gates.forEach(({node})=>node.inert=true);
    const loading=doc.createElement('p');loading.className='study-initializing';loading.setAttribute('role','status');loading.textContent=text('正在恢复学习记录…','Restoring learning records…');doc.body.append(loading);
    let store;
    try {store=await win.MosankaiStudy.ready;}
    catch(error){gates.forEach(({node,inert})=>node.inert=inert);loading.remove();throw error;}
    const desc=store.index[id],bank=desc?.questions||[];
    const $=selector=>doc.querySelector(selector),all=selector=>[...doc.querySelectorAll(selector)];
    const isReload=win.performance.getEntriesByType('navigation')[0]?.type==='reload';
    const params=new URLSearchParams(win.location.search),qid=!isReload&&bank.some(q=>q.id===params.get('studyQuestion'))?params.get('studyQuestion'):null;
    let restoring=true, timer, busy=false;const record=store.read(id);let lastState=record.progress.state,lastAssessment={answers:{},checked:[]};
    const value=(node)=>node?node.value:'';
    const strip=s=>String(s||'').slice(0,12000);
    let page;
    if(id==='statistics-review') {
      let checked=new Set(record.progress.state.checked||[]);
      page={
        capture(){const choices={},notes={};bank.forEach((q,i)=>{if(q.type==='mc'){const b=$(`[data-question="${i}"][aria-pressed="true"]`);if(b)choices[q.id]=Number(b.dataset.choice);}else notes[q.id]=strip(value($('#note'+i)));});return {state:{choices,notes,mastery:all('.mastery').flatMap((c,i)=>c.checked?[i]:[]),checked:[...checked]},answers:choices,checked:[...checked],resume:{section:win.location.hash.slice(1)||'outline',mode:typeof selfTest==='boolean'&&selfTest?'test':'practice'}};},
        restore(s,r,target){all('.mastery').forEach((c,i)=>{c.checked=s.mastery?.includes(i)||false;c.dispatchEvent(new Event('change'));});
          if(r?.mode==='test'&&typeof selfTest==='boolean'&&!selfTest)$('#exam').click();
          bank.forEach((q,i)=>{if(q.type==='mc'&&Number.isInteger(s.choices?.[q.id]))$(`[data-question="${i}"][data-choice="${s.choices[q.id]}"]`)?.click();else if(q.type!=='mc'&&s.notes?.[q.id])$('#note'+i).value=s.notes[q.id];});checked=new Set(s.checked||[]);
          const anchor=target?'q'+(bank.findIndex(q=>q.id===target)+1):r?.section;if(anchor&&doc.getElementById(anchor))doc.getElementById(anchor).scrollIntoView();
        },
        assess(event){const b=event.target.closest('[data-choice]');if(b){const q=bank[Number(b.dataset.question)];if(selfTest)checked.delete(q.id);else{checked.add(q.id);return[q.id];}}if(event.target.closest('#exam')&&!selfTest){checked=new Set(Object.keys(this.capture().answers));return[...checked];}return[];}
      };
      $('#quizStatus').textContent='练习记录保存在当前浏览器；非选择题对照解析自评。';
    } else if(id==='literature-review') {
      let graded=new Set(record.progress.state.graded||[]);
      page={
        capture(){const answers={},notes={},rubrics={};bank.forEach((q,i)=>{if(q.type==='mc'){const input=$(`input[name="q${i}"]:checked`);if(input)answers[q.id]=Number(input.value);}else notes[q.id]=strip(value($('#'+q.id)));});all('[data-rubric]').forEach(c=>{if(c.value)rubrics[c.id.replace('rubric-','')]=Number(c.value);});return{state:{answers,notes,rubrics,graded:[...graded]},answers,checked:[...graded],resume:{hash:win.location.hash&&/^#[\w-]+$/.test(win.location.hash)?win.location.hash:'#self-test'}};},
        restore(s,r,target){bank.forEach((q,i)=>{if(q.type==='mc'&&Number.isInteger(s.answers?.[q.id])){const input=$(`input[name="q${i}"][value="${s.answers[q.id]}"]`);if(input)input.checked=true;}else if(q.type!=='mc'&&s.notes?.[q.id])$('#'+q.id).value=s.notes[q.id];});all('[data-rubric]').forEach(c=>{c.value=String(s.rubrics?.[c.id.replace('rubric-','')]||'');});updateRubricTotal();graded=new Set(s.graded||[]);if(graded.size)$('#grade').click();
          const anchor=target?(bank.find(q=>q.id===target).type==='mc'?'question-'+(bank.findIndex(q=>q.id===target)+1):target):r?.hash?.slice(1);if(anchor&&doc.getElementById(anchor))doc.getElementById(anchor).scrollIntoView();
        },
        assess(event){if(event.target.matches('input[type=radio]'))graded.clear();if(event.target.closest('#grade')){graded=new Set(bank.filter(q=>q.type==='mc').map(q=>q.id));return[...graded];}if(event.target.closest('#reset')){graded.clear();}return[];}
      };
    } else if(id==='neuroscience-review') {
      page={
        capture(){const frq={};all('#frqList textarea').forEach((t,i)=>{frq['FRQ-'+String(i+1).padStart(3,'0')]=strip(t.value);});const current=doc.querySelector('.page.active')?.id||'home';const session={queue:[...queue],answers:[...answers],pos,isMock,submitted,reviewWrong};
          const ans={},ids=[];queue.forEach((n,i)=>{if(answers[i]!==null&&(!isMock||submitted)){ans[D.quiz[n].id]=answers[i];ids.push(D.quiz[n].id);}});
          return {state:{learned:[...learned],wrong:[...wrong],seen:[...seen],frq,session},answers:ans,checked:ids,resume:{section:current,chapter:value($('#qchapter')),topic:value($('#qtopic')),mode:value($('#qmode')),size:Number(value($('#qsize')))||10}};
        },
        restore(s,r,target){learned=new Set(s.learned||[]);wrong=new Set(s.wrong||[]);seen=new Set(s.seen||[]);renderCards();updateProgress();all('#frqList textarea').forEach((t,i)=>{t.value=s.frq?.['FRQ-'+String(i+1).padStart(3,'0')]||'';});
          for(const [key,selector] of [['chapter','#qchapter'],['topic','#qtopic'],['mode','#qmode'],['size','#qsize']]){const control=$(selector);if(r?.[key]!==undefined&&[...control.options].some(o=>o.value===String(r[key])))control.value=String(r[key]);}
          if(target){const n=D.quiz.findIndex(q=>q.id===target);if(n>=0){queue=[n];answers=[null];pos=0;isMock=false;submitted=false;reviewWrong=true;started=Date.now();renderQuestion();go('quiz');}else{go('frq');const n=bank.findIndex(q=>q.id===target)-D.quiz.length;all('#frqList .frq')[n]?.scrollIntoView();}return;}
          if(s.session?.queue.length){queue=[...s.session.queue];answers=[...s.session.answers];pos=s.session.pos;isMock=!!s.session.isMock;submitted=false;reviewWrong=!!s.session.reviewWrong;started=Date.now();if(s.session.submitted)finish();else renderQuestion();}
          if(r?.section&&doc.getElementById(r.section)?.classList.contains('page'))go(r.section);
        },
        assess(event){const b=event.target.closest('#quizarea [data-choice]');if(b&&!isMock&&queue[pos]!==undefined)return[D.quiz[queue[pos]].id];if(event.target.closest('#submitQ')||(event.target.closest('#nextQ')&&submitted))return queue.map(n=>D.quiz[n].id);return[];}
      };
    } else if(['neuroscience-ch4-6-review','neuroscience-ch4-6-map','statistics-ch1-4-review','statistics-ch1-4-map'].includes(id)) {
      page={capture:()=>win.MosankaiPage.capture(),restore:(s,r,target)=>win.MosankaiPage.restore(s,r,target),assess:event=>win.MosankaiPage.assess(event)};
    } else if(['literature-androids-10-12','literature-androids-13-18','literature-androids-18-22'].includes(id)) {
      page={capture:()=>win.MosankaiPage.capture(),restore:(s,r,target)=>win.MosankaiPage.restore(s,r,target),assess(event){
        const snap=this.capture();if(event.target.closest('#check-answer'))return snap.resume.questionId?[snap.resume.questionId]:[];
        if(event.target.closest('#submit-test')&&snap.selectedIds.every(qid=>snap.state.submitted.includes(qid)))return snap.selectedIds;
        return[];
      }};
    } else {
      page={capture:()=>({state:{},answers:{},checked:[],resume:/^#[\w-]{1,100}$/.test(win.location.hash)?{hash:win.location.hash}:null}),restore(s,r){
        const target=r?.hash&&doc.getElementById(r.hash.slice(1));
        if(target){
          // Continue URLs carry the saved position in the record, not in their URL.
          // Retain it for the next capture and reveal native collapsed ancestors.
          win.history.replaceState(win.history.state,'',r.hash);
          for(let node=target.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
          target.scrollIntoView();
        }
      },assess:()=>[]};
    }
    const tools=doc.createElement('div');tools.className='study-tools';
    const back=$('[data-studyguide-return]');if(back)tools.append(back);
    const button=(label,handler)=>{const b=doc.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',handler);tools.append(b);return b;};
    const favorite=button('',()=>store.save(id,{favorite:!store.read(id).favorite}));
    const pending=button('',()=>store.save(id,{pending:{material:!store.read(id).pending.material}}));
    const exportButton=button(text('导出备份','Export backup'),()=>{
      clearTimeout(timer);persist();const url=win.URL.createObjectURL(new Blob([store.exportBackup()],{type:'application/json'})),a=doc.createElement('a');
      a.href=url;a.download='mosankai-study-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>win.URL.revokeObjectURL(url),1000);
    });exportButton.className='study-export';
    const status=doc.createElement('span');status.className='study-save-status';status.setAttribute('role','status');tools.append(status);doc.body.append(tools);
    function refreshTools(){const r=store.read(id);favorite.textContent=r.favorite?text('已收藏','Saved'):text('收藏','Save');favorite.setAttribute('aria-pressed',String(r.favorite));pending.textContent=r.pending.material?text('已加入待复习','In review list'):text('加入待复习','Add to review');pending.setAttribute('aria-pressed',String(r.pending.material));}
    function persist(force=[]){if(restoring||busy)return;busy=true;try{const previous=store.read(id),snap=page.capture();
        // An unchanged stale answer is not a new local assessment.
        const assessed=assessmentIds(id,snap,lastAssessment,force).filter(qid=>{
          const q=bank.find(q=>q.id===qid),answer=snap.answers[qid];return q?.type==='mc'&&snap.checked.includes(qid)&&Number.isInteger(answer)&&answer>=0&&answer<q.options.length;
        });
        const rebased=id==='neuroscience-ch4-6-review'?rebaseNeuroState(lastState,snap.state,previous.progress.state,assessed):id==='statistics-ch1-4-review'?rebaseStatsState(lastState,snap.state,previous.progress.state,assessed):rebaseState(lastState,snap.state,previous.progress.state);
        const accepted=id==='neuroscience-ch4-6-review'?neuroAssessmentIds(snap,rebased,assessed):assessed;
        const results=assessedResults(bank,snap.answers,accepted,previous.progress.results,Date.now(),accepted);
        if(id!=='neuroscience-ch4-6-review')for(const qid of assessed){if(rebased.choices)rebased.choices[qid]=snap.answers[qid];else if(rebased.answers)rebased.answers[qid]=snap.answers[qid];}
        if(id==='neuroscience-review'){
          const mc=bank.filter(q=>q.type==='mc');rebased.wrong=mc.flatMap((q,i)=>results[q.id]?.status==='incorrect'?[i]:[]);
          rebased.seen=[...new Set([...(rebased.seen||[]),...assessed.map(qid=>mc.findIndex(q=>q.id===qid)).filter(i=>i>=0)])];
        }
        lastState=JSON.parse(JSON.stringify(snap.state));lastAssessment=JSON.parse(JSON.stringify({answers:snap.answers,checked:snap.checked}));
        const result=store.save(id,{resume:snap.resume,progress:{state:rebased,results}});status.textContent=result.persisted?text('已保存','Saved in this browser'):text('未保存 · 请在本页导出备份','Not saved · export before leaving this page');
      }catch(error){status.textContent=text('保存失败，请在本页导出备份','Save failed; export before leaving this page');console.error(error);}finally{busy=false;}}
    win.MosankaiGuide={save:persist};
    const resume=params.get('studyResume')==='1'||isReload?record.resume:null;
    try {page.restore(record.progress.state,resume,qid);}
    finally {gates.forEach(({node,inert})=>node.inert=inert);loading.remove();}
    restoring=false;const initial=page.capture();lastAssessment=JSON.parse(JSON.stringify({answers:initial.answers,checked:initial.checked}));store.save(id,{lastVisitedAt:Date.now()});refreshTools();
    function addWrittenButtons(){all('textarea').forEach((t,i)=>{
      let q;
      if(id==='statistics-review')q=bank.find(q=>q.id==='STAT-'+String(Number(t.id.replace('note',''))+1).padStart(3,'0'));
      else if(id==='neuroscience-review')q=bank.find(q=>q.id==='FRQ-'+String(i+1).padStart(3,'0'));
      else if(id==='neuroscience-ch4-6-review')q=bank.find(q=>q.id===t.dataset.questionId);
      else if(id==='statistics-ch1-4-review')q=bank.find(q=>q.id===t.dataset.questionId);
      else if(id==='literature-review')q=bank.find(q=>q.id===t.id);
      else if(['literature-androids-10-12','literature-androids-13-18','literature-androids-18-22'].includes(id)){const snap=page.capture();q=bank.find(q=>q.id===snap.resume.questionId&&q.type==='written');}
      if(!q||q.type==='mc'||t.parentElement.querySelector('[data-study-written]'))return;
      const b=doc.createElement('button');b.type='button';b.className='study-written';b.dataset.studyWritten=q.id;
      const update=()=>{const active=store.read(id).pending.questions.includes(q.id);b.textContent=active?text('从待复习移出','Remove from review'):text('加入待复习','Add to review');b.setAttribute('aria-pressed',String(active));};
      b.addEventListener('click',()=>{const list=store.read(id).pending.questions;store.save(id,{pending:{questions:list.includes(q.id)?list.filter(x=>x!==q.id):[...list,q.id]}});update();});t.after(b);update();
    });}
    const process=event=>{if(event.target.closest('.study-tools')||event.target.closest('[data-study-written]'))return;const force=page.assess(event);clearTimeout(timer);timer=setTimeout(()=>{persist(force);addWrittenButtons();},event.type==='input'?180:0);};
    doc.addEventListener('click',process);doc.addEventListener('change',process);doc.addEventListener('input',process);win.addEventListener('hashchange',()=>persist());win.addEventListener('pagehide',()=>{clearTimeout(timer);persist();});
    store.subscribe(refreshTools);addWrittenButtons();persist();
  }
  return {assessedResults,assessmentIds,rebaseState,rebaseStatsState,rebaseNeuroState,neuroAssessmentIds,boot};
});
