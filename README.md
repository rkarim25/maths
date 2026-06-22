# Liyana's Maths

A gamified, story-driven maths website for **Liyana** (UK Year 1, working towards the 11+ in four
years), deployed on GitHub Pages at https://rkarim25.github.io/maths/. Built to support multiple
child profiles, work on phones and iPads, and track progress locally so lessons can be tailored.

## How it works

1. **Choose a player** — one tap (built for one child now, ready for siblings later).
2. **Lessons table** — lessons are grouped by topic into tappable cards, across four stages
   (Year 1 → 11+). Each card shows a live progress badge from saved scores.
3. **Each lesson offers**:
   - 📖 **Story** — the concept taught through an illustrated, narrated story.
   - 📝 **Explain** — the same idea in plain, simple words.
   - 🎮 **Practice** — auto-generated exercise sets (Set A / B / Challenge) you can replay endlessly.
   - 📄 **Sheet** — a printable worksheet + answer key (Save as PDF from the print dialog).
   - ▶ **Video** — an optional curated YouTube clip (hidden until a video is set).
4. **Scores are saved** to the browser (IndexedDB) for every answer and attempt.
5. **Grown-ups area** (🔒, optional PIN) — per-skill results, weak-area flags, **suggested next
   lessons**, and **JSON / CSV export**.

### The "results → lesson plan" loop
Practice generates data → open **Grown-ups → Export** → the JSON/CSV captures every answer, skill
accuracy and weak area. That export can be analysed (by you, or handed back for a tailored plan) and
maps straight onto the syllabus ladder, so "what to teach next" is always answerable.
`tools/export-analyzer.mjs` reads this export shape directly.

## Curriculum

[`Math syllabus.md`](Math%20syllabus.md) is the human-readable scope and sequence: a 12-step mastery
ladder bridging UK Year 1 to the 11+, plus a year-by-year lesson list and a skill-tag glossary.
[`src/data/curriculum.js`](src/data/curriculum.js) implements it as the single source of truth —
72 lessons across 4 stages, each tagged to a syllabus step and skill. Add or edit a lesson there and
it appears in the table, gains practice and a worksheet, and feeds the reports automatically.

## Technology

- **Frontend:** Vanilla JavaScript (ES modules), hash-based router — no framework.
- **Build:** Vite. **Storage:** IndexedDB. **Hosting:** GitHub Pages via GitHub Actions.
- **Narration:** Web Speech API. **PDF:** browser print-to-PDF (no dependencies).
- **Content:** all data is static; no API keys ship to the browser.

## Project structure

```
index.html                 # entry; loads styles + src/main.js
src/
  main.js                  # boot: init DB, then router
  app.js                   # DB + profile init, default route
  router.js                # hash routes: /profiles /lessons /lesson/:id /practice/:id /worksheet/:id /grownups
  config/constants.js
  data/
    curriculum.js          # SINGLE SOURCE OF TRUTH — all lessons
    teaching.js            # story + plain explanations per lesson
  services/
    db.js                  # IndexedDB wrapper
    profile-manager.js     # profiles + PIN
    tracking.js            # records answers/attempts, computes weak areas
    question-bank.js       # question generators (one per skill type)
    analysis.js            # stats, recommendations, JSON/CSV export
  views/                   # profile-switcher, profile-create, lessons-table,
                           # lesson-player, practice-game, grownups, worksheet
  styles/                  # one stylesheet per view + main.css + print.css
tools/                     # offline Gemini content-generation + export-analyzer
docs/                      # architecture & guides
```

## Develop

```bash
npm install
npm run dev      # http://localhost:3000/maths/
npm run build    # outputs to dist/
npm run preview
```

## Deploy

Push to `master`; GitHub Actions builds and deploys to GitHub Pages.

## Accessibility

Large tap targets, text-to-speech narration, high-contrast playful theme, and
`prefers-reduced-motion` support. Designed mobile-first for phones and iPads.

## Optional: AI content enrichment

Story/plain text and videos can be enriched offline using the scripts in `tools/` (Gemini), which
read `src/data/curriculum.js` and write static content. API keys stay local — nothing secret is ever
shipped to the static site.

## License

MIT — see LICENSE.
