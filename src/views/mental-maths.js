// Mental Maths — a chooseable list of agility methods (Starter/Builder/
// Speedster), each opening a detail with the idea, numbered steps, worked
// examples and read-aloud.
import { navigateTo } from '../router.js';
import { getMethods, getMethod } from '../data/mental-maths.js';
import { getMentalDiagram } from '../data/mental-diagrams.js';
import { speak, stopSpeaking } from '../services/tts.js';
import { getProgressMap } from '../services/tracking.js';
import { getCurrentProfileId } from '../services/profile-manager.js';

const LEVELS = ['Starter', 'Builder', 'Speedster'];
const LEVEL_CLASS = { Starter: 'easy', Builder: 'medium', Speedster: 'tricky' };

export function renderMentalMaths() {
  showList();
}

async function showList() {
  stopSpeaking();
  const app = document.getElementById('app');
  if (!app) return;
  const methods = getMethods();
  // Show a ✓ on tricks she has already practised to mastery (progress rows
  // are recorded under `trick-{id}` and sync across devices).
  let progressMap = {};
  try { progressMap = await getProgressMap(getCurrentProfileId()); } catch (e) { /* fine */ }
  const doneBadge = (m) => {
    const p = progressMap[`trick-${m.id}`];
    if (!p || !p.attempts) return '';
    return p.status === 'completed'
      ? '<span class="puz-done" title="Learnt!">✓ Learnt</span>'
      : '<span class="puz-done puz-trying" title="Practising">…practising</span>';
  };
  const groups = LEVELS.map((lvl) => {
    const items = methods.filter((m) => m.level === lvl);
    if (!items.length) return '';
    return `<h2 class="puz-group">${lvl}</h2><div class="puz-list">${items.map((m) => `
      <button class="puz-item" data-id="${m.id}">
        <span class="puz-emoji">${m.emoji}</span>
        <span class="puz-item-title">${esc(m.title)}</span>
        ${doneBadge(m)}
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
  const diag = getMentalDiagram(m.id);
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
        ${diag ? `<div class="mm-diagram">${diag.svg}${diag.caption ? `<p class="diagram-caption">${esc(diag.caption)}</p>` : ''}</div>` : ''}
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
