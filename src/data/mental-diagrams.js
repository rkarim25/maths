// =============================================================================
// Visual diagrams for the mental-maths tricks where a picture really helps.
// getMentalDiagram(methodId) → { svg, caption } or null. Same flat, child-
// friendly SVG style as data/diagrams.js (class "concept-svg").
// =============================================================================

const PINK = '#FF6B9D', TEAL = '#4ECDC4', GOLD = '#FFD93D', GREEN = '#63C779', PURPLE = '#A78BFA';
const INK = '#333', RED = '#E24B4A', LINE = '#9a8f86', GREY = '#cfc8c2';
const FONT = 'font-family="Fredoka, Nunito, sans-serif"';

const esc = (s) => String(s == null ? '' : s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const svg = (w, h, inner, title) =>
  `<svg class="concept-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(title)}</title>${inner}</svg>`;
const t = (x, y, s, size = 18, fill = INK, anchor = 'middle', weight = 700) =>
  `<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
const ln = (x1, y1, x2, y2, stroke = LINE, w = 3) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"/>`;
const box = (x, y, w, h, fill, txt, txtFill = '#fff', size = 24) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}"/>` + t(x + w / 2, y + h / 2 + size / 3, txt, size, txtFill);

// --- number line with hops above (make-ten, count-up, either-side) -----------
function numberLine(min, max, marks, hops, title, w = 380) {
  const x0 = 34, x1 = w - 20, span = (max - min) || 1, axisY = 112;
  const X = (v) => x0 + ((v - min) / span) * (x1 - x0);
  let inner = ln(x0, axisY, x1, axisY, LINE, 3) +
    `<polygon points="${x1},${axisY} ${x1 - 11},${axisY - 5} ${x1 - 11},${axisY + 5}" fill="${LINE}"/>`;
  marks.forEach((m) => { const x = X(m); inner += ln(x, axisY - 6, x, axisY + 6, LINE, 2) + t(x, axisY + 26, String(m), 15, INK); });
  hops.forEach((h) => {
    const xa = X(h.from), xb = X(h.to), mid = (xa + xb) / 2;
    inner += `<path d="M ${xa} ${axisY - 6} Q ${mid} 54 ${xb} ${axisY - 6}" fill="none" stroke="${h.color}" stroke-width="3"/>`;
    inner += `<polygon points="${xb},${axisY - 6} ${xb - 6},${axisY - 15} ${xb + 6},${axisY - 15}" fill="${h.color}"/>`;
    inner += t(mid, 46, h.label, 15, h.color);
  });
  return svg(w, 150, inner, title);
}

