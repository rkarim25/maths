// =============================================================================
// Teaching content for each lesson: an optional illustrated `story` (Liyana
// loves stories) and a `plain` explanation (the "explain it simply" view).
//
// Stage 1 (Year 1 — what Liyana needs now) has full stories. Stages 2-4 have
// clear plain explanations and short story hooks; these are the slots the
// offline Gemini pipeline (tools/) is designed to enrich over time.
//
// Shape:
//   { story?: { character, emoji, scenes: [{ text, emoji? }] },
//     plain: [ "paragraph", "paragraph", ... ] }
// =============================================================================

const TEACHING = {
  // --------------------------- STAGE 1 (full stories) ----------------------
  'count-to-10': {
    story: {
      character: 'Finn the Fox', emoji: '🦊',
      scenes: [
        { text: 'Finn the Fox found a magical apple tree in the Enchanted Forest. "Let\'s count the apples!" he said.', emoji: '🌳' },
        { text: 'He pointed at each apple and counted out loud: one, two, three, four, five… all the way to ten.', emoji: '🍎' },
        { text: 'Counting means saying one number for each thing — and never skipping one. Now you try with Finn!', emoji: '✨' }
      ]
    },
    plain: [
      'Counting is saying the numbers in order while pointing at each thing once: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.',
      'Top tip: touch each object as you say its number, so you don\'t count anything twice or miss one.'
    ]
  },
  'count-to-20': {
    story: {
      character: 'Pip the Penguin', emoji: '🐧',
      scenes: [
        { text: 'Pip the Penguin caught a big bucket of shiny fish and wanted to count them all.', emoji: '🪣' },
        { text: 'After ten, the numbers keep going: eleven, twelve, thirteen… up to twenty!', emoji: '🐟' },
        { text: 'The "teen" numbers are just a ten and some more. Thirteen is ten and three.', emoji: '✨' }
      ]
    },
    plain: [
      'After 10 we keep counting: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20.',
      'Each teen number is "ten and some more". 14 is one ten and four ones.'
    ]
  },
  'one-more-less': {
    story: {
      character: 'Hoppy the Rabbit', emoji: '🐰',
      scenes: [
        { text: 'Hoppy the Rabbit loves hopping along the number line.', emoji: '➡️' },
        { text: 'Hop forward once and you get one MORE. Hop back once and you get one LESS.', emoji: '🔢' },
        { text: 'One more than 7 is 8. One less than 7 is 6. Easy hops!', emoji: '✨' }
      ]
    },
    plain: [
      'One more means the next number up. One less means the number just before.',
      'Picture a number line: one more is a step right, one less is a step left.'
    ]
  },
  'number-bonds-10': {
    story: {
      character: 'Luna the Wizard', emoji: '🧙',
      scenes: [
        { text: 'Luna the Wizard\'s best spell needs exactly 10 sparkles — but she can split them in many ways.', emoji: '🔮' },
        { text: 'She can use 6 red and 4 blue, or 7 red and 3 blue. Both make 10!', emoji: '✨' },
        { text: 'Pairs that make 10 are called number bonds: 0+10, 1+9, 2+8, 3+7, 4+6, 5+5.', emoji: '🌈' }
      ]
    },
    plain: [
      'Number bonds to 10 are the pairs that add up to 10: 1+9, 2+8, 3+7, 4+6, 5+5 (and the other way round).',
      'Knowing these by heart makes adding and taking away much faster later on.'
    ]
  },
  'add-within-10': {
    story: {
      character: 'Benny the Beaver', emoji: '🦫',
      scenes: [
        { text: 'Benny the Beaver is building a bridge. A friend gives him 3 planks.', emoji: '🪵' },
        { text: 'Then a neighbour brings 4 more planks. How many altogether?', emoji: '🪵' },
        { text: 'Adding means putting groups together: 3 + 4 = 7 planks. The bridge is ready!', emoji: '🌉' }
      ]
    },
    plain: [
      'Adding puts two groups together to find how many in total. Count them all, or count on from the bigger number.',
      'For 3 + 4, start at 4 and count on three more: 5, 6, 7.'
    ]
  },
  'sub-within-10': {
    story: {
      character: 'Mango the Monkey', emoji: '🐵',
      scenes: [
        { text: 'Mango the Monkey had 9 bananas in his basket.', emoji: '🍌' },
        { text: 'He felt hungry and ate 4 of them. How many are left?', emoji: '😋' },
        { text: 'Taking away leaves fewer behind: 9 − 4 = 5 bananas left.', emoji: '✨' }
      ]
    },
    plain: [
      'Subtraction (taking away) finds how many are left when some are removed.',
      'For 9 − 4, start at 9 and count back four: 8, 7, 6, 5.'
    ]
  },
  'count-to-100': {
    story: {
      character: 'Astro the Owl', emoji: '🦉',
      scenes: [
        { text: 'Astro the Owl counts stars from her hundred square every night.', emoji: '🌟' },
        { text: 'The numbers go in rows of ten: 10, 20, 30… up to 100.', emoji: '🔢' },
        { text: 'If you know where a number is, the one after and before are its neighbours.', emoji: '✨' }
      ]
    },
    plain: [
      'Numbers carry on past 20 all the way to 100, going up in tens: 10, 20, 30, … 100.',
      'A hundred square helps you spot the number that comes next or just before.'
    ]
  },
  'place-value-2digit': {
    story: {
      character: 'Tilly the Tortoise', emoji: '🐢',
      scenes: [
        { text: 'Tilly the Tortoise bundles straws into tens to count them quickly.', emoji: '🥤' },
        { text: 'The number 47 means 4 bundles of ten and 7 single straws.', emoji: '🔢' },
        { text: 'The left digit tells the tens, the right digit tells the ones.', emoji: '✨' }
      ]
    },
    plain: [
      'A two-digit number is made of tens and ones. In 47, the 4 means 4 tens (40) and the 7 means 7 ones.',
      'So 47 = 40 + 7. Bundling into tens makes big counts much easier.'
    ]
  },
  'compare-numbers': {
    story: {
      character: 'The Two Dragons', emoji: '🐉',
      scenes: [
        { text: 'Two dragons each count their treasure to see who has more.', emoji: '💎' },
        { text: 'We use signs: > means "greater than", < means "less than", = means "equal".', emoji: '🔢' },
        { text: 'The open mouth of the sign always gobbles the bigger number!', emoji: '✨' }
      ]
    },
    plain: [
      'To compare, look at the tens first; if they are equal, look at the ones.',
      'The signs are >, < and =. The wide-open side faces the bigger number: 52 > 47.'
    ]
  },
  'add-within-20': {
    story: {
      character: 'Bella the Baker', emoji: '👩‍🍳',
      scenes: [
        { text: 'Bella the Baker had 8 buns on a tray.', emoji: '🥐' },
        { text: 'She baked 7 more. How many buns now?', emoji: '🔥' },
        { text: 'Make 10 first: 8 + 2 = 10, then 5 more makes 15 buns.', emoji: '✨' }
      ]
    },
    plain: [
      'When the total goes past 10, it helps to "make 10" first.',
      'For 8 + 7: take 2 from the 7 to make 8 into 10, then add the 5 left over → 15.'
    ]
  },
  'sub-within-20': {
    story: {
      character: 'Detective Cat', emoji: '🐱',
      scenes: [
        { text: 'Someone took some cookies! There were 15, now there are fewer.', emoji: '🍪' },
        { text: 'If 6 are missing, how many are left? 15 − 6.', emoji: '🔍' },
        { text: 'Count back to 10 first: 15 − 5 = 10, then 1 more makes 9 left.', emoji: '✨' }
      ]
    },
    plain: [
      'For take-away past ten, count back to 10 first, then take away the rest.',
      'For 15 − 6: 15 − 5 = 10, then 10 − 1 = 9.'
    ]
  },
  'shapes-2d': {
    story: {
      character: 'Rosa the Gardener', emoji: '🌷',
      scenes: [
        { text: 'Rosa plants a shape garden with circle ponds and square beds.', emoji: '🟦' },
        { text: 'A triangle has 3 sides, a square has 4 equal sides, a circle has none.', emoji: '🔺' },
        { text: 'Sides are the straight edges; corners (vertices) are where they meet.', emoji: '✨' }
      ]
    },
    plain: [
      'Flat shapes are called 2D shapes. We describe them by their sides and corners.',
      'Triangle = 3 sides, square/rectangle = 4 sides, pentagon = 5, hexagon = 6, circle = 0 (it is curved).'
    ]
  },
  'skip-counting': {
    story: {
      character: 'Skip the Frog', emoji: '🐸',
      scenes: [
        { text: 'Skip the Frog never lands on every lily pad — he jumps in steps!', emoji: '🪷' },
        { text: 'In 2s: 2, 4, 6, 8… In 5s: 5, 10, 15… In 10s: 10, 20, 30…', emoji: '🔢' },
        { text: 'Skip counting is the start of times tables. Clever Skip!', emoji: '✨' }
      ]
    },
    plain: [
      'Skip counting means counting in equal jumps instead of one at a time.',
      'In 2s: 2,4,6,8,10. In 5s: 5,10,15,20. In 10s: 10,20,30,40. This builds towards multiplication.'
    ]
  },
  'number-bonds-20': {
    story: {
      character: 'Luna the Wizard', emoji: '🧙',
      scenes: [
        { text: 'Luna\'s bigger spell needs 20 sparkles this time.', emoji: '🔮' },
        { text: 'If she has 13, she needs 7 more, because 13 + 7 = 20.', emoji: '✨' },
        { text: 'Number bonds to 20 work just like bonds to 10, with bigger pairs.', emoji: '🌈' }
      ]
    },
    plain: [
      'Number bonds to 20 are pairs that make 20: 11+9, 12+8, 13+7, 14+6, 15+5, and so on.',
      'If you know bonds to 10, bonds to 20 follow the same pattern.'
    ]
  },
  'ordinal-numbers': {
    story: {
      character: 'Race Day', emoji: '🏁',
      scenes: [
        { text: 'It\'s race day in the meadow! The animals line up to finish.', emoji: '🐇' },
        { text: 'The winner is 1st, then 2nd, then 3rd, 4th, 5th…', emoji: '🏆' },
        { text: 'Ordinal numbers tell us position or order, not how many.', emoji: '✨' }
      ]
    },
    plain: [
      'Ordinal numbers tell us position: 1st, 2nd, 3rd, 4th, 5th, and so on.',
      'They are different from counting numbers — they say where something is in a line or race.'
    ]
  },
  'money-coins': {
    story: {
      character: 'Penny the Shopkeeper', emoji: '🛍️',
      scenes: [
        { text: 'Penny runs a tiny pet shop. Coins come in 1p, 2p, 5p, 10p, 20p…', emoji: '🪙' },
        { text: 'To make 7p you could use 5p + 2p, or 2p + 2p + 2p + 1p.', emoji: '💰' },
        { text: 'Different coins can make the same amount. Clever counting!', emoji: '✨' }
      ]
    },
    plain: [
      'Coins have different values: 1p, 2p, 5p, 10p, 20p, 50p, £1, £2.',
      'You can make an amount in different ways — 7p could be 5p + 2p. Add the coin values to find the total.'
    ]
  },
  'patterns': {
    story: {
      character: 'Iris the Fairy', emoji: '🧚',
      scenes: [
        { text: 'Iris the Fairy rebuilds the rainbow bridge with coloured beads.', emoji: '🌈' },
        { text: 'Red, blue, red, blue, red… what comes next? Blue!', emoji: '🔵' },
        { text: 'A pattern repeats in a rule. Find the rule and you can carry it on.', emoji: '✨' }
      ]
    },
    plain: [
      'A pattern follows a repeating rule — like 🔺🟦🔺🟦 or 2, 4, 6, 8.',
      'Work out the rule (what keeps happening), then use it to find what comes next.'
    ]
  },
  'word-problems-1': {
    story: {
      character: 'The Star Festival', emoji: '🎆',
      scenes: [
        { text: 'At the Star Festival, Liyana collects glowing stars in a jar.', emoji: '⭐' },
        { text: 'She has 8 stars and catches 6 more. The words tell a sum: 8 + 6.', emoji: '🫙' },
        { text: 'Read carefully: "more" usually means add, "left" usually means take away.', emoji: '✨' }
      ]
    },
    plain: [
      'A word problem hides a sum inside a story. Read it, picture it, then choose add or take away.',
      'Clues: "altogether / more" → add; "left / gives away / fewer" → take away.'
    ]
  },

  // --------------------------- STAGE 2 (plain + hooks) ---------------------
  'place-value-1000': {
    story: { character: 'Tilly the Tortoise', emoji: '🐢', scenes: [{ text: 'Now Tilly bundles tens into hundreds! 100s, 10s and 1s build any number to 1000.', emoji: '🔢' }] },
    plain: [
      'Three-digit numbers have hundreds, tens and ones. In 528: 5 hundreds, 2 tens, 8 ones.',
      'So 528 = 500 + 20 + 8. The place of a digit tells you what it is worth.'
    ]
  },
  'add-2digit': {
    plain: [
      'To add two-digit numbers, add the ones, then add the tens.',
      'For 34 + 25: ones 4 + 5 = 9, tens 30 + 20 = 50, so the answer is 59.'
    ]
  },
  'sub-2digit': {
    plain: [
      'To subtract two-digit numbers (no borrowing), take away the ones, then the tens.',
      'For 57 − 23: ones 7 − 3 = 4, tens 50 − 20 = 30, so the answer is 34.'
    ]
  },
  'fact-families': {
    plain: [
      'A fact family is a set of linked sums using the same three numbers.',
      'From 3 + 4 = 7 you also get 4 + 3 = 7, 7 − 3 = 4 and 7 − 4 = 3.'
    ]
  },
  'multiplication-groups': {
    plain: [
      'Multiplication is repeated equal groups. "3 groups of 4" means 4 + 4 + 4 = 12.',
      'We write it as 3 × 4 = 12. The × sign means "lots of".'
    ]
  },
  'division-sharing': {
    plain: [
      'Division shares a total into equal groups. 12 shared between 3 is 12 ÷ 3 = 4 each.',
      'It is the opposite of multiplication: because 3 × 4 = 12, we know 12 ÷ 3 = 4.'
    ]
  },
  'tables-2-5-10': {
    plain: [
      'The 2, 5 and 10 times tables are the easiest to learn first.',
      '2s are doubles; 5s end in 5 or 0; 10s just add a zero. Practise until they are instant.'
    ]
  },
  'fractions-half-quarter': {
    plain: [
      'A fraction is an equal part of a whole. Half (1/2) is one of two equal parts; a quarter (1/4) is one of four.',
      'Half of 8 is 4. A quarter of 8 is 2. Share the whole into equal parts to find a fraction of an amount.'
    ]
  },
  'fractions-thirds': {
    plain: [
      'A third (1/3) is one of three equal parts.',
      'A third of 9 is 3, because 9 shared into 3 equal groups gives 3 in each.'
    ]
  },
  'time-oclock': {
    plain: [
      'On a clock, the short hand shows the hour and the long hand shows the minutes.',
      'When the long hand points to 12 it is "o\'clock"; pointing to 6 it is "half past".'
    ]
  },
  'measure-length': {
    plain: [
      'We measure length in centimetres (cm) and metres (m). There are 100 cm in 1 m.',
      'Use a ruler for small things and a metre stick or tape for big things.'
    ]
  },
  'money-change': {
    plain: [
      'Change is what you get back when you pay more than something costs.',
      'If a toy costs 6p and you pay 10p, the change is 10 − 6 = 4p.'
    ]
  },
  'shapes-3d': {
    plain: [
      'Solid shapes are 3D. We describe them by faces (flat sides), edges and vertices (corners).',
      'A cube has 6 faces, 12 edges and 8 vertices. A sphere is round like a ball.'
    ]
  },
  'position-direction': {
    plain: [
      'Position words tell us where things are: left, right, above, below, between, next to.',
      'A quarter turn is a right angle; a half turn faces you the opposite way.'
    ]
  },
  'pictograms': {
    plain: [
      'A pictogram uses pictures to show how many. A key tells you what one picture is worth.',
      'If one 🍎 stands for 2 apples, then three 🍎 means 6 apples.'
    ]
  },
  'block-diagrams': {
    plain: [
      'A block diagram (or bar chart) uses bars to compare amounts.',
      'The taller the bar, the more there is. Read the scale up the side to find each value.'
    ]
  },
  'regrouping': {
    plain: [
      'Regrouping means trading: 10 ones become 1 ten, and 10 tens become 1 hundred.',
      'When a column adds to 10 or more, carry the extra into the next column.'
    ]
  },
  'word-problems-2': {
    plain: [
      'Two-step problems need two calculations. Work out the first part, then use it for the second.',
      'Underline the numbers and the question, then plan your two steps before you start.'
    ]
  },

  // --------------------------- STAGE 3 (plain) -----------------------------
  'column-addition': {
    plain: [
      'Column addition lines up hundreds, tens and ones. Add from the right (ones first).',
      'If a column reaches 10 or more, carry the ten into the next column.'
    ]
  },
  'column-subtraction': {
    plain: [
      'Column subtraction also lines up the place values and works from the right.',
      'If the top digit is too small, borrow one from the next column (it becomes 10 more).'
    ]
  },
  'estimate-check': {
    plain: [
      'Estimating gives a quick rough answer by rounding the numbers first.',
      'For 38 + 21, round to 40 + 20 = about 60. Then check your exact answer is close to it.'
    ]
  },
  'tables-3': { plain: ['The 3 times table: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36.', 'Tip: the digits of each answer add up to a multiple of 3.'] },
  'tables-4': { plain: ['The 4 times table: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48.', 'Tip: 4 is double-double — double the number, then double again.'] },
  'tables-8': { plain: ['The 8 times table: 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96.', 'Tip: 8 is double the 4 times table.'] },
  'grid-multiplication': {
    plain: [
      'To multiply a 2-digit number by 1 digit, split it into tens and ones.',
      'For 23 × 4: do 20 × 4 = 80 and 3 × 4 = 12, then add: 80 + 12 = 92.'
    ]
  },
  'short-multiplication': {
    plain: [
      'Short multiplication multiplies each digit, carrying when needed, working from the right.',
      'It is the quick column method once you are confident with the grid method.'
    ]
  },
  'short-division': {
    plain: [
      'Short division ("bus stop") divides digit by digit from the left.',
      'For 84 ÷ 4: 8 ÷ 4 = 2, 4 ÷ 4 = 1, so 84 ÷ 4 = 21. Sometimes there is a remainder.'
    ]
  },
  'equivalent-fractions': {
    plain: [
      'Equivalent fractions look different but show the same amount: 1/2 = 2/4 = 3/6.',
      'Multiply (or divide) the top and bottom by the same number to find equivalents.'
    ]
  },
  'add-subtract-fractions': {
    plain: [
      'When the bottom numbers (denominators) are the same, just add or subtract the tops.',
      'For 1/5 + 2/5, the bottom stays 5 and 1 + 2 = 3, so the answer is 3/5.'
    ]
  },
  'time-to-minute': {
    plain: [
      'Each small mark on a clock is one minute; each number is five minutes.',
      '"Quarter past" is 15 minutes, "half past" is 30, "quarter to" is 45 minutes past (or 15 to).'
    ]
  },
  'measure-mass-capacity': {
    plain: [
      'Mass is measured in grams (g) and kilograms (kg): 1 kg = 1000 g.',
      'Capacity is measured in millilitres (ml) and litres (l): 1 l = 1000 ml.'
    ]
  },
  'rounding': {
    plain: [
      'Rounding gives a nearby, simpler number. Look at the next digit: 5 or more rounds up, less rounds down.',
      '67 to the nearest 10 is 70; 312 to the nearest 100 is 300.'
    ]
  },
  'roman-numerals': {
    plain: [
      'Romans wrote numbers with letters: I=1, V=5, X=10, L=50, C=100.',
      'A smaller letter before a bigger one means subtract: IV = 4, IX = 9, XL = 40.'
    ]
  },
  'negative-numbers': {
    plain: [
      'Negative numbers are below zero, like cold temperatures: −1, −2, −3.',
      'On a number line they sit to the left of 0. 2 − 5 = −3.'
    ]
  },
  'decimals-intro': {
    plain: [
      'A decimal point separates whole numbers from parts. The first place after it is tenths.',
      '0.3 means 3 tenths. 0.25 means 2 tenths and 5 hundredths.'
    ]
  },
  'decimal-fraction-match': {
    plain: [
      'Some decimals and fractions are just two names for the same amount.',
      '0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4, 0.1 = 1/10.'
    ]
  },

  // --------------------------- STAGE 4 (plain) -----------------------------
  'tables-all': {
    plain: [
      'For the 11+ you need every table to 12 × 12 to be instant — no counting.',
      'Focus practice on the trickier ones: 6, 7, 8, 9 and 12. Speed matters in the exam.'
    ]
  },
  'factors-multiples': {
    plain: [
      'A factor divides exactly into a number (factors of 12: 1, 2, 3, 4, 6, 12).',
      'A multiple is in a number\'s times table (multiples of 3: 3, 6, 9, 12, …).'
    ]
  },
  'primes': {
    plain: [
      'A prime number has exactly two factors: 1 and itself (2, 3, 5, 7, 11, 13…).',
      '1 is not prime. 2 is the only even prime number.'
    ]
  },
  'square-cube': {
    plain: [
      'A square number is a number times itself: 4² = 4 × 4 = 16.',
      'A cube number is a number times itself three times: 2³ = 2 × 2 × 2 = 8.'
    ]
  },
  'order-of-operations': {
    plain: [
      'BODMAS sets the order: Brackets, Orders (powers), Division/Multiplication, then Addition/Subtraction.',
      'In 2 + 3 × 4 you multiply first: 3 × 4 = 12, then 2 + 12 = 14.'
    ]
  },
  'fdp-conversion': {
    plain: [
      'Fractions, decimals and percentages are three ways to show parts of a whole.',
      '1/2 = 0.5 = 50%. 1/4 = 0.25 = 25%. 3/4 = 0.75 = 75%.'
    ]
  },
  'ratio': {
    plain: [
      'A ratio compares amounts, like 2 red to 3 blue, written 2 : 3.',
      'If you scale up, keep the ratio: 2 : 3 becomes 4 : 6 then 6 : 9.'
    ]
  },
  'proportion': {
    plain: [
      'Proportion keeps the same rate. If 3 pens cost 60p, each pen costs 20p.',
      'So 6 pens cost 120p — double the pens, double the price.'
    ]
  },
  'algebra': {
    plain: [
      'In algebra a letter stands for an unknown number. If x = 4, then x + 3 = 7.',
      'a + a + a is the same as 3 × a, written 3a.'
    ]
  },
  'sequences-rules': {
    plain: [
      'A sequence follows a rule. Find the step between terms to continue it.',
      'In 2, 5, 8, 11 the rule is "+3", so the next number is 14.'
    ]
  },
  'perimeter-area': {
    plain: [
      'Perimeter is the distance all the way around a shape — add up every side.',
      'Area is the space inside. For a rectangle, area = length × width.'
    ]
  },
  'angles-lines': {
    plain: [
      'A right angle is 90°. Acute angles are smaller; obtuse angles are between 90° and 180°.',
      'Parallel lines never meet; perpendicular lines cross at a right angle.'
    ]
  },
  'angles-missing': {
    plain: [
      'Angles on a straight line add to 180°; angles around a point add to 360°.',
      'The three angles in a triangle always add to 180°, so subtract to find a missing one.'
    ]
  },
  'symmetry-transformations': {
    plain: [
      'A line of symmetry splits a shape into two matching halves (a mirror line).',
      'Reflection flips a shape, translation slides it, and rotation turns it.'
    ]
  },
  'coordinates': {
    plain: [
      'Coordinates give a position as (x, y): x is how far across, y is how far up.',
      'Always read across first, then up — (3, 2) means 3 right and 2 up.'
    ]
  },
  'averages': {
    plain: [
      'Mean: add the values and divide by how many. Range: biggest − smallest.',
      'Mode: the most common value. Median: the middle value when they are in order.'
    ]
  },
  'logic-problems': {
    plain: [
      'Multi-step word problems hide several calculations. Break them into small steps.',
      'Write down what you know, plan the steps in order, and check your answer makes sense.'
    ]
  },
  'exam-speed': {
    plain: [
      'In the 11+ you have about 45 seconds per question, so accuracy AND speed both count.',
      'For multiple choice, rule out answers that are clearly wrong, and move on if you are stuck — come back later.'
    ]
  }
};

export function getTeaching(id) {
  return TEACHING[id] || null;
}
