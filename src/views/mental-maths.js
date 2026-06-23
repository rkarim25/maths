// Mental Maths — a chooseable list of agility methods (Starter/Builder/
// Speedster), each opening a detail with the idea, numbered steps, worked
// examples and read-aloud.
import { navigateTo } from '../router.js';
import { getMethods, getMethod } from '../data/mental-maths.js';
import { speak, stopSpeaking } from '../services/tts.js';

const LEVELS = ['Starter', 'Builder', 'Speedster'];
const LEVEL_CLASS = { Starter: 'easy', Builder: 'medium', Speedster: 'tricky' };

export function renderMentalMaths() {
  showList();
}

function showList() {
  stopSpeaking();
  const app = document.getElementById('app');
  if (!app) return;
  const methods = getMethods();
  const groups = LEVELS.map((lvl) => {
    const items = methods.filter((m) => m.level === lvl);
    if (!items.length) return '';
    return `<h2 class="puz-group">${lvl}</h2><div class="puz-list">${items.map((m) => `
      <button class="puz-item" data-id="${m.id}">
        <span class="puz-emoji">${m.emoji}</span>
        <span class="puz-item-title">${esc(m.title)}</span>
        <span class="puz-level ${LEVEL_CLASS[lvl]}">${lvl}</span>
      </button>`).join('')}</div>`;
  }).join('');
  app.innerHTML = `
    <div class="puzzles-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>🧠 Mental Maths</h1>
        <p class="lp-objective">Clever methods to work things out in your head — fast! Learn one, then try it on real sums. Speedster ones are Trachtenberg-style tricks.</p>
      </header>
      ${groups}
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.puz-item').forEach((b) => b.addEventListener('click', () => showMethod(b.dataset.id)));
}

function showMethod(id) {
  stopSpeaking();
  const m = getMethod(id);
  if (!m) { showList(); return; }
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="puzzles-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← All methods</button>
        <h1>${m.emoji} ${esc(m.title)}</h1>
        <p class="lp-objective"><span class="puz-level ${LEVEL_CLASS[m.level]}">${m.level}</span></p>
      </header>
      <div class="puz-card">
        <p class="puz-question">${esc(m.idea)}</p>
        <p class="app-task-label">How to do it</p>
        <ol class="mm-steps">${m.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        <p class="app-task-label">Examples</p>
        <ul class="mm-examples">${m.examples.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
        <div class="puz-actions">
          <button class="primary-btn" id="practise-btn">✏️ Practise this trick</button>
          <button class="secondary-btn" id="speak-btn">🔊 Read to me</button>
        </div>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', showList);
  document.getElementById('practise-btn').addEventListener('click', () => navigateTo(`/mental-practice/${m.id}`));
  document.getElementById('speak-btn').addEventListener('click', () => speak(`${m.title}. ${m.idea}. ${m.steps.join('. ')}`));
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
