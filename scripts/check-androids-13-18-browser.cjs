const {chromium}=require(process.env.MOSANKAI_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const {pathToFileURL}=require('node:url');
const base=process.env.STUDY_BASE_URL||'http://127.0.0.1:3148';
const route='/studyguides/english/guides/androids-chapters-13-18.html',id='literature-androids-13-18';
const output=process.env.STUDY_SCREENSHOT_DIR;
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const go=async url=>{await page.goto(url);await page.waitForFunction(()=>window.Review);};
 const nav=async section=>page.locator(`.nav-btn[data-section="${section}"]`).click();
 const record=()=>page.evaluate(id=>window.MosankaiStudy.read(id),id);
 try{
  await go(base+route);await page.waitForFunction(()=>window.MosankaiPage?.capture&&window.MosankaiGuide,null,{timeout:4000});
  assert.equal(await page.evaluate(()=>Review.questions.length),96);
  for(const section of ['context','story','details','characters','themes','evidence','map','types','quiz','templates','predictions']){await nav(section);assert.equal(await page.locator('#'+section).isVisible(),true);assert.ok((await page.locator('#'+section+'-title').innerText()).length);}
  await nav('details');await page.locator('#detail-chapter').selectOption('18');assert.equal(await page.locator('.fact-card').count(),12);await page.locator('.fact-card summary').first().click();assert.ok((await page.locator('.fact-answer').first().innerText()).includes('government'));
  await nav('story');await page.locator('[data-chapter="18"]').click();assert.equal(await page.locator('.flow-node').count(),5);await page.locator('#flow-all').click();assert.equal(await page.locator('.flow-node').count(),27);await page.locator('#play').click();assert.equal(await page.locator('#play').innerText(),'Pause');await nav('quiz');assert.equal(await page.locator('#play').innerText(),'Play storyline');
  const answer=await page.evaluate(()=>Review.questions[0].answer);const wrong=(answer+1)%4;
  await page.locator(`input[name="answer"][value="${wrong}"]`).check();await page.waitForTimeout(220);assert.equal((await record()).progress.results['c13-m01'],undefined);
  await page.locator('#check-answer').click();await page.waitForTimeout(120);assert.equal((await record()).progress.results['c13-m01'].status,'incorrect');assert.equal(await page.locator('.feedback').count(),1);
  await page.locator('#retry-wrong').click();assert.match(await page.locator('#question-meta').innerText(),/C13-M01/);assert.equal(await page.locator('.feedback').count(),0);
  await page.locator(`input[name="answer"][value="${answer}"]`).check();await page.locator('#check-answer').click();await page.waitForTimeout(120);assert.equal((await record()).progress.results['c13-m01'].status,'correct');await page.locator('#exit-retry').click();
  await page.locator('#filter-chapter').selectOption('14');await page.locator('#filter-category').selectOption('analysis');await page.locator('#filter-type').selectOption('short');await page.locator('#filter-focus').selectOption('tone');
  await page.locator('#short-answer').fill('The sarcastic delivery undercuts the acknowledgment of Isidore’s care.');await page.waitForTimeout(250);assert.equal((await record()).resume.topic,'tone');assert.equal((await record()).resume.questionId,'c14-s03');
  await page.reload();await page.waitForFunction(()=>window.MosankaiGuide);assert.equal(await page.locator('#filter-focus').inputValue(),'tone');assert.match(await page.locator('#short-answer').inputValue(),/sarcastic/);
  await page.locator('#check-answer').click();await page.locator('[data-rubric="0"]').check();await page.locator('#short-answer').fill('A revised interpretation with evidence.');assert.equal(await page.locator('.feedback').count(),0);await page.waitForTimeout(250);assert.equal((await record()).progress.state.assessed['c14-s03'],undefined);
  assert.equal(await page.locator('[data-study-written="c14-s03"]').count(),1);await page.locator('[data-study-written="c14-s03"]').click();assert.ok((await record()).pending.questions.includes('c14-s03'));
  await page.locator('#filter-focus').selectOption('all');await page.locator('#filter-type').selectOption('mc');await page.locator('#filter-category').selectOption('all');await page.locator('#filter-chapter').selectOption('13');await page.locator('#new-attempt').click();await page.locator('#test-mode').click();assert.equal(await page.locator('.feedback').count(),0);
  await page.locator('#submit-test').click();assert.match(await page.locator('#submit-test').innerText(),/with blanks/);assert.equal(await page.locator('.feedback').count(),0);await page.locator('#submit-test').click();assert.match(await page.locator('.feedback').innerText(),/Unanswered/);assert.equal(await page.locator('input[name="answer"]').first().isDisabled(),true);assert.match(await page.locator('.score-big').innerText(),/0 \/ 10/);
  await go(base+route+'?studyQuestion=c18-s06');await page.waitForFunction(()=>window.MosankaiGuide);assert.match(await page.locator('#question-meta').innerText(),/C18-S06/);assert.equal(await page.locator('#filter-focus').inputValue(),'all');assert.equal(await page.locator('#practice-mode').getAttribute('aria-pressed'),'true');
  assert.equal((await page.evaluate(()=>MosankaiStudy.read('literature-androids-10-12'))).progress.results.m01,undefined);
  await nav('story');await page.locator('[data-chapter="15"]').click();if(output){fs.mkdirSync(output,{recursive:true});await page.screenshot({path:output+'/desktop-story.png',fullPage:true});}
  for(const width of [375,768,1440]){await page.setViewportSize({width,height:1000});for(const section of ['context','story','details','characters','map','quiz']){await nav(section);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,section+' overflow '+width);}}
  await page.setViewportSize({width:375,height:900});await nav('quiz');if(output)await page.screenshot({path:output+'/mobile-quiz.png',fullPage:true});
  await page.emulateMedia({reducedMotion:'reduce'});await nav('story');await page.locator('#play').click();assert.equal(await page.locator('#play').innerText(),'Play storyline');await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!!document.activeElement));
  console.log('PASS hosted navigation, assessment, retries, blanks, written review, focus resume, deep links, independent records, layout and reduced motion');
  const offline=process.env.DADOES_OFFLINE;if(offline){const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(offline).href);await p.waitForFunction(()=>window.Review);await p.locator('.nav-btn[data-section="quiz"]').click();await p.locator('input[name="answer"]').first().check();await p.locator('#check-answer').click();assert.equal(await p.locator('.feedback').count(),1);await p.reload();await p.locator('.nav-btn[data-section="quiz"]').click();assert.equal(await p.locator('input:checked').count(),1);assert.equal(await p.locator('.feedback').count(),1);assert.equal(await p.locator('.study-tools').count(),0);assert.equal(await p.evaluate(()=>performance.getEntriesByType('resource').length),0);console.log('PASS offline file opens, grades and persists without network resources');await p.close();}
  assert.deepEqual(errors,[]);console.log('PASS no browser JavaScript errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
