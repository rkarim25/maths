// Times-tables trainer — a fun, fast way to memorise every table. Pick a table
// (or Mixed), answer rapid-fire questions with a streak, and see a mastery map
// built from tracked data. Every answer is recorded per table skill.
import { navigateTo } from '../router.js';
import { recordAnswer, recomputeWeakAreas, logEvent, getAllWeakAreaStats } from '../services/tracking.js';
import { getCurrentProfileId } from '../services/profile-manager.js';

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ROUND = 10;
let s = null;

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export async function renderTimesTables() {
  const app = document.getElementById('app');
  if (!app) return;
  const pid = getCurrentProfileId();
  const stats = pid ? await getAllWeakAreaStats(pid) : [];
  const acc = {};
  stats.forEach((w) => { const m = /^times-tables-(\d+)$/.exec(w.skillTag); if (m) acc[+m[1]] = w.accuracy; });

  const card = (t) => {
    const a = acc[t];
    const cls = a == null ? 'none' : a >= 80 ? 'good' : a >= 50 ? 'ok' : 'low';
    const badge = a == null ? 'new' : `${a}%`;
    return `<button class="tt-card" data-table="${t}"><span class="tt-num">${t}×</span><span class="tt-dot ${cls}">${badge}</span></button>`;
  };

  app.innerHTML = `
    <div class="practice tt-screen">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>✖️ Times Tables</h1>
        <p class="lp-objective">Pick a table to practise. The colour shows how well you know it — turn them all green!</p>
      </header>
      <div class="tt-grid">
        ${TABLES.map(card).join('')}
        <button class="tt-card tt-mixed" data-table="mixed"><span class="tt-num">🎲</span><span class="tt-mixed-label">Mixed</span></button>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.tt-card').forEach((b) => b.addEventListener('click', () => startRound(b.dataset.table)));
}

function buildQuestions(table) {
  const qs = [];
  const seen = new Set();
  let guard = 0;
  while (qs.length < ROUND && guard++ < ROUND * 8) {
    const t = table === 'mixed' ? pick(TABLES) : Number(table);
    const n = rnd(1, 12);
    const key = `${t}x${n}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const ans = t * n;
    const opts = shuffle([...new Set([ans, ans + t, Math.max(0, ans - t), ans + 1])]).slice(0, 4);
    if (!opts.includes(ans)) opts[0] = ans;
    qs.push({ prompt: `${t} × ${n}`, answer: String(ans), options: shuffle(opts).map(String), skillTag: `times-tables-${t}` });
  }
  return qs;
}

function startRound(table) {
  s = { table, qs: buildQuestions(table), index: 0, score: 0, streak: 0, best: 0, locked: false };
  const pid = getCurrentProfileId();
  if (pid) logEvent(pid, 'times-tables-start', { table }).catch(() => {});
  paintShell();
  paintQuestion();
}

function paintShell() {
  document.getElementById('app').innerHTML = `
    <div class="practice tt-screen">
      <header class="practice-bar">
        <button class="back-button" id="quit-btn">← Quit</button>
        <div class="tt-streak">🔥 streak <span id="streak">0</span></div>
        <div class="score-pill">⭐ <span id="score">0</span>/${s.qs.length}</div>
      </header>
      <div class="progress-track"><div class="progress-fill" id="pfill" style="width:0%"></div></div>
      <div id="qarea" class="qarea"></div>
    </div>`;
  document.getElementById('quit-btn').addEventListener('click', () => navigateTo('/times-tables'));
}

function paintQuestion() {
  const q = s.qs[s.index];
  s.locked = false;
  document.getElementById('pfill').style.width = `${(s.index / s.qs.length) * 100}%`;
  const area = document.getElementById('qarea');
  area.innerHTML = `
    <div class="q-card">
      <p class="q-prompt tt-prompt">${q.prompt} = ?</p>
      <div class="options">${q.options.map((o) => `<button class="opt" data-val="${o}">${o}</button>`).join('')}</div>
    </div>`;
  area.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => answer(b, q)));
}

function answer(btn, q) {
  if (s.locked) return;
  s.locked = true;
  const correct = btn.dataset.val === q.answer;
  document.querySelectorAll('.opt').forEach((b) => {
    b.disabled = true;
    if (b.dataset.val === q.answer) b.classList.add('correct');
    else if (b === btn) b.classList.add('incorrect');
  });
  if (correct) { s.score++; s.streak++; s.best = Math.max(s.best, s.streak); }
  else s.streak = 0;
  document.getElementById('score').textContent = s.score;
  document.getElementById('streak').textContent = s.streak;

  const pid = getCurrentProfileId();
  if (pid) recordAnswer({
    profileId: pid, lessonId: 'times-tables-trainer', skillTag: q.skillTag, questionType: 'mcq',
    questionText: q.prompt, userAnswer: btn.dataset.val, correctAnswer: q.answer, correct, timeSpentMs: 0
  }).catch(() => {});

  setTimeout(() => {
    s.index++;
    if (s.index < s.qs.length) paintQuestion();
    else finish();
  }, 750);
}

async function finish() {
  document.getElementById('pfill').style.width = '100%';
  const total = s.qs.length, percent = Math.round((s.score / total) * 100);
  const stars = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0;
  const pid = getCurrentProfileId();
  if (pid) { try { await recomputeWeakAreas(pid); await logEvent(pid, 'times-tables-complete', { table: s.table, score: s.score, total, best: s.best }); } catch (e) { /* noop */ } }

  const msg = percent >= 90 ? 'Lightning fast! ⚡' : percent >= 70 ? 'Great recall! 🌟' : 'Keep drilling — you\'re getting quicker! 💪';
  document.getElementById('qarea').innerHTML = `
    <div class="complete-card">
      <h2>Round done!</h2>
      <div class="result-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <div class="result-score">${s.score} / ${total} <span class="result-pct">(${percent}%)</span></div>
      <p class="result-msg">${msg} Best streak: <strong>${s.best}</strong> 🔥</p>
      <div class="complete-actions">
        <button class="primary-btn" id="again-btn">Go again</button>
        <button class="secondary-btn" id="pick-btn">Pick another table</button>
        <button class="secondary-btn" id="done-btn">Back to lessons</button>
      </div>
    </div>`;
  document.getElementById('again-btn').addEventListener('click', () => startRound(s.table));
  document.getElementById('pick-btn').addEventListener('click', () => navigateTo('/times-tables'));
  document.getElementById('done-btn').addEventListener('click', () => navigateTo('/lessons'));
}
