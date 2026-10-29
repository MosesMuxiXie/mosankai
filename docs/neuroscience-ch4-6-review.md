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

The guide and map are registered separately as neuroscience-ch4-6-review and neuroscience-ch4-6-map. Both use the existing study center return/favorite/review/export tools. Written work is self-assessed; only explicit checks or exam submission update MCQ results. Mock answers are locked after submission until the user starts a new round. Exam time is a 90-minute reference, not an automatic submission deadline. A no-point written response can be recorded by checking and then unchecking a rubric item. Existing chapter 1–3 records are not migrated into this guide.

The content is static HTML/CSS/JS; no backend, new dependencies, source-file uploads or accounts. The bundled Geist Latin variable font is licensed under the included OFL, with system fallback for Chinese and scientific glyphs. A primary electrophysiology paper is linked for the neonicotinoid correction.
