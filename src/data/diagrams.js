// =============================================================================
// Visual concept diagrams. Each builder returns a flat, child-friendly SVG
// string. getDiagramFor(lesson) returns { svg, caption } for the lesson's
// concept, or null. Used in the Explain view and the printable Lesson sheet so
// Liyana can SEE what addition, sharing, fractions, place value… actually mean.
// =============================================================================

const PINK = '#FF6B9D', TEAL = '#4ECDC4', GOLD = '#FFD93D', GREEN = '#63C779';
const INK = '#333', RED = '#E24B4A', LINE = '#9a8f86', PALE = '#F5E6D9';
const FONT = 'font-family="Fredoka, Nunito, sans-serif"';

const esc = (s) => String(s == null ? '' : s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const svg = (w, h, inner, title) =>
  `<svg class="concept-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(title)}</title>${inner}</svg>`;
const t = (x, y, s, size = 20, fill = INK, anchor = 'middle') =>
  `<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="700" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

function countObjects(n) {
  let inner = '';
  const r = 15, gap = 36, x0 = 30, y0 = 38;
  for (let i = 0; i < n; i++) {
    const c = i % 10, row = Math.floor(i / 10);
    const x = x0 + c * gap, y = y0 + row * gap;
    inner += dot(x, y, r, PINK) + t(x, y + 5, String(i + 1), 14, '#fff');
  }
  const cols = Math.min(n, 10), rows = Math.ceil(n / 10);
  return svg(Math.max(x0 * 2 + (cols - 1) * gap, 240), y0 + rows * gap + 8, inner, 'counting');
}

function addition(a, b) {
  const r = 12, gap = 28, y = 42; let x = 24, inner = '';
  for (let i = 0; i < a; i++) { inner += dot(x, y, r, PINK); x += gap; }
  inner += t(x + 4, y + 7, '+', 26); x += 30;
  for (let i = 0; i < b; i++) { inner += dot(x, y, r, TEAL); x += gap; }
  inner += t(x + 6, y + 7, '=', 26); x += 32;
  inner += t(x + 14, y + 9, String(a + b), 30, PINK); x += 44;
  inner += t(x / 2, 92, `${a} + ${b} = ${a + b}`, 22, INK);
  return svg(x, 108, inner, 'addition');
}

function subtraction(total, take) {
  const r = 12, gap = 28, y = 42; let x = 24, inner = '';
  for (let i = 0; i < total; i++) {
    const gone = i >= total - take;
    inner += dot(x, y, r, gone ? '#f2cdcd' : TEAL);
    if (gone) inner += `<line x1="${x - 10}" y1="${y - 10}" x2="${x + 10}" y2="${y + 10}" stroke="${RED}" stroke-width="3"/><line x1="${x + 10}" y1="${y - 10}" x2="${x - 10}" y2="${y + 10}" stroke="${RED}" stroke-width="3"/>`;
    x += gap;
  }
  inner += t(x / 2, 92, `${total} − ${take} = ${total - take}`, 22, INK);
  return svg(x + 12, 108, inner, 'subtraction');
}

function numberBond(whole, p1, p2) {
  const inner =
    `<line x1="160" y1="56" x2="92" y2="120" stroke="${LINE}" stroke-width="3"/>` +
    `<line x1="160" y1="56" x2="228" y2="120" stroke="${LINE}" stroke-width="3"/>` +
    `<circle cx="160" cy="40" r="34" fill="${GOLD}"/>` + t(160, 48, String(whole), 26, INK) +
    `<circle cx="92" cy="150" r="30" fill="${PINK}"/>` + t(92, 158, String(p1), 24, '#fff') +
    `<circle cx="228" cy="150" r="30" fill="${TEAL}"/>` + t(228, 158, String(p2), 24, '#fff');
  return svg(320, 196, inner, 'number bond');
}

function placeValue(tens, ones) {
  let inner = '', x = 24;
  for (let i = 0; i < tens; i++) {
    inner += `<rect x="${x}" y="24" width="22" height="200" rx="3" fill="${TEAL}" stroke="#2a9d8f"/>`;
    for (let s = 1; s < 10; s++) inner += `<line x1="${x}" y1="${24 + s * 20}" x2="${x + 22}" y2="${24 + s * 20}" stroke="#2a9d8f"/>`;
    x += 30;
  }
  x += 16;
  for (let i = 0; i < ones; i++) { const c = i % 2, r = Math.floor(i / 2); inner += `<rect x="${x + c * 24}" y="${24 + r * 24}" width="20" height="20" rx="3" fill="${GOLD}" stroke="#caa11a"/>`; }
  const w = Math.max(x + 70, 300);
  inner += t(w / 2, 250, `${tens} ten${tens === 1 ? '' : 's'} and ${ones} one${ones === 1 ? '' : 's'} = ${tens * 10 + ones}`, 20, INK);
  return svg(w, 266, inner, 'place value');
}

function arrayMul(rows, cols) {
  const r = 11, gap = 30, x0 = 26, y0 = 26; let inner = '';
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) inner += dot(x0 + j * gap, y0 + i * gap, r, PINK);
  const w = x0 + cols * gap, h = y0 + rows * gap;
  inner += t(w / 2, h + 24, `${rows} × ${cols} = ${rows * cols}`, 20, INK);
  return svg(Math.max(w, 220), h + 36, inner, 'array');
}

function equalGroups(groups, each) {
  let inner = ''; const gw = 92, x0 = 20;
  for (let g = 0; g < groups; g++) {
    const gx = x0 + g * (gw + 10);
    inner += `<rect x="${gx}" y="20" width="${gw}" height="100" rx="14" fill="none" stroke="${TEAL}" stroke-width="3"/>`;
    for (let i = 0; i < each; i++) { const c = i % 2, r = Math.floor(i / 2); inner += dot(gx + 26 + c * 40, 50 + r * 34, 13, PINK); }
  }
  const w = x0 + groups * (gw + 10);
  inner += t(w / 2, 150, `${groups} groups of ${each} = ${groups * each}`, 20, INK);
  return svg(w + 10, 170, inner, 'equal groups');
}

function sharing(total, groups) {
  const each = Math.floor(total / groups); let inner = '';
  const bw = 92, x0 = 20, by = 70;
  for (let g = 0; g < groups; g++) {
    const bx = x0 + g * (bw + 12);
    inner += `<rect x="${bx}" y="${by}" width="${bw}" height="76" rx="12" fill="${PALE}" stroke="${LINE}" stroke-width="2"/>`;
    for (let i = 0; i < each; i++) { const c = i % 2, r = Math.floor(i / 2); inner += dot(bx + 28 + c * 38, by + 24 + r * 28, 12, GREEN); }
  }
  const w = x0 + groups * (bw + 12);
  inner += t(w / 2, 36, `Share ${total} equally`, 18, INK);
  inner += t(w / 2, 172, `${total} ÷ ${groups} = ${each}`, 20, INK);
  return svg(w + 10, 188, inner, 'sharing');
}

function compare(a, b) {
  const sign = a > b ? '>' : a < b ? '<' : '=';
  const ha = Math.min(a, 45) * 2, hb = Math.min(b, 45) * 2;
  const inner =
    `<rect x="46" y="${130 - ha}" width="70" height="${ha}" rx="6" fill="${PINK}"/>` + t(81, 156, String(a), 22) +
    t(160, 96, sign, 44, GOLD) +
    `<rect x="204" y="${130 - hb}" width="70" height="${hb}" rx="6" fill="${TEAL}"/>` + t(239, 156, String(b), 22);
  return svg(320, 176, inner, 'comparing');
}

function numberLine(min, max, highlight) {
  const x0 = 24, x1 = 336, y = 64, n = max - min, step = (x1 - x0) / n;
  let inner = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${LINE}" stroke-width="3"/>`;
  for (let i = 0; i <= n; i++) { const x = x0 + i * step; inner += `<line x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}" stroke="${LINE}" stroke-width="2"/>` + t(x, y + 28, String(min + i), 14); }
  if (highlight != null) inner += dot(x0 + (highlight - min) * step, y, 12, PINK);
  return svg(360, 104, inner, 'number line');
}

