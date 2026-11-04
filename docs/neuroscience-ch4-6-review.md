# Neuroscience chapters 4–6 implementation record

Approved specification: the user's complete implementation plan in this conversation, 2026-10-29.

## Deliverable

Two new static study pages, 90 MCQs and 30 FRQs (30/10 per chapter), three disjoint mock exams, a shared concept map and the existing Mosankai learning-record integration. Chinese explanations and English prompts/models. Light editorial design follows elayadesign/ai-design-skills landing-page-design. Existing chapters 1–3 and their records remain independent. No newly supplied original files or answer photograph are published.

## Tasks and checks

1. Source calibration and shared content: read all 24 rendered classroom pages, four Kahoots (69 items), 35 exam MCQs and 10 FRQs/mark scheme; verify disputed mechanisms against the retained textbook. Write content/score tests before implementation.
2. Guide and map: static, accessible and responsive; same content source; practice, separate exam drafts, FRQ self-assessment, explanations and source audit.
3. Learning integration: new material identities, index generation, restore/export/import validation, checked-only MCQ results, written review buttons and independent old records.
4. Full tests, browser acceptance, fresh whole-branch review, deployment through existing Vercel Git integration and live URL verification.

## Evidence and decisions

- Baseline: npm test, 60 passed / 0 failed on 2026-10-29.
- Source reading: all 6 + 12 + 6 classroom PDF pages rendered and visually read. Text extraction alone omitted chapters 4 and 5.
- Ruling: native worktree creation rejected an external sourceRoot; created a Git worktree inside this chat's workspace, on codex/neuroscience-ch4-6. No product behavior changes.
- Quizlet: all three specified links failed web retrieval; browser chapter 5 hit human verification. Keep entry links, explicitly unverified. Do not infer card content.
- Exam scoring: 30 MCQs × 2 + 8 selected FRQs × 5 = 100. Source's five bonus MCQs are audited but no bonus is added to mock totals.
- Source pitfalls: exam 12/13 duplicate; 9/21 answer-photo disagreement; 30 ambiguous functions; 34 omits L-DOPA. Separate file key from corrected scientific explanation. All automated questions must have one correct choice.
- Scan pitfalls: Na channel alpha chain/four domains; halorhodopsin is a pump; small molecule versus membrane recycling; ACh is separate from monoamines; AMPA/NMDA/kainate are glutamate receptors; neonicotinoids target nAChRs; rate-limiting choline uptake; physiological NMJ safety factor is not a guarantee in all conditions.

## Progress

- Source rendering and calibration complete. The 30 concept notes, 90 MCQs, 30 FRQs, 9 evidence-priority entries, 35-question exam audit and 12 source corrections share one content source.
- Data and mock tests passed. Three papers partition all 120 questions; each chapter has 30 MCQs/10 FRQs. All written rubrics total five marks.
- Browser verification: draft/check boundary, wrong-only filtering, reload, written drafts/review buttons, eight-FRQ maximum, hidden pre-submit models, 2/60 MCQ + pending written result, 42/100 after self-scoring, separate practice/exam answers, and latest-result preservation on returning to practice passed.
- Map verification: all 30 SVG and outline nodes, selection, zoom, collapse/expand, saved viewport/selection, 375px responsive outline and source-topic deep link passed.
- Fixed and regression-tested: initial resume.mock field rejected by shared contract (snapshot now uses supported resume fields); exam assessments must not overwrite practice answers or regrade on navigation; direct question links override stale priority filters.

## User-facing behavior

The guide and map are registered separately as neuroscience-ch4-6-review and neuroscience-ch4-6-map. Both use the existing study center return/favorite/review/export tools. Written work is self-assessed; only explicit checks or exam submission update MCQ results. Mock answers are locked after submission until the user starts a new round. Exam time is a 90-minute reference, not an automatic submission deadline. A zero-mark or blank written response has an explicit “record 0” button; blank responses cannot earn checked points. Existing chapter 1–3 records are not migrated into this guide.

The content is static HTML/CSS/JS; no backend, new dependencies, source-file uploads or accounts. The bundled Geist Latin variable font is licensed under the included OFL, with system fallback for Chinese and scientific glyphs. A primary electrophysiology paper is linked for the neonicotinoid correction.

## Final review and repair

An independent read-only reviewer ran the 69-test suite and identified two P2 issues. Both received failing regression tests before fixes:

- Blank selected FRQs could be locked without a way to complete grading. Explicit zero assessment now works after submission, zero-point arrays are distinguished from missing self-assessment, and a blank response with positive checks cannot yield a total. Browser verified 0/100 survives reload and blank points cannot be awarded.
- Entry topic queries could override newer saved positions. Guide reload now preserves the saved chapter/question; map selection resolves current node hashes and synchronizes its query. Browser verified C4 entry → C6 question → reload retains C6, and C4 map entry → c6-t6 → reload retains c6-t6.

Ruling: mock questions are interleaved across concept areas rather than consecutive blocks. Every paper still has ten MCQs per chapter, but now each chapter's ten topics are represented once in every paper. FRQs remain disjoint with the specified 4/3/3 rotation. This improves representativeness without changing bank size or scoring; the regression test covers coverage and partitioning.

