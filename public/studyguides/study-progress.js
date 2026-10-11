(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else {
    const api = { ready: null };
    root.MosankaiStudy = api;
    api.ready = Promise.all(['/studyguides/catalog.json', '/studyguides/learning-index.json'].map(async url => {
      const response = await fetch(url); if (!response.ok) throw Error('Study data unavailable'); return response.json();
    })).then(([catalog, index]) => {
      let storage; try { storage = root.localStorage; } catch (_) {}
      const store = factory().createStore({ storage, catalog, index, events: root });
      Object.assign(api, store);
      Object.defineProperty(api, 'persistenceError', { get: () => store.persistenceError });
      return api;
    });
  }
})(typeof window === 'object' ? window : globalThis, function () {
  'use strict';
  const PREFIX = 'mosankai:study:v1:';
  const clone = value => JSON.parse(JSON.stringify(value));
  const plain = value => value && typeof value === 'object' && !Array.isArray(value);
  const time = value => Number.isSafeInteger(value) && value >= 0;
  const fail = () => { throw Error('Invalid study record'); };
  function safeJSON(value, depth = 0) {
    if (depth > 12) fail();
    if (value === null || typeof value === 'boolean') return;
    if (typeof value === 'number') { if (!Number.isFinite(value)) fail(); return; }
    if (typeof value === 'string') { if (value.length > 12000) fail(); return; }
    if (Array.isArray(value)) { if (value.length > 1000) fail(); value.forEach(x => safeJSON(x, depth + 1)); return; }
    if (!plain(value) || Object.keys(value).length > 1000) fail();
    for (const [key, item] of Object.entries(value)) { if (['__proto__', 'prototype', 'constructor'].includes(key)) fail(); safeJSON(item, depth + 1); }
  }
  function createStore({ storage, catalog, index = {}, now = Date.now, events }) {
    const materials = new Map(catalog.materials.map(m => [m.id, m]));
    const dirty = new Map(), corrupted = new Set(), listeners = new Set(); let persistenceError = false;
    const question = (id, qid) => index[id]?.questions?.find(q => q.id === qid);
    function empty(id) { return { version: 1, materialId: id, updatedAt: 0, favorite: false, pending: { material: false, questions: [] }, reviewed: {}, lastVisitedAt: 0, resume: null, progress: { state: {}, results: {} } }; }
    function validateState(id, state) {
      if (!plain(state)) fail(); safeJSON(state);
      if (id === 'literature-androids-10-12' && state.version !== undefined && state.version !== 1) fail();
      const desc = index[id] || {}, questions = desc.questions || [];
      const map = (name, check) => {
        if (state[name] === undefined) return;
        if (!plain(state[name])) fail();
        for (const [qid, v] of Object.entries(state[name])) { const q = question(id, qid); if (!q || !check(q, v)) fail(); }
      };
      const choices = (q, v) => q.type === 'mc' && Number.isInteger(v) && v >= 0 && v < q.options.length;
      map('choices', choices); map('answers', (q, v) => q.type === 'mc' ? choices(q, v) : typeof v === 'string');
      map('notes', (q, v) => q.type !== 'mc' && typeof v === 'string');
      map('assessed', (q, v) => q.type !== 'mc' && Array.isArray(v) && v.every(x => typeof x === 'boolean'));
      for (const name of ['checked', 'submitted', 'graded']) if (state[name] !== undefined && (!Array.isArray(state[name]) || state[name].some(qid => !question(id, qid)))) fail();
      if (state.mastery !== undefined && (!Array.isArray(state.mastery) || state.mastery.some(i => !desc.cardIds?.includes(String(i))))) fail();
      if (state.learned !== undefined && (!Array.isArray(state.learned) || state.learned.some(i => !desc.cardIds?.includes(i)))) fail();
      for (const name of ['wrong', 'seen']) if (state[name] !== undefined && (!Array.isArray(state[name]) || state[name].some(i => !Number.isInteger(i) || i < 0 || i >= questions.filter(q => q.type === 'mc').length))) fail();
      if (state.frq !== undefined) {
        if (!plain(state.frq)) fail();
        for (const [qid, v] of Object.entries(state.frq)) if (question(id, qid)?.type !== 'written' || typeof v !== 'string') fail();
      }
      if (state.rubrics !== undefined && (!plain(state.rubrics) || Object.entries(state.rubrics).some(([k, v]) => !['claim','evidence','commentary','style','insight'].includes(k) || !Number.isInteger(v) || v < 1 || v > 5))) fail();
      if (state.session !== undefined) {
        const s = state.session, mc = questions.filter(q => q.type === 'mc');
        if (!plain(s) || !Array.isArray(s.queue) || !Array.isArray(s.answers) || s.queue.length !== s.answers.length || s.queue.length > mc.length || new Set(s.queue).size !== s.queue.length || s.queue.some(i => !Number.isInteger(i) || !mc[i]) || s.answers.some((a,i) => a !== null && (!Number.isInteger(a) || a < 0 || a >= mc[s.queue[i]].options.length)) || !Number.isInteger(s.pos) || s.pos < 0 || s.pos >= Math.max(1,s.queue.length)) fail();
        if (['isMock','submitted','reviewWrong'].some(k=>typeof s[k]!=='boolean')) fail();
      }
      return clone(state);
    }
    function validate(id, record) {
      if (!materials.has(id) || !plain(record) || record.version !== 1 || record.materialId !== id || !time(record.updatedAt) || typeof record.favorite !== 'boolean' || !time(record.lastVisitedAt)) fail();
      safeJSON(record);
      if (!plain(record.pending) || typeof record.pending.material !== 'boolean' || !Array.isArray(record.pending.questions) || record.pending.questions.some(qid => !question(id,qid))) fail();
      if (!plain(record.reviewed) || Object.entries(record.reviewed).some(([qid,t]) => !question(id,qid) || !time(t))) fail();
      if (record.resume !== null) {
        const fields = ['section','questionId','sceneIndex','branchIndex','chapter','topic','mode','category','type','size','hash','flowView'];
        if (!plain(record.resume) || Object.keys(record.resume).some(k => !fields.includes(k))) fail();
        if (record.resume.questionId && !question(id,record.resume.questionId)) fail();
        if (record.resume.hash !== undefined && !/^#[A-Za-z0-9_-]{1,100}$/.test(record.resume.hash)) fail();
        for (const k of ['sceneIndex','branchIndex','size']) if (record.resume[k] !== undefined && (!Number.isInteger(record.resume[k]) || record.resume[k] < 0 || record.resume[k] > 1000)) fail();
        for (const k of ['section','chapter','topic','mode','category','type','flowView']) if (record.resume[k] !== undefined && (typeof record.resume[k] !== 'string' || record.resume[k].length > 100)) fail();
      }
      if (!plain(record.progress) || !plain(record.progress.results)) fail();
      const results = {};
      for (const [qid,result] of Object.entries(record.progress.results)) {
        if (question(id,qid)?.type !== 'mc' || !plain(result) || !['correct','incorrect'].includes(result.status) || !time(result.updatedAt)) fail();
        results[qid] = {status:result.status,updatedAt:result.updatedAt};
      }
      return {version:1,materialId:id,updatedAt:record.updatedAt,favorite:record.favorite,pending:{material:record.pending.material,questions:[...new Set(record.pending.questions)]},reviewed:clone(record.reviewed),lastVisitedAt:record.lastVisitedAt,resume:clone(record.resume),progress:{state:validateState(id,record.progress.state),results}};
    }
    function read(id) {
      if (!materials.has(id)) fail(); if (dirty.has(id)) return clone(dirty.get(id));
      let raw;
      try { raw = storage?.getItem(PREFIX + id); const record=raw ? validate(id,JSON.parse(raw)) : empty(id);corrupted.delete(id);return record; }
      catch (_) { persistenceError = true;if(raw)corrupted.add(id);return empty(id); }
    }
    function emit(id) { for (const fn of listeners) fn(id); }
    function write(id,record) {
      let persisted = true;
      try { if (!storage || corrupted.has(id)) throw Error('Storage unavailable or existing record damaged'); storage.setItem(PREFIX + id,JSON.stringify(record)); dirty.delete(id); }
      catch (_) { dirty.set(id,clone(record)); persisted = false; }
      persistenceError = !persisted; emit(id); return {record:clone(record),persisted};
    }
    function save(id,patch) {
      safeJSON(patch);const prev = read(id), next = {...prev,...patch,version:1,materialId:id,updatedAt:Math.max(now(),prev.updatedAt + 1)};
      next.pending = {...prev.pending,...patch.pending};next.reviewed = {...prev.reviewed,...patch.reviewed};
      next.progress = {...prev.progress,...patch.progress,results:{...prev.progress.results,...patch.progress?.results}};
      for (const [qid,v] of Object.entries(next.progress.results)) if (v === null) delete next.progress.results[qid];
      return write(id,validate(id,next));
    }
    function all() { return catalog.materials.map(m => read(m.id)); }
    function wrongItems() {
      return all().flatMap(r => Object.entries(r.progress.results).filter(([,v]) => v.status === 'incorrect').map(([qid,result]) => ({materialId:r.materialId,questionId:qid,updatedAt:result.updatedAt,automatic:true}))).sort((a,b) => b.updatedAt-a.updatedAt);
    }
    function reviewItems() {
      const items = new Map();
      for (const r of all()) {
        if (r.pending.material) items.set(r.materialId,{materialId:r.materialId,questionId:null,updatedAt:r.updatedAt,automatic:false});
        for (const qid of r.pending.questions) items.set(r.materialId+':'+qid,{materialId:r.materialId,questionId:qid,updatedAt:r.updatedAt,automatic:false});
      }
      for (const item of wrongItems()) if (item.updatedAt > (read(item.materialId).reviewed[item.questionId] || 0)) items.set(item.materialId+':'+item.questionId,item);
      return [...items.values()].sort((a,b) => b.updatedAt-a.updatedAt);
    }
    function exportBackup() { return JSON.stringify({version:1,exportedAt:now(),records:all().filter(r => r.updatedAt)},null,2); }
    function importBackup(input) {
      if (typeof input === 'string' && input.length > 8 * 1024 * 1024) fail();
      const backup = typeof input === 'string' ? JSON.parse(input) : input;
      if (!plain(backup) || backup.version !== 1 || !Array.isArray(backup.records) || backup.records.length > 500) fail();
      const ids = new Set(), valid = [];let skipped = 0;
      for (const r of backup.records) {
        if (!plain(r) || typeof r.materialId !== 'string') fail();
        if (!materials.has(r.materialId)) { skipped++; continue; }
        if (ids.has(r.materialId)) fail(); ids.add(r.materialId); valid.push(validate(r.materialId,r));
      }
      let added = 0, overwritten = 0;
      for (const r of valid) { const prev = read(r.materialId);if (r.updatedAt > prev.updatedAt) {if (prev.updatedAt) overwritten++; else added++;} else skipped++; }
      return {added,overwritten,skipped,commit() {
        // Validate every record before writes; rollback persistent changes on a quota failure.
        const candidates = valid.filter(r => r.updatedAt > read(r.materialId).updatedAt);
        const previous = candidates.map(r => ({id:r.materialId,raw:storage?.getItem(PREFIX+r.materialId)}));
        try {
          if (!storage) throw Error('Storage unavailable');
          for (const r of candidates) storage.setItem(PREFIX+r.materialId,JSON.stringify(r));
        } catch (error) {
          for (const p of previous) try { if (p.raw === null || p.raw === undefined) storage?.removeItem(PREFIX+p.id);else storage?.setItem(PREFIX+p.id,p.raw); } catch (_) {}
          persistenceError = true; throw Error('Backup could not be saved; existing records retained');
        }
        for (const r of candidates) {dirty.delete(r.materialId);corrupted.delete(r.materialId);emit(r.materialId);}return candidates.length;
      }};
    }
    function migrate() {
      for (const [key,id] of [['neuro-guide-v1','neuroscience-review'],['dadoes-ch10-12-review-v1','literature-androids-10-12']]) {
        if (!materials.has(id) || read(id).updatedAt) continue;
        try {
          const raw = storage?.getItem(key);if (!raw) continue;const old = JSON.parse(raw), results = {};
          let state;
          if (id === 'neuroscience-review') {
            if (!plain(old) || !Array.isArray(old.learned) || !Array.isArray(old.wrong)) continue;
            state = {learned:old.learned.filter(c => index[id].cardIds.includes(c)),wrong:old.wrong.filter(i => Number.isInteger(i) && i >= 0 && i < 90),seen:Array.isArray(old.seen)?old.seen.filter(i=>Number.isInteger(i)&&i>=0&&i<90):[]};
            state.wrong.forEach(i => {results[index[id].questions[i].id] = {status:'incorrect',updatedAt:now()};});
          } else {
            state = validateState(id,old);
            for (const q of index[id].questions.filter(q => q.type === 'mc')) if ((old.checked?.includes(q.id) || old.submitted?.includes(q.id)) && Number.isInteger(old.answers?.[q.id])) results[q.id] = {status:old.answers[q.id] === q.answer?'correct':'incorrect',updatedAt:now()};
          }
          save(id,{progress:{state,results}});
        } catch (_) { /* Never overwrite a damaged legacy record or invent answers. */ }
      }
    }
    if (events) events.addEventListener('storage',event => {
      if (event.key === null) { for (const id of materials.keys()) if (!dirty.has(id)) emit(id); }
      else if (event.key.startsWith(PREFIX)) { const id = event.key.slice(PREFIX.length);if (materials.has(id) && !dirty.has(id)) emit(id); }
    });
    const api = {read,save,all,wrongItems,reviewItems,exportBackup,importBackup,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},catalog,index,get persistenceError(){return persistenceError || dirty.size>0 || corrupted.size>0;}};
    migrate();return api;
  }
  return {createStore};
});
