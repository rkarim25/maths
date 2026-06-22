// Printable worksheet + answer key. "Save as PDF" from the browser/iPad print
// dialog produces the PDF — no libraries, and it shares the question generators
// with on-screen practice, so paper and screen always match.
import { navigateTo } from '../router.js';
import { getLesson } from '../data/curriculum.js';
import { getTeaching } from '../data/teaching.js';
import { generateSet } from '../services/question-bank.js';

let state = null;

function parseArg(arg) {
  const [id, query = ''] = String(arg).split('?');
  const p = new URLSearchParams(query);
  return { id, count: Number(p.get('n')) || 12 };
}

export function renderWorksheet(arg) {
  const { id, count } = parseArg(arg);
  const lesson = getLesson(id);
  const app = document.getElementById('app');
  if (!app) return;
  if (!lesson) {
    app.innerHTML = `<div class="worksheet-screen"><button class="back-button" id="b">← Back</button><h1>Not found</h1></div>`;
    document.getElementById('b').addEventListener('click', () => navigateTo('/lessons'));
    return;
  }
  state = {
    lesson,
    count,
    questions: generateSet(lesson, count),
    includeNotes: false,
    includeKey: true
  };
  paint();
}

function paint() {
  const app = document.getElementById('app');
  const { lesson } = state;
  app.innerHTML = `
    <div class="worksheet-screen">
      <div class="ws-controls no-print">
        <button class="back-button" id="back-btn">← Back</button>
        <label class="ws-check"><input type="checkbox" id="notes-cb" ${state.includeNotes ? 'checked' : ''}> Teaching notes</label>
        <label class="ws-check"><input type="checkbox" id="key-cb" ${state.includeKey ? 'checked' : ''}> Answer key</label>
        <button class="secondary-btn" id="new-btn">🔄 New questions</button>
        <button class="primary-btn" id="print-btn">🖨️ Print / Save PDF</button>
      </div>

      <div class="worksheet" id="worksheet">
        <div class="ws-head">
          <h1>${escapeHtml(lesson.title)}</h1>
          <p class="ws-obj">${escapeHtml(lesson.objective)}</p>
          <div class="ws-meta"><span>Name: ____________________</span><span>Date: ____________</span><span>Score: ____ / ${state.questions.length}</span></div>
        </div>

        ${state.includeNotes ? notesBlock(lesson) : ''}

        <ol class="ws-questions">
          ${state.questions.map(questionBlock).join('')}
        </ol>

        ${state.includeKey ? answerKey() : ''}
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.getElementById('new-btn').addEventListener('click', () => { state.questions = generateSet(lesson, state.count); paint(); });
  document.getElementById('notes-cb').addEventListener('change', (e) => { state.includeNotes = e.target.checked; paint(); });
  document.getElementById('key-cb').addEventListener('change', (e) => { state.includeKey = e.target.checked; paint(); });
}

function notesBlock(lesson) {
  const t = getTeaching(lesson.id);
  const paras = (t && t.plain) || [lesson.objective];
  return `<div class="ws-notes"><h2>How to do it</h2>${paras.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`;
}

function questionBlock(q) {
  if (q.type === 'mcq') {
    const labels = ['A', 'B', 'C', 'D'];
    const opts = q.options.map((o, i) => `<span class="ws-opt">${labels[i]}) ${escapeHtml(o)}</span>`).join('');
    return `<li class="ws-q"><span class="ws-prompt">${escapeHtml(q.prompt)}</span><span class="ws-options">${opts}</span></li>`;
  }
  return `<li class="ws-q"><span class="ws-prompt">${escapeHtml(q.prompt)}</span><span class="ws-answer-line">____________</span></li>`;
}

function answerKey() {
  return `
    <div class="ws-key">
      <h2>Answer key</h2>
      <ol class="ws-key-list">
        ${state.questions.map((q) => `<li>${escapeHtml(q.answer)}</li>`).join('')}
      </ol>
    </div>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
