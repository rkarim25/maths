# Liyana's Maths Adventure — working notes for Claude sessions

A static, client-side maths app for Liyana (one child, single-profile mode),
covering 4 stages from Year 1 counting up to 11+ prep.

## The essentials

- **Live site**: https://rkarim25.github.io/maths/ (GitHub Pages, repo
  `rkarim25/maths`, branch `master`). Pushing to `master` deploys via
  [.github/workflows/deploy.yml](.github/workflows/deploy.yml) (~2 min).
  NOT Cloudflare.
- **Stack**: vanilla ES modules + Vite (`npm run dev` on port 3000,
  `npm run build`). Hash router ([src/router.js](src/router.js)). All state in
  IndexedDB ([src/services/db.js](src/services/db.js)).
- **The one code: 2353** — it is both the parent PIN (Grown-ups area) and the
  family sync code on every device. Full sync design + troubleshooting (incl.
  how to inspect Firestore from the CLI): **[docs/SYNC.md](docs/SYNC.md)**.
- **Cloud sync**: Firebase Firestore project `kid-s-maths`, one doc
  `families/2353`. Client: [src/services/sync.js](src/services/sync.js).
  Sync is opt-in per device (☁️ button → Turn on sync); the code is prefilled.
- **Auto-update**: builds embed `__BUILD_ID__` + ship `version.json`
  ([vite.config.js](vite.config.js)); the app reloads itself when a newer
  build is deployed ([src/services/update-check.js](src/services/update-check.js)).
  A device stuck on a pre-July-2026 build needs one manual reload first.

## Content model (source of truth)

- [src/data/curriculum.js](src/data/curriculum.js) — the lesson table (89
  lessons, ids like `count-to-10`). Everything else keys off lesson ids.
- [src/data/teaching.js](src/data/teaching.js) — story/plain teaching text;
  [src/data/mental-maths.js](src/data/mental-maths.js) — 32 mental-maths
  tricks; [src/data/puzzles.js](src/data/puzzles.js),
  [src/data/real-world.js](src/data/real-world.js),
  [src/data/maths-fun.js](src/data/maths-fun.js),
  [src/data/papers.js](src/data/papers.js) (assessments + mock 11+ papers).
- Practice questions are generated at runtime by
  [src/services/question-bank.js](src/services/question-bank.js).
- Diagrams are inline SVGs under [src/assets/diagrams/](src/assets/diagrams),
  indexed by [src/data/diagrams.js](src/data/diagrams.js) and
  [src/data/mental-diagrams.js](src/data/mental-diagrams.js).
- Authoring guide: [docs/CONTENT-AUTHORING.md](docs/CONTENT-AUTHORING.md);
  offline Gemini generators in [tools/](tools) (keys stay local).

## Progress & reports

- Every answer → `answer_log`; attempts → `progress`; weak areas recomputed in
  [src/services/tracking.js](src/services/tracking.js). Reports/analysis in
  [src/services/analysis.js](src/services/analysis.js), shown in the Grown-ups
  area ([src/views/grownups.js](src/views/grownups.js), PIN 2353).
- Timing is captured silently for parents; never shown to the child.

## Conventions & gotchas

- Single-profile mode: `ensureSingleProfile()` always uses/creates "Liyana" —
  don't add profile pickers back.
- Views are plain render functions (`app.innerHTML` + listeners) — no
  framework. Keep new views in that style.
- When testing sync changes, do NOT connect a test browser with code 2353 —
  it will push test answers into Liyana's real data. Use a throwaway code and
  delete the Firestore doc afterwards (see docs/SYNC.md for REST commands).
- The user's routine ask: export progress JSON from Grown-ups → generate a
  lesson plan (see memory + [tools/export-analyzer.mjs](tools/export-analyzer.mjs)).
