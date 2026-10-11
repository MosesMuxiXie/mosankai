(function(){
'use strict';
const $=id=>document.getElementById(id),i18n=()=>window.MosankaiI18n;
const copy={
home:['首页','Home'],hub:['学习中心','Study Center'],gallery:['作品馆','Gallery'],intro:['继续学习，整理资料与复习记录。','Continue studying. Organize materials and review records.'],
export:['↑ 导出备份','↑ Export backup'],import:['↓ 导入备份','↓ Import backup'],local:['记录保存在当前浏览器，可导出转移。','Records stay in this browser. Export a backup to transfer them.'],
heroAlt:['黄昏自习室、台灯与笔记本的漫画分镜。','Manga panels of a dusk study room, a lamp and a notebook.'],
continue:['继续学习','Continue studying'],recentFive:['最近五份资料','Five most recent materials'],personal:['个人学习','My learning'],subject:['学科','Subject'],all:['全部','All'],
favorites:['收藏','Saved'],wrong:['错题','Incorrect answers'],review:['待复习','To review'],catalog:['资料目录','Study materials'],guides:['交互资料','interactive guides'],sources:['原始文件','source files'],originals:['原始资料','Original materials'],footer:['学习中心 · 公开阅读','Study Center · Open access'],
loading:['正在读取资料…','Loading materials…'],restoreTitle:['恢复备份','Restore backup'],mergeNote:['较新记录优先，相同时间保留本机记录。','Newer records take priority. Ties keep this browser’s record.'],restore:['恢复','Restore'],cancel:['取消','Cancel'],
noRecent:['尚无学习记录。从下方打开一份资料开始。','No study records yet. Open a material below to start.'],latest:['最新资料','Latest guide'],emptyFavorites:['还没有收藏资料。点击资料旁的书签即可收藏。','No saved materials. Use the bookmark beside a material to save it.'],
emptyWrong:['暂无已判定的错题。检查或提交选择题后，错题会出现在这里。','No assessed incorrect answers. Check or submit MC answers to collect them here.'],emptyReview:['暂无待复习内容。错题会自动加入，也可手动添加资料或书面题。','Nothing to review. Incorrect answers are added automatically; materials and written questions can be added manually.'],
open:['打开 →','Open →'],resume:['继续学习 →','Continue →'],retry:['重练','Retry'],read:['阅读','Read'],download:['下载','Download'],manual:['手动添加','Added manually'],wrongTag:['上次答错','Last assessed incorrect'],complete:['标记复习完成','Mark review complete'],
remove:['移出','Remove'],save:['收藏','Save material'],unsave:['取消收藏','Unsave material'],pending:['加入待复习','Add to review'],unpending:['从待复习移出','Remove from review'],
position:['上次位置','Last position'],savedAnswers:['已保存作答，可继续复习','Responses saved; resume your review'],opened:['上次打开的资料','Previously opened material'],new:['新增','New'],
unavailable:['存储不可用或记录损坏。本次记录仍可导出；请检查浏览器存储设置。','Storage is unavailable or a record is damaged. Export session records and check browser storage settings.'],
importError:['备份无法读取或保存。原有记录保留。','Backup could not be read or saved. Existing records are retained.'],restored:['备份已恢复。','Backup restored.'],exported:['备份已导出。','Backup exported.'],
tooLarge:['备份文件超过 8 MiB。','Backup exceeds 8 MiB.'],refresh:['学习记录已更新。','Learning records updated.']
};
const t=key=>copy[key]?copy[key][i18n().language==='en'?1:0]:i18n().t('studyguides.'+key);
const localized=value=>value[i18n().language]||value.en;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const subjectPath=()=>{const s=location.pathname.replace(/\/$/,'').split('/')[2];return ['statistics','neuroscience','english'].includes(s)?s:'all';};
let selected=subjectPath(),panel='favorites',store,catalog,index,preview;
function image(subject){const img=el('img');img.src='/studyguides/assets/manga-'+subject+'.webp';img.alt='';img.loading='lazy';img.width=720;img.height=405;img.addEventListener('error',()=>{img.hidden=true;});return img;}
function material(id){return catalog.materials.find(m=>m.id===id);}
function subjectName(m){return localized(catalog.subjects.find(s=>s.id===m.subject).title);}
function update(id,patch){const result=store.save(id,patch);if(!result.persisted)status(t('unavailable'));return result;}
function status(message,error=false){$('study-status').textContent=message;$('study-status').classList.toggle('error',error);}
function link(m,label,questionId=null,resume=false){const a=el('a','',label);const url=new URL(m.href,location.origin);if(questionId)url.searchParams.set('studyQuestion',questionId);else if(resume&&m.kind==='guide')url.searchParams.set('studyResume','1');a.href=url.pathname+url.search+url.hash;a.dataset.visit=m.id;return a;}
function bookmark(m){const b=el('button','bookmark');b.type='button';const active=store.read(m.id).favorite;b.setAttribute('aria-pressed',String(active));b.setAttribute('aria-label',t(active?'unsave':'save')+' · '+localized(m.title));b.dataset.favorite=m.id;
 b.innerHTML='<svg viewBox="0 0 18 24" aria-hidden="true"><path d="M3 2h12v20l-6-4-6 4Z"/></svg>';return b;}
function size(bytes){const f=new Intl.NumberFormat(i18n().locale(),{maximumFractionDigits:1});return bytes<1048576?f.format(bytes/1024)+' KB':f.format(bytes/1048576)+' MB';}
function date(time){return new Intl.DateTimeFormat(i18n().locale(),{month:'short',day:'numeric'}).format(new Date(time));}
function renderRecent(){
 const records=store.all().filter(r=>r.lastVisitedAt).sort((a,b)=>b.lastVisitedAt-a.lastVisitedAt).slice(0,5),root=$('recent-results');root.replaceChildren();
 if(!records.length){const empty=el('div','empty-state');empty.append(el('div','',t('noRecent')));const newest=material('literature-androids-10-12');const a=link(newest,t('latest')+' · '+localized(newest.title));a.className='button';empty.append(a);root.append(empty);return;}
 const r=records[0],m=material(r.materialId),card=el('article','continue-card'),info=el('div');card.append(image(m.subject));info.append(el('h3','',localized(m.title)),el('p','',localized(m.scope)));
 let position=m.kind==='source'?t('opened'):t('savedAnswers');
 if(r.resume?.questionId)position=t('position')+' · '+r.resume.questionId;
 else if(r.resume?.sceneIndex!==undefined)position=t('position')+' · '+(i18n().language==='en'?'Scene ':'故事节点 ')+(r.resume.sceneIndex+1);
 else if(r.resume?.section)position=t('position')+' · '+r.resume.section;
 info.append(el('p','',position));const a=link(m,t(m.kind==='guide'?'resume':'open'),null,true);a.className='button primary';card.append(info,a);root.append(card);
 if(records.length>1){const list=el('ul','recent-list');for(const item of records.slice(1)){const row=el('li');row.append(link(material(item.materialId),localized(material(item.materialId).title),null,true),el('span','small',date(item.lastVisitedAt)));list.append(row);}root.append(list);}
}
function renderPersonal(){
 const root=$('personal-results');root.replaceChildren();root.setAttribute('aria-labelledby','tab-'+panel);
 const ps=$('personal-subject').value;
 let items=panel==='favorites'?store.all().filter(r=>r.favorite).map(r=>({materialId:r.materialId,questionId:null,updatedAt:r.updatedAt})):panel==='wrong'?store.wrongItems():store.reviewItems();
 items=items.filter(item=>ps==='all'||material(item.materialId).subject===ps).sort((a,b)=>b.updatedAt-a.updatedAt);
 if(!items.length){root.append(el('p','empty-state',t(panel==='favorites'?'emptyFavorites':panel==='wrong'?'emptyWrong':'emptyReview')));return;}
 const list=el('ul','personal-list');
 for(const item of items){const m=material(item.materialId),row=el('li','personal-row'),info=el('div','personal-info'),actions=el('div','row-actions');
 if(panel==='review'){const complete=el('button','complete-button');complete.type='button';complete.setAttribute('aria-label',t('complete')+' · '+localized(m.title));complete.dataset.complete=m.id;complete.dataset.question=item.questionId||'';row.append(complete);}
 info.append(el('strong','',localized(m.title)),el('p','',subjectName(m)));
 if(item.questionId){const q=index[m.id].questions.find(q=>q.id===item.questionId);info.append(el('span','personal-question',item.questionId+' · '+q.prompt));}
 const a=link(m,t(item.questionId?'retry':'open'),item.questionId);a.className='button';actions.append(a);
 if(panel==='favorites'){actions.append(bookmark(m));const b=el('button','',t(store.read(m.id).pending.material?'unpending':'pending'));b.type='button';b.dataset.pending=m.id;actions.append(b);}
 else row.append(el('span','tag'+(item.automatic?' wrong':''),t(item.automatic?'wrongTag':'manual')));
 row.append(info,actions);list.append(row);
 }
 root.append(list);
}
function guideCard(m){const card=el('article','guide-card');card.dataset.material=m.id;const a=link(m,'');a.append(image(m.subject),el('h3','',localized(m.title)),el('p','material-scope',localized(m.scope)));const meta=el('div','guide-metadata');meta.append(el('span','',m.format+' · '+size(m.bytes)),el('span','open-guide',t('open')));a.append(meta);card.append(a,bookmark(m));if(m.id==='literature-androids-10-12')card.append(el('span','new-tag',t('new')));return card;}
function sourceRow(m){const row=el('li','source-row'),info=el('div','source-info'),actions=el('div','source-actions');info.append(el('h4','',localized(m.title)),el('p','',localized(m.scope)));actions.append(el('span','file-size',size(m.bytes)));
 if(m.format==='PDF'){const a=link(m,t('read'));a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',t('readMaterial').replace('{title}',localized(m.title)));actions.append(a);}
 const download=link(m,t('download'));download.download=m.filename;download.setAttribute('aria-label',t('downloadMaterial').replace('{title}',localized(m.title)));actions.append(download);
 const pending=el('button','',t(store.read(m.id).pending.material?'unpending':'pending'));pending.type='button';pending.dataset.pending=m.id;pending.setAttribute('aria-label',pending.textContent+' · '+localized(m.title));actions.append(pending);
 row.append(el('span','file-badge'+(m.format==='PDF'?' pdf':''),m.format),info,bookmark(m),actions);return row;
}
function renderCatalog(){
 const query=$('study-search').value.normalize('NFKC').trim().toLocaleLowerCase();
 const matches=catalog.materials.filter(m=>(selected==='all'||m.subject===selected)&&[m.title.en,m.title['zh-CN'],m.scope.en,m.scope['zh-CN'],m.filename,m.format].join(' ').normalize('NFKC').toLocaleLowerCase().includes(query));
 document.querySelectorAll('[data-subject]').forEach(a=>{if(a.dataset.subject===selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('results-count').textContent=i18n().t('studyguides.resultCount',{count:matches.length});
 const guides=$('catalog-results'),sources=$('source-results');guides.replaceChildren();sources.replaceChildren();
 const list=matches.filter(m=>m.kind==='guide');
 if(list.length){const grid=el('div','guide-grid');list.forEach(m=>grid.append(guideCard(m)));guides.append(grid);}else guides.append(el('p','empty-state',t('emptyTitle')));
 for(const subject of catalog.subjects){const items=matches.filter(m=>m.kind==='source'&&m.subject===subject.id);if(!items.length)continue;sources.append(el('h3','source-subject',localized(subject.title)));const ul=el('ul','source-list');items.forEach(m=>ul.append(sourceRow(m)));sources.append(ul);if(subject.id==='neuroscience'&&!query)sources.append(el('p','source-note',t('missingSource')));}
 if(!matches.some(m=>m.kind==='source'))sources.append(el('p','empty-state',t('emptyTitle')));
}
function render(){
 document.querySelectorAll('[data-hubtext]').forEach(n=>n.textContent=t(n.dataset.hubtext));
 $('personal-subject').setAttribute('aria-label',t('subject'));document.querySelector('.personal-tabs').setAttribute('aria-label',t('personal'));
 if(!store)return;$('guide-count').textContent=catalog.materials.filter(m=>m.kind==='guide').length;$('source-count').textContent=catalog.materials.filter(m=>m.kind==='source').length;
 renderRecent();renderPersonal();renderCatalog();if(store.persistenceError)status(t('unavailable'));
}
function activate(next,focus=false){panel=next;document.querySelectorAll('[data-panel]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.panel===panel));b.tabIndex=b.dataset.panel===panel?0:-1;if(focus&&b.dataset.panel===panel)b.focus();});renderPersonal();}
document.querySelector('.personal-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-panel]');if(b&&store)activate(b.dataset.panel);});
document.querySelector('.personal-tabs').addEventListener('keydown',e=>{const tabs=['favorites','wrong','review'];if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)&&store){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?2:(tabs.indexOf(panel)+(e.key==='ArrowRight'?1:2))%3;activate(tabs[n],true);}});
$('personal-subject').addEventListener('change',()=>{if(store)renderPersonal();});
document.querySelectorAll('[data-subject]').forEach(a=>a.addEventListener('click',event=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();selected=a.dataset.subject;history.pushState(null,'',a.href);if(store)renderCatalog();}));
window.addEventListener('popstate',()=>{selected=subjectPath();if(store)renderCatalog();});
window.addEventListener('mosankai:languagechange',render);$('study-search').addEventListener('input',()=>{if(store)renderCatalog();});
document.addEventListener('click',event=>{
 if(!store)return;const fav=event.target.closest('[data-favorite]'),pending=event.target.closest('[data-pending]'),complete=event.target.closest('[data-complete]'),visit=event.target.closest('[data-visit]');
 if(fav){const id=fav.dataset.favorite;update(id,{favorite:!store.read(id).favorite});const fresh=[...document.querySelectorAll('[data-favorite]')].find(b=>b.dataset.favorite===id);fresh?.focus({preventScroll:true});}
 if(pending){const id=pending.dataset.pending;update(id,{pending:{material:!store.read(id).pending.material}});}
 if(complete){const id=complete.dataset.complete,qid=complete.dataset.question,r=store.read(id);update(id,qid?{pending:{questions:r.pending.questions.filter(q=>q!==qid)},reviewed:{[qid]:Date.now()}}:{pending:{material:false}});document.querySelector('[data-panel="'+panel+'"]').focus({preventScroll:true});}
 if(visit)update(visit.dataset.visit,{lastVisitedAt:Date.now()});
});
$('export-backup').addEventListener('click',()=>{if(!store)return;const blob=new Blob([store.exportBackup()],{type:'application/json'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='mosankai-study-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status(t('exported'));});
$('import-backup').addEventListener('click',()=>{if(store)$('backup-file').click();});
$('backup-file').addEventListener('change',async()=>{try{const file=$('backup-file').files[0];if(!file)return;if(file.size>8*1024*1024)throw Error(t('tooLarge'));preview=store.importBackup(await file.text());$('import-preview').textContent=i18n().language==='en'?preview.added+' new · '+preview.overwritten+' replace · '+preview.skipped+' skip':preview.added+' 项新增 · '+preview.overwritten+' 项覆盖 · '+preview.skipped+' 项跳过';$('import-dialog').showModal();}catch(_){status(t('importError'),true);}finally{$('backup-file').value='';}});
$('confirm-import').addEventListener('click',()=>{try{preview?.commit();$('import-dialog').close();render();status(t('restored'));}catch(_){$('import-dialog').close();status(t('importError'),true);}finally{preview=null;}});
$('cancel-import').addEventListener('click',()=>{$('import-dialog').close();preview=null;});$('import-dialog').addEventListener('close',()=>$('import-backup').focus({preventScroll:true}));
async function load(){try{store=await window.MosankaiStudy.ready;catalog=store.catalog;index=store.index;store.subscribe(render);render();}catch(_){const root=$('recent-results');root.replaceChildren(el('p','state-message',t('loadError')));const retry=el('button','load-retry',t('retry'));retry.type='button';retry.onclick=()=>location.reload();root.append(retry);}}
render();load();
})();
