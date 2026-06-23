// Practice for a mental-maths trick. Auto-scored, no timer shown to the child
// (time is captured silently for the parent report). Records under `trick-<id>`.
import { navigateTo } from '../router.js';
import { getMethod, genQuestions } from '../data/mental-maths.js';
import { recordAnswer, recordAttempt, logEvent } from '../services/tracking.js';
import { getCurrentProfileId } from '../services/profile-manager.js';

const COUNT = 8;
let s = null;

export function renderMentalPractice(arg) {
  const id = String(arg || '').split('?')[0];
  const method = getMethod(id);
  const app = document.getElementById('app');
  if (!app) return;
  if (!method) { navigateTo('/mental-maths'); return; }
  const questions = genQuestions(id, COUNT);
  if (!questions.length) { navigateTo(`/mental-maths`); return; }
  s = { method, questions, index: 0, score: 0, startedAt: Date.now(), qShownAt: Date.now() };
  const pid = getCurrentProfileId();
  if (pid) logEvent(pid, 'trick-practice-start', { methodId: id }).catch(() => {});
  paintShell();
  paintQuestion();
}

function paintShell() {
  document.getElementById('app').innerHTML = `
    <div class="practice">
      <header class="practice-bar">
        <button class="back-button" id="quit-btn">← Quit</button>
        <div class="score-pill">⭐ <span id="score">0</span> / ${s.questions.length}</div>
      </header>
      <div class="progress-track"><div class="progress-fill" id="pfill" style="width:0%"></div></div>
      <p class="set-intro">${esc(s.method.emoji)} ${esc(s.method.title)}</p>
      <div id="qarea" class="qarea"></div>
    </div>`;
  document.getElementById('quit-btn').addEventListener('click', () => navigateTo('/mental-maths'));
}

function paintQuestion() {
  const q = s.questions[s.index];
  s.qShownAt = Date.now();
  document.getElementById('pfill').style.width = `${(s.index / s.questions.length) * 100}%`;
  const area = document.getElementById('qarea');
  const answerUI = q.type === 'input'
    ? `<div class="input-row"><input type="text" inputmode="numeric" id="answer-input" class="answer-input" autocomplete="off" placeholder="?"><button class="primary-btn" id="check-btn">Check</button></div>`
    : `<div class="options">${q.options.map((o) => `<button class="opt" data-val="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  area.innerHTML = `
    <div class="q-card">
      <div class="q-num">Question ${s.index + 1} of ${s.questions.length}</div>
      <p class="q-prompt">${esc(q.prompt)}</p>
      ${answerUI}
      <div class="feedback" id="feedback"></div>
    </div>`;
  if (q.type === 'input') {
    const inp = document.getElementById('answer-input');
    const submit = () => handleAnswer(inp.value, document.getElementById('check-btn'));
    document.getElementById('check-btn').addEventListener('click', submit);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    inp.focus();
  } else {
    area.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => handleAnswer(b.dataset.val, b)));
  }
}

const norm = (v) => String(v).trim().toLowerCase().replace(/\s+/g, '');

function handleAnswer(raw, sourceEl) {
  const q = s.questions[s.index];
  if (q._answered) return;
  q._answered = true;
  const correct = norm(raw) === norm(q.answer);
  const timeSpentMs = Date.now() - s.qShownAt;
  if (correct) s.score++;

  const area = document.getElementById('qarea');
  area.querySelectorAll('.opt').forEach((b) => {
    b.disabled = true;
    if (norm(b.dataset.val) === norm(q.answer)) b.classList.add('correct');
    else if (b === sourceEl) b.classList.add('incorrect');
  });
  const inp = document.getElementById('answer-input');
  if (inp) { inp.disabled = true; const cb = document.getElementById('check-btn'); if (cb) cb.disabled = true; }

  document.getElementById('score').textContent = s.score;
  const fb = document.getElementById('feedback');
  fb.innerHTML = correct
    ? `<span class="fb-ok">✓ Well done!</span>`
    : `<span class="fb-no">Not quite — the answer is <strong>${esc(q.answer)}</strong></span>`;
  fb.innerHTML += `<button class="primary-btn next-btn" id="next-btn">${s.index < s.questions.length - 1 ? 'Next →' : 'Finish'}</button>`;
  document.getElementById('next-btn').addEventListener('click', nextQuestion);

  const pid = getCurrentProfileId();
  if (pid) recordAnswer({
    profileId: pid, lessonId: `trick-${s.method.id}`, skillTag: q.skillTag || `trick-${s.method.id}`,
    questionType: q.type, questionText: q.prompt, userAnswer: raw, correctAnswer: q.answer, correct, timeSpentMs
  }).catch(() => {});
}

function nextQuestion() {
  if (s.index < s.questions.length - 1) { s.index++; paintQuestion(); }
  else finish();
}

async function finish() {
  document.getElementById('pfill').style.width = '100%';
  const total = s.questions.length;
  const percent = Math.round((s.score / total) * 100);
  let stars = percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0;
  const pid = getCurrentProfileId();
  if (pid) {
    try {
      const res = await recordAttempt(pid, `trick-${s.method.id}`, { score: s.score, total, setName: 'trick', timeMs: Date.now() - s.startedAt });
      stars = res.stars;
    } catch (e) { /* keep fallback */ }
  }
  const msg = percent >= 90 ? 'Brilliant — you\'ve got this trick! 🌟'
    : percent >= 70 ? 'Great work! 🎉'
    : percent >= 50 ? 'Good effort — try it again to get faster! 💪'
    : 'Keep practising — read the steps again and have another go. 📚';
  document.getElementById('qarea').innerHTML = `
    <div class="complete-card">
      <h2>All done!</h2>
      <div class="result-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <div class="result-score">${s.score} / ${total} <span class="result-pct">(${percent}%)</span></div>
      <p class="result-msg">${msg}</p>
      <div class="complete-actions">
        <button class="primary-btn" id="again-btn">Practise again</button>
        <button class="secondary-btn" id="method-btn">Back to the trick</button>
        <button class="secondary-btn" id="all-btn">All methods</button>
      </div>
    </div>`;
  document.getElementById('again-btn').addEventListener('click', () => renderMentalPractice(s.method.id));
  document.getElementById('method-btn').addEventListener('click', () => navigateTo('/mental-maths'));
  document.getElementById('all-btn').addEventListener('click', () => navigateTo('/mental-maths'));
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
