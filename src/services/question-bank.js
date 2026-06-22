// =============================================================================
// Question generators. Every lesson in curriculum.js names a `generator` here.
// A generator is fn(params, lesson) -> question. generateSet() runs it to build
// an exercise set (used by both on-screen practice and printable worksheets).
//
// Question shape:
//   { prompt, type: 'mcq'|'input', options?: string[], answer: string,
//     skillTag: string, hint?: string, visual?: {emoji, count} }
//
// Answers and options are always strings (the UI compares strings).
// =============================================================================

// --- small utilities ---------------------------------------------------------
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build an mcq question. Distractors are de-duped against the answer.
function mcq(prompt, answer, distractors, skillTag, extra = {}) {
  const opts = [String(answer)];
  for (const d of distractors) {
    const s = String(d);
    if (!opts.includes(s)) opts.push(s);
    if (opts.length >= 4) break;
  }
  return { prompt, type: 'mcq', options: shuffle(opts), answer: String(answer), skillTag, ...extra };
}

// Numeric distractors near a value, respecting a minimum.
function near(answer, { spread = 3, min = 0, count = 3 } = {}) {
  const out = new Set();
  let guard = 0;
  while (out.size < count && guard++ < 40) {
    const delta = randInt(-spread, spread);
    const cand = answer + delta;
    if (cand !== answer && cand >= min) out.add(cand);
  }
  // pad if needed
  let pad = answer + 1;
  while (out.size < count) { if (pad !== answer && pad >= min) out.add(pad); pad++; }
  return [...out];
}

function input(prompt, answer, skillTag, extra = {}) {
  return { prompt, type: 'input', answer: String(answer), skillTag, ...extra };
}

const EMOJI = ['🍎', '⭐', '🐟', '🌸', '🚗', '🐝', '🍓', '🎈', '🐢', '🦋'];
const NAMES = ['Liyana', 'Sam', 'Aria', 'Noah', 'Mia', 'Leo'];

function tagFor(lesson, preferred) {
  if (preferred && lesson.skillTags.includes(preferred)) return preferred;
  return lesson.skillTags[0];
}

