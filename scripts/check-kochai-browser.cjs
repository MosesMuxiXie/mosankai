// Browser acceptance for the real page. Reuses bundled Playwright; no package additions.
const {chromium} = require(process.env.MOSANKAI_PLAYWRIGHT || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.STUDY_BASE_URL || 'http://127.0.0.1:3137';
const route = '/studyguides/english/guides/kochai-phantom-pain-essay-toolkit.html';
const material = 'literature-kochai-phantom-pain';

(async () => {
  const browser = await chromium.launch({channel:'msedge', headless:true});
  const context = await browser.newContext({viewport:{width:1440,height:1000}, locale:'en-US'});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {if(m.type()==='error')errors.push(m.text());});
  const go = async suffix => {await page.goto(base + route + suffix);await page.waitForFunction(() => window.MosankaiGuide);};
  const visibleEvidence = () => page.locator('.evidence-card:visible').count();
  try {
    await go('');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('h2').count(), 2);
    assert.equal(await page.locator('.essay').count(), 8);
    assert.equal(await visibleEvidence(), 26);
    assert.equal(/[\u3400-\u9fff]/.test(await page.locator('body').innerText()), false, 'Page and learning controls are English');
    assert.equal(await page.locator('.study-tools').count(), 1);

    await page.locator('#evidence-search').fill('FATHER');
    const searchCount = await visibleEvidence();
    assert.ok(searchCount > 0 && searchCount < 26);
    await page.locator('#theme-filter').selectOption('ending');
    assert.ok(await visibleEvidence() > 0);
    assert.ok(await visibleEvidence() < searchCount, 'Theme and text intersect');
    await page.locator('#evidence-search').fill('no-such-evidence-xyz');
    assert.equal(await visibleEvidence(), 0);
    assert.equal(await page.locator('#no-evidence').isVisible(), true);
    await page.locator('#clear-filters').click();
    assert.equal(await visibleEvidence(), 26);
    await page.locator('#theme-filter').selectOption('ending');
    await page.evaluate(() => {location.hash = 'E01';});
    await page.waitForFunction(() => !document.getElementById('E01').hidden);
    assert.equal(await page.locator('#theme-filter').inputValue(), 'all', 'Evidence deep links reveal filtered records');
    await page.locator('#theme-filter').selectOption('ending');
    await page.locator('.observation a[href="#E01"]').click();
    assert.equal(await page.locator('#E01').isVisible(), true, 'Repeating the current anchor reveals a filtered target');
    console.log('PASS real evidence search, intersecting filters, empty/reset, filtered deep links');

    for (const role of ['thesis','evidence','commentary','complexity']) {
      await page.locator(`[data-highlight="${role}"]`).check();
      assert.equal(await page.locator('body').evaluate((b,r) => b.classList.contains('show-'+r), role), true);
    }
    await page.locator('#clear-highlights').click();
    assert.equal(await page.locator('[data-highlight]:checked').count(), 0);
    await go('#essay-08-p4');
    assert.equal(await page.locator('#essay-08 .model').getAttribute('open'), '');
    assert.equal(await page.locator('#essay-08-p4').isVisible(), true);
    await page.locator('#essay-08 .model > summary').click();
    await page.locator('#essay-08 .notes > summary').click();
    await page.locator('#essay-08 .paragraph-notes a[href="#essay-08-p4"]').click();
    assert.equal(await page.locator('#essay-08-p4').isVisible(), true, 'Repeating a paragraph anchor reopens its model');
    console.log('PASS annotation controls and direct links into collapsed models');

    const favorite = page.getByRole('button', {name:'Save', exact:true});
    await favorite.click();
    await page.getByRole('button', {name:'Add to review', exact:true}).click();
    await page.waitForTimeout(250);
    await page.reload();
    await page.waitForFunction(() => window.MosankaiGuide);
    const record = await page.evaluate(id => window.MosankaiStudy.read(id), material);
    assert.equal(record.favorite, true);
    assert.equal(record.pending.material, true);
    assert.equal(record.resume.hash, '#essay-08-p4');
    assert.deepEqual(record.progress.results, {});
    assert.equal(await page.locator('#essay-08-p4').isVisible(), true);
    const backup = await page.evaluate(() => JSON.parse(window.MosankaiStudy.exportBackup()));
    assert.equal(backup.records.find(r => r.materialId === material).favorite, true);
    console.log('PASS favorites, review, paragraph resume, backup, and no invented assessment');

    await page.goto(base+'/studyguides/english');
    const resumeLink = page.locator(`#recent-results .continue-card a[href="${route}?studyResume=1"]`);
    await resumeLink.click();
    await page.waitForFunction(() => window.MosankaiGuide);
    assert.equal(await page.evaluate(() => location.hash), '#essay-08-p4', 'Continue restores the saved hash before the next capture');
    assert.equal(await page.locator('#essay-08-p4').isVisible(), true, 'Continue opens the containing model');
    assert.equal(await page.evaluate(id => window.MosankaiStudy.read(id).resume.hash, material), '#essay-08-p4');
    console.log('PASS real Study Center Continue restores a paragraph inside a collapsed model');

    await page.locator('#theme-filter').selectOption('ending');
    const priorCount = await visibleEvidence();
    const priorOpen = await page.locator('details[open]').count();
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
    assert.equal(await visibleEvidence(), 26);
    assert.equal(await page.locator('details:not([open])').count(), 0);
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    assert.equal(await visibleEvidence(), priorCount);
    assert.equal(await page.locator('details[open]').count(), priorOpen);
    assert.equal(await page.locator('#theme-filter').inputValue(), 'ending');
    console.log('PASS complete printing, idempotent preparation, and reading-state restoration');

    for (const width of [375,768,1440]) {
      await page.setViewportSize({width,height:1000});
      await go('');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No page overflow at '+width);
      await page.locator('#essay-01 .model > summary').click();
      assert.equal(await page.locator('#essay-01-p1').isVisible(), true);
      if (process.env.STUDY_SCREENSHOT_DIR) {
        fs.mkdirSync(process.env.STUDY_SCREENSHOT_DIR,{recursive:true});
        await page.evaluate(() => window.scrollTo(0,0));
        await page.screenshot({path:path.join(process.env.STUDY_SCREENSHOT_DIR,'kochai-'+width+'.png')});
        if(width===1440) {
          await page.locator('#evidence-bank').scrollIntoViewIfNeeded();
          await page.screenshot({path:path.join(process.env.STUDY_SCREENSHOT_DIR,'kochai-evidence.png')});
          await page.locator('#essay-01-p1').scrollIntoViewIfNeeded();
          await page.screenshot({path:path.join(process.env.STUDY_SCREENSHOT_DIR,'kochai-model.png')});
          await page.pdf({path:path.join(process.env.STUDY_SCREENSHOT_DIR,'kochai-print.pdf'),format:'A4',printBackground:true});
        }
      }
    }
    await page.locator('#essay-02 .model > summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#essay-02-p1').isVisible(),true);
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),'auto');
    console.log('PASS 375/768/1440 layouts, keyboard disclosure, and reduced motion');

    const noJs = await browser.newContext({javaScriptEnabled:false});
    const reading = await noJs.newPage();
    await reading.goto(base+route);
    assert.equal(await reading.locator('.essay').count(),8);
    await reading.locator('#essay-03 .model > summary').click();
    assert.equal(await reading.locator('#essay-03-p1').isVisible(),true);
    await noJs.close();
    await page.goto(base+'/studyguides/english');
    await page.waitForSelector(`[data-material="${material}"]`);
    assert.equal(await page.locator(`[data-material="${material}"] a`).getAttribute('href'),route);
    assert.deepEqual(errors,[]);
    console.log('PASS static reading without JavaScript, catalog discovery, and no browser errors');
  } finally {await browser.close();}
})().catch(error => {console.error(error);process.exitCode=1;});
