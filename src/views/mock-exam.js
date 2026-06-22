// Mock 11+ exams — timed, mixed-topic papers drawn from the whole curriculum
// (weighted to 11+ level). Every paper is freshly generated, so there are
// effectively unlimited mocks. Results show time, topic breakdown and gaps.
import { navigateTo } from '../router.js';
import { getAllLessons } from '../data/curriculum.js';
import { getMockPapers } from '../data/papers.js';
import { generateSet } from '../services/question-bank.js';
import { recordAnswer, recordAttempt, recomputeWeakAreas, logEvent } from '../services/tracking.js';
import { getCurrentProfileId } from '../services/profile-manager.js';

const PAPERS = getMockPapers().map((p) => ({ ...p, count: 40, mins: 35, icon: '🎓' }));

let s = null;
let timerId = null;

const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export function renderMockExams() {
  clearTimer();
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="practice">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>🎓 Mock 11+ exams</h1>
        <p class="lp-objective">Five full timed mock papers with a mix of questions from every topic. Each one is freshly generated, so you can re-sit them as often as you like — perfect 11+ practice. Aim for 80%+!</p>
      </header>
      <div class="set-grid">
        ${PAPERS.map((p) => `
          <button class="set-card" data-paper="${p.id}">
            <span class="set-icon">${p.icon}</span>
            <span class="set-label">${p.title}</span>
            <span class="set-count">${p.count} questions · ~${p.mins} min</span>
          </button>`).join('')}
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.set-card').forEach((b) => b.addEventListener('click', () => start(b.dataset.paper)));
}

function buildPaper(count) {
  const all = getAllLessons();
  const weighted = [];
  all.forEach((l) => { const w = l.stage >= 3 ? 3 : l.stage === 2 ? 2 : 1; for (let i = 0; i < w; i++) weighted.push(l); });
  const order = shuffle(weighted);
  const picked = [], seen = new Set();
  for (const l of order) { if (picked.length >= count) break; if (seen.has(l.id)) continue; seen.add(l.id); picked.push(l); }
  let g = 0;
  while (picked.length < count && g++ < count * 3) picked.push(pick(all));
  return picked.map((l) => ({ lesson: l, q: generateSet(l, 1)[0] })).filter((x) => x.q);
}

function start(paperId) {
  const paper = PAPERS.find((p) => p.id === paperId) || PAPERS[0];
  s = { paper, items: buildPaper(paper.count), index: 0, score: 0, answers: [], startMs: Date.now() };
  const pid = getCurrentProfileId();
  if (pid) logEvent(pid, 'mock-start', { paper: paper.id }).catch(() => {});
  paintShell();
  paintQuestion();
  startTimer();
}

function startTimer() {
  clearTimer();
  timerId = setInterval(() => {
    const el = document.getElementById('mock-timer');
    if (!el) { clearTimer(); return; }
    const sec = Math.floor((Date.now() - s.startMs) / 1000);
    const mm = String(Math.floor(sec / 60)).padStart(2, '0'), ss = String(sec % 60).padStart(2, '0');
    el.textContent = `${mm}:${ss}`;
    el.classList.toggle('over', sec > s.paper.mins * 60);
  }, 1000);
}
function clearTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

function paintShell() {
  document.getElementById('app').innerHTML = `
    <div class="practice">
      <header class="practice-bar">
        <button class="back-button" id="quit-btn">← Quit</button>
        <div class="mock-meta">
          <span class="mock-clock">⏱ <span id="mock-timer">00:00</span><span class="mock-target"> / ${s.paper.mins}:00</span></span>
          <span class="score-pill"><span id="qnum">1</span>/${s.items.length}</span>
        </div>
      </header>
      <div class="progress-track"><div class="progress-fill" id="pfill" style="width:0%"></div></div>
      <div id="qarea" class="qarea"></div>
    </div>`;
  document.getElementById('quit-btn').addEventListener('click', () => { clearTimer(); navigateTo('/lessons'); });
}

