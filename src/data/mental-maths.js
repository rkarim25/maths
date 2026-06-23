// =============================================================================
// Mental-maths methods for agility — foundational tricks plus Trachtenberg-style
// speed methods, adapted for a young learner. Levels: Starter / Builder /
// Speedster. Shape: { id, level, emoji, title, idea, steps:[], examples:[] }
// =============================================================================

export const METHODS = [
  // ---------------- Starter ----------------
  { id: 'make-ten', level: 'Starter', emoji: '🌉', title: 'Make ten to add',
    idea: 'Crossing 10 is easier if you build a 10 on the way.',
    steps: ['See how far the first number is from 10.', 'Split the second number to fill it up to 10.', 'Add whatever is left over.'],
    examples: ['8 + 5 → take 2 from the 5 to make 10, then +3 = 13', '7 + 6 → 7 + 3 = 10, then +3 = 13'] },
  { id: 'doubles', level: 'Starter', emoji: '✌️', title: 'Doubles & near-doubles',
    idea: 'Learn the doubles by heart, then nudge by one for the rest.',
    steps: ['Memorise the doubles: 6 + 6 = 12, 7 + 7 = 14…', 'For a near-double, do the double, then add or take 1.'],
    examples: ['6 + 7 = (6 + 6) + 1 = 13', '8 + 7 = (8 + 8) − 1 = 15'] },
  { id: 'add-9-11', level: 'Starter', emoji: '🔟', title: 'Add 9, add 11',
    idea: 'Round to a friendly 10, then fix it.',
    steps: ['To add 9: add 10, then take 1 away.', 'To add 11: add 10, then add 1.'],
    examples: ['46 + 9 = 46 + 10 − 1 = 55', '46 + 11 = 46 + 10 + 1 = 57'] },
  { id: 'count-up', level: 'Starter', emoji: '🛒', title: 'Subtract by counting up',
    idea: 'Like a shopkeeper giving change — count up to the bigger number.',
    steps: ['Start at the smaller number.', 'Count up in easy hops to the bigger number.', 'Add up your hops — that is the answer.'],
    examples: ['12 − 7 → from 7 up to 12 is 5', '200 − 176 → 176 (+4) 180 (+20) 200 = 24'] },

  // ---------------- Builder ----------------
  { id: 'nine-fingers', level: 'Builder', emoji: '✋', title: 'The 9× finger trick',
    idea: 'Your ten fingers can do the whole 9 times table.',
    steps: ['Hold up all 10 fingers.', 'For 9 × n, fold down the n-th finger.', 'Fingers before the gap are the tens; fingers after are the ones.'],
    examples: ['9 × 3 → fold the 3rd: 2 and 7 = 27', '9 × 7 → 6 and 3 = 63'] },
  { id: 'times-5', level: 'Builder', emoji: '🔟', title: '×5 = ×10 then halve',
    idea: 'Fives are just half of tens.',
    steps: ['Multiply by 10 (pop a zero on the end).', 'Halve the answer.'],
    examples: ['8 × 5 → 80, then half = 40', '14 × 5 → 140, then half = 70'] },
  { id: 'double-double', level: 'Builder', emoji: '✖️', title: '×4 and ×8 by doubling',
    idea: 'Multiplying by 4 or 8 is just repeated doubling.',
    steps: ['×4 = double, then double again.', '×8 = double, double, double.'],
    examples: ['13 × 4 → 26 → 52', '7 × 8 → 14 → 28 → 56'] },
  { id: 'times-9', level: 'Builder', emoji: '9️⃣', title: '×9 = ×10 minus one lot',
    idea: 'Nine is one less than ten, so take one lot away.',
    steps: ['Multiply the number by 10.', 'Subtract one lot of the number.'],
    examples: ['9 × 7 = 70 − 7 = 63', '9 × 12 = 120 − 12 = 108'] },

  // ---------------- Speedster (Trachtenberg-style) ----------------
  { id: 'trachtenberg-11', level: 'Speedster', emoji: '1️⃣1️⃣', title: 'Trachtenberg ×11',
    idea: 'Multiply a 2-digit number by 11 by adding its neighbours.',
    steps: ['Write the first digit.', 'In the middle, write the two digits ADDED together.', 'Write the last digit.', 'If the middle adds to 10 or more, carry 1 to the front.'],
    examples: ['35 × 11 → 3 | 3+5 | 5 = 385', '85 × 11 → 8 | 8+5=13 | 5 → carry → 935'] },
  { id: 'times-12', level: 'Speedster', emoji: '1️⃣2️⃣', title: '×12 the quick way',
    idea: 'Twelve is ten and two together.',
    steps: ['Multiply by 10 (add a zero).', 'Add double the number.'],
    examples: ['7 × 12 = 70 + 14 = 84', '15 × 12 = 150 + 30 = 180'] },
  { id: 'square-5', level: 'Speedster', emoji: '🟰', title: 'Squaring numbers ending in 5',
    idea: 'A neat shortcut for 15², 25², 35²…',
    steps: ['Take the tens digit and the next number up.', 'Multiply them together.', 'Write 25 on the end.'],
    examples: ['35² → 3 × 4 = 12, then 25 → 1225', '85² → 8 × 9 = 72, then 25 → 7225'] },
  { id: 'complements', level: 'Speedster', emoji: '💯', title: 'Subtract from 100',
    idea: 'Use complements: take each digit from 9, and the last from 10.',
    steps: ['Take every digit except the last from 9.', 'Take the last digit from 10.'],
    examples: ['100 − 37 → 9−3=6, 10−7=3 → 63', '100 − 68 → 9−6=3, 10−8=2 → 32'] },
  { id: 'double-halve', level: 'Speedster', emoji: '🔄', title: 'Doubling & halving',
    idea: 'Make one number friendly by halving it and doubling the other.',
    steps: ['Halve one number and double the other.', 'Repeat until the sum is easy.'],
    examples: ['16 × 5 → 8 × 10 = 80', '14 × 50 → 7 × 100 = 700'] },
  { id: 'left-to-right', level: 'Speedster', emoji: '➡️', title: 'Add left to right',
    idea: 'Add the big parts first, the way you say the number.',
    steps: ['Add the tens together.', 'Add the ones together.', 'Combine the two.'],
    examples: ['45 + 38 → 40+30 = 70, 5+8 = 13, → 83'] },

  // ---------------- More tricks ----------------
  { id: 'times-50', level: 'Builder', emoji: '🔟', title: '×50 the quick way',
    idea: 'Fifty is half of a hundred.',
    steps: ['Multiply by 100 (add two zeros).', 'Halve the answer.'],
    examples: ['8 × 50 → 800, half = 400', '14 × 50 → 1400, half = 700'] },
  { id: 'times-15', level: 'Builder', emoji: '🧮', title: '×15 = ten plus half',
    idea: 'Fifteen is ten, and then half as much again.',
    steps: ['Multiply by 10.', 'Add half of that.'],
    examples: ['6 × 15 → 60 + 30 = 90', '12 × 15 → 120 + 60 = 180'] },
  { id: 'fraction-of', level: 'Builder', emoji: '🍕', title: 'Fraction of an amount',
    idea: 'To find a fraction of a number, divide by the bottom number.',
    steps: ['For 1/2 — divide by 2.', 'For 1/4 — divide by 4.', 'For 1/3 — divide by 3.'],
    examples: ['1/4 of 20 = 5', '1/3 of 18 = 6'] },
  { id: 'rounding', level: 'Builder', emoji: '🎯', title: 'Round to estimate',
    idea: 'Rounding makes big sums quick — and checks an answer is sensible.',
    steps: ['Find the rounding digit (tens or hundreds).', 'Look at the digit just to its right.', '5 or more rounds up; 4 or less stays the same.'],
    examples: ['68 to the nearest 10 → 70', '342 to the nearest 100 → 300'] },
  { id: 'divisibility', level: 'Builder', emoji: '➗', title: 'Divisibility detective',
    idea: 'Quick checks tell you if a number divides exactly — no dividing needed.',
    steps: ['÷2: the last digit is even.', '÷5: it ends in 0 or 5.', '÷10: it ends in 0.', '÷3 or ÷9: add the digits — is the total in the 3s (or 9s)?'],
    examples: ['72 → 7+2 = 9, so divisible by 3 AND 9', '85 → ends in 5, so divisible by 5 (not 2)'] },
  { id: 'times-25', level: 'Speedster', emoji: '🔢', title: '×25 with quarters',
    idea: 'Twenty-five is a quarter of a hundred.',
    steps: ['Multiply by 100 (add two zeros).', 'Divide by 4 (halve, then halve again).'],
    examples: ['8 × 25 → 800 ÷ 4 = 200', '12 × 25 → 1200 ÷ 4 = 300'] },
  { id: 'percent-of', level: 'Speedster', emoji: '💯', title: 'Percentages in your head',
    idea: 'Build any percentage from 10%, 1% and a half.',
    steps: ['10% — divide by 10.', '1% — divide by 100.', '50% — take half.', 'Combine them (e.g. 30% = three lots of 10%).'],
    examples: ['10% of 80 = 8', '50% of 60 = 30', '1% of 400 = 4'] },

  // ---------------- World speed-maths: Vedic & beyond ----------------
  { id: 'times-99', level: 'Builder', emoji: '9️⃣', title: '×99 (and ×9, ×999)',
    idea: 'Nines are one less than a round number — multiply by the round number, then take one lot away.',
    steps: ['Multiply by 100 (for ×99).', 'Subtract one lot of the number.'],
    examples: ['7 × 99 = 700 − 7 = 693', '12 × 99 = 1200 − 12 = 1188'] },
  { id: 'from-1000', level: 'Builder', emoji: '🔟', title: 'Subtract from 1000',
    idea: 'Vedic “all from 9, last from 10”: take each digit from 9 and the last from 10.',
    steps: ['Take each digit (except the last) away from 9.', 'Take the last digit away from 10.'],
    examples: ['1000 − 457 → 9−4=5, 9−5=4, 10−7=3 → 543', '1000 − 286 → 714'] },
  { id: 'percent-swap', level: 'Builder', emoji: '🔁', title: 'Flip the percentage',
    idea: 'x% of y is the SAME as y% of x — so flip it to make it easy.',
    steps: ['Swap the two numbers around.', 'Work out the easier one.'],
    examples: ['8% of 25 = 25% of 8 = 2', '4% of 50 = 50% of 4 = 2'] },
  { id: 'round-adjust', level: 'Builder', emoji: '🛠️', title: 'Round and adjust',
    idea: 'Round a tricky number to a friendly ten, then put back the little bit.',
    steps: ['Round the number up to the nearest ten.', 'Add (or subtract) the easy way.', 'Take back the bit you added on.'],
    examples: ['47 + 38 → 47 + 40 − 2 = 85', '83 − 29 → 83 − 30 + 1 = 54'] },
  { id: 'near-100', level: 'Speedster', emoji: '💯', title: 'Vedic: multiply near 100',
    idea: 'For numbers just below 100, use how far each is from 100 (Vedic “Nikhilam”).',
    steps: ['Find how far each number is below 100 (its gap).', 'Take ONE gap away from the OTHER number — that is the left part.', 'Multiply the two gaps — that is the right part (always 2 digits).', 'Write them side by side.'],
    examples: ['97 × 96 → gaps 3 & 4 → 97−4 = 93, and 3×4 = 12 → 9312', '98 × 97 → 95 and 3×2 = 06 → 9506 (pad to 2 digits!)'] },
  { id: 'ones-make-ten', level: 'Speedster', emoji: '🤝', title: 'Vedic: tens match, ones make 10',
    idea: 'When the tens are the same and the ones add to 10 (like 43 × 47), the answer is instant.',
    steps: ['Tens digit × the next number up → the left part.', 'Multiply the two ones digits → the right part (2 digits).'],
    examples: ['43 × 47 → 4×5 = 20, and 3×7 = 21 → 2021', '62 × 68 → 6×7 = 42, and 2×8 = 16 → 4216'] },
  { id: 'either-side', level: 'Speedster', emoji: '🪞', title: 'Either side of a round number',
    idea: 'Two numbers the same distance from a round middle? Square the middle, take the gap squared away.',
    steps: ['Find the round number in the middle.', 'Square it.', 'Subtract (gap × gap).'],
    examples: ['48 × 52 → 50² − 2² = 2500 − 4 = 2496', '19 × 21 → 20² − 1 = 399'] },
  { id: 'cross-multiply', level: 'Speedster', emoji: '❌', title: 'Vedic: vertically & crosswise',
    idea: 'Multiply any two 2-digit numbers in one line (Vedic “Urdhva-Tiryak”).',
    steps: ['Right digit: multiply the two ones.', 'Middle: cross-multiply and add the two products.', 'Left: multiply the two tens.', 'Carry any tens to the left.'],
    examples: ['21 × 34 → ones 1×4=4; cross 2×4+1×3=11; tens 2×3=6 → 6|11|4 → 714', '23 × 12 → 6; 2×2+3×1=7; 2 → 276'] },
  { id: 'eleven-3', level: 'Speedster', emoji: '1️⃣1️⃣', title: '×11 for bigger numbers',
    idea: 'The ×11 “add the neighbours” trick also works for 3-digit numbers.',
    steps: ['Write the first digit.', 'Add each pair of neighbours in turn.', 'Write the last digit.', 'Carry if any sum is 10 or more.'],
    examples: ['352 × 11 → 3 | 3+5 | 5+2 | 2 → 3872', '264 × 11 → 2 | 8 | 10 | 4 → carry → 2904'] },
  { id: 'digit-sum-check', level: 'Speedster', emoji: '✅', title: 'Check it: casting out nines',
    idea: 'Add the digits down to one number (the “digit root”) to check an answer — used the world over.',
    steps: ['Add all the digits together.', 'If that has more than one digit, add again.', 'Keep going until one digit is left.'],
    examples: ['4825 → 4+8+2+5 = 19 → 1+9 = 10 → 1', '732 → 7+3+2 = 12 → 3'] },
  { id: 'gauss-sum', level: 'Speedster', emoji: '➕', title: 'Gauss’s lightning sum',
    idea: 'Add 1 + 2 + 3 … up to a number by pairing the ends — the trick young Gauss famously used.',
    steps: ['Multiply the last number by one more than itself.', 'Halve the answer.'],
    examples: ['1 to 10 → 10 × 11 = 110, half = 55', '1 to 100 → 100 × 101 ÷ 2 = 5050'] }
];

