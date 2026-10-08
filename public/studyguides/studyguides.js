(function () {
  'use strict';
  const results = document.getElementById('catalog-results');
  const search = document.getElementById('study-search');
  const filters = document.querySelectorAll('[data-subject]');
  let catalog;
  const i18n = () => window.MosankaiI18n;
  const t = (key, params) => i18n().t('studyguides.' + key, params);
  const localized = value => value[i18n().language] || value.en;
  const subjectFromPath = () => {
    const subject = location.pathname.replace(/\/$/, '').split('/')[2];
    return ['statistics', 'neuroscience', 'english'].includes(subject) ? subject : 'all';
  };
  let selected = subjectFromPath();

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function size(bytes) {
    const formatter = new Intl.NumberFormat(i18n().locale(), { maximumFractionDigits: 1 });
    return bytes < 1048576 ? formatter.format(bytes / 1024) + ' KB' : formatter.format(bytes / 1048576) + ' MB';
  }

  function guideCard(item, subject, index) {
    const card = element('a', 'guide-card');
    card.href = item.href;
    const top = element('div', 'guide-card-top');
    top.append(element('span', 'eyebrow', `${t('interactive')} / ${String(index + 1).padStart(2, '0')}`), element('span', 'card-arrow', '↗'));
    const art = element('div', 'guide-art ' + subject.id);
    art.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 7; i++) art.append(element('i'));
    const metadata = element('div', 'guide-metadata');
    metadata.append(element('span', '', item.format + ' · ' + size(item.bytes)), element('span', 'open-guide', t('open') + ' ↗'));
    card.append(top, art, element('h3', '', localized(item.title)), element('p', 'material-scope', localized(item.scope)), metadata);
    return card;
  }

  function sourceRow(item) {
    const row = element('li', 'source-row');
    const badge = element('span', 'file-badge', item.format);
    const info = element('div', 'source-info');
    info.append(element('h4', '', localized(item.title)), element('p', 'material-scope', localized(item.scope)));
    const actions = element('div', 'source-actions');
    actions.append(element('span', 'file-size', size(item.bytes)));
    if (item.format === 'PDF') {
      const read = element('a', 'read-source', t('read') + ' ↗');
      read.href = item.href;
      read.target = '_blank';
      read.rel = 'noopener';
      read.setAttribute('aria-label', t('readMaterial', { title: localized(item.title) }));
      actions.append(read);
    }
    const download = element('a', 'download-source', t('download') + ' ↓');
    download.href = item.href;
    download.download = item.filename;
    download.setAttribute('aria-label', t('downloadMaterial', { title: localized(item.title) }));
    actions.append(download);
    row.append(badge, info, actions);
    return row;
  }

  function render() {
    if (!catalog) return;
    const query = search.value.normalize('NFKC').trim().toLocaleLowerCase();
    const matching = catalog.materials.filter(item => {
      if (selected !== 'all' && item.subject !== selected) return false;
      const haystack = [item.title.en, item.title['zh-CN'], item.scope.en, item.scope['zh-CN'], item.filename, item.format].join(' ').normalize('NFKC').toLocaleLowerCase();
      return haystack.includes(query);
    });
    document.getElementById('results-count').textContent = t('resultCount', { count: matching.length });
    filters.forEach(link => {
      if (link.dataset.subject === selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    results.replaceChildren();
    if (!matching.length) {
      const empty = element('div', 'empty-state');
      empty.append(element('span', 'empty-symbol', '∅'), element('h2', '', t('emptyTitle')), element('p', '', t('emptyDescription')));
      results.append(empty);
      return;
    }
    catalog.subjects.forEach((subject, subjectIndex) => {
      const items = matching.filter(item => item.subject === subject.id);
      if (!items.length) return;
      const section = element('section', 'subject-section');
      section.dataset.subjectSection = subject.id;
      const heading = element('div', 'subject-heading');
      const title = element('div', 'subject-title');
      title.append(element('span', 'subject-number', String(subjectIndex + 1).padStart(2, '0')), element('h2', '', localized(subject.title)));
      heading.append(title, element('p', '', localized(subject.description)));
      section.append(heading);
      const guides = items.filter(item => item.kind === 'guide');
      if (guides.length) {
        section.append(element('h3', 'group-label', `${t('guides')} / ${guides.length}`));
        const cards = element('div', 'guide-grid');
        guides.forEach((item, index) => cards.append(guideCard(item, subject, index)));
        section.append(cards);
      }
      const sources = items.filter(item => item.kind === 'source');
      if (sources.length) {
        section.append(element('h3', 'group-label', `${t('sources')} / ${sources.length}`));
        const list = element('ul', 'source-list');
        sources.forEach(item => list.append(sourceRow(item)));
        section.append(list);
      }
      if (subject.id === 'neuroscience' && !query) section.append(element('p', 'source-note', t('missingSource')));
      results.append(section);
    });
  }

  filters.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selected = link.dataset.subject;
    history.pushState(null, '', link.href);
    render();
  }));
  window.addEventListener('popstate', () => { selected = subjectFromPath(); render(); });
  window.addEventListener('mosankai:languagechange', render);
  search.addEventListener('input', render);

  async function load() {
    try {
      const response = await fetch('/studyguides/catalog.json');
      if (!response.ok) throw new Error('Catalog request failed');
      catalog = await response.json();
      document.getElementById('subject-count').textContent = String(catalog.subjects.length).padStart(2, '0');
      document.getElementById('guide-count').textContent = String(catalog.materials.filter(item => item.kind === 'guide').length).padStart(2, '0');
      document.getElementById('source-count').textContent = String(catalog.materials.filter(item => item.kind === 'source').length).padStart(2, '0');
      render();
    } catch {
      results.replaceChildren();
      const message = element('div', 'state-message');
      message.setAttribute('role', 'alert');
      message.append(element('p', '', t('loadError')));
      const retry = element('button', 'retry-button', t('retry'));
      retry.type = 'button';
      retry.addEventListener('click', load);
      message.append(retry);
      results.append(message);
    }
  }
  load();
}());
