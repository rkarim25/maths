# Comprehensive 11+ Maths Syllabus & 4-Year Scope and Sequence

This document is the **single reference** for what Liyana learns and in what order. It bridges
the UK National Curriculum (Year 1 onwards) to the standard required by the **11+ exam**
(sat in Year 6 — roughly four years from a Year 1 / age-6 start).

It has four parts:

- **Part A — The 12-Step Mastery Ladder.** The big-picture progression, expanded with detailed
  sub-skills and the `skill-tag` used by the app to track each skill.
- **Part B — Year-by-Year Scope and Sequence.** Every lesson, grouped by year → term → topic.
  This is the list that `src/data/curriculum.js` implements one-for-one.
- **Part C — Skill-Tag Glossary.** Every tag in one place, so progress data stays consistent.
- **Part D — Assessment, Mastery & Exam Mechanics.**

> **How to use it.** Each `skill-tag` below is the same string stored against every answer Liyana
> gives. When you export her results from the Grown-ups screen, weak skills are reported by tag and
> mapped back to the step and lessons here, so "what to teach next" is always answerable.

---

## Part A — The 12-Step Mastery Ladder

The ladder is the *conceptual* spine. A child can be working across two adjacent steps at once;
the year-by-year sequence in Part B is the *practical* ordering.

### Step 1 — Visual Mastery and Fluency  · *Year 1*
Build instant, finger-free number sense.
- Count, read, write and order numbers to 10, then 20, then 100. `count-to-10` `count-to-20` `count-to-100` `read-write-numbers`
- Number bonds to 10 and 20 with automatic recall. `number-bonds-10` `number-bonds-20`
- Place value of two-digit numbers (67 = 6 tens and 7 ones). `place-value-2digit`
- Skip count in 2s, 5s and 10s, forwards and backwards. `skip-counting`
- One more / one less; compare and order with `<`, `>`, `=`. `one-more-less` `compare-numbers`
- Ordinal numbers (1st–20th). `ordinal-numbers`

### Step 2 — Operational Basics  · *Year 1–2*
- Add and subtract within 10, then 20, then two-digit numbers without regrouping. `add-within-10` `sub-within-10` `add-within-20` `sub-within-20` `add-2digit-noregroup` `sub-2digit-noregroup`
- Conceptual regrouping/carrying with base-10 blocks (trade ten ones for one ten). `regrouping-concept`
- Multiplication as **equal groups**; division as **fair sharing / grouping**. `multiplication-groups` `division-sharing`
- Commutativity and the link between + and − (fact families). `fact-families`
- Money: recognise coins/notes, make and give change. `money`

### Step 3 — Foundational Shapes and Fractions  · *Year 2*
- Halves, quarters and thirds of shapes, objects and small quantities. `fractions-halves-quarters` `fractions-thirds`
- Properties of 2D and 3D shapes (sides, vertices, edges, faces). `2d-shapes` `3d-shapes`
- Position, direction and simple turns. `position-direction`
- Read and make pictograms, tally charts and block diagrams. `tally-charts` `pictograms` `block-diagrams`

### Step 4 — Formal Written Mechanics  · *Year 3*
- Place value to 1,000; partition and recombine. `place-value-1000`
- Formal **column** addition and subtraction of 3-digit numbers, with carrying and borrowing. `column-addition` `column-subtraction`
- Estimate and use inverse operations to check. `estimate-check`

### Step 5 — Introductory Multiplication Engine  · *Year 3*
- Rapid recall of the 3, 4 and 8 times tables (building on 2, 5, 10). `times-tables-3` `times-tables-4` `times-tables-8`
- Short multiplication: grid method → standard column method. `grid-multiplication` `short-multiplication`
- Scaling and correspondence problems. `scaling-problems`

### Step 6 — Fractions Progression and Measurement  · *Year 3–4*
- Equivalent fractions; add and subtract fractions with the same denominator. `equivalent-fractions` `add-subtract-fractions`
- Tell time on an analogue clock to the nearest minute; 12- and 24-hour clocks. `time-to-minute` `time-24hour`
- Measure, compare and add/subtract length (mm/cm/m), mass (g/kg), volume (ml/l). `measure-length` `measure-mass` `measure-capacity`

### Step 7 — Advanced Whole-Number Operations  · *Year 4*
- Round to the nearest 10, 100, 1,000. `rounding`
- Negative numbers in context; Roman numerals to 100. `negative-numbers` `roman-numerals`
- Formal **short division** ("bus stop"), including simple remainders. `short-division`