// =============================================================================
// GENERATORS
// =============================================================================
const GEN = {
  countObjects(p, l) {
    const n = randInt(1, p.max);
    const emoji = pick(EMOJI);
    return mcq(`How many ${emoji} are there?`, n, near(n, { spread: 2, min: 0 }),
      tagFor(l), { visual: { emoji, count: n } });
  },

  numberSequence(p, l) {
    const style = pick(['after', 'before', 'between']);
    if (style === 'after') {
      const n = randInt(1, p.max - 1);
      return mcq(`What number comes just after ${n}?`, n + 1, near(n + 1, { spread: 2, min: 0 }), tagFor(l));
    }
    if (style === 'before') {
      const n = randInt(1, p.max);
      return mcq(`What number comes just before ${n}?`, n - 1, near(n - 1, { spread: 2, min: 0 }), tagFor(l));
    }
    const n = randInt(1, p.max - 2);
    return mcq(`Which number is between ${n} and ${n + 2}?`, n + 1, near(n + 1, { spread: 3, min: 0 }), tagFor(l));
  },

  oneMoreLess(p, l) {
    const n = randInt(1, p.max);
    if (Math.random() < 0.5) return mcq(`One more than ${n} is…`, n + 1, near(n + 1, { spread: 2 }), tagFor(l));
    return mcq(`One less than ${n} is…`, n - 1, near(n - 1, { spread: 2 }), tagFor(l));
  },

  numberBonds(p, l) {
    const a = randInt(0, p.total);
    const b = p.total - a;
    return mcq(`${a} + ? = ${p.total}`, b, near(b, { spread: 2, min: 0, count: 3 }), tagFor(l),
      { hint: `Count up from ${a} to ${p.total}.` });
  },

  addition(p, l) {
    let a, b;
    if (p.noRegroup) {
      // keep each column sum < 10 so there is no carrying
      a = randInt(11, p.maxA); b = randInt(11, p.maxB);
      a = Math.min(a, 99); b = Math.min(b, 99);
      const aT = Math.floor(a / 10), aO = a % 10;
      const bO = randInt(0, 9 - aO), bT = randInt(0, 9 - aT);
      a = aT * 10 + aO; b = bT * 10 + bO;
    } else {
      a = randInt(0, p.maxA); b = randInt(0, p.maxB);
    }
    const ans = a + b;
    const big = p.maxA > 12 || p.maxB > 12;
    return big ? input(`${a} + ${b} = ?`, ans, tagFor(l))
      : mcq(`${a} + ${b} = ?`, ans, near(ans, { spread: 3, min: 0 }), tagFor(l));
  },

  subtraction(p, l) {
    let a, b;
    if (p.noBorrow) {
      a = randInt(11, p.max);
      const aT = Math.floor(a / 10), aO = a % 10;
      const bO = randInt(0, aO), bT = randInt(0, aT);
      b = bT * 10 + bO;
    } else {
      a = randInt(1, p.max); b = randInt(0, a);
    }
    const ans = a - b;
    const big = p.max > 20;
    return big ? input(`${a} − ${b} = ?`, ans, tagFor(l))
      : mcq(`${a} − ${b} = ?`, ans, near(ans, { spread: 3, min: 0 }), tagFor(l));
  },

  compareNumbers(p, l) {
    const a = randInt(1, p.max), b = randInt(1, p.max);
    const sign = a > b ? '>' : a < b ? '<' : '=';
    return mcq(`Which sign makes it true?   ${a} ___ ${b}`, sign, ['>', '<', '='].filter((s) => s !== sign), tagFor(l),
      { hint: 'Bigger number is on the open side of < or >.' });
  },

  placeValue(p, l) {
    if (p.digits === 2) {
      const n = randInt(11, 99);
      const mode = pick(['tens', 'ones', 'build']);
      if (mode === 'tens') return mcq(`In ${n}, how many tens?`, Math.floor(n / 10), near(Math.floor(n / 10), { spread: 2, min: 0 }), tagFor(l));
      if (mode === 'ones') return mcq(`In ${n}, how many ones?`, n % 10, near(n % 10, { spread: 2, min: 0 }), tagFor(l));
      return mcq(`What is ${Math.floor(n / 10)} tens and ${n % 10} ones?`, n, near(n, { spread: 5, min: 0 }), tagFor(l));
    }
    const n = randInt(101, 999);
    const mode = pick(['hundreds', 'tens', 'ones', 'build']);
    if (mode === 'hundreds') return mcq(`In ${n}, what is the hundreds digit worth?`, Math.floor(n / 100) * 100, [Math.floor(n / 100), n % 100, Math.floor(n / 10) % 10 * 10], tagFor(l));
    if (mode === 'tens') return mcq(`In ${n}, how many tens are in the tens place?`, Math.floor(n / 10) % 10, near(Math.floor(n / 10) % 10, { spread: 2, min: 0 }), tagFor(l));
    if (mode === 'ones') return mcq(`In ${n}, how many ones?`, n % 10, near(n % 10, { spread: 2, min: 0 }), tagFor(l));
    return input(`What is ${Math.floor(n / 100)} hundreds, ${Math.floor(n / 10) % 10} tens and ${n % 10} ones?`, n, tagFor(l));
  },

  skipCounting(p, l) {
    const step = pick(p.steps);
    const start = step * randInt(1, 3);
    const seq = [start, start + step, start + 2 * step];
    const ans = start + 3 * step;
    return mcq(`Count in ${step}s:  ${seq.join(', ')}, ?`, ans, [ans - step, ans + step, ans + 2 * step], tagFor(l, `times-tables-${step}`) || tagFor(l));
  },

  ordinal(p, l) {
    const words = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
    const i = randInt(0, Math.min(p.max, words.length) - 2);
    return mcq(`Which comes next?  ${words.slice(Math.max(0, i - 1), i + 1).join(', ')}, ?`,
      words[i + 1], [words[i], words[i + 2] || '11th', words[Math.max(0, i - 1)]], tagFor(l));
  },

  money(p, l) {
    if (p.mode === 'change') {
      const cost = randInt(1, p.maxPence - 1);
      const paid = p.maxPence;
      return mcq(`You buy a toy for ${cost}p and pay ${paid}p. What change do you get?`,
        `${paid - cost}p`, [`${paid - cost + 1}p`, `${paid - cost - 1}p`, `${cost}p`], tagFor(l));
    }
    const a = randInt(1, Math.floor(p.maxPence / 2));
    const b = randInt(1, Math.floor(p.maxPence / 2));
    return mcq(`You have a ${a}p coin and a ${b}p coin. How much altogether?`,
      `${a + b}p`, [`${a + b + 1}p`, `${a + b - 1}p`, `${Math.abs(a - b)}p`], tagFor(l));
  },

  patterns(p, l) {
    if (Math.random() < 0.5) {
      const a = pick(EMOJI), b = pick(EMOJI.filter((e) => e !== a));
      return mcq(`What comes next?  ${a}${b}${a}${b}${a} ?`, b, [a, pick(EMOJI), '⭐'].filter((x) => x !== b).slice(0, 3), tagFor(l));
    }
    const step = pick([1, 2, 5, 10]);
    const start = randInt(1, 5);
    const seq = [start, start + step, start + 2 * step];
    const ans = start + 3 * step;
    return mcq(`What comes next?  ${seq.join(', ')}, ?`, ans, [ans - step, ans + step, ans + 1], tagFor(l));
  },

  wordProblem(p, l) {
    const name = pick(NAMES), thing = pick(['sweets', 'stickers', 'marbles', 'coins', 'cards']);
    const steps = p.steps || 1;
    if (steps === 1) {
      const op = pick(p.ops);
      if (op === '+') {
        const a = randInt(2, p.max / 2), b = randInt(2, p.max / 2);
        return mcq(`${name} has ${a} ${thing} and gets ${b} more. How many now?`, a + b, near(a + b, { spread: 3, min: 0 }), tagFor(l));
      }
      if (op === '-') {
        const a = randInt(5, p.max), b = randInt(1, a - 1);
        return mcq(`${name} has ${a} ${thing} and gives away ${b}. How many left?`, a - b, near(a - b, { spread: 3, min: 0 }), tagFor(l));
      }
      const g = randInt(2, 5), e = randInt(2, 5);
      return mcq(`${name} has ${g} bags with ${e} ${thing} in each. How many altogether?`, g * e, near(g * e, { spread: 4, min: 0 }), tagFor(l));
    }
    // two-step
    const a = randInt(10, p.max), b = randInt(2, 9), c = randInt(2, 9);
    const ans = a + b - c;
    return input(`${name} has ${a} ${thing}, buys ${b} more, then uses ${c}. How many now?`, ans, tagFor(l));
  },

  factFamilies(p, l) {
    const c = randInt(5, p.max), a = randInt(1, c - 1), b = c - a;
    const variants = [
      [`If ${a} + ${b} = ${c}, then ${c} − ${b} = ?`, a],
      [`If ${a} + ${b} = ${c}, then ${c} − ${a} = ?`, b],
      [`If ${c} − ${a} = ${b}, then ${b} + ${a} = ?`, c]
    ];
    const [prompt, ans] = pick(variants);
    return mcq(prompt, ans, near(ans, { spread: 3, min: 0 }), tagFor(l));
  },

  multiplicationGroups(p, l) {
    const g = randInt(2, p.maxGroups), e = randInt(2, p.maxEach);
    return mcq(`${g} groups of ${e}. How many altogether?`, g * e, near(g * e, { spread: 4, min: 0 }), tagFor(l),
      { hint: `Add ${e} a total of ${g} times.` });
  },

  divisionSharing(p, l) {
    const friends = randInt(2, 5), each = randInt(2, Math.floor(p.max / friends));
    const total = friends * each;
    return mcq(`${total} ${pick(['sweets', 'stickers', 'apples'])} shared equally between ${friends}. How many each?`,
      each, near(each, { spread: 2, min: 1 }), tagFor(l));
  },

  timesTables(p, l) {
    const t = pick(p.tables), n = randInt(1, 12);
    const ans = t * n;
    return mcq(`${t} × ${n} = ?`, ans, [ans + t, ans - t, ans + 1].filter((x) => x > 0), tagFor(l, `times-tables-${t}`));
  },

  fractionsOfAmount(p, l) {
    const part = pick(p.parts);
    const each = randInt(2, 6);
    const amount = part * each;
    return mcq(`What is 1/${part} of ${amount}?`, each, near(each, { spread: 2, min: 1 }), tagFor(l),
      { hint: `Share ${amount} into ${part} equal groups.` });
  },

  timeClock(p, l) {
    if (p.mode === 'minute') {
      const variants = [
        ['How many minutes are in a quarter of an hour?', '15'],
        ['How many minutes are in half an hour?', '30'],
        ['"Quarter to 8" is how many minutes before 8 o\'clock?', '15'],
        ['The minute hand points to 6. How many minutes past the hour?', '30'],
        ['The minute hand points to 3. How many minutes past the hour?', '15']
      ];
      const [q, a] = pick(variants);
      return mcq(q, a, ['10', '20', '45', '25'].filter((x) => x !== a).slice(0, 3), tagFor(l));
    }
    const variants = [
      ['What time is 1 hour after 3 o\'clock?', '4 o\'clock', ['2 o\'clock', '5 o\'clock', 'half past 3']],
      ['How many minutes is "half past"?', '30', ['15', '45', '60']],
      ['The big hand is on 12 and the little hand is on 7. What time is it?', '7 o\'clock', ['12 o\'clock', 'half past 7', '6 o\'clock']],
      ['What comes 1 hour after 11 o\'clock?', '12 o\'clock', ['10 o\'clock', '1 o\'clock', 'half past 11']]
    ];
    const [q, a, d] = pick(variants);
    return mcq(q, a, d, tagFor(l));
  },

  measure(p, l) {
    const length = [
      ['How many centimetres are in 1 metre?', '100', ['10', '1000', '50']],
      ['Which is longer?', '1 m', ['90 cm', '50 cm', '10 cm']],
      ['How many cm in half a metre?', '50', ['5', '500', '25']],
      ['How many cm in 2 metres?', '200', ['20', '2000', '120']],
      ['About how long is a new pencil?', '15 cm', ['15 m', '15 mm', '150 cm']],
      ['How many millimetres are in 1 centimetre?', '10', ['100', '1', '1000']]
    ];
    const mass = [
      ['How many grams are in 1 kilogram?', '1000', ['100', '10', '500']],
      ['Which is heavier?', '1 kg', ['900 g', '500 g', '100 g']],
      ['How many grams in half a kilogram?', '500', ['50', '5000', '250']],
      ['About how much does a bag of sugar weigh?', '1 kg', ['1 g', '100 g', '1 ml']]
    ];
    const cap = [
      ['How many millilitres are in 1 litre?', '1000', ['100', '10', '500']],
      ['Which holds more?', '1 litre', ['900 ml', '500 ml', '250 ml']],
      ['How many ml in half a litre?', '500', ['50', '5000', '250']],
      ['About how much does a teaspoon hold?', '5 ml', ['5 l', '500 ml', '5 cm']]
    ];
    let bank = length;
    if (p.quantity === 'mass-capacity') bank = pick([mass, cap]);
    const [q, a, d] = pick(bank);
    return mcq(q, a, d, tagFor(l));
  },

  dataRead(p, l) {
    if (p.type === 'pictogram') {
      const per = pick([2, 5, 10]), pics = randInt(2, 5);
      return mcq(`On a pictogram, ${pick(EMOJI)} = ${per}. There are ${pics} of them. How many in total?`,
        per * pics, near(per * pics, { spread: per, min: 0 }), tagFor(l));
    }
    const blue = randInt(4, 9), red = randInt(1, blue - 1);
    if (Math.random() < 0.5) return mcq(`A bar chart shows Blue = ${blue} and Red = ${red}. How many more Blue than Red?`, blue - red, near(blue - red, { spread: 2, min: 0 }), tagFor(l));
    return mcq(`A bar chart shows Blue = ${blue} and Red = ${red}. How many altogether?`, blue + red, near(blue + red, { spread: 3, min: 0 }), tagFor(l));
  },

  columnAddition(p, l) {
    const a = randInt(120, 899), b = randInt(120, 899);
    return input(`${a} + ${b} = ?`, a + b, tagFor(l), { hint: 'Line up hundreds, tens and ones. Carry when a column makes 10 or more.' });
  },

  columnSubtraction(p, l) {
    const a = randInt(300, 999), b = randInt(101, a - 50);
    return input(`${a} − ${b} = ?`, a - b, tagFor(l), { hint: 'Borrow from the next column when needed.' });
  },

  estimateCheck(p, l) {
    const a = randInt(21, 79), b = randInt(21, 79);
    const ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
    return mcq(`Estimate by rounding to the nearest 10:  ${a} + ${b} is about…`, ra + rb,
      [ra + rb + 10, ra + rb - 10, ra + rb + 20], tagFor(l));
  },

  multiplyColumn(p, l) {
    const a = p.aDigits === 3 ? randInt(101, 899) : randInt(12, 89);
    const b = randInt(2, 9);
    return input(`${a} × ${b} = ?`, a * b, tagFor(l));
  },

  divideColumn(p, l) {
    const b = randInt(2, 9), q = randInt(11, 99);
    const a = b * q;
    return input(`${a} ÷ ${b} = ?`, q, tagFor(l), { hint: 'Use the bus-stop method, digit by digit.' });
  },

  equivalentFractions(p, l) {
    const base = pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4]]);
    const m = randInt(2, 4);
    const [n, d] = base;
    return mcq(`${n}/${d} = ${n * m}/?`, d * m, [d * m + 1, d * m - 1, d + m], tagFor(l));
  },

  addSubtractFractions(p, l) {
    const d = pick([4, 5, 6, 8]);
    const a = randInt(1, d - 2), b = randInt(1, d - a - 1);
    if (Math.random() < 0.5) return mcq(`${a}/${d} + ${b}/${d} = ?`, `${a + b}/${d}`, [`${a + b + 1}/${d}`, `${a + b}/${d * 2}`, `${a}/${d}`], tagFor(l));
    return mcq(`${a + b}/${d} − ${b}/${d} = ?`, `${a}/${d}`, [`${a + 1}/${d}`, `${b}/${d}`, `${a}/${d * 2}`], tagFor(l));
  },

  fractionOfShape(p, l) {
    const parts = pick([2, 3, 4, 5, 6, 8]);
    const sh = randInt(1, parts - 1);
    return mcq(`A shape is split into ${parts} equal parts and ${sh} are shaded. What fraction is shaded?`,
      `${sh}/${parts}`, [`${parts}/${sh}`, `${sh}/${parts + 1}`, `${sh + 1}/${parts}`], tagFor(l),
      { hint: 'Top = shaded parts, bottom = total parts.' });
  },

  compareFractions(p, l) {
    const d = pick([3, 4, 5, 6, 8]);
    let a = randInt(1, d - 1), b = randInt(1, d - 1);
    while (b === a) b = randInt(1, d - 1);
    const bigger = a > b ? `${a}/${d}` : `${b}/${d}`;
    const smaller = a > b ? `${b}/${d}` : `${a}/${d}`;
    return mcq(`Which is bigger:  ${a}/${d}  or  ${b}/${d}?`, bigger, [smaller], tagFor(l),
      { hint: 'Same bottom number — the bigger top is bigger.' });
  },

  simplifyFractions(p, l) {
    const base = pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5]]);
    const m = randInt(2, 4);
    const n = base[0] * m, d = base[1] * m;
    return mcq(`Write ${n}/${d} in its simplest form.`, `${base[0]}/${base[1]}`,
      [`${n}/${d}`, `${base[0]}/${d}`, `${n}/${base[1]}`], tagFor(l),
      { hint: 'Divide the top and bottom by the same number.' });
  },

  decimalAddSub(p, l) {
    if (Math.random() < 0.5) {
      const a = randInt(1, 8), b = randInt(1, 9 - a);
      return mcq(`0.${a} + 0.${b} = ?`, `0.${a + b}`, [`0.${a + b + 1 > 9 ? 9 : a + b + 1}`, `0.${Math.max(0, a + b - 1)}`, `${a + b}`], tagFor(l));
    }
    const a = randInt(3, 9), b = randInt(1, a - 1);
    return mcq(`0.${a} − 0.${b} = ?`, `0.${a - b}`, [`0.${a - b + 1}`, `0.${Math.max(0, a - b - 1)}`, `0.${a}`], tagFor(l));
  },

  hundredths(p, l) {
    const n = randInt(1, 9);
    if (Math.random() < 0.5) return mcq(`What is ${n} hundredths as a decimal?`, `0.0${n}`, [`0.${n}`, `0.00${n}`, `${n}`], tagFor(l));
    const t = randInt(1, 9);
    return mcq(`In 0.${t}${n}, what is the ${n} worth?`, `${n} hundredths`, [`${n} tenths`, `${n} ones`, `${n} tens`], tagFor(l));
  },

  improperMixed(p, l) {
    const d = pick([2, 3, 4]), whole = randInt(1, 3), num = randInt(1, d - 1);
    const improper = whole * d + num;
    if (Math.random() < 0.5) return mcq(`How many whole ones are in ${improper}/${d}?`, `${whole}`, near(whole, { spread: 2, min: 0 }), tagFor(l));
    return mcq(`${improper}/${d} as a mixed number is…`, `${whole} ${num}/${d}`,
      [`${whole} ${d}/${num}`, `${whole + 1} ${num}/${d}`, `${num}/${d}`], tagFor(l));
  },

  percentOfAmount(p, l) {
    const map = [[50, 2], [25, 4], [10, 10], [20, 5]];
    const [pct, div] = pick(map);
    const amount = div * randInt(2, 8), ans = amount / div;
    return mcq(`What is ${pct}% of ${amount}?`, `${ans}`, near(ans, { spread: 3, min: 0 }), tagFor(l),
      { hint: `${pct}% means ${pct} out of every 100.` });
  },

  rounding(p, l) {
    const to = pick(p.to);
    const n = randInt(to + 1, to * 9 + 7);
    const ans = Math.round(n / to) * to;
    return mcq(`Round ${n} to the nearest ${to}.`, ans, [ans + to, ans - to, ans + Math.floor(to / 2)], tagFor(l));
  },

  romanNumerals(p, l) {
    const map = [[1, 'I'], [4, 'IV'], [5, 'V'], [9, 'IX'], [10, 'X'], [14, 'XIV'], [19, 'XIX'], [20, 'XX'], [40, 'XL'], [50, 'L'], [90, 'XC'], [100, 'C']];
    const [num, rom] = pick(map);
    if (Math.random() < 0.5) return mcq(`What is ${rom} as a number?`, num, near(num, { spread: 3, min: 1 }), tagFor(l));
    const wrong = shuffle(map.filter(([n2]) => n2 !== num)).slice(0, 3).map((x) => x[1]);
    return mcq(`Write ${num} in Roman numerals.`, rom, wrong, tagFor(l));
  },

  negativeNumbers(p, l) {
    if (Math.random() < 0.5) {
      const a = randInt(1, 5), drop = randInt(a + 1, a + 6);
      return mcq(`The temperature is ${a}°C and falls ${drop}°C. What is it now?`, `${a - drop}°C`,
        [`${a - drop + 1}°C`, `${drop - a}°C`, `${a - drop - 1}°C`], tagFor(l));
    }
    const a = randInt(1, 4), b = randInt(a + 1, a + 6);
    return mcq(`${a} − ${b} = ?`, a - b, [a - b + 1, a - b - 1, b - a], tagFor(l));
  },

  decimalsIntro(p, l) {
    const t = randInt(1, 9);
    if (Math.random() < 0.5) return mcq(`What is ${t} tenths as a decimal?`, `0.${t}`, [`${t}.0`, `0.0${t}`, `${t}`], tagFor(l));
    return mcq(`How many tenths is 0.${t}?`, t, near(t, { spread: 2, min: 1 }), tagFor(l));
  },

  decimalFractionMatch(p, l) {
    const map = [['0.5', '1/2'], ['0.25', '1/4'], ['0.75', '3/4'], ['0.1', '1/10'], ['0.2', '1/5']];
    const [dec, frac] = pick(map);
    const wrong = shuffle(map.filter((m) => m[1] !== frac)).slice(0, 3).map((m) => m[1]);
    return mcq(`Which fraction equals ${dec}?`, frac, wrong, tagFor(l));
  },

  factorsMultiples(p, l) {
    if (Math.random() < 0.5) {
      const base = pick([12, 18, 20, 24]);
      const factors = []; for (let i = 1; i <= base; i++) if (base % i === 0) factors.push(i);
      const ans = pick(factors.filter((f) => f > 1 && f < base));
      const nonF = []; for (let i = 2; i < base; i++) if (base % i !== 0) nonF.push(i);
      return mcq(`Which of these is a factor of ${base}?`, ans, shuffle(nonF).slice(0, 3), tagFor(l));
    }
    const base = pick([3, 4, 6, 7]);
    const ans = base * randInt(2, 6);
    const wrong = [ans + 1, ans - 1, ans + 2].filter((x) => x % base !== 0);
    return mcq(`Which of these is a multiple of ${base}?`, ans, wrong, tagFor(l));
  },

  primes(p, l) {
    const primesList = [2, 3, 5, 7, 11, 13, 17, 19], comps = [4, 6, 8, 9, 10, 12, 14, 15, 16];
    const ans = pick(primesList);
    return mcq('Which of these is a prime number?', ans, shuffle(comps).slice(0, 3), tagFor(l),
      { hint: 'A prime has exactly two factors: 1 and itself.' });
  },

  squareCube(p, l) {
    if (Math.random() < 0.5) {
      const n = randInt(2, 9);
      return mcq(`What is ${n} squared (${n}²)?`, n * n, [n * n + 1, n * 2, n * n - 1], tagFor(l));
    }
    const n = randInt(2, 4);
    return mcq(`What is ${n} cubed (${n}³)?`, n * n * n, [n * n, n * 3, n * n * n + 1], tagFor(l));
  },

  orderOfOperations(p, l) {
    const a = randInt(2, 6), b = randInt(2, 6), c = randInt(2, 6);
    return mcq(`Work it out:  ${a} + ${b} × ${c} = ?`, a + b * c,
      [(a + b) * c, a + b + c, a * b + c], tagFor(l), { hint: 'Do × before +.' });
  },

  fdpConversion(p, l) {
    const map = [['1/2', '50'], ['1/4', '25'], ['3/4', '75'], ['1/10', '10'], ['1/5', '20']];
    const [frac, pct] = pick(map);
    if (Math.random() < 0.5) return mcq(`What is ${frac} as a percentage?`, `${pct}%`, [`${+pct + 5}%`, `${+pct - 5}%`, `${+pct * 2}%`], tagFor(l));
    return mcq(`What is ${pct}% as a fraction?`, frac, shuffle(map.filter((m) => m[1] !== pct)).slice(0, 3).map((m) => m[0]), tagFor(l));
  },

  ratio(p, l) {
    const r1 = randInt(1, 3), r2 = randInt(1, 4), mult = randInt(2, 4);
    return mcq(`Mix ${r1} red for every ${r2} blue. For ${r1 * mult} red, how many blue?`,
      r2 * mult, near(r2 * mult, { spread: 2, min: 1 }), tagFor(l));
  },

  proportion(p, l) {
    const n = randInt(2, 5), cost = n * randInt(2, 6), mult = randInt(2, 3);
    return mcq(`${n} pencils cost ${cost}p. How much do ${n * mult} pencils cost?`,
      `${cost * mult}p`, [`${cost * mult + 5}p`, `${cost * mult - 5}p`, `${cost + mult}p`], tagFor(l));
  },

  algebra(p, l) {
    const x = randInt(2, 9);
    const variants = [
      [`If x = ${x}, what is x + 5?`, x + 5],
      [`If x = ${x}, what is 2x?`, 2 * x],
      [`If x = ${x}, what is x − 1?`, x - 1],
      ['Simplify: a + a + a', '3a']
    ];
    const [q, a] = pick(variants);
    if (a === '3a') return mcq(q, a, ['a3', '3+a', 'aaa'], tagFor(l));
    return mcq(q, a, near(Number(a), { spread: 3, min: 0 }), tagFor(l));
  },

  sequences(p, l) {
    const step = pick([2, 3, 4, 5, 10]);
    const start = randInt(1, 6);
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    if (Math.random() < 0.5) {
      const ans = start + 4 * step;
      return mcq(`What comes next?  ${seq.join(', ')}, ?`, ans, [ans - step, ans + step, ans + 1], tagFor(l, 'sequences'));
    }
    const ans = seq[2];
    return mcq(`Find the missing number:  ${seq[0]}, ${seq[1]}, ?, ${seq[3]}`, ans, [ans - step, ans + step, ans + 1], tagFor(l, 'missing-number'));
  },

  perimeterArea(p, l) {
    const w = randInt(2, 9), h = randInt(2, 9);
    if (Math.random() < 0.5) return mcq(`A rectangle is ${w} cm by ${h} cm. What is its perimeter?`,
      `${2 * (w + h)} cm`, [`${w * h} cm`, `${2 * (w + h) + 2} cm`, `${w + h} cm`], tagFor(l, 'perimeter'));
    return mcq(`A rectangle is ${w} cm by ${h} cm. What is its area?`,
      `${w * h} cm²`, [`${2 * (w + h)} cm²`, `${w * h + w} cm²`, `${w + h} cm²`], tagFor(l, 'area'));
  },

  angles(p, l) {
    const variants = [
      ['What do we call an angle of exactly 90°?', 'right angle', ['acute angle', 'obtuse angle', 'straight angle']],
      ['What do we call an angle smaller than 90°?', 'acute angle', ['right angle', 'obtuse angle', 'reflex angle']],
      ['What do we call an angle between 90° and 180°?', 'obtuse angle', ['acute angle', 'right angle', 'straight angle']],
      ['Lines that stay the same distance apart and never meet are…', 'parallel', ['perpendicular', 'curved', 'diagonal']],
      ['Lines that meet at a right angle are…', 'perpendicular', ['parallel', 'acute', 'obtuse']]
    ];
    const [q, a, d] = pick(variants);
    return mcq(q, a, d, tagFor(l, a.includes('angle') ? 'angles' : 'lines'));
  },

  anglesMissing(p, l) {
    if (Math.random() < 0.5) {
      const a = randInt(20, 160);
      return mcq(`Angles on a straight line add to 180°. One angle is ${a}°. What is the other?`,
        `${180 - a}°`, [`${180 - a + 10}°`, `${180 - a - 10}°`, `${a}°`], tagFor(l));
    }
    const a = randInt(30, 80), b = randInt(30, 80);
    return mcq(`Two angles in a triangle are ${a}° and ${b}°. What is the third? (angles add to 180°)`,
      `${180 - a - b}°`, [`${180 - a - b + 10}°`, `${180 - a - b - 10}°`, `${a + b}°`], tagFor(l));
  },

  coordinates(p, l) {
    const x = randInt(0, 6), y = randInt(0, 6);
    const variants = [
      [`A point is at (${x}, ${y}). What is the x-coordinate (across)?`, `${x}`, near(x, { spread: 2, min: 0 })],
      [`A point is at (${x}, ${y}). What is the y-coordinate (up)?`, `${y}`, near(y, { spread: 2, min: 0 })],
      [`Start at (0, 0). Move right ${x} and up ${y}. Where are you?`, `(${x}, ${y})`, [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y + 1})`]]
    ];
    const [q, a, d] = pick(variants);
    return mcq(q, a, d, tagFor(l, 'coordinates'));
  },

  averages(p, l) {
    const set = Array.from({ length: 3 }, () => randInt(1, 9));
    const sorted = [...set].sort((a, b) => a - b);
    const variants = [
      [`What is the mean of ${set.join(', ')}?`, String(Math.round(set.reduce((s, n) => s + n, 0) / set.length))],
      [`What is the range of ${set.join(', ')}?`, String(Math.max(...set) - Math.min(...set))],
      [`What is the median (middle) of ${set.join(', ')}?`, String(sorted[1])]
    ];
    const [q, a] = pick(variants);
    return mcq(q, a, near(Number(a), { spread: 2, min: 0 }), tagFor(l));
  },

  mixedArithmetic(p, l) {
    const op = pick(['+', '-', '×', '÷']);
    if (op === '+') { const a = randInt(10, p.max), b = randInt(10, p.max); return input(`${a} + ${b} = ?`, a + b, tagFor(l)); }
    if (op === '-') { const a = randInt(20, p.max), b = randInt(1, a); return input(`${a} − ${b} = ?`, a - b, tagFor(l)); }
    if (op === '×') { const a = randInt(2, 12), b = randInt(2, 12); return input(`${a} × ${b} = ?`, a * b, tagFor(l)); }
    const b = randInt(2, 9), q = randInt(2, 12); return input(`${b * q} ÷ ${b} = ?`, q, tagFor(l));
  },

  staticMCQ(p, l) {
    const pool = STATIC[p.pool] || [];
    const item = pick(pool);
    return mcq(item.q, item.answer, item.options.filter((o) => o !== item.answer), tagFor(l));
  }
};

// --- static question pools for topics that need fixed facts -------------------
const STATIC = {
  '2d-shapes': [
    { q: 'How many sides does a triangle have?', answer: '3', options: ['3', '4', '5', '6'] },
    { q: 'How many sides does a square have?', answer: '4', options: ['4', '3', '5', '6'] },
    { q: 'A shape with no corners and one curved side is a…', answer: 'circle', options: ['circle', 'square', 'triangle', 'rectangle'] },
    { q: 'How many corners (vertices) does a rectangle have?', answer: '4', options: ['4', '3', '5', '2'] },
    { q: 'Which shape has 5 sides?', answer: 'pentagon', options: ['pentagon', 'hexagon', 'square', 'triangle'] },
    { q: 'Which shape has 6 sides?', answer: 'hexagon', options: ['hexagon', 'pentagon', 'octagon', 'triangle'] }
  ],
  '3d-shapes': [
    { q: 'How many faces does a cube have?', answer: '6', options: ['6', '4', '8', '12'] },
    { q: 'A ball is shaped like a…', answer: 'sphere', options: ['sphere', 'cube', 'cone', 'cylinder'] },
    { q: 'An ice-cream cone is shaped like a…', answer: 'cone', options: ['cone', 'sphere', 'cube', 'cuboid'] },
    { q: 'A tin of beans is shaped like a…', answer: 'cylinder', options: ['cylinder', 'cube', 'sphere', 'pyramid'] },
    { q: 'How many edges does a cube have?', answer: '12', options: ['12', '6', '8', '4'] },
    { q: 'How many vertices (corners) does a cube have?', answer: '8', options: ['8', '6', '12', '4'] }
  ],
  'position-direction': [
    { q: 'If you turn all the way around once, that is a…', answer: 'full turn', options: ['full turn', 'half turn', 'quarter turn', 'no turn'] },
    { q: 'A quarter turn is the same as a…', answer: 'right angle', options: ['right angle', 'straight line', 'full circle', 'half turn'] },
    { q: 'Which word means the opposite of "left"?', answer: 'right', options: ['right', 'up', 'down', 'forward'] },
    { q: 'If something is "between" two boxes, it is…', answer: 'in the middle', options: ['in the middle', 'on top', 'far away', 'behind'] },
    { q: 'Turning to face the opposite way is a…', answer: 'half turn', options: ['half turn', 'quarter turn', 'full turn', 'tiny turn'] },
    { q: 'Which direction is the opposite of "up"?', answer: 'down', options: ['down', 'left', 'right', 'forward'] },
    { q: 'A clockwise quarter turn from facing North points you…', answer: 'East', options: ['East', 'West', 'South', 'North'] },
    { q: 'If you stand behind someone, they are ___ you.', answer: 'in front of', options: ['in front of', 'below', 'beside', 'under'] }
  ],
  'regrouping-concept': [
    { q: 'You can trade 10 ones for how many tens?', answer: '1 ten', options: ['1 ten', '10 tens', '2 tens', '5 tens'] },
    { q: 'How many ones are the same as 1 ten?', answer: '10', options: ['10', '1', '5', '100'] },
    { q: 'When a column adds to more than 9, you must…', answer: 'carry to the next column', options: ['carry to the next column', 'stop', 'cross it out', 'add zero'] },
    { q: '13 ones is the same as 1 ten and…', answer: '3 ones', options: ['3 ones', '1 one', '13 tens', '0 ones'] },
    { q: 'How many tens make 100?', answer: '10', options: ['10', '100', '1', '5'] },
    { q: 'When you subtract and the top digit is too small, you must…', answer: 'borrow from the next column', options: ['borrow from the next column', 'stop', 'add 10 to the answer', 'swap the digits'] },
    { q: '24 ones is the same as 2 tens and…', answer: '4 ones', options: ['4 ones', '2 ones', '24 tens', '6 ones'] }
  ],
  'symmetry': [
    { q: 'A line of symmetry splits a shape into two…', answer: 'matching halves', options: ['matching halves', 'big and small parts', 'three pieces', 'circles'] },
    { q: 'How many lines of symmetry does a square have?', answer: '4', options: ['4', '1', '2', '0'] },
    { q: 'Sliding a shape without turning it is called a…', answer: 'translation', options: ['translation', 'reflection', 'rotation', 'symmetry'] },
    { q: 'Flipping a shape over a line is called a…', answer: 'reflection', options: ['reflection', 'translation', 'rotation', 'sliding'] },
    { q: 'How many lines of symmetry does a circle have?', answer: 'lots (infinite)', options: ['lots (infinite)', '1', '2', '4'] },
    { q: 'How many lines of symmetry does a (non-square) rectangle have?', answer: '2', options: ['2', '1', '4', '0'] },
    { q: 'Turning a shape around a point is called a…', answer: 'rotation', options: ['rotation', 'reflection', 'translation', 'symmetry'] }
  ]
};

/**
 * Build an exercise set for a lesson.
 * @param {object} lesson - a lesson from curriculum.js
 * @param {number} count - how many questions
 * @returns {Array} questions, each with a unique `qid`
 */
export function generateSet(lesson, count = 6) {
  const gen = GEN[lesson.generator] || GEN.staticMCQ;
  const out = [];
  const seen = new Set();
  // A question is "the same" only if prompt AND answer AND options match — so
  // generators that reuse a prompt with different answers (e.g. primes) count
  // as distinct questions.
  const sig = (q) => `${q.prompt}|${q.answer}|${q.options ? q.options.join(',') : ''}`;

  let guard = 0;
  while (out.length < count && guard++ < count * 10) {
    let q;
    try { q = gen(lesson.params || {}, lesson); } catch (e) { continue; }
    if (!q || !q.prompt) continue;
    const s = sig(q);
    if (seen.has(s)) continue;
    seen.add(s);
    out.push({ ...q, qid: `${lesson.id}-${out.length}` });
  }
  // If the generator's question space is smaller than `count`, top up with
  // repeats so the set is always full (repetition is fine for practice).
  guard = 0;
  while (out.length < count && guard++ < count * 6) {
    let q;
    try { q = gen(lesson.params || {}, lesson); } catch (e) { continue; }
    if (q && q.prompt) out.push({ ...q, qid: `${lesson.id}-${out.length}` });
  }
  return out;
}

export function hasGenerator(name) {
  return Boolean(GEN[name]);
}
