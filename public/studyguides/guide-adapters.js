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
  async function boot(win) {
    const doc=win.document,id=doc.documentElement.dataset.studyMaterial;if(!id)return;
    const store=await win.MosankaiStudy.ready,desc=store.index[id],bank=desc?.questions||[];
    const en=doc.documentElement.lang==='en',text=(zh,english)=>en?english:zh;
    const $=selector=>doc.querySelector(selector),all=selector=>[...doc.querySelectorAll(selector)];
    const isReload=win.performance.getEntriesByType('navigation')[0]?.type==='reload';
    const params=new URLSearchParams(win.location.search),qid=!isReload&&bank.some(q=>q.id===params.get('studyQuestion'))?params.get('studyQuestion'):null;
    let restoring=true, timer, busy=false;const record=store.read(id);let lastState=record.progress.state;
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
    } else if(id==='literature-androids-10-12') {
      page={capture:()=>win.MosankaiPage.capture(),restore:(s,r,target)=>win.MosankaiPage.restore(s,r,target),assess(){return[];}};
    } else {
      page={capture:()=>({state:{},answers:{},checked:[],resume:/^#[\w-]{1,100}$/.test(win.location.hash)?{hash:win.location.hash}:null}),restore(s,r){if(r?.hash&&doc.getElementById(r.hash.slice(1)))doc.getElementById(r.hash.slice(1)).scrollIntoView();},assess:()=>[]};
    }
    const tools=doc.createElement('div');tools.className='study-tools';
    const back=$('[data-studyguide-return]');if(back)tools.append(back);
    const button=(label,handler)=>{const b=doc.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',handler);tools.append(b);return b;};
    const favorite=button('',()=>store.save(id,{favorite:!store.read(id).favorite}));
    const pending=button('',()=>store.save(id,{pending:{material:!store.read(id).pending.material}}));
    const status=doc.createElement('span');status.className='study-save-status';status.setAttribute('role','status');tools.append(status);doc.body.append(tools);
    function refreshTools(){const r=store.read(id);favorite.textContent=r.favorite?text('已收藏','Saved'):text('收藏','Save');favorite.setAttribute('aria-pressed',String(r.favorite));pending.textContent=r.pending.material?text('已加入待复习','In review list'):text('加入待复习','Add to review');pending.setAttribute('aria-pressed',String(r.pending.material));}
    function persist(force=[]){if(restoring||busy)return;busy=true;try{const previous=store.read(id),snap=page.capture();const results=assessedResults(bank,snap.answers,snap.checked,previous.progress.results,Date.now(),force);
        const rebased=rebaseState(lastState,snap.state,previous.progress.state);lastState=JSON.parse(JSON.stringify(snap.state));
        const result=store.save(id,{resume:snap.resume,progress:{state:rebased,results}});status.textContent=result.persisted?text('已保存','Saved in this browser'):text('未保存 · 可导出本次记录','Not saved · export this session');
      }catch(error){status.textContent=text('保存失败，请返回学习中心导出备份','Save failed; export a backup from the study center');console.error(error);}finally{busy=false;}}
    win.MosankaiGuide={save:persist};
    const resume=params.get('studyResume')==='1'||isReload?record.resume:null;
    page.restore(record.progress.state,resume,qid);restoring=false;store.save(id,{lastVisitedAt:Date.now()});refreshTools();
    function addWrittenButtons(){all('textarea').forEach((t,i)=>{
      let q;
      if(id==='statistics-review')q=bank.find(q=>q.id==='STAT-'+String(Number(t.id.replace('note',''))+1).padStart(3,'0'));
      else if(id==='neuroscience-review')q=bank.find(q=>q.id==='FRQ-'+String(i+1).padStart(3,'0'));
      else if(id==='literature-review')q=bank.find(q=>q.id===t.id);
      else if(id==='literature-androids-10-12'){const snap=page.capture();q=bank.find(q=>q.id===snap.resume.questionId&&q.type==='written');}
      if(!q||q.type==='mc'||t.parentElement.querySelector('[data-study-written]'))return;
      const b=doc.createElement('button');b.type='button';b.className='study-written';b.dataset.studyWritten=q.id;
      const update=()=>{const active=store.read(id).pending.questions.includes(q.id);b.textContent=active?text('从待复习移出','Remove from review'):text('加入待复习','Add to review');b.setAttribute('aria-pressed',String(active));};
      b.addEventListener('click',()=>{const list=store.read(id).pending.questions;store.save(id,{pending:{questions:list.includes(q.id)?list.filter(x=>x!==q.id):[...list,q.id]}});update();});t.after(b);update();
    });}
    const process=event=>{if(event.target.closest('.study-tools')||event.target.closest('[data-study-written]'))return;const force=page.assess(event);clearTimeout(timer);timer=setTimeout(()=>{persist(force);addWrittenButtons();},event.type==='input'?180:0);};
    doc.addEventListener('click',process);doc.addEventListener('change',process);doc.addEventListener('input',process);win.addEventListener('hashchange',()=>persist());win.addEventListener('pagehide',()=>{clearTimeout(timer);persist();});
    store.subscribe(refreshTools);addWrittenButtons();persist();
  }
  return {assessedResults,rebaseState,boot};
});