### Step 8 — Multiplication Automaticity and Decimals  · *Year 4*
- Automatic recall of **all** tables to 12 × 12 (critical for 11+ speed). `times-tables-all`
- Tenths and hundredths; match decimals to fraction equivalents (0.5 = 1/2, 0.25 = 1/4). `decimals-intro` `decimal-fraction-match`

### Step 9 — Geometry and Data Interpretation  · *Year 4–5*
- Perimeter and area of rectangles and rectilinear shapes. `perimeter` `area`
- Acute / obtuse / right angles; parallel and perpendicular lines. `angles` `lines`
- Read and draw bar charts, line graphs and first-quadrant coordinates. `bar-charts` `line-graphs` `coordinates`

### Step 10 — Advanced Arithmetic and Pre-Algebra  · *Year 5*
- Order of operations (BIDMAS/BODMAS). `order-of-operations`
- Primes, factors, multiples, square and cube numbers. `factors-multiples` `primes` `square-cube-numbers`
- Convert fluently between fractions, decimals and percentages. `fdp-conversion`
- Ratio, direct proportion and simple scale factors. `ratio` `proportion`
- Simple algebra: expressions, simplifying, sequences, missing numbers. `algebra-expressions` `sequences` `missing-number`

### Step 11 — Complex Geometry and Advanced Data  · *Year 5–6*
- Multi-step logic problems; translating word problems into equations. `logic-problems` `multi-step-problems`
- Missing angles in triangles, quadrilaterals, on a line, around a point. `angles-missing`
- Reflection, translation and lines of symmetry. `transformations` `symmetry`
- 3D nets, hidden-cube counting, rotations (11+ non-verbal). `nets` `spatial-reasoning`
- Mean, median, mode, range; pie charts, Venn and Carroll diagrams. `averages` `pie-charts` `venn-carroll`

### Step 12 — Exam Mechanics and Test Strategy  · *Year 6*
- Speed and accuracy drills — target ~45 seconds per question. `speed-drills`
- Multiple-choice elimination tactics for formal answer sheets. `mcq-tactics`
- Timed mock papers with systematic error analysis. `mock-analysis`

---

## Part B — Year-by-Year Scope and Sequence

> The app's **4 "years"** are learning stages, not school years. Liyana starts in Year 1 (age 6.5)
> and the four stages compress the National Curriculum + 11+ ladder so the exam-level material
> (Steps 9–12) is reached in time for an 11+ sat in school Year 6.
>
> Each stage has **3 terms**. Each lesson lists its `skill-tag` and ladder **step**.

### Stage 1 — Adventures in Numberland  *(school Year 1, age 6–7 · Steps 1–2)*

**Term 1 · Counting & Early Number**
1. Counting to 10 — `count-to-10` (S1)
2. Counting to 20 — `count-to-20` (S1)
3. One More, One Less — `one-more-less` (S1)
4. Number Bonds to 10 — `number-bonds-10` (S1)
5. Adding within 10 — `add-within-10` (S2)
6. Taking Away within 10 — `sub-within-10` (S2)

**Term 2 · Bigger Numbers & Shapes**
7. Counting to 100 — `count-to-100` (S1)
8. Tens and Ones (place value) — `place-value-2digit` (S1)
9. Comparing Numbers — `compare-numbers` (S1)
10. Adding within 20 — `add-within-20` (S2)
11. Subtracting within 20 — `sub-within-20` (S2)
12. 2D Shapes Around Us — `2d-shapes` (S3)

**Term 3 · Patterns, Money & Review**
13. Skip Counting in 2s, 5s, 10s — `skip-counting` (S1)
14. Number Bonds to 20 — `number-bonds-20` (S1)
15. Ordinal Numbers — `ordinal-numbers` (S1)
16. Coins and Money — `money` (S2)
17. Simple Patterns — `sequences` (S10·intro)
18. Word Problems: add & take away — `add-within-20` `sub-within-20` (S2)

### Stage 2 — Journey Through Mathland  *(Year 2–3, age 7–8 · Steps 2–4)*

**Term 1 · Place Value & Mental Calculation**
1. Numbers to 1,000 — `place-value-1000` (S4)
2. Two-Digit Add without Regrouping — `add-2digit-noregroup` (S2)
3. Two-Digit Subtract without Regrouping — `sub-2digit-noregroup` (S2)
4. Fact Families — `fact-families` (S2)
5. Equal Groups (multiplication idea) — `multiplication-groups` (S2)
6. Fair Sharing (division idea) — `division-sharing` (S2)

