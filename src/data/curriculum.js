// =============================================================================
// SINGLE SOURCE OF TRUTH for the whole app.
// Every lesson the table shows, every practice it generates, every worksheet it
// prints, and every weak-area report it produces reads from LESSONS below.
//
// Each lesson maps directly onto a row in "Math syllabus.md" (Part B), via its
// `step` (1-12 ladder) and `skillTags` (used to track answers and find gaps).
//
// Teaching text (story + plain) lives separately in src/data/teaching.js so this
// file stays a clean, scannable index. Practice questions are produced by the
// generators in src/services/question-bank.js, keyed by `generator`.
// =============================================================================

export const STAGES = {
  1: { name: 'Adventures in Numberland', blurb: 'Counting, number bonds and first sums', schoolYear: 'Year 1 · age 6–7' },
  2: { name: 'Journey Through Mathland', blurb: 'Place value, tables, fractions and time', schoolYear: 'Year 2–3 · age 7–8' },
  3: { name: 'Quest for Mathoria', blurb: 'Written methods, division and decimals', schoolYear: 'Year 4–5 · age 8–9' },
  4: { name: 'Expedition to Calculand', blurb: 'Ratio, algebra, geometry and exam skills', schoolYear: 'Year 5–6 · age 9–11' }
};

// L() keeps each row short and consistent. youtubeId defaults to null (button hidden until set).
const L = (id, stage, term, topic, step, skillTags, objective, generator, params = {}, youtubeId = null) =>
  ({ id, stage, term, topic, step, skillTags, objective, generator, params, youtubeId });