// --- the 9× finger trick -----------------------------------------------------
function nineFingers() {
  const W = 372, fold = 2, x0 = 26, bw = 20; let inner = '';
  const xat = (i) => x0 + i * 30 + (i > fold ? 18 : 0);
  for (let i = 0; i < 10; i++) {
    const x = xat(i), folded = i === fold;
    const y = folded ? 86 : 34, h = folded ? 20 : 72;
    inner += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="9" fill="${folded ? GREY : GOLD}" stroke="${folded ? '#a9a29b' : '#e0b400'}" stroke-width="2"/>`;
  }
  inner += t(xat(fold) + bw / 2, 78, 'fold #3', 12, RED);
  const leftC = (xat(0) + xat(fold - 1) + bw) / 2;
  const rightC = (xat(fold + 1) + xat(9) + bw) / 2;
  inner += t(leftC, 134, '2', 26, PINK) + t(leftC, 152, 'tens', 13, INK);
  inner += t(rightC, 134, '7', 26, TEAL) + t(rightC, 152, 'ones', 13, INK);
  return svg(W, 162, inner, '9 times finger trick');
}

// --- ×11 add the neighbours (2- and 3-digit) ---------------------------------
function eleven(digits, mids) {
  // digits: array of strings to show in boxes; mids: array of {i, label} sum hints over box i
  const n = digits.length, bw = 54, gap = 14, x0 = 30, y = 74, W = x0 * 2 + n * bw + (n - 1) * gap;
  let inner = '';
  digits.forEach((d, i) => {
    const x = x0 + i * (bw + gap);
    const isMid = mids.some((m) => m.i === i);
    inner += box(x, y, bw, bw, isMid ? GOLD : (i === 0 || i === n - 1 ? PINK : GOLD), d, isMid ? '#333' : '#fff', 24);
  });
  mids.forEach((m) => { const x = x0 + m.i * (bw + gap) + bw / 2; inner += t(x, 52, m.label, 13, INK); });
  return svg(W, 150, inner, 'multiply by 11');
}

// --- generic two-part product (ones-make-ten, square-5) ----------------------
function twoPart(headline, leftTxt, rightTxt, answer, caption) {
  const W = 330; let inner = '';
  inner += t(W / 2, 42, headline, 22, INK);
  inner += box(28, 66, 130, 52, PINK, leftTxt, '#fff', 17);
  inner += box(172, 66, 130, 52, TEAL, rightTxt, '#fff', 17);
  inner += t(W / 2, 156, '→ ' + answer, 24, INK);
  return svg(W, 176, inner, caption || headline);
}

// --- "all from 9, last from 10" columns (subtract from 100 / 1000) -----------
function complementCols(base, n) {
  const digits = String(n).split('');
  const baseDigits = String(base).length - 1; // 100 -> 2 working digits, 1000 -> 3
  const res = String(base - n).padStart(baseDigits, '0').split('');
  const W = 80 + digits.length * 70; let inner = '';
  inner += t(W / 2, 38, `${base} − ${n}`, 22, INK);
  digits.forEach((d, i) => {
    const x = 60 + i * 70, last = i === digits.length - 1;
    inner += t(x, 78, d, 22, INK);
    inner += t(x, 100, last ? 'from 10' : 'from 9', 12, RED);
    inner += `<rect x="${x - 24}" y="116" width="48" height="40" rx="8" fill="${TEAL}"/>` + t(x, 144, res[i] || '0', 22, '#fff');
  });
  return svg(W, 176, inner, `subtract from ${base}`);
}

// --- multiply near 100 (Vedic Nikhilam) --------------------------------------
function near100() {
  const W = 380; let inner = '';
  inner += t(78, 52, '97', 26, INK) + t(150, 52, '→ 100 − 3', 13, RED);
  inner += t(78, 100, '96', 26, INK) + t(150, 100, '→ 100 − 4', 13, RED);
  inner += ln(112, 48, 150, 96, LINE, 2) + ln(112, 96, 150, 48, LINE, 2); // crosswise
  inner += box(238, 30, 120, 40, PINK, '97 − 4 = 93', '#fff', 16);
  inner += box(238, 82, 120, 40, TEAL, '3 × 4 = 12', '#fff', 16);
  inner += t(W / 2, 158, '→ 9312', 24, INK);
  return svg(W, 176, inner, 'multiply near 100');
}

// --- doubling & halving ------------------------------------------------------
function doubleHalve() {
  const W = 340; let inner = '';
  inner += t(86, 52, '16 × 5', 24, INK);
  inner += t(60, 96, '÷2', 14, PINK) + t(150, 96, '×2', 14, TEAL);
  inner += t(86, 120, '8 × 10', 24, INK);
  inner += `<path d="M 60 60 Q 40 88 60 110" fill="none" stroke="${PINK}" stroke-width="2.5"/>`;
  inner += `<path d="M 132 60 Q 152 88 132 110" fill="none" stroke="${TEAL}" stroke-width="2.5"/>`;
  inner += t(250, 96, '= 80', 26, GREEN);
  return svg(W, 150, inner, 'doubling and halving');
}

// --- Gauss pairing sum -------------------------------------------------------
function gauss() {
  const W = 400, x0 = 30, step = (W - 60) / 9, y = 124; let inner = '';
  for (let i = 1; i <= 10; i++) inner += t(x0 + (i - 1) * step, y, String(i), 17, INK);
  const pairs = [[1, 10], [2, 9], [3, 8], [4, 7], [5, 6]];
  const colors = [PINK, TEAL, GOLD, GREEN, PURPLE];
  pairs.forEach((p, k) => {
    const xa = x0 + (p[0] - 1) * step, xb = x0 + (p[1] - 1) * step, mid = (xa + xb) / 2, peak = 104 - (k + 1) * 17;
    inner += `<path d="M ${xa} ${y - 16} Q ${mid} ${peak} ${xb} ${y - 16}" fill="none" stroke="${colors[k]}" stroke-width="2.5"/>`;
    inner += t(mid, peak - 2, '11', 12, colors[k]);
  });
  inner += t(W / 2, 152, '5 pairs × 11 = 55', 16, INK);
  return svg(W, 168, inner, 'Gauss pairing');
}

const DIAGRAMS = {
  'make-ten': () => ({ svg: numberLine(0, 14, [8, 10, 13], [{ from: 8, to: 10, label: '+2', color: PINK }, { from: 10, to: 13, label: '+3', color: TEAL }], 'make ten'), caption: '8 + 5: jump to 10 first (+2), then add the rest (+3) → 13.' }),
  'count-up': () => ({ svg: numberLine(0, 14, [7, 10, 12], [{ from: 7, to: 10, label: '+3', color: PINK }, { from: 10, to: 12, label: '+2', color: TEAL }], 'count up'), caption: '12 − 7: count up from 7 — the hops are 3 + 2 = 5.' }),
  'either-side': () => ({ svg: numberLine(44, 56, [48, 50, 52], [{ from: 50, to: 48, label: '−2', color: PINK }, { from: 50, to: 52, label: '+2', color: TEAL }], 'either side'), caption: '48 and 52 sit 2 either side of 50 → 50² − 2² = 2496.' }),
  'nine-fingers': () => ({ svg: nineFingers(), caption: 'For 9 × 3, fold the 3rd finger: 2 fingers before (tens), 7 after (ones) → 27.' }),
  'trachtenberg-11': () => ({ svg: eleven(['3', '8', '5'], [{ i: 1, label: '3+5' }]), caption: '35 × 11: keep the outside digits, the middle is 3 + 5 = 8 → 385.' }),
  'eleven-3': () => ({ svg: eleven(['3', '8', '7', '2'], [{ i: 1, label: '3+5' }, { i: 2, label: '5+2' }]), caption: '352 × 11: add each pair of neighbours → 3 | 8 | 7 | 2 = 3872.' }),
  'ones-make-ten': () => ({ svg: twoPart('43 × 47', '4 × 5 = 20', '3 × 7 = 21', '2021', 'tens match, ones make ten'), caption: 'Tens are the same (4) and ones add to 10 (3 + 7).' }),
  'square-5': () => ({ svg: twoPart('35 × 35', '3 × 4 = 12', '5 × 5 = 25', '1225', 'squaring a number ending in 5'), caption: 'Tens digit × the next number up (3×4), then stick 25 on the end.' }),
  'complements': () => ({ svg: complementCols(100, 37), caption: 'Each digit from 9, the last from 10 → 63.' }),
  'from-1000': () => ({ svg: complementCols(1000, 457), caption: 'Each digit from 9, the last from 10 → 543.' }),
  'near-100': () => ({ svg: near100(), caption: 'Gaps from 100 cross over: 97 − 4 = 93, then 3 × 4 = 12 → 9312.' }),
  'double-halve': () => ({ svg: doubleHalve(), caption: 'Halve one, double the other: 16 × 5 becomes the easy 8 × 10.' }),
  'gauss-sum': () => ({ svg: gauss(), caption: 'Pair the ends — each pair makes 11, and there are 5 pairs → 55.' })
};

export function getMentalDiagram(methodId) {
  const make = DIAGRAMS[methodId];
  return make ? make() : null;
}
