// End-of-stage assessment — samples the stage's skills, scores against a pass
// mark, records answers (so weak areas + recommendations update) and shows gaps.
import { navigateTo } from '../router.js';
import { STAGES, getLessonsByStage } from '../data/curriculum.js';
import { generateSet } from '../services/question-bank.js';
import { recordAnswer, recordAttempt, recomputeWeakAreas, logEvent } from '../services/tracking.js';
import { getCurrentProfileId } from '../services/profile-manager.js';

const PASS = 80;
let s = null;

function parseStage(arg) {
  const n = Number(String(arg || '').split('?')[0]);
  return STAGES[n] ? n : 1;
}

function sampleLessons(stage, max = 12) {
  const ls = getLessonsByStage(stage);
  if (ls.length <= max) return ls;
  const step = ls.length / max, out = [];
  for (let i = 0; i < max; i++) out.push(ls[Math.floor(i * step)]);
  return out;
}

export function renderAssessment(arg) {
  const stage = parseStage(arg);
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="practice">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>📋 Stage ${stage} assessment</h1>
        <p class="lp-objective">A mix of questions from across <strong>${esc(STAGES[stage].name)}</strong> to check what's mastered and what to revisit. Try your best!</p>
      </header>
      <div class="q-card" style="text-align:center">
        <p class="q-prompt">Ready to show what you know?</p>
        <button class="primary-btn" id="start-btn">Start the assessment →</button>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  document.getElementById('start-btn').addEventListener('click', () => start(stage));
}

function start(stage) {
  const items = sampleLessons(stage).map((lesson) => ({ lesson, q: generateSet(lesson, 1)[0] })).filter((it) => it.q);
  s = { stage, items, index: 0, score: 0, answers: [] };
  const pid = getCurrentProfileId();
  if (pid) logEvent(pid, 'assessment-start', { stage }).catch(() => {});
  paintShell();
  paintQuestion();
}

function paintShell() {
  document.getElementById('app').innerHTML = `
    <div class="practice">
      <header class="practice-bar">
        <button class="back-button" id="quit-btn">← Quit</button>
        <div class="score-pill">Stage ${s.stage} · <span id="qnum">1</span>/${s.items.length}</div>
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

const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, '');

async function handleAnswer(raw) {
  const { lesson, q } = s.items[s.index];
  const correct = norm(raw) === norm(q.answer);
  if (correct) s.score++;
  s.answers.push({ lesson, correct });
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
  const total = s.items.length;
  const percent = Math.round((s.score / total) * 100);
  const passed = percent >= PASS;
  const pid = getCurrentProfileId();
  if (pid) {
    try {
      await recordAttempt(pid, `assessment-stage-${s.stage}`, { score: s.score, total, setName: 'assessment' });
      await recomputeWeakAreas(pid);
      await logEvent(pid, 'assessment-complete', { stage: s.stage, score: s.score, total, percent });
    } catch (e) { /* non-fatal */ }
  }

  // unique missed lessons → things to revisit
  const missed = [];
  const seen = new Set();
  for (const a of s.answers) if (!a.correct && !seen.has(a.lesson.id)) { seen.add(a.lesson.id); missed.push(a.lesson); }

  const msg = passed
    ? `🎉 Passed! ${percent}% — great mastery of Stage ${s.stage}.`
    : `Good effort — ${percent}%. A little more practice on these and you'll have it.`;

  const revisit = missed.length
    ? `<div class="assess-gaps"><h3>Worth revisiting</h3>${missed.slice(0, 8).map((l) =>
        `<button class="mini-btn primary" data-go="/lesson/${encodeURIComponent(l.id)}">${esc(l.title)}</button>`).join('')}</div>`
    : `<p class="result-msg">Nothing to revisit — fantastic!</p>`;

  document.getElementById('qarea').innerHTML = `
    <div class="complete-card">
      <h2>${passed ? '🏆' : '📋'} Assessment done!</h2>
      <div class="result-score">${s.score} / ${total} <span class="result-pct">(${percent}%)</span></div>
      <p class="result-msg">${msg}</p>
      ${revisit}
      <div class="complete-actions">
        <button class="primary-btn" id="retake-btn">Try again</button>
        <button class="secondary-btn" id="done-btn">Back to lessons</button>
      </div>
    </div>`;
  document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => navigateTo(b.dataset.go)));
  document.getElementById('retake-btn').addEventListener('click', () => start(s.stage));
  document.getElementById('done-btn').addEventListener('click', () => navigateTo('/lessons'));
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
