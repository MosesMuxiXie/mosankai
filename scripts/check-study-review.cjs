// Real-browser regressions from the independent whole-branch review.
const {chromium}=require(process.env.MOSANKAI_PLAYWRIGHT||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.STUDY_BASE_URL||'http://127.0.0.1:3137';
const stats='/studyguides/statistics/guides/statistics-review.html',latest='/studyguides/english/guides/androids-chapters-10-12.html';
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});let failed=0;
 const run=async(name,fn)=>{const context=await browser.newContext();try{await fn(context);console.log('PASS '+name);}catch(error){failed++;console.error('FAIL '+name+': '+error.message);}finally{await context.close();}};
 const go=async(p,url)=>{await p.goto(base+url);await p.waitForFunction(()=>window.MosankaiGuide);};
 await run('memory-only answers can be exported directly from the guide',async ctx=>{
  await ctx.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Quota exceeded','QuotaExceededError');};});const p=await ctx.newPage();await go(p,stats);await p.locator('#note0').fill('Keep this session response.');
  assert.equal(await p.locator('.study-export').count(),1);const pending=p.waitForEvent('download');await p.locator('.study-export').click();const download=await pending;
  const backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.equal(backup.records.find(r=>r.materialId==='statistics-review').progress.state.notes['STAT-001'],'Keep this session response.');
 });
 await run('editing waits until saved state restoration is complete',async ctx=>{
  const p=await ctx.newPage();await p.goto(base+'/studyguides');await p.waitForFunction(()=>window.MosankaiStudy?.save);await p.evaluate(()=>window.MosankaiStudy.save('literature-androids-10-12',{progress:{state:{version:1,answers:{m01:1},checked:[],submitted:[],assessed:{}}}}));
  let release;const held=new Promise(r=>release=r);await p.route('**/studyguides/learning-index.json',async route=>{await held;await route.continue();});
  try{await p.goto(base+latest,{waitUntil:'domcontentloaded'});assert.equal(await p.locator('.sidebar').evaluate(n=>n.inert),true,'native controls should wait for metadata');await assert.rejects(p.locator('[data-section="quiz"]').click({timeout:150}));}
  finally{release();}
  await p.waitForFunction(()=>window.MosankaiGuide);assert.equal(await p.locator('.sidebar').evaluate(n=>n.inert),false);await p.locator('[data-section="quiz"]').click();assert.equal(await p.locator('input[name="answer"][value="1"]').isChecked(),true);
 });
 await run('unrelated edits in a stale tab preserve a newer assessment',async ctx=>{
  const a=await ctx.newPage();await go(a,stats);await a.locator('[data-question="1"][data-choice="0"]').click();await a.waitForTimeout(200);
  const b=await ctx.newPage();await go(b,stats);await b.locator('[data-question="1"][data-choice="2"]').click();await b.waitForTimeout(200);await a.locator('#note0').fill('An unrelated local note.');await a.waitForTimeout(250);
  const r=await a.evaluate(()=>window.MosankaiStudy.read('statistics-review'));assert.equal(r.progress.state.choices['STAT-002'],2);assert.equal(r.progress.results['STAT-002'].status,'correct');
 });
 await run('a repeated newly checked wrong answer returns to the review queue',async ctx=>{
  const p=await ctx.newPage();await go(p,latest);await p.locator('[data-section="quiz"]').click();await p.locator('input[name="answer"][value="1"]').check();await p.locator('#check-answer').click();await p.waitForTimeout(200);
  await p.evaluate(()=>window.MosankaiStudy.save('literature-androids-10-12',{reviewed:{m01:Date.now()}}));assert.equal(await p.evaluate(()=>window.MosankaiStudy.reviewItems().length),0);
  await p.locator('#new-attempt').click();await p.locator('input[name="answer"][value="1"]').check();await p.locator('#check-answer').click();await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>window.MosankaiStudy.reviewItems().length),1);
 });
 await run('submitting a test with blanks saves submission status without inventing results',async ctx=>{
  const p=await ctx.newPage();await go(p,latest);await p.locator('[data-section="quiz"]').click();await p.locator('#test-mode').click();await p.locator('input[name="answer"][value="0"]').check();
  await p.locator('#submit-test').click();await p.locator('#submit-test').click();await p.waitForTimeout(200);const r=await p.evaluate(()=>window.MosankaiStudy.read('literature-androids-10-12'));
  assert.equal(r.progress.state.submitted.length,36);assert.equal(r.progress.results.m01.status,'correct');assert.equal(r.progress.results.m02,undefined);
 });
 await browser.close();if(failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
