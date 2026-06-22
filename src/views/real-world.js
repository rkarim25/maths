// Real-world maths — a chooseable list (stage tabs) of applications. Each opens
// a detail with the real-world context, a task to solve, a hint and a worked answer.
import { navigateTo } from '../router.js';
import { STAGES } from '../data/curriculum.js';
import { getApplications } from '../data/real-world.js';
import { speak, stopSpeaking } from '../services/tts.js';

let st = { stage: 1, items: [], i: 0 };

function parseStage(arg) {
  const n = Number(String(arg || '').split('?')[0]);
  return STAGES[n] ? n : 1;
}

export function renderRealWorld(arg) {
  st = { stage: parseStage(arg), items: [], i: 0 };
  st.items = getApplications(st.stage);
  showList();
}

function showList() {
  stopSpeaking();
  const app = document.getElementById('app');
  if (!app) return;
  const tabs = [1, 2, 3, 4].map((s) => `<button class="ws-mode ${s === st.stage ? 'active' : ''}" data-stage="${s}">Stage ${s}</button>`).join('');
  const list = st.items.map((it, idx) => `
    <button class="puz-item" data-i="${idx}">
      <span class="puz-emoji">${it.emoji}</span>
      <span class="puz-item-title">${esc(it.title)}</span>
      <span class="app-tag">${esc(it.category)}</span>
    </button>`).join('');
  app.innerHTML = `
    <div class="fun-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>🌍 Real-world Maths</h1>
        <p class="lp-objective">See how the maths you know is used in real life — money, nature, space, cooking, sport and more. Pick one and have a go!</p>
      </header>
      <div class="ws-modes fun-tabs">${tabs}</div>
      <div class="puz-list">${list}</div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.ws-mode').forEach((b) => b.addEventListener('click', () => { st.stage = Number(b.dataset.stage); st.items = getApplications(st.stage); showList(); }));
  app.querySelectorAll('.puz-item').forEach((b) => b.addEventListener('click', () => showItem(Number(b.dataset.i))));
}

function showItem(i) {
  stopSpeaking();
  st.i = i;
  const it = st.items[i];
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="fun-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← All applications</button>
        <h1>${it.emoji} ${esc(it.title)}</h1>
        <p class="lp-objective"><span class="app-tag">${esc(it.category)}</span></p>
      </header>
      <div class="puz-card">
        <p class="app-context">${esc(it.context)}</p>
        <div class="app-task"><p class="app-task-label">🧮 Your turn</p><p class="puz-question">${esc(it.task)}</p></div>
        ${it.hint ? `<button class="hint-btn" id="hint-btn">💡 Hint</button><p class="hint-text" id="hint-text" hidden>${esc(it.hint)}</p>` : ''}
        <div class="puz-actions">
          <button class="secondary-btn" id="speak-btn">🔊 Read to me</button>
          <button class="primary-btn" id="reveal-btn">Show answer</button>
        </div>
        <div id="answer-area"></div>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', showList);
  document.getElementById('speak-btn').addEventListener('click', () => speak(`${it.context} ${it.task}`));
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) hintBtn.addEventListener('click', () => { document.getElementById('hint-text').hidden = false; hintBtn.disabled = true; });
  document.getElementById('reveal-btn').addEventListener('click', () => {
    document.getElementById('answer-area').innerHTML = `
      <div class="puz-answer">
        <p class="puz-answer-label">✅ Answer</p>
        <p class="puz-answer-text">${esc(it.answer)}</p>
        <p class="puz-explain">${esc(it.explanation)}</p>
      </div>`;
    document.getElementById('reveal-btn').disabled = true;
  });
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