function skipCount(step, count) {
  const max = step * count, x0 = 24, x1 = 360, y = 80, sx = (x1 - x0) / max;
  let inner = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${LINE}" stroke-width="3"/>`;
  for (let i = 0; i <= max; i++) { const x = x0 + i * sx, big = i % step === 0; inner += `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y + 6}" stroke="${LINE}" stroke-width="${big ? 2 : 1}"/>`; if (big) inner += t(x, y + 24, String(i), 13); }
  for (let k = 0; k < count; k++) { const xa = x0 + k * step * sx, xb = x0 + (k + 1) * step * sx, mx = (xa + xb) / 2; inner += `<path d="M ${xa} ${y - 4} Q ${mx} ${y - 42} ${xb} ${y - 4}" fill="none" stroke="${PINK}" stroke-width="3"/>`; }
  return svg(384, 116, inner, 'skip counting');
}

function fractionBar(parts, shaded) {
  const x0 = 30, w = 300, h = 70, y = 26, pw = w / parts; let inner = '';
  for (let i = 0; i < parts; i++) inner += `<rect x="${x0 + i * pw}" y="${y}" width="${pw}" height="${h}" fill="${i < shaded ? TEAL : '#fff'}" stroke="${INK}" stroke-width="2"/>`;
  inner += t(x0 + w / 2, y + h + 34, `${shaded} out of ${parts} = ${shaded}/${parts}`, 20, INK);
  return svg(360, 150, inner, 'fraction');
}

function equivalentBars() {
  const x0 = 50, w = 280, h = 50, y1 = 20, y2 = 96; let inner = '';
  inner += `<rect x="${x0}" y="${y1}" width="${w / 2}" height="${h}" fill="${TEAL}" stroke="${INK}" stroke-width="2"/><rect x="${x0 + w / 2}" y="${y1}" width="${w / 2}" height="${h}" fill="#fff" stroke="${INK}" stroke-width="2"/>` + t(x0 - 10, y1 + 32, '1/2', 18, INK, 'end');
  for (let i = 0; i < 4; i++) inner += `<rect x="${x0 + i * w / 4}" y="${y2}" width="${w / 4}" height="${h}" fill="${i < 2 ? TEAL : '#fff'}" stroke="${INK}" stroke-width="2"/>`;
  inner += t(x0 - 10, y2 + 32, '2/4', 18, INK, 'end');
  inner += t(x0 + w / 2, y2 + h + 28, '1/2 and 2/4 are the same amount', 18, INK);
  return svg(360, 196, inner, 'equivalent fractions');
}