export const LESSONS = [
  // ---------------------------------------------------------------------------
  // STAGE 1 — Adventures in Numberland (Year 1)
  // ---------------------------------------------------------------------------
  L('count-to-10', 1, 1, 'Counting', 1, ['count-to-10'],
    'Count, read and order numbers up to 10.', 'countObjects', { max: 10 }),
  L('count-to-20', 1, 1, 'Counting', 1, ['count-to-20'],
    'Count, read and order numbers up to 20.', 'countObjects', { max: 20 }),
  L('one-more-less', 1, 1, 'Counting', 1, ['one-more-less'],
    'Find one more and one less than a number to 20.', 'oneMoreLess', { max: 20 }),
  L('number-bonds-10', 1, 1, 'Number bonds', 1, ['number-bonds-10'],
    'Recall pairs of numbers that make 10.', 'numberBonds', { total: 10 }),
  L('add-within-10', 1, 1, 'Adding & taking away', 2, ['add-within-10'],
    'Add two numbers with a total up to 10.', 'addition', { maxA: 5, maxB: 5 }),
  L('sub-within-10', 1, 1, 'Adding & taking away', 2, ['sub-within-10'],
    'Take away numbers within 10.', 'subtraction', { max: 10 }),

  L('count-to-100', 1, 2, 'Counting', 1, ['count-to-100'],
    'Count and find numbers up to 100.', 'numberSequence', { max: 100 }),
  L('place-value-2digit', 1, 2, 'Place value', 1, ['place-value-2digit'],
    'Understand tens and ones in two-digit numbers.', 'placeValue', { digits: 2 }),
  L('compare-numbers', 1, 2, 'Place value', 1, ['compare-numbers'],
    'Compare and order numbers up to 100.', 'compareNumbers', { max: 100 }),
  L('add-within-20', 1, 2, 'Adding & taking away', 2, ['add-within-20'],
    'Add numbers with a total up to 20.', 'addition', { maxA: 10, maxB: 10 }),
  L('sub-within-20', 1, 2, 'Adding & taking away', 2, ['sub-within-20'],
    'Take away numbers within 20.', 'subtraction', { max: 20 }),
  L('shapes-2d', 1, 2, 'Shapes', 3, ['2d-shapes'],
    'Name and describe everyday 2D shapes.', 'staticMCQ', { pool: '2d-shapes' }),

  L('skip-counting', 1, 3, 'Counting', 1, ['skip-counting'],
    'Skip count in 2s, 5s and 10s.', 'skipCounting', { steps: [2, 5, 10], max: 50 }),
  L('number-bonds-20', 1, 3, 'Number bonds', 1, ['number-bonds-20'],
    'Recall pairs of numbers that make 20.', 'numberBonds', { total: 20 }),
  L('ordinal-numbers', 1, 3, 'Counting', 1, ['ordinal-numbers'],
    'Use ordinal numbers (1st–10th).', 'ordinal', { max: 10 }),
  L('money-coins', 1, 3, 'Money', 2, ['money'],
    'Recognise coins and make small amounts.', 'money', { maxPence: 20, mode: 'make' }),
  L('patterns', 1, 3, 'Patterns', 10, ['sequences'],
    'Spot and continue simple patterns.', 'patterns', {}),
  L('word-problems-1', 1, 3, 'Adding & taking away', 2, ['add-within-20', 'sub-within-20'],
    'Solve one-step add and take-away word problems.', 'wordProblem', { ops: ['+', '-'], max: 20 }),

  // ---------------------------------------------------------------------------
  // STAGE 2 — Journey Through Mathland (Year 2–3)
  // ---------------------------------------------------------------------------
  L('place-value-1000', 2, 1, 'Place value', 4, ['place-value-1000'],
    'Read and partition numbers up to 1,000.', 'placeValue', { digits: 3 }),
  L('add-2digit', 2, 1, 'Adding & subtracting', 2, ['add-2digit-noregroup'],
    'Add two-digit numbers (no regrouping).', 'addition', { maxA: 99, maxB: 99, noRegroup: true }),
  L('sub-2digit', 2, 1, 'Adding & subtracting', 2, ['sub-2digit-noregroup'],
    'Subtract two-digit numbers (no borrowing).', 'subtraction', { max: 99, noBorrow: true }),
  L('fact-families', 2, 1, 'Adding & subtracting', 2, ['fact-families'],
    'Use fact families linking + and −.', 'factFamilies', { max: 20 }),
  L('multiplication-groups', 2, 1, 'Multiplication & division', 2, ['multiplication-groups'],
    'See multiplication as equal groups.', 'multiplicationGroups', { maxGroups: 5, maxEach: 5 }),
  L('division-sharing', 2, 1, 'Multiplication & division', 2, ['division-sharing'],
    'See division as fair sharing.', 'divisionSharing', { max: 30 }),

  L('tables-2-5-10', 2, 2, 'Times tables', 5, ['times-tables-2', 'times-tables-5', 'times-tables-10'],
    'Recall the 2, 5 and 10 times tables.', 'timesTables', { tables: [2, 5, 10] }),
  L('fractions-half-quarter', 2, 2, 'Fractions', 3, ['fractions-halves-quarters'],
    'Find halves and quarters of shapes and amounts.', 'fractionsOfAmount', { parts: [2, 4] }),
  L('fractions-thirds', 2, 2, 'Fractions', 3, ['fractions-thirds'],
    'Find thirds of shapes and amounts.', 'fractionsOfAmount', { parts: [2, 3, 4] }),
  L('time-oclock', 2, 2, 'Time', 6, ['time-oclock'],
    'Tell the time to the hour and half past.', 'timeClock', { mode: 'oclock-half' }),
  L('measure-length', 2, 2, 'Measuring', 6, ['measure-length'],
    'Measure and compare lengths in cm and m.', 'measure', { quantity: 'length' }),
  L('money-change', 2, 2, 'Money', 2, ['money'],
    'Make amounts and give change.', 'money', { maxPence: 100, mode: 'change' }),

  L('shapes-3d', 2, 3, 'Shapes', 3, ['3d-shapes'],
    'Name and describe 3D shapes.', 'staticMCQ', { pool: '3d-shapes' }),
  L('position-direction', 2, 3, 'Shapes', 3, ['position-direction'],
    'Describe position, direction and turns.', 'staticMCQ', { pool: 'position-direction' }),
  L('pictograms', 2, 3, 'Data', 3, ['tally-charts', 'pictograms'],
    'Read tally charts and pictograms.', 'dataRead', { type: 'pictogram' }),
  L('block-diagrams', 2, 3, 'Data', 3, ['block-diagrams'],
    'Read block diagrams and simple bar charts.', 'dataRead', { type: 'block' }),
  L('regrouping', 2, 3, 'Adding & subtracting', 2, ['regrouping-concept'],
    'Understand regrouping with tens and ones.', 'staticMCQ', { pool: 'regrouping-concept' }),
  L('word-problems-2', 2, 3, 'Word problems', 11, ['multi-step-problems'],
    'Solve two-step word problems.', 'wordProblem', { ops: ['+', '-', '×'], max: 50, steps: 2 }),

  // ---------------------------------------------------------------------------
  // STAGE 3 — Quest for Mathoria (Year 4–5)
  // ---------------------------------------------------------------------------
  L('column-addition', 3, 1, 'Written methods', 4, ['column-addition'],
    'Add 3-digit numbers in columns with carrying.', 'columnAddition', { digits: 3 }),
  L('column-subtraction', 3, 1, 'Written methods', 4, ['column-subtraction'],
    'Subtract 3-digit numbers with borrowing.', 'columnSubtraction', { digits: 3 }),
  L('estimate-check', 3, 1, 'Written methods', 4, ['estimate-check'],
    'Estimate answers and check with rounding.', 'estimateCheck', {}),
  L('tables-3', 3, 1, 'Times tables', 5, ['times-tables-3'],
    'Recall the 3 times table.', 'timesTables', { tables: [3] }),
  L('tables-4', 3, 1, 'Times tables', 5, ['times-tables-4'],
    'Recall the 4 times table.', 'timesTables', { tables: [4] }),
  L('tables-8', 3, 1, 'Times tables', 5, ['times-tables-8'],
    'Recall the 8 times table.', 'timesTables', { tables: [8] }),

  L('grid-multiplication', 3, 2, 'Multiplication & division', 5, ['grid-multiplication'],
    'Multiply 2-digit by 1-digit numbers.', 'multiplyColumn', { aDigits: 2 }),
  L('short-multiplication', 3, 2, 'Multiplication & division', 5, ['short-multiplication'],
    'Use short multiplication for 3-digit numbers.', 'multiplyColumn', { aDigits: 3 }),
  L('short-division', 3, 2, 'Multiplication & division', 7, ['short-division'],
    'Use the bus-stop method for short division.', 'divideColumn', { aDigits: 3 }),
  L('equivalent-fractions', 3, 2, 'Fractions', 6, ['equivalent-fractions'],
    'Find equivalent fractions.', 'equivalentFractions', {}),
  L('add-subtract-fractions', 3, 2, 'Fractions', 6, ['add-subtract-fractions'],
    'Add and subtract fractions with the same denominator.', 'addSubtractFractions', {}),
  L('time-to-minute', 3, 2, 'Time', 6, ['time-to-minute'],
    'Tell the time to the nearest minute.', 'timeClock', { mode: 'minute' }),

  L('measure-mass-capacity', 3, 3, 'Measuring', 6, ['measure-mass', 'measure-capacity'],
    'Measure mass (g/kg) and capacity (ml/l).', 'measure', { quantity: 'mass-capacity' }),
  L('rounding', 3, 3, 'Place value', 7, ['rounding'],
    'Round to the nearest 10, 100 and 1,000.', 'rounding', { to: [10, 100, 1000] }),
  L('roman-numerals', 3, 3, 'Place value', 7, ['roman-numerals'],
    'Read Roman numerals to 100.', 'romanNumerals', { max: 100 }),
  L('negative-numbers', 3, 3, 'Place value', 7, ['negative-numbers'],
    'Use negative numbers in context.', 'negativeNumbers', {}),
  L('decimals-intro', 3, 3, 'Decimals', 8, ['decimals-intro'],
    'Understand tenths and hundredths.', 'decimalsIntro', {}),
  L('decimal-fraction-match', 3, 3, 'Decimals', 8, ['decimal-fraction-match'],
    'Match decimals to their fraction equivalents.', 'decimalFractionMatch', {}),

  // ---------------------------------------------------------------------------
  // STAGE 4 — Expedition to Calculand (Year 5–6)
  // ---------------------------------------------------------------------------
  L('tables-all', 4, 1, 'Times tables', 8, ['times-tables-all'],
    'Recall all tables to 12 × 12.', 'timesTables', { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }),
  L('factors-multiples', 4, 1, 'Number properties', 10, ['factors-multiples'],
    'Find factors and multiples.', 'factorsMultiples', {}),
  L('primes', 4, 1, 'Number properties', 10, ['primes'],
    'Identify prime numbers.', 'primes', {}),
  L('square-cube', 4, 1, 'Number properties', 10, ['square-cube-numbers'],
    'Recognise square and cube numbers.', 'squareCube', {}),
  L('order-of-operations', 4, 1, 'Number properties', 10, ['order-of-operations'],
    'Apply BODMAS to multi-step sums.', 'orderOfOperations', {}),
  L('fdp-conversion', 4, 1, 'Fractions, decimals & %', 10, ['fdp-conversion'],
    'Convert between fractions, decimals and percentages.', 'fdpConversion', {}),

  L('ratio', 4, 2, 'Ratio & proportion', 10, ['ratio'],
    'Solve simple ratio problems.', 'ratio', {}),
  L('proportion', 4, 2, 'Ratio & proportion', 10, ['proportion'],
    'Solve proportion and scaling problems.', 'proportion', {}),
  L('algebra', 4, 2, 'Algebra', 10, ['algebra-expressions'],
    'Read and simplify simple expressions.', 'algebra', {}),
  L('sequences-rules', 4, 2, 'Algebra', 10, ['sequences', 'missing-number'],
    'Continue sequences and find missing numbers.', 'sequences', { type: 'arithmetic' }),
  L('perimeter-area', 4, 2, 'Geometry', 9, ['perimeter', 'area'],
    'Find perimeter and area of rectangles.', 'perimeterArea', {}),
  L('angles-lines', 4, 2, 'Geometry', 9, ['angles', 'lines'],
    'Identify angles and types of lines.', 'angles', {}),

  L('angles-missing', 4, 3, 'Geometry', 11, ['angles-missing'],
    'Find missing angles on lines and in shapes.', 'anglesMissing', {}),
  L('symmetry-transformations', 4, 3, 'Geometry', 11, ['symmetry', 'transformations'],
    'Use symmetry, reflection and translation.', 'staticMCQ', { pool: 'symmetry' }),
  L('coordinates', 4, 3, 'Coordinates & data', 9, ['coordinates', 'line-graphs'],
    'Read coordinates and line graphs.', 'coordinates', {}),
  L('averages', 4, 3, 'Coordinates & data', 11, ['averages'],
    'Find mean, median, mode and range.', 'averages', {}),
  L('logic-problems', 4, 3, 'Reasoning', 11, ['logic-problems', 'multi-step-problems'],
    'Solve multi-step logic word problems.', 'wordProblem', { ops: ['+', '-', '×', '÷'], max: 100, steps: 2 }),
  L('exam-speed', 4, 3, 'Exam skills', 12, ['speed-drills', 'mcq-tactics'],
    'Build speed and accuracy with mixed questions.', 'mixedArithmetic', { max: 100 })
];

