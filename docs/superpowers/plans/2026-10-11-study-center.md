# Manga study center — approved implementation plan

Approved design: the second imagegen preview in this chat, ivory / indigo, three manga panels, restrained halftone, real HTML controls. Implement the user's complete second-stage plan, including publication through the existing Vercel Git integration.

1. Shared local store: per-material records, stable question IDs, draft/result separation, review completion, validated preview/merge backups, legacy migration, storage failure fallback and multi-tab events. Prove with Node tests.
2. Integrate the latest DADOES chapters 10–12 copy; register 31 materials and a derived question index. Adapt four quizzes and two maps without changing their content/scoring; restore answers, positions and explicit deep links. Preserve source originals.
3. Implement the bilingual hub, recent five, favorites, wrong answers, review queue, subject filtering, source downloads and backup controls. Use independent manga illustrations, no sample records, and responsive / keyboard / reduced-motion behavior.
4. Verify storage/adapters, 31 files and hashes, the latest review's 13 self-checks, full npm test, real browser at 375/768/1440, final independent review, then publish and verify live routes.

Constraints: no dependencies, frameworks, account, backend API, Vercel function or scheduling algorithm. Keep existing native guide layouts and scores. Unknown IDs cannot become URLs. File-based and other-origin records are not automatically accessible.