**Term 2 · Tables, Fractions & Time**
7. 2, 5 and 10 Times Tables — `times-tables-2` `times-tables-5` `times-tables-10` (S5·foundation)
8. Halves and Quarters — `fractions-halves-quarters` (S3)
9. Thirds — `fractions-thirds` (S3)
10. Telling Time (hour & half past) — `time-oclock` (S6·intro)
11. Measuring Length — `measure-length` (S6)
12. Money: Making Amounts & Change — `money` (S2)

**Term 3 · Shapes, Data & Review**
13. 3D Shapes — `3d-shapes` (S3)
14. Position and Direction — `position-direction` (S3)
15. Tally Charts & Pictograms — `tally-charts` `pictograms` (S3)
16. Block Diagrams — `block-diagrams` (S3)
17. Regrouping with Base-10 Blocks — `regrouping-concept` (S2)
18. Mixed Word Problems — `multi-step-problems` (S11·intro)

### Stage 3 — Quest for Mathoria  *(Year 4–5, age 8–9 · Steps 4–8)*

**Term 1 · Formal Written Methods**
1. Column Addition (3-digit) — `column-addition` (S4)
2. Column Subtraction (3-digit) — `column-subtraction` (S4)
3. Estimating and Checking — `estimate-check` (S4)
4. 3 Times Table — `times-tables-3` (S5)
5. 4 Times Table — `times-tables-4` (S5)
6. 8 Times Table — `times-tables-8` (S5)

**Term 2 · Multiplication, Division & Fractions**
7. Grid-Method Multiplication — `grid-multiplication` (S5)
8. Short Multiplication — `short-multiplication` (S5)
9. Short Division (bus stop) — `short-division` (S7)
10. Equivalent Fractions — `equivalent-fractions` (S6)
11. Adding & Subtracting Fractions (same denominator) — `add-subtract-fractions` (S6)
12. Telling Time to the Minute — `time-to-minute` (S6)

**Term 3 · Measurement, Rounding & Decimals**
13. Measuring Mass and Capacity — `measure-mass` `measure-capacity` (S6)
14. Rounding to 10, 100, 1,000 — `rounding` (S7)
15. Roman Numerals — `roman-numerals` (S7)
16. Negative Numbers — `negative-numbers` (S7)
17. Tenths and Hundredths — `decimals-intro` (S8)
18. Decimal–Fraction Matching — `decimal-fraction-match` (S8)

### Stage 4 — Expedition to Calculand  *(Year 5–6, age 9–11 · Steps 8–12)*

**Term 1 · Times-Table Automaticity & Number Properties**
1. All Times Tables to 12×12 — `times-tables-all` (S8)
2. Factors and Multiples — `factors-multiples` (S10)
3. Prime Numbers — `primes` (S10)
4. Square and Cube Numbers — `square-cube-numbers` (S10)
5. Order of Operations (BODMAS) — `order-of-operations` (S10)
6. Fraction–Decimal–Percentage Conversions — `fdp-conversion` (S10)

**Term 2 · Proportion, Algebra & Geometry**
7. Ratio — `ratio` (S10)
8. Proportion and Scaling — `proportion` (S10)
9. Algebra: Expressions & Simplifying — `algebra-expressions` (S10)
10. Sequences and Missing Numbers — `sequences` `missing-number` (S10)
11. Perimeter and Area — `perimeter` `area` (S9)
12. Angles and Lines — `angles` `lines` (S9)

**Term 3 · Advanced Geometry, Data & Exam Skills**
13. Missing Angles — `angles-missing` (S11)
14. Symmetry and Transformations — `symmetry` `transformations` (S11)
15. Coordinates and Line Graphs — `coordinates` `line-graphs` (S9)
16. Averages: Mean, Median, Mode, Range — `averages` (S11)
17. Logic & Multi-Step Word Problems — `logic-problems` `multi-step-problems` (S11)
18. Exam Technique: Speed & Multiple Choice — `speed-drills` `mcq-tactics` (S12)

---

## Part C — Skill-Tag Glossary

Number & place value: `count-to-10` `count-to-20` `count-to-100` `read-write-numbers`
`one-more-less` `compare-numbers` `ordinal-numbers` `place-value-2digit` `place-value-1000`
`skip-counting` `rounding` `negative-numbers` `roman-numerals`

Number bonds & mental: `number-bonds-10` `number-bonds-20` `fact-families`

Addition & subtraction: `add-within-10` `sub-within-10` `add-within-20` `sub-within-20`
`add-2digit-noregroup` `sub-2digit-noregroup` `regrouping-concept` `column-addition`
`column-subtraction` `estimate-check`

