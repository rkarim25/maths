// =============================================================================
// Maths & logic puzzles for up to age 11. Each puzzle has a question, an
// optional hint, and an answer with a clear explanation. Levels: Easy / Medium
// / Tricky. Shown as a chooseable list → puzzle → reveal answer.
// =============================================================================

export const PUZZLES = [
  // ---------------- Easy ----------------
  {
    id: 'farm-legs', level: 'Easy', emoji: '🐔',
    title: 'Farmyard legs',
    question: 'A farmer has chickens and rabbits. Altogether there are 3 animals and 8 legs. How many rabbits are there?',
    hint: 'Chickens have 2 legs; rabbits have 4.',
    answer: '1 rabbit (and 2 chickens)',
    explanation: '2 chickens have 2 + 2 = 4 legs, and 1 rabbit has 4 legs. That is 3 animals and 8 legs altogether.'
  },
  {
    id: 'share-apples', level: 'Easy', emoji: '🍎',
    title: 'Sharing apples',
    question: 'Three friends share 12 apples equally. Then one friend gives 2 of hers away. How many does she have left?',
    hint: 'Share first, then take away.',
    answer: '2 apples',
    explanation: '12 ÷ 3 = 4 apples each. Then 4 − 2 = 2.'
  },
  {
    id: 'odd-one-out', level: 'Easy', emoji: '🎈',
    title: 'Odd one out',
    question: 'Which is the odd one out:  2, 4, 7, 8, 10?',
    answer: '7',
    explanation: 'All the others are even numbers. 7 is the only odd number.'
  },
  {
    id: 'socks', level: 'Easy', emoji: '🧦',
    title: 'Socks in the dark',
    question: 'A drawer has 4 red socks and 4 blue socks. In the dark, how many socks must you take out to be SURE of a matching pair?',
    hint: 'There are only two colours.',
    answer: '3 socks',
    explanation: 'With only two colours, any 3 socks must include at least two of the same colour — a matching pair!'
  },
  {
    id: 'frog-jumps', level: 'Easy', emoji: '🐸',
    title: 'Frog on the lily pads',
    question: 'A frog jumps 2 lily pads forward, then 1 back, again and again. After 3 of these moves, how many pads forward is it?',
    hint: 'Each full move is 2 forward and 1 back.',
    answer: '3 pads',
    explanation: 'Each move gains 2 − 1 = 1 pad. After 3 moves it has gained 3 pads.'
  },
  {
    id: 'balance', level: 'Easy', emoji: '⚖️',
    title: 'Fruit balance',
    question: '2 apples weigh the same as 6 plums. How many plums weigh the same as 1 apple?',
    answer: '3 plums',
    explanation: '2 apples = 6 plums, so 1 apple = 6 ÷ 2 = 3 plums.'
  },

  // ---------------- Medium ----------------
  {
    id: 'ages', level: 'Medium', emoji: '🎂',
    title: 'How old is Mia?',
    question: 'Sam is 3 years older than Mia. Together their ages add up to 15. How old is Mia?',
    hint: 'If Mia is M, Sam is M + 3.',
    answer: 'Mia is 6 (Sam is 9)',
    explanation: 'Mia + (Mia + 3) = 15, so 2 × Mia = 12, which means Mia = 6. Sam is 9.'
  },
  {
    id: 'coins-27', level: 'Medium', emoji: '🪙',
    title: 'Six coins, 27p',
    question: 'Six coins make 27p, using only 5p and 2p coins. How many 5p coins are there?',
    hint: 'Try a few amounts of 5p coins.',
    answer: 'Five 5p coins',
    explanation: 'Five 5p coins make 25p, plus one 2p coin makes 27p — and that is six coins in total.'
  },
  {
    id: 'digit-riddle', level: 'Medium', emoji: '🔢',
    title: 'Two-digit riddle',
    question: 'I am a two-digit number. My tens digit is double my ones digit. My digits add up to 9. What number am I?',
    hint: 'Ones + (2 × ones) = 9.',
    answer: '63',
    explanation: 'If ones = 3, the tens digit is 6, and 6 + 3 = 9. So the number is 63.'
  },
  {
    id: 'cookie-logic', level: 'Medium', emoji: '🍪',
    title: 'Cookie logic',
    question: 'There are 10 cookies: chocolate and oat. There are MORE chocolate than oat, and the number of oat cookies is even. What is the largest number of oat cookies possible?',
    hint: 'Oat must be fewer than 5.',
    answer: '4 oat cookies',
    explanation: 'Oat must be fewer than chocolate, so fewer than 5. The largest even number under 5 is 4 (4 oat, 6 chocolate).'
  },
  {
    id: 'days', level: 'Medium', emoji: '📅',
    title: 'What day will it be?',
    question: 'Today is Wednesday. What day of the week will it be in 10 days’ time?',
    hint: '7 days is exactly one week.',
    answer: 'Saturday',
    explanation: '10 days = 1 week (7 days) + 3 days. Wednesday + 3 days = Saturday.'
  },
  {
    id: 'half-pizza', level: 'Medium', emoji: '🍕',
    title: 'Half of a half',
    question: 'Liyana eats half a pizza, then half of what is left. How much of the whole pizza has she eaten in total?',
    hint: 'Half, then half of the remaining half.',
    answer: 'Three quarters (3/4)',
    explanation: 'First she eats 1/2. Half of the remaining 1/2 is 1/4. So 1/2 + 1/4 = 3/4.'
  },

  // ---------------- Tricky ----------------
  {
    id: 'handshakes', level: 'Tricky', emoji: '🤝',
    title: 'Handshakes',
    question: '4 friends each shake hands once with every other friend. How many handshakes happen in total?',
    hint: 'Each pair shakes hands exactly once.',
    answer: '6 handshakes',
    explanation: 'Each of the 4 people shakes 3 others, giving 4 × 3 = 12, but that counts each handshake twice, so 12 ÷ 2 = 6.'
  },
  {
    id: 'sequence', level: 'Tricky', emoji: '🔢',
    title: 'Find the next number',
    question: 'What number comes next:  3, 6, 11, 18, ?',
    hint: 'Look at the gaps between the numbers.',
    answer: '27',
    explanation: 'The gaps grow: +3, +5, +7, then +9. So 18 + 9 = 27.'
  },
  {
    id: 'overtake', level: 'Tricky', emoji: '🏁',
    title: 'The race trick',
    question: 'In a running race, you overtake the person in 2nd place. What position are you in now?',
    hint: 'You take over THEIR place…',
    answer: '2nd place',
    explanation: 'If you pass the runner in 2nd, you take 2nd place — not 1st! The person you passed is now 3rd.'
  },
  {
    id: 'pond', level: 'Tricky', emoji: '💧',
    title: 'The doubling pond',
    question: 'Lily pads double the area they cover every day, and cover the whole pond on day 30. On which day was the pond exactly half covered?',
    hint: 'If it doubles each day, think about the day BEFORE it was full.',
    answer: 'Day 29',
    explanation: 'Since the area doubles daily, the day before the pond is full it must be half full. So day 29.'
  },
  {
    id: 'digit-sum-10', level: 'Tricky', emoji: '🔟',
    title: 'Smallest with digit-sum 10',
    question: 'What is the smallest two-digit number whose digits add up to 10?',
    hint: 'Make the tens digit as small as you can.',
    answer: '19',
    explanation: 'The smallest tens digit that works is 1, leaving 9 for the ones (1 + 9 = 10). So 19.'
  }
];

export function getPuzzles() {
  return PUZZLES;
}

export function getPuzzle(id) {
  return PUZZLES.find((p) => p.id === id) || null;
}
