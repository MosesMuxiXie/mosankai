// Optional real-browser acceptance check. Use the bundled Playwright module; no project dependency.
const {chromium}=require(process.env.MOSANKAI_PLAYWRIGHT || 'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const base=process.env.STUDY_BASE_URL || 'http://127.0.0.1:3137';
const paths={stats:'/studyguides/statistics/guides/statistics-review.html',neuro:'/studyguides/neuroscience/guides/neuroscience-study-guide.html',lit:'/studyguides/english/guides/ap-literature-review.html',latest:'/studyguides/english/guides/androids-chapters-10-12.html'};
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-CN'});const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const go=async(route,guide=true)=>{await page.goto(base+route);await page.waitForFunction(()=>window.MosankaiStudy?.all);if(guide)await page.waitForFunction(()=>window.MosankaiGuide,{timeout:4000});};
 const read=id=>page.evaluate(id=>window.MosankaiStudy.read(id),id);
 try{
  await go(paths.lit);assert.equal(await page.locator('.study-tools').count(),1,'older English CSP must allow same-origin learning integration');console.log('PASS older English guide loads learning controls');
  await go('/studyguides',false);await page.evaluate(()=>localStorage.clear());await go('/studyguides',false);
  assert.equal(await page.locator('.guide-card').count(),6);assert.equal(await page.locator('.source-row').count(),25);assert.match(await page.locator('#recent-results').innerText(),/尚无学习记录/);
  await page.locator('.guide-card').first().locator('[data-favorite]').click();assert.equal((await read('statistics-review')).favorite,true);
  await page.locator('#tab-favorites').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#tab-wrong').getAttribute('aria-selected'),'true');
  await page.locator('#study-search').fill('10–12');assert.equal(await page.locator('.guide-card').count(),1);await page.locator('#study-search').fill('');
  await page.locator('[data-language="en"]').click();assert.equal(await page.locator('#archive-title').innerText(),'Study Center');await page.locator('[data-language="zh-CN"]').click();
  console.log('PASS real catalogue, favorite, bilingual search and keyboard tabs');
  await go(paths.stats);await page.locator('#note0').fill('Persisted calculation.');await page.locator('.mastery').first().check();await page.locator('[data-question="1"][data-choice="0"]').click();await page.waitForTimeout(200);
  assert.equal((await read('statistics-review')).progress.results['STAT-002'].status,'incorrect');await page.locator('#exam').click();await page.locator('[data-question="1"][data-choice="2"]').click();await page.waitForTimeout(200);assert.equal(await page.locator('#feedback1').isVisible(),false);
  assert.equal((await read('statistics-review')).progress.results['STAT-002'].status,'incorrect');await page.locator('#exam').click();await page.waitForTimeout(200);assert.equal((await read('statistics-review')).progress.results['STAT-002'].status,'correct');
  await page.reload();await page.waitForFunction(()=>window.MosankaiGuide);assert.equal(await page.locator('#note0').inputValue(),'Persisted calculation.');assert.equal(await page.locator('.mastery').first().isChecked(),true);
  await page.locator('[data-study-written="STAT-001"]').click();assert.ok((await read('statistics-review')).pending.questions.includes('STAT-001'));
  console.log('PASS statistics drafts, self-test, notes, mastery and manual written review');
  await go(paths.neuro+'?studyQuestion=MCQ-001');await page.locator('#quizarea [data-choice="0"]').click();await page.waitForTimeout(200);assert.equal((await read('neuroscience-review')).progress.results['MCQ-001'].status,'incorrect');
  await page.reload();await page.waitForFunction(()=>window.MosankaiGuide);assert.equal((await read('neuroscience-review')).progress.state.session.answers[0],0,'refreshing a deep-linked attempt must keep its answer');
  await go(paths.neuro+'?studyQuestion=MCQ-001&attempt=2');await page.locator('#quizarea [data-choice="1"]').click();await page.waitForTimeout(200);assert.equal((await read('neuroscience-review')).progress.results['MCQ-001'].status,'correct');
  await page.locator('nav [data-page="frq"]').click();await page.locator('#frqList textarea').first().fill('A saved neuro response.');await page.waitForTimeout(250);await page.reload();await page.waitForFunction(()=>window.MosankaiGuide);assert.equal(await page.locator('#frqList textarea').first().inputValue(),'A saved neuro response.');
  console.log('PASS neuroscience question navigation, retry, session and written-response persistence');
  // Exercise each original scoring boundary, not a duplicate grading implementation.
  await go(paths.lit);await page.locator('input[name="q0"][value="0"]').check();await page.locator('#essay').fill('A saved paragraph.');await page.locator('#grade').click();await page.waitForTimeout(250);
  assert.equal((await read('literature-review')).progress.results['LIT-001'].status,'incorrect');await page.reload();await page.waitForFunction(()=>window.MosankaiGuide);assert.equal(await page.locator('#essay').inputValue(),'A saved paragraph.');assert.equal(await page.locator('input[name="q0"][value="0"]').isChecked(),true);
  await page.locator('input[name="q0"][value="1"]').check();assert.equal(await page.locator('#score').isVisible(),false);await page.locator('#grade').click();await page.waitForTimeout(200);assert.equal((await read('literature-review')).progress.results['LIT-001'].status,'correct');console.log('PASS older English answer/essay persistence and score invalidation');
  await go(paths.latest);await page.locator('[data-section="quiz"]').click();await page.locator('input[name="answer"][value="1"]').check();assert.equal((await read('literature-androids-10-12')).progress.results.m01,undefined);await page.locator('#check-answer').click();await page.waitForTimeout(150);assert.equal((await read('literature-androids-10-12')).progress.results.m01.status,'incorrect');
  await page.locator('#test-mode').click();assert.equal(await page.locator('.feedback').count(),0);await page.reload();await page.waitForFunction(()=>window.MosankaiGuide);
  await go(paths.latest+'?studyResume=1');assert.equal(await page.locator('#test-mode').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.feedback').count(),0);
  await go(paths.latest+'?studyQuestion=m01');assert.equal(await page.locator('#practice-mode').getAttribute('aria-pressed'),'true');assert.match(await page.locator('#question-meta').innerText(),/M01/);
  console.log('PASS latest review draft/assessment separation, test privacy and question deep link');
  await go('/studyguides',false);await page.locator('#tab-review').click();await page.locator('[data-complete="statistics-review"][data-question="STAT-001"]').click();assert.equal((await read('statistics-review')).pending.questions.includes('STAT-001'),false);
  const backup=await page.evaluate(()=>JSON.parse(window.MosankaiStudy.exportBackup()));const statRecord=backup.records.find(r=>r.materialId==='statistics-review');statRecord.favorite=false;statRecord.updatedAt=Date.now()+5000;
  await page.locator('#backup-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});assert.equal(await page.locator('#import-dialog').isVisible(),true);assert.equal((await read('statistics-review')).favorite,true);await page.locator('#confirm-import').click();assert.equal((await read('statistics-review')).favorite,false);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export-backup').click();const download=await downloadPromise;assert.match(download.suggestedFilename(),/^mosankai-study-.*\.json$/);
  console.log('PASS review completion, preview-before-restore and real backup download');
  for(const width of [375,768,1440]){await page.setViewportSize({width,height:1000});await go('/studyguides',false);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,'hub must fit '+width);assert.equal(await page.locator('.hero-manga img').evaluate(img=>img.complete&&img.naturalWidth>0),true);}
  console.log('PASS 375/768/1440 hub layout and images');
  if(process.env.STUDY_SCREENSHOT_DIR){fs.mkdirSync(process.env.STUDY_SCREENSHOT_DIR,{recursive:true});for(const width of [375,768,1440]){await page.setViewportSize({width,height:1000});await page.screenshot({path:process.env.STUDY_SCREENSHOT_DIR+'/hub-'+width+'.png',fullPage:true});}}
  assert.deepEqual(errors,[]);console.log('PASS no browser exceptions or CSP errors');
  await page.evaluate(()=>{localStorage.setItem('dadoes-ch10-12-review-v1','corrupt legacy');localStorage.removeItem('mosankai:study:v1:literature-androids-10-12');});await go(paths.latest);
  assert.equal(await page.evaluate(()=>localStorage.getItem('dadoes-ch10-12-review-v1')),'corrupt legacy','website integration must preserve the legacy source, even when it is damaged');console.log('PASS legacy source is never rewritten');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
