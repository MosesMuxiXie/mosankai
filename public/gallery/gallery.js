(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const messages = {
    'zh-CN': { skip:'跳转到作品', home:'首页', gallery:'作品馆', blog:'博客', study:'复习资料', schedule:'约时间', menu:'打开或关闭导航', browse:'浏览作品', featured:'精选作品', all:'全部作品', search:'搜索作品', filter:'按分类筛选', retry:'重试', loading:'正在读取作品…', failed:'作品暂时无法读取，请重试。', empty:'没有匹配的作品。', count:'{n} 个作品', view:'查看作品', back:'返回作品馆', problem:'解决的问题', approach:'实现思路', outcome:'已有成果', source:'源码', docs:'文档', demo:'访问项目', download:'下载', read:'阅读', missing:'作品不存在或尚未公开。', preview:'作品预览', previewFailed:'预览已失效，请返回后台重新打开。', minecraft:'Minecraft', tools:'工具与网站', research:'研究', story:'叙事实验', any:'全部' },
    en: { skip:'Skip to works', home:'Home', gallery:'Gallery', blog:'Blog', study:'Study guides', schedule:'Find a time', menu:'Toggle navigation', browse:'Browse works', featured:'Selected works', all:'All works', search:'Search works', filter:'Filter by category', retry:'Retry', loading:'Loading works…', failed:'Works could not be loaded. Please retry.', empty:'No matching works.', count:'{n} works', view:'View work', back:'Back to gallery', problem:'The problem', approach:'The approach', outcome:'The result', source:'Source', docs:'Documentation', demo:'Visit project', download:'Download', read:'Read', missing:'This work does not exist or is not public.', preview:'Work preview', previewFailed:'This preview expired. Open it again from the dashboard.', minecraft:'Minecraft', tools:'Tools & websites', research:'Research', story:'Narrative experiments', any:'All' }
  };
  const categories = ['any','minecraft','tools','research','story'];
  const language = () => window.MosankaiI18n.language;
  const t = key => messages[language()][key] || messages.en[key] || key;
  const text = value => value[language()] || value['zh-CN'] || value.en || '';
  let works = [];
  let selected = 'any';
  let state = 'loading';
  let preview = false;
  const parts = location.pathname.replace(/\/$/, '').split('/');
  let slug = parts[2] || '';
  // Asset paths are never treated as work slugs; HTML entry is useful locally.
  if (slug === 'index.html') slug = '';
  function node(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }
  function safeHref(value) {
    if(typeof value!=='string'||/[\s\\\u0000-\u001f]/.test(value))return false;
    if(value.startsWith('/')&&!value.startsWith('//'))return true;
    try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password;}catch{return false;}
  }
  function art(work, className = '') {
    const el = node('div', 'project-cover ' + className);
    const monogram = node('span', 'cover-monogram', work.title.replace(/[^A-Za-z0-9\u4e00-\u9fff]/g,'').slice(0,2).toUpperCase());
    monogram.setAttribute('aria-hidden','true');
    if (work.cover) {
      const img = document.createElement('img');
      img.src = work.cover; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
      img.addEventListener('error', () => { el.classList.add('image-failed'); el.replaceChildren(monogram); });
      el.append(img);
    } else el.append(monogram);
    return el;
  }
  function card(work) {
    const el = node('a','project-card'); el.href = '/gallery/' + work.slug;
    const content = node('div','project-copy');
    content.append(node('h3','',work.title), node('span','project-tags',work.tags.join(' · ')),node('p','project-summary',text(work.summary)),node('span','project-open',t('view')+' ↗'));
    el.append(art(work),content); return el;
  }
  function row(work) {
    const el = node('a','archive-row'); el.href = '/gallery/' + work.slug;
    const content = node('div','archive-copy');
    const title = node('div','archive-title'); title.append(node('h3','',work.title),node('span','',t(work.category)));
    content.append(title,node('p','',text(work.summary)));
    const arrow = node('span','archive-arrow','↗'); arrow.setAttribute('aria-hidden','true');
    el.append(art(work,'archive-art'),content,arrow); return el;
  }
  function translate() {
    document.querySelectorAll('[data-copy]').forEach(el => el.textContent = t(el.dataset.copy));
    document.querySelectorAll('[data-label]').forEach(el => el.setAttribute('aria-label',t(el.dataset.label)));
    document.querySelectorAll('[data-placeholder]').forEach(el => el.placeholder = t(el.dataset.placeholder));
  }
  function renderList() {
    $('category-filters').replaceChildren(...categories.map(category => {
      const button = node('button','',t(category)); button.type = 'button';
      button.setAttribute('aria-pressed',String(selected === category));
      button.addEventListener('click', () => { selected = category; renderList(); $('category-filters').children[categories.indexOf(category)].focus({preventScroll:true}); });
      return button;
    }));
    const featured = works.filter(w => w.featured).slice(0,3);
    $('featured-section').hidden = featured.length === 0;
    $('featured-works').replaceChildren(...featured.map(card));
    const query = $('work-search').value.normalize('NFKC').toLocaleLowerCase().trim();
    const matches = works.filter(w => (selected === 'any' || w.category === selected) && [w.title,w.summary.en,w.summary['zh-CN'],...w.tags].join(' ').normalize('NFKC').toLocaleLowerCase().includes(query));
    $('all-works-grid').replaceChildren(...matches.map(row));
    $('results-count').textContent = state === 'ready' ? t('count').replace('{n}',matches.length) : '';
    $('works-status').textContent = state === 'ready' ? (matches.length ? '' : t('empty')) : t(state === 'loading' ? 'loading' : 'failed');
    $('gallery-retry').hidden = state !== 'failed';
    document.title = `${t('gallery')} · MOSANKAI`;
  }
  function renderDetail() {
    $('gallery-list-view').hidden = true;
    const container = $('gallery-detail-view'); container.hidden = false; container.replaceChildren();
    const back = node('a','detail-back','← '+t('back')); back.href = '/gallery'; container.append(back);
    if (preview) container.append(node('p','preview-note',t('preview')));
    const work = works.find(w => w.slug === slug);
    if (!work) {
      const message = state === 'loading' ? t('loading') : state === 'failed' ? t(preview ? 'previewFailed' : 'failed') : t('missing');
      container.append(node('p','works-status',message));
      if (state === 'failed' && !preview) { const retry = node('button','text-button',t('retry')); retry.type='button'; retry.addEventListener('click',load); container.append(retry); }
      document.title = `${t('gallery')} · MOSANKAI`; return;
    }
    document.title = `${work.title} · MOSANKAI`;
    document.querySelector('meta[name=description]').content = text(work.summary);
    const header = node('header','detail-header');
    header.append(node('p','eyebrow',t(work.category)),node('h1','',work.title),node('span','project-tags',work.tags.join(' · ')),node('p','project-summary',text(work.summary)));
    container.append(header);
    if (work.cover) container.append(art(work,'detail-cover'));
    const links = node('div','detail-links');
    for (const [key,href] of Object.entries(work.links)) {
      if (!href || !safeHref(href)) continue;
      const link = node('a','',t(key)+' ↗'); link.href = href;
      if (href.startsWith('https:')) { link.target='_blank'; link.rel='noopener noreferrer'; }
      links.append(link);
    }
    if (links.childElementCount) container.append(links);
    const sections = node('div','detail-sections');
    for (const key of ['problem','approach','outcome']) {
      const content = text(work.details[key]); if (!content) continue;
      const section = node('section','detail-block'); section.append(node('h2','',t(key)),node('p','',content)); sections.append(section);
    }
    container.append(sections);
  }
  function render() { translate(); if (slug) renderDetail(); else renderList(); }
  async function load() {
    state='loading'; render();
    try {
      if (new URLSearchParams(location.search).get('preview') === '1') {
        preview=true;
        const key='mosankai-work-preview';
        const work=JSON.parse(sessionStorage.getItem(key)||'null');
        if (!work || work.slug !== slug) throw new Error('Preview expired');
        // Verify the existing admin session before rendering any private preview.
        const auth=await fetch('/api/blogs/admin/auth',{cache:'no-store'});
        if (!auth.ok || !(await auth.json()).authenticated) throw new Error('Sign in required');
        works=[work];
      } else {
        const response=await fetch('/api/works',{cache:'no-store'});
        if (!response.ok) throw new Error('Unavailable');
        works=(await response.json()).works;
      }
      state='ready';
    } catch { state='failed'; works=[]; }
    render();
  }
  $('work-search').addEventListener('input',renderList);
  $('gallery-retry').addEventListener('click',load);
  const menu=document.querySelector('.mobile-menu');
  menu.addEventListener('click',()=>{ const open=menu.getAttribute('aria-expanded')!=='true'; menu.setAttribute('aria-expanded',String(open)); $('gallery-nav').classList.toggle('open',open); });
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');$('gallery-nav').classList.remove('open');menu.focus();}});
  window.addEventListener('mosankai:languagechange',render);
  load();
})();
