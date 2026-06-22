// =============================================================================
// "Maths Fun" — a section in every stage with mental-maths tricks (shortcuts)
// and inspiring facts, to make Liyana love maths. kind: 'trick' | 'fact'.
// =============================================================================

export const MATHS_FUN = {
  1: [
    { kind: 'fact', emoji: '🖐️', title: 'Why we count in tens', text: 'People have ten fingers, so long ago everyone counted on their hands. That is why our whole number system is built on tens!' },
    { kind: 'trick', emoji: '➕', title: 'Count on from the biggest', text: 'To work out 2 + 7, start at the BIGGER number, 7, and count on two: 8, 9. Much faster than starting at 2.' },
    { kind: 'trick', emoji: '✌️', title: 'Doubles are super speedy', text: 'Learn your doubles by heart (4+4, 5+5). Then 6 + 7 is just 6 + 6 and one more — easy!' },
    { kind: 'fact', emoji: '0️⃣', title: 'The mighty zero', text: 'Zero means "nothing", yet it is one of the most important numbers ever invented. Without it we could not write 10, 100 or 1000!' },
    { kind: 'trick', emoji: '🔟', title: 'Adding 10 is easy', text: 'When you add 10, the ones stay the same and the tens go up by one: 3 → 13 → 23 → 33.' },
    { kind: 'fact', emoji: '🐝', title: 'Bees love hexagons', text: 'Bees build honeycomb out of hexagons (6-sided shapes) because they fit together with no gaps — clever maths in nature!' }
  ],
  2: [
    { kind: 'trick', emoji: '✋', title: 'The 9 times table on your fingers', text: 'Hold up all ten fingers. For 9 × 3, fold down your 3rd finger. Fingers before it are the tens (2), fingers after are the ones (7) → 27!' },
    { kind: 'trick', emoji: '🔟', title: '×10 and ×5 shortcuts', text: 'To times by 10, just add a zero (6 × 10 = 60). To times by 5, do ×10 then halve it (6 × 5 = half of 60 = 30).' },
    { kind: 'fact', emoji: '🔢', title: 'Odd and even patterns', text: 'Even + even = even. Odd + odd = even. Odd + even = odd. Try lots — it always works!' },
    { kind: 'trick', emoji: '➕', title: 'Add 9 the clever way', text: 'To add 9, add 10 and then take 1 away. 36 + 9 = 36 + 10 − 1 = 45.' },
    { kind: 'fact', emoji: '🥖', title: 'A baker’s dozen', text: 'A dozen is 12. A "baker’s dozen" is 13 — long ago bakers added an extra bun so they were never accused of selling too little!' },
    { kind: 'trick', emoji: '🪞', title: 'Number bonds everywhere', text: 'If you know 7 + 3 = 10, you instantly know 70 + 30 = 100 and 700 + 300 = 1000. One fact, lots of power!' }
  ],
  3: [
    { kind: 'trick', emoji: '3️⃣', title: 'Is it in the 3 times table?', text: 'Add up the digits. If the total is a multiple of 3, so is the number. 51 → 5 + 1 = 6 → yes (3 × 17 = 51)!' },
    { kind: 'trick', emoji: '✖️', title: '×4 = double, double', text: 'To multiply by 4, double the number, then double again. 13 × 4 → 26 → 52.' },
    { kind: 'trick', emoji: '🛒', title: 'Subtract like a shopkeeper', text: 'For 200 − 176, count UP from 176: +4 to 180, then +20 to 200 → the answer is 24.' },
    { kind: 'fact', emoji: '🔭', title: 'A number called a googol', text: 'A "googol" is 1 followed by 100 zeros. The search engine Google was named after it (with a little spelling slip)!' },
    { kind: 'trick', emoji: '1️⃣1️⃣', title: 'The ×11 trick', text: 'For 11 × 24: split the 2 and 4, add them (2 + 4 = 6), and pop the answer in the middle → 264!' },
    { kind: 'fact', emoji: '✒️', title: 'Who invented "="', text: 'The equals sign was invented in 1557 by Robert Recorde, who said nothing could be more equal than two parallel lines.' }
  ],
  4: [
    { kind: 'trick', emoji: '💯', title: 'Percentages can flip', text: 'x% of y = y% of x. So 18% of 50 is the same as 50% of 18 = 9. Flip it to make it easy!' },
    { kind: 'trick', emoji: '🔟', title: 'Build any percentage from 10%', text: '10% is easy (just ÷10). 5% is half of that, 20% is double, and 15% = 10% + 5%.' },
    { kind: 'trick', emoji: '🟰', title: 'Squaring numbers ending in 5', text: 'For 35²: multiply the 3 by the next number, 4, to get 12, then stick 25 on the end → 1225. Works every time!' },
    { kind: 'trick', emoji: '🧮', title: 'BODMAS keeps order', text: 'Always do Brackets and ×÷ before +−. So 2 + 3 × 4 = 2 + 12 = 14, not 20.' },
    { kind: 'trick', emoji: '9️⃣', title: 'Divisible by 9?', text: 'Add the digits. If they make a multiple of 9, so does the number. 729 → 7 + 2 + 9 = 18 → yes!' },
    { kind: 'trick', emoji: '⚡', title: 'Multiply by 25 fast', text: 'To times by 25, multiply by 100 then divide by 4. 16 × 25 → 1600 ÷ 4 = 400.' },
    { kind: 'fact', emoji: '🥧', title: 'Pi never ends', text: 'Pi (π ≈ 3.14159…) is the distance around a circle divided by the distance across it. Its digits go on forever without ever repeating!' }
  ]
};

export function getMathsFun(stage) {
  return MATHS_FUN[stage] || MATHS_FUN[1];
}
