// Practice view — exercise sets generated on the fly, every answer + attempt
// saved to IndexedDB through the tracking service.
import { navigateTo } from '../router.js';
import { getLesson } from '../data/curriculum.js';
import { generateSet } from '../services/question-bank.js';
import { recordAnswer, recordAttempt, logEvent } from '../services/tracking.js';
import { getCurrentProfileId } from '../services/profile-manager.js';

const SETS = [
  { key: 'A', label: 'Set A', count: 6, icon: '🅰️' },
  { key: 'B', label: 'Set B', count: 6, icon: '🅱️' },
  { key: 'C', label: 'Challenge', count: 8, icon: '🏆' }
];

let s = null; // active quiz state

function parseArg(arg) {
  const [id, query = ''] = String(arg).split('?');
  return { id, set: new URLSearchParams(query).get('set') };
}

export function renderPractice(arg) {
  const { id, set } = parseArg(arg);
  const lesson = getLesson(id);
  const app = document.getElementById('app');
  if (!app) return;
  if (!lesson) {
    app.innerHTML = `<div class="practice"><button class="back-button" id="b">← Back</button><h1>Not found</h1></div>`;
    document.getElementById('b').addEventListener('click', () => navigateTo('/lessons'));
    return;
  }
  if (set) startQuiz(lesson, set);
  else showSetPicker(lesson);
}

function showSetPicker(lesson) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="practice">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>Practise: ${escapeHtml(lesson.title)}</h1>
        <p class="lp-objective">${escapeHtml(lesson.objective)}</p>
      </header>
      <p class="set-intro">Pick an exercise. Each one is different, so you can play again and again!</p>
      <div class="set-grid">
        ${SETS.map((set) => `
          <button class="set-card" data-set="${set.key}">
            <span class="set-icon">${set.icon}</span>
            <span class="set-label">${set.label}</span>
            <span class="set-count">${set.count} questions</span>
          </button>`).join('')}
      </div>
    </div>
  `;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('.set-card').forEach((b) =>
    b.addEventListener('click', () => startQuiz(lesson, b.dataset.set)));
}

function startQuiz(lesson, setKey) {
  const set = SETS.find((x) => x.key === setKey) || SETS[0];
  const questions = generateSet(lesson, set.count);
  s = { lesson, set, questions, index: 0, score: 0, answers: [], startedAt: Date.now(), qShownAt: Date.now(), hintUsed: false };
  const pid = getCurrentProfileId();
  if (pid) logEvent(pid, 'game-start', { lessonId: lesson.id, set: set.key }).catch(() => {});
  paintShell();
  paintQuestion();
}

function paintShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="practice">
      <header class="practice-bar">
        <button class="back-button" id="quit-btn">← Quit</button>
        <div class="score-pill">⭐ <span id="score">0</span> / ${s.questions.length}</div>
      </header>
      <div class="progress-track"><div class="progress-fill" id="pfill" style="width:0%"></div></div>
      <div id="qarea" class="qarea"></div>
    </div>
  `;
  document.getElementById('quit-btn').addEventListener('click', () => navigateTo('/lessons'));
}

function paintQuestion() {
  const q = s.questions[s.index];
  s.qShownAt = Date.now();
  s.hintUsed = false;
  const area = document.getElementById('qarea');
  document.getElementById('pfill').style.width = `${(s.index / s.questions.length) * 100}%`;

  const visual = q.visual && q.visual.emoji
    ? `<div class="q-visual">${q.visual.emoji.repeat(q.visual.count)}</div>` : '';

  const answerUI = q.type === 'input'
    ? `<div class="input-row">
         <input type="text" inputmode="numeric" id="answer-input" class="answer-input" autocomplete="off" placeholder="?">
         <button class="primary-btn" id="check-btn">Check</button>
       </div>`
    : `<div class="options">${q.options.map((o) => `<button class="opt" data-val="${escapeAttr(o)}">${escapeHtml(o)}</button>`).join('')}</div>`;

  area.innerHTML = `
    <div class="q-card">
      <div class="q-num">Question ${s.index + 1} of ${s.questions.length}</div>
      <p class="q-prompt">${escapeHtml(q.prompt)}</p>
      ${visual}
      ${answerUI}
      ${q.hint ? `<button class="hint-btn" id="hint-btn">💡 Hint</button><p class="hint-text" id="hint-text" hidden>${escapeHtml(q.hint)}</p>` : ''}
      <div class="feedback" id="feedback"></div>
    </div>
  `;

  if (q.type === 'input') {
    const inp = document.getElementById('answer-input');
    const check = document.getElementById('check-btn');
    const submit = () => handleAnswer(inp.value, check);
    check.addEventListener('click', submit);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    inp.focus();
  } else {
    area.querySelectorAll('.opt').forEach((b) =>
      b.addEventListener('click', () => handleAnswer(b.dataset.val, b)));
  }
  const hintBtn = document.getElementById('hint-btn');
  if (hintBtn) hintBtn.addEventListener('click', () => {
    s.hintUsed = true;
    document.getElementById('hint-text').hidden = false;
    hintBtn.disabled = true;
  });
}