export function getMethods() {
  return METHODS;
}
export function getMethod(id) {
  return METHODS.find((m) => m.id === id) || null;
}

// --- practice question generators (one per method) ---------------------------
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

const GEN = {
  'make-ten': () => { const a = rnd(6, 9), b = rnd(3, 9); return { prompt: `${a} + ${b} = ?`, type: 'input', answer: String(a + b) }; },
  'doubles': () => { const a = rnd(4, 9); return { prompt: `${a} + ${a + 1} = ?`, type: 'input', answer: String(2 * a + 1) }; },
  'add-9-11': () => { const n = rnd(15, 88), d = pickOne([9, 11]); return { prompt: `${n} + ${d} = ?`, type: 'input', answer: String(n + d) }; },
  'count-up': () => { const big = rnd(31, 95), small = big - rnd(7, 19); return { prompt: `${big} − ${small} = ?`, type: 'input', answer: String(big - small) }; },
  'nine-fingers': () => { const n = rnd(2, 9); return { prompt: `9 × ${n} = ?`, type: 'input', answer: String(9 * n) }; },
  'times-9': () => { const n = rnd(2, 12); return { prompt: `9 × ${n} = ?`, type: 'input', answer: String(9 * n) }; },
  'times-5': () => { const n = rnd(3, 20); return { prompt: `${n} × 5 = ?`, type: 'input', answer: String(5 * n) }; },
  'double-double': () => { const n = rnd(3, 12), m = pickOne([4, 8]); return { prompt: `${n} × ${m} = ?`, type: 'input', answer: String(n * m) }; },
  'times-12': () => { const n = rnd(3, 12); return { prompt: `${n} × 12 = ?`, type: 'input', answer: String(12 * n) }; },
  'trachtenberg-11': () => { const n = rnd(12, 89); return { prompt: `${n} × 11 = ?`, type: 'input', answer: String(11 * n) }; },
  'square-5': () => { const t = rnd(1, 9), v = t * 10 + 5; return { prompt: `${v} × ${v} = ?`, type: 'input', answer: String(v * v) }; },
  'complements': () => { const n = rnd(11, 89); return { prompt: `100 − ${n} = ?`, type: 'input', answer: String(100 - n) }; },
  'double-halve': () => { const n = rnd(6, 24) * 2; return { prompt: `${n} × 5 = ?`, type: 'input', answer: String(n * 5) }; },
  'left-to-right': () => { const a = rnd(21, 78), b = rnd(13, 49); return { prompt: `${a} + ${b} = ?`, type: 'input', answer: String(a + b) }; },
  'times-50': () => { const n = rnd(3, 16); return { prompt: `${n} × 50 = ?`, type: 'input', answer: String(50 * n) }; },
  'times-15': () => { const n = rnd(3, 12); return { prompt: `${n} × 15 = ?`, type: 'input', answer: String(15 * n) }; },
  'times-25': () => { const n = rnd(3, 16); return { prompt: `${n} × 25 = ?`, type: 'input', answer: String(25 * n) }; },
  'fraction-of': () => { const f = pickOne([2, 4, 3]), n = rnd(2, 9) * f; return { prompt: `What is 1/${f} of ${n}?`, type: 'input', answer: String(n / f) }; },
  'rounding': () => { const place = pickOne([10, 100]), n = rnd(11, 989); return { prompt: `Round ${n} to the nearest ${place}`, type: 'input', answer: String(Math.round(n / place) * place) }; },
  'divisibility': () => { const d = pickOne([2, 3, 5, 9, 10]), n = rnd(10, 99); return { prompt: `Is ${n} divisible by ${d}?`, type: 'mcq', options: ['Yes', 'No'], answer: (n % d === 0) ? 'Yes' : 'No' }; },
  'percent-of': () => { const k = pickOne([10, 50, 1]); let n; if (k === 10) n = rnd(2, 20) * 10; else if (k === 50) n = rnd(2, 30) * 2; else n = rnd(2, 20) * 100; return { prompt: `What is ${k}% of ${n}?`, type: 'input', answer: String(n * k / 100) }; },
  'times-99': () => { const n = rnd(3, 30); return { prompt: `${n} × 99 = ?`, type: 'input', answer: String(n * 99) }; },
  'from-1000': () => { const n = rnd(101, 899); return { prompt: `1000 − ${n} = ?`, type: 'input', answer: String(1000 - n) }; },
  'percent-swap': () => { const xs = [2, 4, 5, 8, 10, 20, 25, 50]; let x, y, g = 0; do { x = pickOne(xs); y = pickOne(xs); } while ((x * y) % 100 !== 0 && g++ < 60); return { prompt: `What is ${x}% of ${y}?`, type: 'input', answer: String(x * y / 100) }; },
  'round-adjust': () => { const a = rnd(23, 69), b = pickOne([8, 9, 18, 19, 28, 29, 38, 39, 48, 49]); return { prompt: `${a} + ${b} = ?`, type: 'input', answer: String(a + b) }; },
  'near-100': () => { const a = rnd(91, 99), b = rnd(91, 99); return { prompt: `${a} × ${b} = ?`, type: 'input', answer: String(a * b) }; },
  'ones-make-ten': () => { const t = rnd(2, 8), o = rnd(1, 9), n1 = t * 10 + o, n2 = t * 10 + (10 - o); return { prompt: `${n1} × ${n2} = ?`, type: 'input', answer: String(n1 * n2) }; },
  'either-side': () => { const c = pickOne([10, 15, 20, 25, 30, 40, 50]), g = rnd(1, 4); return { prompt: `${c - g} × ${c + g} = ?`, type: 'input', answer: String((c - g) * (c + g)) }; },
  'cross-multiply': () => { const a = rnd(11, 49), b = rnd(11, 49); return { prompt: `${a} × ${b} = ?`, type: 'input', answer: String(a * b) }; },
  'eleven-3': () => { const n = rnd(102, 899); return { prompt: `${n} × 11 = ?`, type: 'input', answer: String(n * 11) }; },
  'digit-sum-check': () => { const n = rnd(100, 9999); const dr = 1 + (n - 1) % 9; return { prompt: `Add the digits of ${n} again and again until one digit is left. What is it?`, type: 'input', answer: String(dr) }; },
  'gauss-sum': () => { const n = rnd(5, 20); return { prompt: `Add up every whole number from 1 to ${n}.`, type: 'input', answer: String(n * (n + 1) / 2) }; }
};

// Build `count` distinct practice questions for a method (skillTag `trick-<id>`).
export function genQuestions(methodId, count = 8) {
  const gen = GEN[methodId];
  if (!gen) return [];
  const out = [], seen = new Set();
  let guard = 0;
  while (out.length < count && guard++ < count * 12) {
    const q = gen();
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    q.skillTag = `trick-${methodId}`;
    out.push(q);
  }
  return out;
}
