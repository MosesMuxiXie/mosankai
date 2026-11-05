# Neuroscience 4–6 midterm implementation plan

Approved spec: user's complete plan in this chat on 2026-11-05. Keep static HTML/CSS/JS, bilingual style, existing URLs, material/state identities and old drafts. New papers: 30 MCQs (6/9/15 by chapter), six required five-mark FRQs (1/2/3 author allocation), ten one-mark identification/spelling items, five two-mark bonus definitions. Base /100 and bonus /10 independent. Existing 90 MCQs/30 FRQs and three historical papers remain stable; add 15 C6 MCQs and three separately identified current papers. Classroom diagrams across all 24 pages are the atlas scope; textbook calibrates. No raw scans uploaded.

## Task 1: Atlas and vocabulary

Create neuro46-atlas.js and test/neuro46-atlas.test.js. Pure UMD export {figures,terms,coverage,categories,renderFigure}. At least 30 figure questions and 30 terms, bilingual explanations, actual sources, whole classroom coverage including chemical structures. renderFigure(id,{answers:false}) hides canonical names in all rendered text/alt/title. Default full atlas uses answers:true. See task-1-brief in this plan's workspace for interface and coverage detail. TDD the content contract/render behavior; commit only owned files.

## Task 2: Core, validation and persistence

Update core and shared store/adapters with format-driven scoring/validation, optional additive v1 drill state and answer-bound checks/rubrics. Current paper descriptor {format:'midterm2026',mcq,frq,figures,terms,minutes:90,requiredFrq:6}; legacy lacks format and keeps choose8. Data adds figures and terms arrays. API freshAttempt(paper?), checkSpelling(q,text), sanitizeState(data,state), rebaseNeuroState(before,current,latest,force=[]), existing snapshot/validate/score APIs. See task-2-brief for full response shapes. TDD old/new scoring, stale tab merge, backups and lock preservation. Commit only owned files.

## Task 3: Data, UI and integration

Add midterm data module with bilingual extra MCQs, three fixed papers and official blueprint. Load atlas and new data before the existing shared data on both pages. Extend data with extra MCQs, figures, terms and papers; keep old items unchanged. Update index generator, old tests' intentional counts, HTML/CSS/UI: blueprint, full atlas, drill filters, wrong-only, strict spelling check, two-point definition self-score, current four-part mocks, historical select, linked concepts, printable blank/answer versions. Disable spelling/autocorrect suggestions. Answers hidden until explicit check/submit; response edits invalidate their grading. Practice/exam independent, zero action explicit, bonus not a base-score prerequisite. Follow TDD for scoring/UI render and source coverage integrations.

## Task 4: Verify and deploy

Run full npm test, fresh read-only reviews, 375/1440 browser checks, refresh/export/import, stale-tab/state checks, keyboard and print rendering. Fix material findings with failing regressions. Update implementation record and catalog/index. Commit and deploy through existing Vercel Git workflow, verify exact live resources. Deployment is explicitly authorized by the approved plan. No dependencies/backend.

## Review focus

- Answer leak through SVG labels, chemical annotations, titles or accessible descriptions.
- Wrong chemical structures and classroom shorthand (FISH vs protein, TPH vs TH, pumps vs channels, reuptake vs membrane recycling).
- Legacy papers and backups rejected or regraded after expanded question banks.
- Stale-tab answers inheriting another response's check/rubric, or overwriting locked submitted exams.
- Base score blocked by bonus, blank rubrics awarding points, or new current papers using eight-answer legacy rules.