function tenthsGrid(shaded) {
  const x0 = 30, sq = 30, y = 26; let inner = '';
  for (let i = 0; i < 10; i++) inner += `<rect x="${x0 + i * sq}" y="${y}" width="${sq}" height="${sq}" fill="${i < shaded ? TEAL : '#fff'}" stroke="${INK}" stroke-width="2"/>`;
  inner += t(x0 + 5 * sq, y + sq + 34, `${shaded} tenths = 0.${shaded}`, 20, INK);
  return svg(x0 * 2 + 10 * sq, 116, inner, 'tenths');
}

function rectangleWH(w, h) {
  const cell = 34, x0 = 44, y0 = 24; let inner = `<rect x="${x0}" y="${y0}" width="${w * cell}" height="${h * cell}" fill="${PALE}" stroke="${INK}" stroke-width="2"/>`;
  for (let i = 1; i < w; i++) inner += `<line x1="${x0 + i * cell}" y1="${y0}" x2="${x0 + i * cell}" y2="${y0 + h * cell}" stroke="${LINE}"/>`;
  for (let j = 1; j < h; j++) inner += `<line x1="${x0}" y1="${y0 + j * cell}" x2="${x0 + w * cell}" y2="${y0 + j * cell}" stroke="${LINE}"/>`;
  inner += t(x0 + w * cell / 2, y0 + h * cell + 22, `${w} cm`, 15) + t(x0 - 12, y0 + h * cell / 2, `${h} cm`, 15, INK, 'end');
  inner += t(x0 + w * cell / 2, y0 + h * cell + 44, `Area = ${w} × ${h} = ${w * h} cm²`, 16, PINK);
  return svg(x0 + w * cell + 30, y0 + h * cell + 56, inner, 'rectangle');
}

const wrap = (svgStr, caption) => ({ svg: svgStr, caption });

/**
 * Pick a concept diagram for a lesson based on its generator + params.
 * Returns { svg, caption } or null.
 */
export function getDiagramFor(lesson) {
  if (!lesson) return null;
  const g = lesson.generator, p = lesson.params || {};
  switch (g) {
    case 'countObjects': return wrap(countObjects(7), 'Touch and say one number for each object — that is counting.');
    case 'numberSequence': return wrap(numberLine(0, 10, 5), 'Numbers live in order on the number line.');
    case 'oneMoreLess': return wrap(numberLine(0, 10, 5), 'One more is a step right; one less is a step left.');
    case 'numberBonds': { const w = p.total || 10, a = Math.round(w * 0.6); return wrap(numberBond(w, a, w - a), `Two parts join to make ${w}. That is a number bond.`); }
    case 'addition': return wrap(addition(3, 4), 'Adding puts two groups together — then count them all.');
    case 'subtraction': return wrap(subtraction(7, 3), 'Subtracting takes some away — count what is left.');
    case 'compareNumbers': return wrap(compare(34, 29), 'The open mouth of the sign points at the bigger number.');
    case 'placeValue': return wrap(placeValue(4, 7), 'Tens are bundles of ten; ones are singles.');
    case 'skipCounting': return wrap(skipCount((p.steps && p.steps[0]) || 2, 5), 'Skip counting jumps in equal steps.');
    case 'timesTables': return wrap(arrayMul((p.tables && p.tables[0]) || 3, 4), 'A times table is equal rows — count the whole array.');
    case 'multiplicationGroups': return wrap(equalGroups(3, 4), 'Multiplication means equal groups.');
    case 'divisionSharing': return wrap(sharing(12, 3), 'Division shares the total into equal groups.');
    case 'divideColumn': return wrap(sharing(12, 3), 'Division shares the total into equal groups.');
    case 'multiplyColumn': return wrap(arrayMul(3, 4), 'Multiplication is repeated equal rows.');
    case 'fractionsOfAmount': { const parts = p.parts ? Math.max(...p.parts) : 4; return wrap(fractionBar(parts, 1), `A fraction is equal parts of a whole.`); }
    case 'equivalentFractions': return wrap(equivalentBars(), 'Different pieces can show the same amount.');
    case 'addSubtractFractions': return wrap(fractionBar(5, 3), 'Same-size pieces — just count the shaded parts.');
    case 'decimalsIntro': return wrap(tenthsGrid(3), 'Split one whole into ten equal parts: tenths.');
    case 'decimalFractionMatch': return wrap(tenthsGrid(5), 'Five tenths (0.5) is the same as one half.');
    case 'perimeterArea': return wrap(rectangleWH(4, 3), 'Perimeter is the distance around; area is the squares inside.');
    default: return null;
  }
}
