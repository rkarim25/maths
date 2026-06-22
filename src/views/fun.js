// Maths Fun — a chooseable list of tricks & facts (stage tabs to browse), then
// a detail card with read-aloud and prev/next.
import { navigateTo } from '../router.js';
import { STAGES } from '../data/curriculum.js';
import { getMathsFun } from '../data/maths-fun.js';
import { speak, stopSpeaking } from '../services/tts.js';

let st = { stage: 1, items: [], i: 0 };

function parseStage(arg) {
  const n = Number(String(arg || '').split('?')[0]);
  return STAGES[n] ? n : 1;
}

export function renderFun(arg) {
  st = { stage: parseStage(arg), items: [], i: 0 };
  st.items = getMathsFun(st.stage);
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
      <span class="fun-tag ${it.kind}">${it.kind === 'trick' ? 'Trick' : 'Fact'}</span>
    </button>`).join('');
  app.innerHTML = `
    <div class="fun-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>✨ Maths Fun</h1>
        <p class="lp-objective">Tricks and amazing facts to make maths click. Pick one to read — or have it read to you!</p>
      </header>
      <div class="ws-modes fun-tabs">${tabs}</div>
      <div class="puz-list">${list}</div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.ws-mode').forEach((b) => b.addEventListener('click', () => { st.stage = Number(b.dataset.stage); st.items = getMathsFun(st.stage); showList(); }));
  app.querySelectorAll('.puz-item').forEach((b) => b.addEventListener('click', () => showItem(Number(b.dataset.i))));
}

function showItem(i) {
  stopSpeaking();
  st.i = i;
  const it = st.items[i], last = st.items.length - 1;
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="fun-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← All maths fun</button>
        <h1>✨ Maths Fun</h1>
        <p class="lp-objective">Stage ${st.stage}: ${esc(STAGES[st.stage].name)}</p>
      </header>
      <div class="fun-card">
        <span class="fun-tag ${it.kind}">${it.kind === 'trick' ? '✨ Trick' : '💡 Did you know?'}</span>
        <div class="fun-emoji">${it.emoji}</div>
        <h2 class="fun-title">${esc(it.title)}</h2>
        <p class="fun-text">${esc(it.text)}</p>
        <div class="story-controls">
          <button class="secondary-btn" id="prev" ${i === 0 ? 'disabled' : ''}>← Back</button>
          <button class="secondary-btn" id="speak-btn">🔊 Read</button>
          <button class="primary-btn" id="next" ${i === last ? 'disabled' : ''}>Next →</button>
        </div>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', showList);
  document.getElementById('speak-btn').addEventListener('click', () => speak(`${it.title}. ${it.text}`));
  const p = document.getElementById('prev'), n = document.getElementById('next');
  if (p) p.addEventListener('click', () => { if (st.i > 0) showItem(st.i - 1); });
  if (n) n.addEventListener('click', () => { if (st.i < last) showItem(st.i + 1); });
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
