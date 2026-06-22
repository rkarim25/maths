// Learn the times tables — a study/memorise section (separate from the drill).
// Pick a table to see it written out with a tip and read-aloud, or view the
// whole multiplication square.
import { navigateTo } from '../router.js';
import { speak, stopSpeaking } from '../services/tts.js';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TIPS = {
  2: 'Doubles — just add the number to itself.',
  3: 'Each answer’s digits add up to a multiple of 3.',
  4: 'Double, then double again.',
  5: 'Answers end in 5 or 0; they are half of the 10 times table.',
  6: 'Do the 3 times table, then double it.',
  7: 'The tricky one — practise a little every day. 7 × 8 = 56!',
  8: 'Double the 4 times table (or double, double, double).',
  9: 'Multiply by 10, then subtract the number. The digits add up to 9.',
  10: 'Just add a zero on the end.',
  11: 'Up to 9, simply repeat the digit: 11 × 4 = 44.',
  12: 'Multiply by 10, then add the number twice. 12 × 6 = 60 + 12 = 72.'
};

export function renderLearnTables() {
  showMenu();
}

function showMenu() {
  stopSpeaking();
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="practice tt-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>🔢 Learn the Times Tables</h1>
        <p class="lp-objective">Pick a table to study. Read it, say it out loud, then practise it. Little and often is the secret to remembering them all!</p>
      </header>
      <div class="tt-grid">
        ${TABLES.map((t) => `<button class="tt-card" data-table="${t}"><span class="tt-num">${t}×</span><span class="tt-learn-label">Learn</span></button>`).join('')}
        <button class="tt-card tt-mixed" data-grid="1"><span class="tt-num">▦</span><span class="tt-mixed-label">Square</span></button>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.tt-card').forEach((b) => b.addEventListener('click', () => (b.dataset.grid ? showGrid() : showTable(Number(b.dataset.table)))));
}

function showTable(t) {
  stopSpeaking();
  const rows = [];
  for (let n = 1; n <= 12; n++) rows.push(`<div class="tl-row"><span class="tl-eq">${t} × ${n} = <strong>${t * n}</strong></span></div>`);
  const skip = Array.from({ length: 12 }, (_, i) => t * (i + 1)).join(', ');
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="practice tt-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← All tables</button>
        <h1>The ${t} Times Table</h1>
        <p class="lp-objective">💡 ${esc(TIPS[t] || '')}</p>
      </header>
      <div class="tl-card">
        <div class="tl-rows">${rows.join('')}</div>
        <p class="tl-skip">Count in ${t}s: ${skip}</p>
        <div class="lp-footer">
          <button class="secondary-btn" id="speak-btn">🔊 Read it to me</button>
          <button class="primary-btn" id="practise-btn">🎮 Practise the ${t}s</button>
        </div>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', showMenu);
  document.getElementById('practise-btn').addEventListener('click', () => navigateTo('/times-tables'));
  document.getElementById('speak-btn').addEventListener('click', () => {
    speak(Array.from({ length: 12 }, (_, i) => `${t} times ${i + 1} is ${t * (i + 1)}`).join('. '));
  });
}

function showGrid() {
  stopSpeaking();
  let head = '<tr><th>×</th>';
  for (let c = 1; c <= 12; c++) head += `<th>${c}</th>`;
  head += '</tr>';
  let body = '';
  for (let r = 1; r <= 12; r++) {
    body += `<tr><th>${r}</th>`;
    for (let c = 1; c <= 12; c++) body += `<td${r === c ? ' class="tl-diag"' : ''}>${r * c}</td>`;
    body += '</tr>';
  }
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="practice tt-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← All tables</button>
        <h1>Multiplication Square</h1>
        <p class="lp-objective">Every answer from 1×1 to 12×12. Look for patterns — the highlighted diagonal is the square numbers!</p>
      </header>
      <div class="tl-gridwrap"><table class="tl-grid">${head}${body}</table></div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', showMenu);
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