function paintQuestion() {
  const { q } = s.items[s.index];
  document.getElementById('qnum').textContent = String(s.index + 1);
  document.getElementById('pfill').style.width = `${(s.index / s.items.length) * 100}%`;
  const area = document.getElementById('qarea');
  const visual = q.visual && q.visual.emoji ? `<div class="q-visual">${q.visual.emoji.repeat(q.visual.count)}</div>` : '';
  const answerUI = q.type === 'input'
    ? `<div class="input-row"><input type="text" inputmode="numeric" id="answer-input" class="answer-input" autocomplete="off" placeholder="?"><button class="primary-btn" id="check-btn">Next</button></div>`
    : `<div class="options">${q.options.map((o) => `<button class="opt" data-val="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  const finishBtn = s.index === s.items.length - 1 ? '' : `<button class="text-btn" id="skip-btn">Skip →</button>`;
  area.innerHTML = `<div class="q-card"><div class="q-num">Question ${s.index + 1} of ${s.items.length}</div><p class="q-prompt">${esc(q.prompt)}</p>${visual}${answerUI}${finishBtn}</div>`;
  if (q.type === 'input') {
    const inp = document.getElementById('answer-input');
    const go = () => handleAnswer(inp.value);
    document.getElementById('check-btn').addEventListener('click', go);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    inp.focus();
  } else {
    area.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => handleAnswer(b.dataset.val)));
  }
  const skip = document.getElementById('skip-btn');
  if (skip) skip.addEventListener('click', () => handleAnswer(''));
}

const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, '');

function handleAnswer(raw) {
  const { lesson, q } = s.items[s.index];
  const correct = norm(raw) === norm(q.answer) && raw !== '';
  if (correct) s.score++;
  s.answers.push({ lesson, correct });
  const pid = getCurrentProfileId();
  if (pid) recordAnswer({
    profileId: pid, lessonId: lesson.id, skillTag: q.skillTag, questionType: q.type,
    questionText: q.prompt, userAnswer: raw, correctAnswer: q.answer, correct, timeSpentMs: 0
  }).catch(() => {});
  s.index++;
  if (s.index < s.items.length) paintQuestion();
  else finish();
}

async function finish() {
  clearTimer();
  document.getElementById('pfill').style.width = '100%';
  const total = s.items.length, percent = Math.round((s.score / total) * 100);
  const sec = Math.floor((Date.now() - s.startMs) / 1000);
  const mm = Math.floor(sec / 60), ss = sec % 60;

  const pid = getCurrentProfileId();
  if (pid) {
    try {
      await recordAttempt(pid, s.paper.id, { score: s.score, total, setName: 'mock' });
      await recomputeWeakAreas(pid);
      await logEvent(pid, 'mock-complete', { paper: s.paper.id, score: s.score, total, percent, seconds: sec });
    } catch (e) { /* noop */ }
  }

  // topic breakdown
  const byTopic = {};
  for (const a of s.answers) {
    const t = a.lesson.topic;
    if (!byTopic[t]) byTopic[t] = { c: 0, n: 0 };
    byTopic[t].n++; if (a.correct) byTopic[t].c++;
  }
  const rows = Object.entries(byTopic).sort((a, b) => (a[1].c / a[1].n) - (b[1].c / b[1].n))
    .map(([t, v]) => { const p = Math.round((v.c / v.n) * 100); const cls = p >= 80 ? 'good' : p >= 50 ? 'ok' : 'low'; return `<tr><td>${esc(t)}</td><td>${v.c}/${v.n}</td><td><span class="pill ${cls === 'good' ? 'mastered' : 'sev-' + (cls === 'ok' ? 'medium' : 'high')}">${p}%</span></td></tr>`; }).join('');

  const grade = percent >= 85 ? 'Excellent — that\'s a strong 11+ score! 🏆' : percent >= 70 ? 'Good work — closing in on the 11+ standard. 🌟' : 'Keep practising the weaker topics below and it will climb. 💪';

  document.getElementById('qarea').innerHTML = `
    <div class="complete-card">
      <h2>${percent >= 85 ? '🏆' : '🎓'} Mock complete!</h2>
      <div class="result-score">${s.score} / ${total} <span class="result-pct">(${percent}%)</span></div>
      <p class="result-msg">Time: ${mm}m ${ss}s · target ${s.paper.mins}m. ${grade}</p>
      <div class="table-wrap mock-breakdown"><table class="skills-table"><thead><tr><th>Topic</th><th>Score</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="complete-actions">
        <button class="primary-btn" id="again-btn">New mock</button>
        <button class="secondary-btn" id="grown-btn">See full report</button>
        <button class="secondary-btn" id="done-btn">Back to lessons</button>
      </div>
    </div>`;
  document.getElementById('again-btn').addEventListener('click', () => renderMockExams());
  document.getElementById('grown-btn').addEventListener('click', () => navigateTo('/grownups'));
  document.getElementById('done-btn').addEventListener('click', () => navigateTo('/lessons'));
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
