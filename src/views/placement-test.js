// Short placement test — samples checkpoint skills from easy to hard and
// recommends where to start. Every answer is also recorded to tracking.
import { navigateTo } from '../router.js';
import { getLesson, STAGES } from '../data/curriculum.js';
import { generateSet } from '../services/question-bank.js';
import { recordAnswer, logEvent } from '../services/tracking.js';
import { getCurrentProfileId, getProfile, updateProfile } from '../services/profile-manager.js';

// Checkpoints in increasing difficulty. The first one missed is where to start.
const CHECKPOINTS = [
  'count-to-20', 'add-within-20', 'number-bonds-20', 'tables-2-5-10',
  'place-value-1000', 'column-addition', 'tables-4', 'equivalent-fractions'
];

let s = null;

export function renderPlacement() {
  const app = document.getElementById('app');
  if (!app) return;
  s = null;
  app.innerHTML = `
    <div class="practice">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>🎯 Quick level check</h1>
        <p class="lp-objective">A few questions to find the best place to start. They get trickier as you go — just try your best, and skip by guessing if you're unsure!</p>
      </header>
      <div class="q-card" style="text-align:center">
        <p class="q-prompt">Ready? It only takes a couple of minutes.</p>
        <button class="primary-btn" id="start-btn">Start the check →</button>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  document.getElementById('start-btn').addEventListener('click', start);
}

function start() {
  const items = CHECKPOINTS.map((id) => {
    const lesson = getLesson(id);
    const q = generateSet(lesson, 1)[0];
    return { lesson, q };
  }).filter((it) => it.q);
  s = { items, index: 0, firstWrong: null };
  const pid = getCurrentProfileId();
  if (pid) logEvent(pid, 'placement-start', {}).catch(() => {});
  paintShell();
  paintQuestion();
}

function paintShell() {
  document.getElementById('app').innerHTML = `
    <div class="practice">
      <header class="practice-bar">
        <button class="back-button" id="quit-btn">← Quit</button>
        <div class="score-pill">Question <span id="qnum">1</span> / ${s.items.length}</div>
      </header>
      <div class="progress-track"><div class="progress-fill" id="pfill" style="width:0%"></div></div>
      <div id="qarea" class="qarea"></div>
    </div>`;
  document.getElementById('quit-btn').addEventListener('click', () => navigateTo('/lessons'));
}

function paintQuestion() {
  const { q } = s.items[s.index];
  document.getElementById('qnum').textContent = String(s.index + 1);
  document.getElementById('pfill').style.width = `${(s.index / s.items.length) * 100}%`;
  const area = document.getElementById('qarea');
  const visual = q.visual && q.visual.emoji ? `<div class="q-visual">${q.visual.emoji.repeat(q.visual.count)}</div>` : '';
  const answerUI = q.type === 'input'
    ? `<div class="input-row"><input type="text" inputmode="numeric" id="answer-input" class="answer-input" autocomplete="off" placeholder="?"><button class="primary-btn" id="check-btn">OK</button></div>`
    : `<div class="options">${q.options.map((o) => `<button class="opt" data-val="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  area.innerHTML = `<div class="q-card"><p class="q-prompt">${esc(q.prompt)}</p>${visual}${answerUI}</div>`;

  if (q.type === 'input') {
    const inp = document.getElementById('answer-input');
    const go = () => handleAnswer(inp.value);
    document.getElementById('check-btn').addEventListener('click', go);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    inp.focus();
  } else {
    area.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => handleAnswer(b.dataset.val)));
  }
}

function norm(v) { return String(v).trim().toLowerCase().replace(/\s+/g, ''); }

async function handleAnswer(raw) {
  const { lesson, q } = s.items[s.index];
  const correct = norm(raw) === norm(q.answer);
  if (!correct && s.firstWrong === null) s.firstWrong = s.index;
  const pid = getCurrentProfileId();
  if (pid) {
    recordAnswer({
      profileId: pid, lessonId: lesson.id, skillTag: q.skillTag, questionType: q.type,
      questionText: q.prompt, userAnswer: raw, correctAnswer: q.answer, correct, timeSpentMs: 0
    }).catch(() => {});
  }
  s.index++;
  if (s.index < s.items.length) paintQuestion();
  else finish();
}

async function finish() {
  document.getElementById('pfill').style.width = '100%';
  // First missed checkpoint = recommended start. All correct = ready for the top stage.
  const startId = s.firstWrong === null ? s.items[s.items.length - 1].lesson.id : s.items[s.firstWrong].lesson.id;
  const lesson = getLesson(startId);
  const stage = lesson.stage;
  const allRight = s.firstWrong === null;

  const pid = getCurrentProfileId();
  if (pid) {
    try {
      const profile = await getProfile(pid);
      if (profile) { profile.currentYear = stage; await updateProfile(profile); }
    } catch (e) { /* non-fatal */ }
    sessionStorage.setItem('selectedStage', String(stage));
    logEvent(pid, 'placement-complete', { recommended: startId, stage, allRight }).catch(() => {});
  }

  const msg = allRight
    ? `Brilliant — you answered everything! You're ready for the toughest stage.`
    : `Great effort! The best place to start is here.`;

  document.getElementById('qarea').innerHTML = `
    <div class="complete-card">
      <h2>🎯 All done!</h2>
      <p class="result-msg">${msg}</p>
      <div class="rec-box">
        <p class="rec-stage">Stage ${stage}: ${esc(STAGES[stage].name)}</p>
        <p class="rec-lesson">Start with: <strong>${esc(lesson.title)}</strong></p>
      </div>
      <div class="complete-actions">
        <button class="primary-btn" id="startlesson-btn">Start this lesson →</button>
        <button class="secondary-btn" id="seeall-btn">See all lessons</button>
      </div>
    </div>`;
  document.getElementById('startlesson-btn').addEventListener('click', () => navigateTo(`/lesson/${encodeURIComponent(startId)}`));
  document.getElementById('seeall-btn').addEventListener('click', () => navigateTo('/lessons'));
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
