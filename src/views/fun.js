// Maths Fun — flip-through cards of tricks and facts, with read-aloud.
import { navigateTo } from '../router.js';
import { STAGES } from '../data/curriculum.js';
import { getMathsFun } from '../data/maths-fun.js';
import { speak, stopSpeaking } from '../services/tts.js';

let st = null;

function parseStage(arg) {
  const n = Number(String(arg || '').split('?')[0]);
  return STAGES[n] ? n : 1;
}

export function renderFun(arg) {
  const stage = parseStage(arg);
  st = { stage, items: getMathsFun(stage), i: 0 };
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="fun-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>✨ Maths Fun</h1>
        <p class="lp-objective">Cool tricks and amazing facts — Stage ${stage}: ${esc(STAGES[stage].name)}.</p>
      </header>
      <div class="lp-stage" id="fun-stage"></div>
      <div class="lp-footer"><button class="secondary-btn" id="speak-btn">🔊 Read to me</button></div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => { stopSpeaking(); navigateTo('/lessons'); });
  document.getElementById('speak-btn').addEventListener('click', () => { const it = st.items[st.i]; speak(`${it.title}. ${it.text}`); });
  paint();
}

function paint() {
  const el = document.getElementById('fun-stage');
  const it = st.items[st.i], last = st.items.length - 1;
  el.innerHTML = `
    <div class="fun-card">
      <span class="fun-tag ${it.kind}">${it.kind === 'trick' ? '✨ Trick' : '💡 Did you know?'}</span>
      <div class="fun-emoji">${it.emoji}</div>
      <h2 class="fun-title">${esc(it.title)}</h2>
      <p class="fun-text">${esc(it.text)}</p>
      <div class="story-controls">
        <button class="secondary-btn" id="prev" ${st.i === 0 ? 'disabled' : ''}>← Back</button>
        <span class="scene-dots">${st.items.map((_, j) => j === st.i ? '●' : '○').join(' ')}</span>
        <button class="primary-btn" id="next" ${st.i === last ? 'disabled' : ''}>Next →</button>
      </div>
    </div>`;
  const p = document.getElementById('prev'), n = document.getElementById('next');
  if (p) p.addEventListener('click', () => { if (st.i > 0) { st.i--; stopSpeaking(); paint(); } });
  if (n) n.addEventListener('click', () => { if (st.i < last) { st.i++; stopSpeaking(); paint(); } });
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
