# Neuroscience 4–6 beginner lessons

Approved spec: the user's 2026-11-04 plan in this conversation. All 30 topics become beginner-first bilingual lessons; six foundation units explain neuron structure, membrane/ions, concentration/electrical forces, Vm, I/R/g, and AP/PSP. Each lesson explains purpose, terms, causal steps, a labeled teaching example, an ungraded expandable understanding answer, and the existing exam recap. Preserve source calibration, 120 assessed questions, three papers, grading and stored identities/state. Guide, map and print share the new lesson content. Keep static HTML/CSS/JS, existing style and deployment URLs.

## Task 1: Shared lessons and rendering

- Add a static UMD module keyed by existing topic IDs, with Chinese/English paired at each authored block.
- Supply all six foundations and 30 lessons; retain existing compact topic bodies as the exam recap.
- Export pure escaped renderers for foundations, lessons, print and map summaries. Native details reveal understanding answers without assessment controls.
- Test complete rendering, matched bilingual data, safe authored text and ordinary-versus-print answer disclosure. Verify the actual test fails before implementing renderers.

## Task 2: Integrate, verify and publish

- Insert beginner content before each existing recap, replace the prerequisite paragraph with six foundation units, and use lesson summaries in map details.
- Reuse AP/decay figures and add labeled pre/postsynaptic and transmitter-cycle schematics. Preserve all current question figures and assessment code.
- Update print, responsive styling, catalog bytes and documentation. Exercise UI checks, new/old draft restore, ungraded answer expansion, map links, print output and 375/1440px layouts.
- Run npm test; obtain one read-only whole-branch review; repair important findings with regression tests. Merge/push via existing Vercel integration and verify the exact live assets.

## Review focus

User scope addition during implementation: add a bilingual original-exam walkthrough for Neuroscience Mid-Term Va.pdf: all 35 MCQs including bonus and all 10 FRQs. Show transcribed original questions/options with detailed answers, reasoning and source/page locators. Preserve duplicates, conflicts, missing options and missing-figure limits explicitly. This is an ungraded reference section, separate from the existing corrected/adapted practice and three mocks. Do not publish raw source PDFs or the answer image.

- Scientific qualifications, especially ionic current signs, zero net flux, refractoriness, shunting, ACh limiting supply and receptor-specific effects.
- A novice can identify the location, actors and reason for every causal step before a formula appears.
- Chinese and English express the same conditions and sequence.
- Understanding checks cannot create MCQ results or change written self-scores.
- Existing links, drafts, source boundaries and printable content remain usable.