Multiplication & division: `multiplication-groups` `division-sharing` `times-tables-2`
`times-tables-3` `times-tables-4` `times-tables-5` `times-tables-8` `times-tables-10`
`times-tables-all` `grid-multiplication` `short-multiplication` `short-division`
`scaling-problems` `factors-multiples` `primes` `square-cube-numbers`

Fractions, decimals, percentages: `fractions-halves-quarters` `fractions-thirds`
`equivalent-fractions` `add-subtract-fractions` `decimals-intro` `decimal-fraction-match`
`fdp-conversion`

Ratio & algebra: `ratio` `proportion` `algebra-expressions` `sequences` `missing-number`
`order-of-operations`

Geometry & measurement: `2d-shapes` `3d-shapes` `position-direction` `angles` `lines`
`angles-missing` `symmetry` `transformations` `nets` `spatial-reasoning` `perimeter` `area`
`coordinates` `measure-length` `measure-mass` `measure-capacity` `time-oclock`
`time-to-minute` `time-24hour` `money`

Data & statistics: `tally-charts` `pictograms` `block-diagrams` `bar-charts` `line-graphs`
`averages` `pie-charts` `venn-carroll`

Reasoning & exam: `logic-problems` `multi-step-problems` `speed-drills` `mcq-tactics`
`mock-analysis`

---

## Part D — Assessment, Mastery & Exam Mechanics

### Mastery thresholds (per skill-tag, from tracked answers)
- **≥ 80% accuracy** → mastered (lesson shows ⭐⭐⭐ / green "Mastered").
- **70–79%** → low-severity gap ("Nearly there").
- **50–69%** → medium-severity gap ("Needs practice").
- **< 50%** → high-severity gap ("Let's revisit") — surfaced first in the Grown-ups recommendations.

A skill needs at least **5 logged answers** before a severity is assigned, so a single bad day
doesn't flag a false weakness.

### Stars per practice attempt
- 3 stars: ≥ 90%  ·  2 stars: 70–89%  ·  1 star: 50–69%  ·  0 stars: < 50%.
The lesson keeps the **best** star score and the **most recent** percentage.

### Progression
Lessons are always available (no hard locks — a young child should be free to explore), but the
table marks the **recommended next lesson** based on the lowest unmet step with practice data, so
there is a clear default path without dead ends.

### 11+ exam profile (Year 6 target)
- Pace: ~45 seconds/question; mixed multiple-choice and standard answer formats.
- Strong emphasis on Steps 8–11: table fluency, FDP conversion, ratio/proportion, multi-step
  word problems, angles, and non-verbal/spatial reasoning.
- Final term of Stage 4 should include **timed mixed papers** with error analysis, using the
  exported results to target remaining weak tags.

---

## Part E — Comprehensive 11+ Coverage, Practice & Inspiration

The curriculum now spans **~89 lessons** across the four stages and covers every major topic tested
in the 11+ maths paper. Beyond Parts A–B, the following topics are explicitly included:

- **Number:** square roots; BODMAS with brackets; factors, multiples, primes; squares & cubes;
  rounding; negative numbers; Roman numerals.
- **Fractions / decimals / %:** naming fractions of a shape, comparing, simplifying, equivalent
  fractions, mixed numbers; tenths & hundredths, adding/subtracting decimals, decimal–fraction
  matching; percentages of amounts and percentage increase/decrease; full FDP conversion.
- **Ratio & proportion:** sharing in a ratio; direct proportion; **speed, distance and time**.
- **Algebra:** expressions, simplifying, sequences and missing numbers.
- **Geometry & measure:** perimeter, area and **volume of cuboids**; angles (incl. missing angles);
  lines; symmetry & transformations; **nets of 3D shapes**; coordinates; **timetables (24-hour)**;
  length, mass, capacity, money.
- **Statistics & probability:** pictograms, bar/block charts, line graphs, **pie charts**, tables;
  mean / median / mode / range; **probability** of simple events.
- **Reasoning & exam skill:** multi-step word problems; speed/accuracy; multiple-choice tactics.

### Practice & assessment built in
- **Per-stage assessments** (80% pass) that report gaps and update recommendations.
- **Mock 11+ exams** — timed Quick / Half / Full papers, freshly generated so there are effectively
  unlimited mocks, each with a topic-by-topic breakdown.
- **Times-tables trainer** with a per-table mastery map (memorise every table to 12 × 12).
- **Printable stage books and worksheets** for fully off-screen practice.

### Inspiration
- A **Maths Fun** section in every stage: mental-maths tricks/shortcuts and amazing facts to keep
  her curious and quick.

### Extra skill tags
`probability` `volume` `nets` `pie-charts` `fractions-shapes` — used alongside the Part C glossary.

