const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.MOSANKAI_PLAYWRIGHT||'C:/Users/xiemu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.STUDY_BASE_URL||'http://127.0.0.1:3138';
const route='/studyguides/statistics/guides/statistics-chapters-1-4.html';
const map='/studyguides/statistics/guides/statistics-chapters-1-4-mindmap.html';
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(base+route);assert.equal(response.status(),200,'handbook must exist');
 await page.locator('.study-tools').waitFor();
 const copied=await context.newPage();await copied.goto(base+route+'#example-ST14-C3-E02');await copied.locator('.study-tools').waitFor();assert.equal(await copied.locator('#example-ST14-C3-E02').count(),1,'copied example hash must render its chapter');assert.ok(await copied.locator('#example-ST14-C3-E02 details').evaluate(el=>el.open));await copied.close();
 assert.equal(await page.locator('#topic-list .topic-card').count(),6);assert.equal(await page.locator('#example-list .example-card').count(),4);
 assert.ok(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length===new Set(ids).size;}),'print and screen anchors must remain unique');
 await page.locator('[data-learn-chapter="3"]').click();assert.match(await page.locator('.topic-card').first().innerText(),/Scatterplots/);
 await page.locator('[data-learned]').first().click();await page.reload();await page.locator('.study-tools').waitFor();assert.equal(await page.locator('[data-learned]').first().getAttribute('aria-pressed'),'true');
 await page.selectOption('#chapter-filter','1');await page.selectOption('#topic-filter','all');await page.selectOption('#type-filter','mc');
 await page.locator('input[name="choice"][value="1"]').check();await page.waitForTimeout(250);
 let record=await page.evaluate(()=>MosankaiStudy.read('statistics-ch1-4-review'));assert.equal(Object.keys(record.progress.results).length,0);
 await page.locator('#check-answer').click();await page.waitForTimeout(250);record=await page.evaluate(()=>MosankaiStudy.read('statistics-ch1-4-review'));assert.equal(record.progress.results['ST14-C1-M01'].status,'incorrect');
 await page.locator('input[name="choice"][value="0"]').check();await page.waitForTimeout(250);record=await page.evaluate(()=>MosankaiStudy.read('statistics-ch1-4-review'));assert.equal(record.progress.results['ST14-C1-M01'].status,'incorrect');
 await page.reload();await page.locator('.study-tools').waitFor();assert.equal(await page.locator('#question-feedback').count(),0);await page.locator('#check-answer').click();await page.waitForTimeout(250);record=await page.evaluate(()=>MosankaiStudy.read('statistics-ch1-4-review'));assert.equal(record.progress.results['ST14-C1-M01'].status,'correct');
 await page.selectOption('#type-filter','written');await page.locator('#written-answer').fill('My bilingual reasoning / 我的推理');await page.waitForTimeout(300);await page.reload();await page.locator('.study-tools').waitFor();assert.equal(await page.locator('#written-answer').inputValue(),'My bilingual reasoning / 我的推理');
 await page.locator('#show-model').click();await page.locator('[data-rubric]').first().check();await page.waitForTimeout(250);await page.reload();await page.locator('.study-tools').waitFor();await page.locator('#show-model').click();assert.ok(await page.locator('[data-rubric]').first().isChecked());
 await page.goto(base+route+'?studyQuestion=ST14-C4-M08');await page.locator('.study-tools').waitFor();assert.equal(await page.locator('#question-area').getAttribute('data-question-id'),'ST14-C4-M08');assert.equal(await page.locator('#chapter-filter').inputValue(),'4');
 await page.goto(base+route+'?studyQuestion=ST14-C1-M04');await page.locator('.study-tools').waitFor();assert.match(await page.locator('#question-area').innerText(),/60/);assert.match(await page.locator('#question-area').innerText(),/100/);
 await page.goto(base+map);await page.locator('.study-tools').waitFor();assert.equal(await page.locator('.map-outline [data-map-topic]').count(),24);await page.locator('.map-outline [data-map-topic="st14-c3-fit"]').click();assert.match(await page.locator('#map-detail').innerText(),/residual SD/);await page.reload();await page.locator('.study-tools').waitFor();assert.equal(await page.locator('.map-outline [aria-pressed="true"]').getAttribute('data-map-topic'),'st14-c3-fit');
 await page.locator('#map-practice').click();await page.locator('.study-tools').waitFor();assert.equal(await page.locator('#topic-filter').inputValue(),'st14-c3-fit');
 // Reload must retain a newer location rather than replay the original topic entry.
 await page.selectOption('#chapter-filter','2');await page.selectOption('#type-filter','written');await page.waitForTimeout(300);await page.reload();await page.locator('.study-tools').waitFor();assert.equal(await page.locator('#chapter-filter').inputValue(),'2');
 await page.locator('#extreme').fill('40');await page.locator('#extreme').dispatchEvent('input');assert.match(await page.locator('#outlier-result').innerText(),/9.57/);
 await page.locator('#normal-z').fill('2');await page.selectOption('#normal-tail','right');assert.match(await page.locator('#normal-result').innerText(),/2.28/);
 for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`handbook overflow ${width}`);}
 await page.setViewportSize({width:1440,height:1000});
 if(process.env.STUDY_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.STUDY_SCREENSHOT_DIR,'stats14-desktop.png'),fullPage:true});
 await page.locator('#print-mode').selectOption('questions');await page.emulateMedia({media:'print'});assert.equal(await page.locator('#print-content .print-question').count(),48);assert.equal(await page.locator('#print-content .print-solution:visible').count(),0);await page.emulateMedia({media:'screen'});
 await page.selectOption('#print-mode','answers');await page.emulateMedia({media:'print'});assert.match(await page.locator('#print-content .print-solution').nth(1).innerText(),/Answer: B\s+A/,'correct letter must be separated from the first rationale');await page.emulateMedia({media:'screen'});
 await page.goto(base+map);await page.locator('.study-tools').waitFor();for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`map overflow ${width}`);}
 await page.locator('.map-outline [data-map-topic]').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.map-outline [data-map-topic]').first().getAttribute('aria-pressed'),'true');
 if(process.env.STUDY_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.STUDY_SCREENSHOT_DIR,'stats14-map-mobile.png'),fullPage:true});
 const tabs=await browser.newContext(),a=await tabs.newPage(),b=await tabs.newPage();
 await Promise.all([a.goto(base+route),b.goto(base+route)]);await Promise.all([a.locator('.study-tools').waitFor(),b.locator('.study-tools').waitFor()]);
 await a.locator('input[name="choice"][value="1"]').check();await a.locator('#check-answer').click();await a.waitForTimeout(250);
 await b.locator('input[name="choice"][value="0"]').check();await b.waitForTimeout(250);await b.reload();await b.locator('.study-tools').waitFor();assert.equal(await b.locator('#question-feedback').count(),0,'other tab checked marker must not attach to this draft');
 let concurrent=await b.evaluate(()=>MosankaiStudy.read('statistics-ch1-4-review'));assert.equal(concurrent.progress.results['ST14-C1-M01'].status,'incorrect');assert.deepEqual(concurrent.progress.state.checked,[]);
 await Promise.all([a.goto(base+route+'?studyQuestion=ST14-C1-F01'),b.goto(base+route+'?studyQuestion=ST14-C1-F01')]);await Promise.all([a.locator('.study-tools').waitFor(),b.locator('.study-tools').waitFor()]);
 await a.locator('#written-answer').fill('A previously reviewed response');await a.locator('#show-model').click();await a.locator('[data-rubric]').first().check();await a.waitForTimeout(250);
 await b.locator('#written-answer').fill('A different unreviewed response');await b.waitForTimeout(250);await b.reload();await b.locator('.study-tools').waitFor();await b.locator('#show-model').click();assert.equal(await b.locator('[data-rubric]').first().isChecked(),false,'self-assessment must remain bound to its reviewed text');await tabs.close();
 assert.deepEqual(errors,[]);console.log('PASS: bilingual guide/map, explicit checks, drafts, written self-assessment, concurrent tabs, reload, stable links, labs, print, keyboard, 4 viewports; no page errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
