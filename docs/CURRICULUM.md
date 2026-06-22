# Curriculum

The curriculum now lives in two places, kept deliberately in sync:

1. **[`Math syllabus.md`](../Math%20syllabus.md)** (repository root) — the human-readable plan:
   - **Part A** — the 12-step mastery ladder (Year 1 → 11+), with sub-skills and skill tags.
   - **Part B** — the year-by-year scope and sequence: every lesson, grouped by stage → term → topic.
   - **Part C** — the skill-tag glossary (the exact tags stored against every answer).
   - **Part D** — assessment thresholds, stars, progression and the 11+ exam profile.

2. **[`src/data/curriculum.js`](../src/data/curriculum.js)** — the machine source of truth that the
   app reads. Each of the 72 lessons carries: `id`, `title`, `stage` (1–4), `term`, `topic`,
   `step` (1–12), `skillTags`, `objective`, a question `generator` + params, and an optional
   `youtubeId`. Teaching text (story + plain) lives in
   [`src/data/teaching.js`](../src/data/teaching.js).

## Adding or changing a lesson

1. Add a `L(...)` row to `LESSONS` in `curriculum.js` (and a friendly entry to `TITLES`).
2. Point `generator` at an existing generator in `src/services/question-bank.js`
   (or add a new one there).
3. Add a `teaching.js` entry (`story` and/or `plain`) keyed by the lesson `id`.
4. The lesson then appears in the table automatically, with practice, a printable worksheet,
   and progress tracking — no other wiring needed.

## Progression & mastery

There are **no hard locks** — a young learner can explore freely. Instead, the lessons table
highlights the **recommended next lesson** (lowest unmet step), and the Grown-ups screen ranks
**weak skills** to revisit. Mastery thresholds and star rules are defined in `Math syllabus.md`,
Part D, and implemented in `src/services/tracking.js` and `src/services/analysis.js`.
