# Statistics chapters 1–4 bilingual review

Approved scope: ten TPS5e classroom slide decks, Introduction through §4.2; TPS6e chapters 1–4 verify concepts. The local 4.3/4.4 presentations are calculus and excluded. Only authored materials are published.

Deliverables: a new handbook and linked SVG/HTML mind map; 24 bilingual topic cards, 16 worked examples and 48 original questions (per chapter: four examples, eight MCQs, four written tasks). Every explanatory field has Chinese/English parity. Question and answer print views, four conceptual diagrams, original self-assessment checklists and source locators are included.

Implementation: static HTML/CSS/JS with shared stats14 data/core/UI modules. New material IDs `statistics-ch1-4-review` and `statistics-ch1-4-map`; stable question prefix `ST14`. Existing pages/records are preserved. Use the existing MosankaiPage interface, local-browser study store, explicit MCQ checks, manual written review and Git/Vercel deployment.

Tasks: (1) author and audit content plus independent numeric tests; (2) implement handbook/map and draft/assessment logic; (3) integrate catalogue, study index, backups and deep links; (4) browser/print QA, whole-branch review and publish.

Verification: source coverage and bilingual content audit; independently calculated statistics/normal/regression fixtures; state validation and backup round trips; draft/check boundaries and question/topic deep links; full node test suite; Edge at 1440/768/390/320px, keyboard, printing, old record compatibility; matching Vercel commit and live URLs.

Conventions: median-of-halves quartiles (omit an odd overall median), sample SD uses n−1, N(μ,σ) explicitly uses SD, normal probabilities approximate, residual y−ŷ, regression r² interpreted for variation in response explained by its linear relationship with predictor. Original rubrics are learning checklists, not official exam marks. Official response style reference: https://apcentral.collegeboard.org/courses/ap-statistics/exam/past-exam-questions (2025 released scoring guidance inspected).

Execution record: native worktree tool rejected the selected website sourceRoot because it lies outside this chat's project roots. Used a Git worktree under the Statistics workspace on `codex/statistics-bilingual`. Baseline: 73 tests passed. Dependencies reuse the unchanged parent checkout node_modules through an ignored junction.

Content audit: all sixteen examples and question keys manually checked. Independent calculation fixtures verify sum of squares 236.4 for the ten-value summary, sample SD denominators, strict fences, normal CDF/quantiles, least-squares slope/intercept/residuals/r² and n−2 residual SD. The percentile task uses the actual sample mean 72.5 and SD ≈15.14 rather than an unrelated hypothetical z. Every map concept has an example association and practice task.

Implementation verification: five focused node tests and full `npm test` (78 passing) initially green; Edge browser check covers both pages, explicit checks, revised drafts, written self-assessment, refresh restoration, stable question links, topic entry followed by a newer resume position, two numeric labs, no horizontal overflow at 1440/768/390/320, keyboard map selection and 48-question answer-free printing. Desktop/mobile/map screenshots and print PDFs inspected during QA. Final review and deployment evidence are recorded below when completed.

Final independent review inspected all concepts/examples/questions and found no further numerical/conceptual/bilingual discrepancies. Four findings were fixed in one pass: answer-bound concurrent-tab checked/self-assessed state, fresh hash-only example entry, self-contained M04 class counts, and separate block headings for printed answer keys. New unit/browser regressions were observed failing before fixes; final `npm test`: 79 passing, zero failures. Final Edge check also covers concurrent MCQ/written tabs and the reviewed print answer block. No deferred findings.