// Friendly titles (shown on cards, lessons, worksheets). Keyed by lesson id.
const TITLES = {
  'count-to-10': 'Counting to 10', 'count-to-20': 'Counting to 20', 'one-more-less': 'One More, One Less',
  'number-bonds-10': 'Number Bonds to 10', 'add-within-10': 'Adding within 10', 'sub-within-10': 'Taking Away within 10',
  'count-to-100': 'Counting to 100', 'place-value-2digit': 'Tens and Ones', 'compare-numbers': 'Comparing Numbers',
  'add-within-20': 'Adding within 20', 'sub-within-20': 'Subtracting within 20', 'shapes-2d': '2D Shapes Around Us',
  'skip-counting': 'Skip Counting', 'number-bonds-20': 'Number Bonds to 20', 'ordinal-numbers': 'Ordinal Numbers',
  'money-coins': 'Coins and Money', 'patterns': 'Simple Patterns', 'word-problems-1': 'Add & Take-Away Stories',
  'place-value-1000': 'Numbers to 1,000', 'add-2digit': 'Two-Digit Addition', 'sub-2digit': 'Two-Digit Subtraction',
  'fact-families': 'Fact Families', 'multiplication-groups': 'Equal Groups', 'division-sharing': 'Fair Sharing',
  'tables-2-5-10': '2, 5 and 10 Times Tables', 'fractions-half-quarter': 'Halves and Quarters', 'fractions-thirds': 'Thirds',
  'time-oclock': "O'clock and Half Past", 'measure-length': 'Measuring Length', 'money-change': 'Money and Change',
  'shapes-3d': '3D Shapes', 'position-direction': 'Position and Direction', 'pictograms': 'Tally Charts & Pictograms',
  'block-diagrams': 'Block Diagrams', 'regrouping': 'Regrouping with Tens', 'word-problems-2': 'Two-Step Problems',
  'column-addition': 'Column Addition', 'column-subtraction': 'Column Subtraction', 'estimate-check': 'Estimating & Checking',
  'tables-3': '3 Times Table', 'tables-4': '4 Times Table', 'tables-8': '8 Times Table',
  'grid-multiplication': 'Grid Multiplication', 'short-multiplication': 'Short Multiplication', 'short-division': 'Short Division',
  'equivalent-fractions': 'Equivalent Fractions', 'add-subtract-fractions': 'Adding & Subtracting Fractions',
  'time-to-minute': 'Time to the Minute', 'measure-mass-capacity': 'Mass and Capacity', 'rounding': 'Rounding Numbers',
  'roman-numerals': 'Roman Numerals', 'negative-numbers': 'Negative Numbers', 'decimals-intro': 'Tenths and Hundredths',
  'decimal-fraction-match': 'Decimals & Fractions', 'tables-all': 'All Times Tables', 'factors-multiples': 'Factors and Multiples',
  'primes': 'Prime Numbers', 'square-cube': 'Square & Cube Numbers', 'order-of-operations': 'Order of Operations',
  'fdp-conversion': 'Fractions, Decimals & %', 'ratio': 'Ratio', 'proportion': 'Proportion & Scaling', 'algebra': 'Simple Algebra',
  'sequences-rules': 'Sequences & Missing Numbers', 'perimeter-area': 'Perimeter and Area', 'angles-lines': 'Angles and Lines',
  'angles-missing': 'Missing Angles', 'symmetry-transformations': 'Symmetry & Transformations', 'coordinates': 'Coordinates',
  'averages': 'Mean, Median, Mode, Range', 'logic-problems': 'Logic Problems', 'exam-speed': 'Exam Speed Practice'
};

