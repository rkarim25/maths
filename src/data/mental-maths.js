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
    examples: ['45 + 38 → 40+30 = 70, 5+8 = 13, → 83'] }
];

export function getMethods() {
  return METHODS;
}
export function getMethod(id) {
  return METHODS.find((m) => m.id === id) || null;
}