function normalize(v) {
  return String(v).trim().toLowerCase().replace(/\s+/g, '').replace(/^\+/, '');
}

async function handleAnswer(rawAnswer, sourceEl) {
  const q = s.questions[s.index];
  if (q._answered) return;
  q._answered = true;
  const correct = normalize(rawAnswer) === normalize(q.answer);
  const timeSpentMs = Date.now() - s.qShownAt;

  if (correct) s.score++;
  s.answers.push({ qid: q.qid, correct, userAnswer: rawAnswer });

  // lock the UI
  const area = document.getElementById('qarea');
  area.querySelectorAll('.opt').forEach((b) => {
    b.disabled = true;
    if (normalize(b.dataset.val) === normalize(q.answer)) b.classList.add('correct');
    else if (b === sourceEl) b.classList.add('incorrect');
  });
  const inp = document.getElementById('answer-input');
  if (inp) { inp.disabled = true; const cb = document.getElementById('check-btn'); if (cb) cb.disabled = true; }

  document.getElementById('score').textContent = s.score;
  const fb = document.getElementById('feedback');
  fb.innerHTML = correct
    ? `<span class="fb-ok">✓ Well done!</span>`
    : `<span class="fb-no">Not quite — the answer is <strong>${escapeHtml(q.answer)}</strong></span>`;
  fb.innerHTML += `<button class="primary-btn next-btn" id="next-btn">${s.index < s.questions.length - 1 ? 'Next →' : 'Finish'}</button>`;
  document.getElementById('next-btn').addEventListener('click', nextQuestion);

  const pid = getCurrentProfileId();
  if (pid) {
    recordAnswer({
      profileId: pid, lessonId: s.lesson.id, skillTag: q.skillTag,
      questionType: q.type, questionText: q.prompt,
      userAnswer: rawAnswer, correctAnswer: q.answer, correct,
      timeSpentMs, hintUsed: s.hintUsed
    }).catch((e) => console.error('recordAnswer failed', e));
  }
}

function nextQuestion() {
  if (s.index < s.questions.length - 1) { s.index++; paintQuestion(); }
  else finish();
}

async function finish() {
  document.getElementById('pfill').style.width = '100%';
  const total = s.questions.length;
  const pid = getCurrentProfileId();
  let stars = 0, percent = Math.round((s.score / total) * 100);
  if (pid) {
    try {
      const res = await recordAttempt(pid, s.lesson.id, { score: s.score, total, setName: s.set.key, timeMs: Date.now() - s.startedAt });
      stars = res.stars; percent = res.percent;
    } catch (e) { console.error('recordAttempt failed', e); stars = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0; }
  }

  const msg = percent >= 90 ? 'Amazing! You\'re a maths star! 🌟'
    : percent >= 70 ? 'Great job! 🎉'
    : percent >= 50 ? 'Good effort — keep practising! 💪'
    : 'Nice try! Let\'s practise again. 📚';

  const area = document.getElementById('qarea');
  area.innerHTML = `
    <div class="complete-card">
      <h2>All done!</h2>
      <div class="result-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <div class="result-score">${s.score} / ${total} <span class="result-pct">(${percent}%)</span></div>
      <p class="result-msg">${msg}</p>
      <div class="complete-actions">
        <button class="primary-btn" id="again-btn">Play again</button>
        <button class="secondary-btn" id="another-btn">Another set</button>
        <button class="secondary-btn" id="done-btn">Back to lessons</button>
      </div>
    </div>
  `;
  if (stars >= 2) confetti();
  document.getElementById('again-btn').addEventListener('click', () => startQuiz(s.lesson, s.set.key));
  document.getElementById('another-btn').addEventListener('click', () => showSetPicker(s.lesson));
  document.getElementById('done-btn').addEventListener('click', () => navigateTo('/lessons'));
}

function confetti() {
  const layer = document.createElement('div');
  layer.className = 'celebration';
  const colors = ['#FF6B9D', '#4ECDC4', '#FFD93D', '#A78BFA', '#63C779'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 1.5}s`;
    p.style.opacity = '1';
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 5000);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
function escapeAttr(str) { return escapeHtml(str); }
