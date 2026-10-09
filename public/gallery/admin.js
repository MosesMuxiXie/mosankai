(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('works-panel');
  const categories = { minecraft:'Minecraft', tools:'工具与网站', research:'研究', story:'叙事实验' };
  const detailNames = { problem:'解决的问题', approach:'实现思路', outcome:'已有成果' };
  const linkNames = { source:'源码', docs:'文档', demo:'演示', download:'下载', read:'阅读' };
  let record = { revision:0, works:[] };
  let selected = null;
  let cover = '';
  let dirty = false;
  let loaded = false;
  let busy = false;
  const blank = () => ({slug:'',title:'',category:'tools',visible:false,featured:false,tags:[],cover:'',summary:{'zh-CN':'',en:''},details:Object.fromEntries(Object.keys(detailNames).map(key=>[key,{'zh-CN':'',en:''}])),links:{}});
  function node(tag, className, text) { const el=document.createElement(tag); if(className)el.className=className; if(text!==undefined)el.textContent=text; return el; }
  function message(text='',error=false) { $('works-admin-message').textContent=text; $('works-admin-message').className='form-message '+(error?'error':'success'); }
  function markDirty(value=true) { dirty=value; $('work-dirty-state').textContent=value?'未保存':'已保存'; }
  function setBusy(value) { busy=value; root.inert=value; $('work-save').textContent=value?'正在保存…':'保存作品'; }
  function discardAllowed() { return !dirty || window.confirm('这个作品有未保存的修改，确定放弃修改吗？'); }
  function closePreview() { $('work-preview-area').hidden=true; $('work-preview-frame').removeAttribute('src'); try{sessionStorage.removeItem('mosankai-work-preview');}catch{} }

  for(const [key,label] of Object.entries(detailNames)) {
    const pair=node('div','work-field-pair');
    for(const [code,lang] of [['zh','中文'],['en','English']]) {
      const wrapper=node('label','',`${label} / ${lang}`); const field=node('textarea'); field.id=`work-${key}-${code}`; field.maxLength=5000;field.rows=4;if(code==='en')field.lang='en';wrapper.append(field);pair.append(wrapper);
    }
    $('work-detail-fields').append(pair);
  }
  for(const [key,label] of Object.entries(linkNames)) {
    const wrapper=node('label','',label+'链接'); const field=node('input');field.id='work-link-'+key;field.maxLength=2048;field.placeholder='https://… 或 /站内地址';wrapper.append(field);$('work-link-fields').append(wrapper);
  }
  function showCover() { const image=$('work-cover-preview');image.hidden=!cover;if(cover)image.src=cover;else image.removeAttribute('src'); }
  function edit(work, existing=true) {
    selected=existing?work.slug:null;cover=work.cover;
    $('work-editor').hidden=false;$('work-editor-heading').textContent=existing?'编辑作品':'新增作品';
    for(const key of ['title','slug','category']) $('work-'+key).value=work[key];
    $('work-slug').readOnly=existing;$('work-slug-label').textContent=work.slug;
    $('work-tags').value=work.tags.join(', ');
    $('work-summary-zh').value=work.summary['zh-CN'];$('work-summary-en').value=work.summary.en;
    for(const key of Object.keys(detailNames)) for(const [suffix,lang] of [['zh','zh-CN'],['en','en']]) $('work-'+key+'-'+suffix).value=work.details[key][lang];
    for(const key of Object.keys(linkNames)) $('work-link-'+key).value=work.links[key]||'';
    $('work-visible').checked=work.visible;$('work-featured').checked=work.featured;
    $('work-cover-file').value='';markDirty(!existing);showCover();renderList();closePreview();
  }
  function collect() {
    const work=blank();
    for(const key of ['title','slug','category']) work[key]=$('work-'+key).value.trim();
    work.tags=$('work-tags').value.split(',').map(v=>v.trim()).filter(Boolean);work.cover=cover;
    work.summary={'zh-CN':$('work-summary-zh').value.trim(),en:$('work-summary-en').value.trim()};
    for(const key of Object.keys(detailNames)) work.details[key]={'zh-CN':$('work-'+key+'-zh').value.trim(),en:$('work-'+key+'-en').value.trim()};
    for(const key of Object.keys(linkNames)) { const value=$('work-link-'+key).value.trim();if(value)work.links[key]=value; }
    work.visible=$('work-visible').checked;work.featured=$('work-featured').checked;
    return work;
  }
  function renderList() {
    const list=$('works-admin-list');list.replaceChildren();
    if(!record.works.length){list.append(node('p','', '暂无作品'));return;}
    record.works.forEach((work,index)=>{
      const item=node('div','work-admin-item'+(selected===work.slug?' selected':''));
      const select=node('button','work-select');select.type='button';select.append(node('strong','',work.title),node('small','',`${categories[work.category]} · ${work.visible?'公开':'隐藏'}${work.featured?' · 精选':''}`));
      select.addEventListener('click',()=>{if(!busy&&discardAllowed()){message();edit(work);}});
      const actions=node('div','work-order-actions');
      for(const [offset,label] of [[-1,'上移'],[1,'下移']]){
        const button=node('button','',offset<0?'↑':'↓');button.type='button';button.setAttribute('aria-label',`${label} ${work.title}`);button.disabled=index+offset<0||index+offset>=record.works.length;
        button.addEventListener('click',async()=>{if(dirty){message('请先保存或重新读取正在编辑的作品，再调整顺序。',true);return;}const reordered=[...record.works];[reordered[index],reordered[index+offset]]=[reordered[index+offset],reordered[index]];await save(reordered,selected);});actions.append(button);
      }
      item.append(select,actions);list.append(item);
    });
  }
  async function load(force=false) {
    if(busy||loaded&&!force)return;
    if(force&&!discardAllowed())return;
    setBusy(true);message('正在读取作品…');
    try{
      record=await api('/api/works?admin=1');loaded=true;$('work-new').disabled=false;markDirty(false);
      if(record.works.length)edit(record.works.find(w=>w.slug===selected)||record.works[0]);else{$('work-editor').hidden=true;selected=null;renderList();}
      message();
    }catch(error){message(error.message,true);}finally{setBusy(false);}
  }
  async function save(works,slug) {
    if(busy)return;
    setBusy(true);message();
    try{
      record=await api('/api/works',{method:'PUT',body:JSON.stringify({revision:record.revision,works})});
      const work=record.works.find(w=>w.slug===slug);
      if(work)edit(work);else renderList();markDirty(false);message('作品已保存。');
    }catch(error){message(error.status===409?'作品已在其他位置更新。当前编辑内容仍保留，请先复制需要保留的内容，再点击“重新读取”。':error.message,true);}finally{setBusy(false);}
  }
  $('work-editor').addEventListener('input',()=>{markDirty();$('work-slug-label').textContent=$('work-slug').value;});
  $('work-editor').addEventListener('change',()=>markDirty());
  $('work-new').addEventListener('click',()=>{if(!busy&&loaded&&discardAllowed()){message();edit(blank(),false);$('work-title').focus();}});
  $('works-reload').addEventListener('click',()=>load(true));
  $('work-editor').addEventListener('submit',async event=>{
    event.preventDefault();if(!$('work-editor').reportValidity()||busy)return;
    const work=collect();
    if(!selected&&record.works.some(w=>w.slug===work.slug)){message('这个作品地址已经被使用。',true);return;}
    const works=selected?record.works.map(w=>w.slug===selected?work:w):[...record.works,work];await save(works,work.slug);
  });
  $('work-cover-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;setBusy(true);
    try{cover=await optimizedPageBackground(file);showCover();markDirty();message();}catch(error){message(error.message,true);}finally{setBusy(false);event.target.value='';}
  });
  $('work-clear-cover').addEventListener('click',()=>{cover='';showCover();markDirty();});
  $('work-preview').addEventListener('click',()=>{
    if(!$('work-editor').reportValidity())return;
    try{const work=collect();sessionStorage.setItem('mosankai-work-preview',JSON.stringify(work));$('work-preview-frame').src='/gallery/'+encodeURIComponent(work.slug)+'?preview=1';$('work-preview-area').hidden=false;$('work-preview-area').scrollIntoView({block:'start'});}catch{message('浏览器无法保存预览，请允许本站的本地存储。',true);}
  });
  $('work-close-preview').addEventListener('click',closePreview);
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  window.MosankaiWorksAdmin={load};
})();
