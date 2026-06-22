// Printables — fully off-screen materials. Three modes, each Save-as-PDF ready:
//   • Exercise — standalone questions (counting questions print the objects!)
//   • Lesson   — the plain explanation + concept diagram
//   • Story    — the full illustrated story text
import { navigateTo } from '../router.js';
import { getLesson } from '../data/curriculum.js';
import { getTeaching } from '../data/teaching.js';
import { getDiagramFor } from '../data/diagrams.js';
import { generateSet } from '../services/question-bank.js';

let state = null;

function parseArg(arg) {
  const [id, query = ''] = String(arg).split('?');
  const p = new URLSearchParams(query);
  return { id, count: Number(p.get('n')) || 12, mode: p.get('mode') || 'exercise' };
}

export function renderWorksheet(arg) {
  const { id, count, mode } = parseArg(arg);
  const lesson = getLesson(id);
  const app = document.getElementById('app');
  if (!app) return;
  if (!lesson) {
    app.innerHTML = `<div class="worksheet-screen"><button class="back-button" id="b">← Back</button><h1>Not found</h1></div>`;
    document.getElementById('b').addEventListener('click', () => navigateTo('/lessons'));
    return;
  }
  const teaching = getTeaching(id);
  const hasStory = !!(teaching && teaching.story && teaching.story.scenes && teaching.story.scenes.length);
  state = {
    lesson, teaching, hasStory, count,
    questions: generateSet(lesson, count),
    includeKey: true,
    mode: (mode === 'story' && !hasStory) ? 'lesson' : mode
  };
  paint();
}

function paint() {
  const app = document.getElementById('app');
  const { hasStory, mode } = state;
  const tab = (m, label, show = true) => show
    ? `<button class="ws-mode ${mode === m ? 'active' : ''}" data-mode="${m}">${label}</button>` : '';

  app.innerHTML = `
    <div class="worksheet-screen">
      <div class="ws-controls no-print">
        <button class="back-button" id="back-btn">← Back</button>
        <div class="ws-modes">
          ${tab('exercise', '📝 Exercise')}
          ${tab('lesson', '📖 Lesson')}
          ${tab('story', '✨ Story', hasStory)}
        </div>
        ${mode === 'exercise'
          ? `<label class="ws-check"><input type="checkbox" id="key-cb" ${state.includeKey ? 'checked' : ''}> Answer key</label>
             <button class="secondary-btn" id="new-btn">🔄 New questions</button>` : ''}
        <button class="primary-btn" id="print-btn">🖨️ Print / Save PDF</button>
      </div>
      <div class="worksheet" id="worksheet">${bodyHTML()}</div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.querySelectorAll('.ws-mode').forEach((b) => b.addEventListener('click', () => { state.mode = b.dataset.mode; paint(); }));
  const newBtn = document.getElementById('new-btn');
  if (newBtn) newBtn.addEventListener('click', () => { state.questions = generateSet(state.lesson, state.count); paint(); });
  const keyCb = document.getElementById('key-cb');
  if (keyCb) keyCb.addEventListener('change', (e) => { state.includeKey = e.target.checked; paint(); });
}

function bodyHTML() {
  if (state.mode === 'lesson') return lessonBody();
  if (state.mode === 'story') return storyBody();
  return exerciseBody();
}

function headHTML(withFields) {
  const { lesson } = state;
  const fields = withFields
    ? `<div class="ws-meta"><span>Name: ____________________</span><span>Date: ____________</span><span>Score: ____ / ${state.questions.length}</span></div>`
    : '';
  return `<div class="ws-head"><h1>${esc(lesson.title)}</h1><p class="ws-obj">${esc(lesson.objective)}</p>${fields}</div>`;
}

function exerciseBody() {
  return `
    ${headHTML(true)}
    <ol class="ws-questions">${state.questions.map(questionBlock).join('')}</ol>
    ${state.includeKey ? answerKey() : ''}
  `;
}

function questionBlock(q) {
  const visual = q.visual && q.visual.emoji
    ? `<div class="ws-visual">${q.visual.emoji.repeat(q.visual.count)}</div>` : '';
  let answer;
  if (q.type === 'mcq') {
    const labels = ['A', 'B', 'C', 'D'];
    answer = `<span class="ws-options">${q.options.map((o, i) => `<span class="ws-opt">${labels[i]}) ${esc(o)}</span>`).join('')}</span>`;
  } else {
    answer = `<span class="ws-answer-line">____________</span>`;
  }
  return `<li class="ws-q"><span class="ws-prompt">${esc(q.prompt)}</span>${visual}${answer}</li>`;
}

function answerKey() {
  return `<div class="ws-key"><h2>Answer key</h2><ol class="ws-key-list">${state.questions.map((q) => `<li>${esc(q.answer)}</li>`).join('')}</ol></div>`;
}

function lessonBody() {
  const paras = (state.teaching && state.teaching.plain) || [state.lesson.objective];
  const d = getDiagramFor(state.lesson);
  return `
    ${headHTML(false)}
    ${d ? `<figure class="concept-figure">${d.svg}<figcaption>${esc(d.caption)}</figcaption></figure>` : ''}
    <div class="ws-notes">${paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
  `;
}

function storyBody() {
  const s = state.teaching.story;
  return `
    ${headHTML(false)}
    <div class="ws-story">
      <p class="ws-story-char">${esc(s.emoji || '')} ${esc(s.character)}</p>
      ${s.scenes.map((sc) => `<div class="ws-scene"><span class="ws-scene-emoji">${esc(sc.emoji || '')}</span><p>${esc(sc.text)}</p></div>`).join('')}
    </div>
  `;
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
