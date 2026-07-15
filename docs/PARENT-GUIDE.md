# Parent Guide — Liyana's Maths Adventure

The app lives at **https://rkarim25.github.io/maths/** and works on any phone,
tablet or computer. It opens straight into Liyana's lessons — no login.

## The one number to remember: 2353

- **🔒 Grown-ups** (top right) → enter PIN **2353** → progress reports,
  exports, paper-score entry, photo, PIN settings.
- **☁️ Sync** (top right) → family code **2353** is prefilled → tap
  **Turn on sync**. Do this once on each device and progress, scores and the
  profile photo stay the same everywhere, automatically.

## What's on the home page

- **Stages 1–4** — Year 1 counting through 11+ prep, 89 lessons in a table.
  Each lesson has **Story**, **Explain**, **Practice** (Set A / Set B /
  Challenge), **Print** (worksheet with answer key) and often a **Video**.
- **🎯 Level check** — a quick adaptive check that finds the right starting
  lesson.
- **🔢 Learn tables / 🧮 Tables drill** — times tables, learn then drill.
- **🧠 Mental maths** — 32 in-your-head methods (make ten, doubling,
  Trachtenberg/Vedic tricks…), each with a picture, steps and practice.
- **🧩 Puzzles / 🌍 Real-world / ✨ Maths fun** — brain-teasers, applied maths,
  enrichment reading.
- **📝 Mock exams** — five 40-question mixed papers, freshly generated each
  time (11+ style — expect them to be hard for younger stages).
- **📚 Print book** — print a whole stage as a booklet / PDF.
- **When you're ready** — 10 assessments per stage.

## Progress reports (Grown-ups area, PIN 2353)

- Accuracy, lessons mastered, time practising, and a **speed score** (her pace
  vs. typical — captured silently, never shown to her).
- Every exercise/test result with scores and dates.
- **Suggested next lessons** based on weak areas.
- **Record a paper score** — did she do a worksheet on paper? Enter the score
  and it updates progress and recommendations.
- **Export** — Download JSON (full history, good for asking a chat session for
  a lesson plan) or CSV of every answer. Import merges on another device.

## Sync — how to check it's working

Home page, top right: **☁️✓** means this device is syncing; plain **☁️** means
it isn't — tap it and turn sync on (code 2353). Both devices must show ☁️✓.
Full details and troubleshooting: [docs/SYNC.md](SYNC.md).

## If the app looks old / new features are missing

The app updates itself within about 15 minutes of a new release. A device
that hasn't been used since before mid-July 2026 needs **one manual refresh**
(pull down to reload in Safari, or close and reopen the tab) — after that it
keeps itself current.

## Privacy

Data is saved on the device and — once sync is on — in a private Firebase
database owned by the family, under the family code. Nothing is shared with
any third party. The site is public, so anyone with the exact code could in
principle read the sync data; the code is kept simple on purpose because
usability for one family matters more here than secrecy.

## Forgotten PIN?

The default PIN **2353** always works unless a custom PIN was set on that
device. To clear a forgotten custom PIN: clear the site's browser data on that
device (progress is safe in the cloud if sync is on), reload, and use 2353.