// Verified, embeddable YouTube ids (each confirmed via oEmbed = public + embeddable).
// Lessons without a strong, verified match are intentionally absent → no Video button.
const YOUTUBE = {
  'count-to-10': 'k4i6fu0bTQ8', 'count-to-20': 'HwVX_Bn19qs', 'one-more-less': 't8rIqxyfEmI',
  'number-bonds-10': 'lD9tjBUiXs0', 'add-within-10': 'YClapK67rKc', 'sub-within-10': 'vB09HIcNzC4',
  'count-to-100': 'F3-AY1B-0qc', 'place-value-2digit': 'a4FXl4zb3E4', 'compare-numbers': 'xGvrG6049wE',
  'add-within-20': 'N8wUVMMS-jo', 'sub-within-20': 'pwQKugrFmJQ', 'shapes-2d': 'nFvBPFf9ZK0',
  'skip-counting': 'q_yUC1NCFkE', 'number-bonds-20': 'MmLMU8BqyKw', 'money-coins': 'jHkUPDjum_E',
  'patterns': 'MBjjxSx45-Q', 'word-problems-1': '-iAQI5k-8cQ',
  'place-value-1000': 'Rc6QNhrZkEA', 'add-2digit': '8hz0fAQV0ac', 'sub-2digit': 'nku3jVLbPBw',
  'fact-families': 'AMLRFww0qJg', 'multiplication-groups': 'gzFbUZ8VjEg', 'division-sharing': 'fgoUVDoHx5M',
  'tables-2-5-10': 'q_yUC1NCFkE', 'fractions-half-quarter': 'lTce7f6KGE0', 'fractions-thirds': '16jNp2TwCrE',
  'time-oclock': 'MaVgBjVh4b8', 'money-change': 'jHkUPDjum_E', 'shapes-3d': 'ZnZYK83utu0',
  'position-direction': 'HnlJzWhsNnw', 'pictograms': 'JuEpHNhRJlA', 'block-diagrams': 'yZJR2MzkBrU',
  'word-problems-2': '_Vzd16NqR_U',
  'column-addition': 'mAvuom42NyY', 'column-subtraction': 'Y6M89-6106I', 'estimate-check': 'vW3brhLL5Fg',
  'tables-3': '9XzfQUXqiYY', 'tables-4': 'UJY1_fzzM6Y', 'tables-8': 'TdqAA9Ky2DY',
  'grid-multiplication': '-5DMbOEtg9o', 'short-multiplication': 'FJ5qLWP3Fqo', 'short-division': '5R37L_aMNvQ',
  'equivalent-fractions': 'N1X0vf5PUz4', 'add-subtract-fractions': '5juto2ze8Lg', 'time-to-minute': 'QU-XUmujbuM',
  'measure-mass-capacity': 'hlJhbebmP5o', 'rounding': 'fd-E18EqSVk', 'roman-numerals': 'MVRzKsFbhVc',
  'negative-numbers': 'OAoLCXpao6s', 'decimals-intro': 'KG6ILNOiMgM', 'decimal-fraction-match': 'do_IbHId2Os',
  'factors-multiples': '0NvLtTwnUHs', 'primes': 'XGbOiYhHY2c', 'square-cube': 'B4zejSI8zho',
  'order-of-operations': 'dAgfnK528RA', 'fdp-conversion': 'Tceuvg9vjyc', 'ratio': 'RQ2nYUBVvqI',
  'proportion': 'USmit5zUGas', 'algebra': 'NybHckSEQBI', 'sequences-rules': 'vV7C7bXm4VI',
  'perimeter-area': 'AAY1bsazcgM', 'angles-lines': 'DGKwdHMiqCg', 'angles-missing': 'IIQ1m4De6mE',
  'symmetry-transformations': 'QHq3CSoal0I', 'coordinates': '9Uc62CuQjc4', 'averages': 'B1HEzNTGeZ4',
  'logic-problems': 'IW8qg7eZOTo'
};

const prettify = (id) => id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
LESSONS.forEach((l) => {
  l.title = TITLES[l.id] || prettify(l.id);
  if (YOUTUBE[l.id]) l.youtubeId = YOUTUBE[l.id];
});

// --- Lookups --------------------------------------------------------------

const LESSON_BY_ID = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

export function getLesson(id) {
  return LESSON_BY_ID[id] || null;
}

export function getAllLessons() {
  return LESSONS;
}

export function getLessonsByStage(stage) {
  return LESSONS.filter((l) => l.stage === Number(stage));
}

// Topics in first-appearance order within a stage (used to group the table).
export function getTopicsForStage(stage) {
  const seen = [];
  for (const l of getLessonsByStage(stage)) {
    if (!seen.includes(l.topic)) seen.push(l.topic);
  }
  return seen;
}

export function getLessonsByTopic(stage, topic) {
  return getLessonsByStage(stage).filter((l) => l.topic === topic);
}

// Ordered list of lesson ids — defines the default learning path.
export function getLessonOrder() {
  return LESSONS.map((l) => l.id);
}