Reviewer limits resolved: the author read all 24 classroom scans and checked specific disputed textbook passages; this is educational source calibration, not independent verification of every textbook page. The accessible outline provides the complete keyboard path even if rebuilding the graphical view resets SVG focus; browser verified Tab from a selected outline node reaches its correct guide link and Enter opens that topic. Interface preference validation remains bounded by safe JSON and validated answer/exam identities; malformed scoring state is rejected.

Additional browser checks: real JSON download contains both new material records and exam/written drafts; the learning-center import preview recognized both records without replacing newer data. Native SVG dragging changed the pan transform; 375px and 1440px layouts fit their viewport.

Final verification after the review fixes: npm test, 73 passed / 0 failed. Content and scoring regression tests include comprehensive per-paper topic coverage. New public text assets retain LF bytes as required by this repository's public-tree attributes. Existing sources and their hashes remain unchanged.

## Chinese–English comparison update · 2026-11-04

Added adjacent English counterparts to all 30 concept introductions/body paragraphs and MCQ/FRQ strategies, all 360 option rationales, all 150 FRQ rubric points and 30 common-mistake notes. Priority cards, source notes, the 35-item exam audit, 12 corrections, mechanism demonstrations, instructions and map summaries/outline are also bilingual. Existing English stems, options and model answers remain the originals. The translations preserve the original qualifications and source calibration; no new recurrence claims or Quizlet verification are implied.

English content is a shared static module keyed by existing topic/question identities. Rendering escapes both languages and marks English passages with lang="en". Print notes use the same paragraph pairs. On phones, the topic badge sits above the title so both languages retain readable width. No answer, rubric order, paper allocation, scoring rule, record identity or state schema changed.

Verification: npm test passed all 80 tests, including escaped bilingual output and the existing scoring/state/backup regressions. A separate alignment check covered every translated paragraph, four rationales per MCQ and five points per FRQ. Browser checks confirmed C6-M16 option explanations, C6-F06 rubric/self-score and draft restoration, all 30 translated map-outline nodes and bilingual c5-t9 map details. Both 375px and 1440px layouts fit their viewports; no browser console errors were reported.

## Beginner lessons and original-exam walkthrough · 2026-11-04

Implemented the approved beginner-first revision: six foundations and 30 bilingual lessons, each with purpose, terms, causal steps, a labeled teaching example, an ungraded expandable understanding answer, and the existing exam recap. Guide, map summaries and print share the lesson module. Existing AP/decay figures are reused; pre/postsynaptic, ACh-cycle and catecholamine schematics support the explanations.

The user's added scope is included: 35 original MCQs (five bonus) and 10 original FRQs transcribed from Neuroscience Mid-Term Va.pdf, with Chinese readings, calibrated answers, detailed bilingual option reasoning, models and MS interpretation. The newly attached MS is byte-identical to the classroom-folder copy. Individual mark allocations are not invented. Figure 1/2 for FRQ 4 remain absent; conditional explanations are explicitly separated from a unique answer.

Preserved original issues: duplicate 12/13, photo conflicts 9/21, valid B/C in 30, missing L-DOPA in 34. Additional wording calibrations explain saxitoxin conduction versus activation, volts versus force, usual Gray associations, minimal versus literally zero electrical delay, and relative AP conductance. MS FRQ 5's diameter claim is corrected: in a uniform cylindrical cable at fixed specific membrane resistance/resistivity, doubling diameter halves r_m and quarters r_i, so λ increases by √2. NMJ reliability retains physiological limits.

The supplied classroom correction image is recorded as RC without uploading it. NT/precursor uptake uses specific transporters; endocytosis retrieves vesicle membrane. AChE produces acetate plus choline. The foundation citations use the provided textbook's PDF pages, including the chapter 3 membrane discussion. Question arrays, correct answers, rubric order, paper allocations, state version and material identities remain unchanged.

Browser evidence: all six foundations, 10 lessons in each chapter, all 35/10 original items, bilingual models and calibration tables render. Matched exports before/after opening understanding/reference disclosures showed unchanged practice answers/checks, written self-scores, mock drafts and results. C6-F06's older draft restores after refresh. Original-reference hashes use supported resume fields and no longer override a newer practice position; a regression test and browser reload confirmed the URL becomes #practice. 375px and 1440px fit without page overflow; wide comparison tables scroll inside their containers. Map retains all 30 outline nodes and uses the new beginner summaries.

Printing has separate lesson and original-walkthrough actions. Shared render tests verify all foundation units and understanding answers expand for print; original disclosures are included by print CSS. The in-app browser did not expose an inspectable native print preview; the print action returned the page to ordinary reading. Native printer/PDF pagination is therefore not claimed as visually verified.

Pre-review verification: 87 tests passed, zero failures. A direct comparison with commit 6a3c86d confirms the complete assessed MCQ/FRQ arrays, correct answers, rubrics and mock allocations are unchanged.
