// Maths & logic puzzles — a chooseable list, then a puzzle with a hint and a
// reveal-answer button (answer + explanation).
import { navigateTo } from '../router.js';
import { getPuzzles, getPuzzle } from '../data/puzzles.js';
import { speak, stopSpeaking } from '../services/tts.js';

const LEVELS = ['Easy', 'Medium', 'Tricky'];

export function renderPuzzles() {
  showList();
}

function showList() {
  stopSpeaking();
  const app = document.getElementById('app');
  if (!app) return;
  const puzzles = getPuzzles();
  const groups = LEVELS.map((lvl) => {
    const items = puzzles.filter((p) => p.level === lvl);
    if (!items.length) return '';
    return `<h2 class="puz-group">${lvl}</h2><div class="puz-list">${items.map((p) => `
      <button class="puz-item" data-id="${p.id}">
        <span class="puz-emoji">${p.emoji}</span>
        <span class="puz-item-title">${esc(p.title)}</span>
        <span class="puz-level ${p.level.toLowerCase()}">${p.level}</span>
      </button>`).join('')}</div>`;
  }).join('');
  app.innerHTML = `
    <div class="puzzles-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>🧩 Maths Puzzles</h1>
        <p class="lp-objective">Brain-teasers and logic puzzles. Pick one, have a good think, then reveal the answer!</p>
      </header>
      ${groups}
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.puz-item').forEach((b) => b.addEventListener('click', () => showPuzzle(b.dataset.id)));
}

function showPuzzle(id) {
  stopSpeaking();
  const p = getPuzzle(id);
  if (!p) { showList(); return; }
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="puzzles-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← All puzzles</button>
        <h1>${p.emoji} ${esc(p.title)}</h1>
        <p class="lp-objective"><span class="puz-level ${p.level.toLowerCase()}">${p.level}</span></p>
      </header>
      <div class="puz-card">
        <p class="puz-question">${esc(p.question)}</p>
        ${p.hint ? `<button class="hint-btn" id="hint-btn">💡 Hint</button><p class="hint-text" id="hint-text" hidden>${esc(p.hint)}</p>` : ''}
        <div class="puz-actions">
          <button class="secondary-btn" id="speak-btn">🔊 Read to me</button>
          <button class="primary-btn" id="reveal-btn">Show answer</button>
        </div>
        <div id="answer-area"></div>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', showList);
  document.getElementById('speak-btn').addEventListener('click', () => speak(p.question));
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) hintBtn.addEventListener('click', () => { document.getElementById('hint-text').hidden = false; hintBtn.disabled = true; });
  document.getElementById('reveal-btn').addEventListener('click', () => {
    document.getElementById('answer-area').innerHTML = `
      <div class="puz-answer">
        <p class="puz-answer-label">✅ Answer</p>
        <p class="puz-answer-text">${esc(p.answer)}</p>
        <p class="puz-explain">${esc(p.explanation)}</p>
      </div>`;
    document.getElementById('reveal-btn').disabled = true;
  });
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
