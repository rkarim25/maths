// Printable stage "book" — compiles a whole stage into one document. Choose
// which sections to include (Stories / Explanations / Exercises / Answer key),
// then Print / Save PDF for a complete off-screen book.
import { navigateTo } from '../router.js';
import { STAGES, getLessonsByStage } from '../data/curriculum.js';
import { getTeaching } from '../data/teaching.js';
import { getDiagramFor } from '../data/diagrams.js';
import { generateSet } from '../services/question-bank.js';

let state = null;

function parseStage(arg) {
  const s = Number(String(arg || '').split('?')[0]);
  return STAGES[s] ? s : 1;
}

export function renderBook(arg) {
  const stage = parseStage(arg);
  state = { stage, include: { story: true, explain: true, exercise: true, answers: true } };
  buildItems();
  paint();
}

function buildItems() {
  state.items = getLessonsByStage(state.stage).map((lesson) => ({
    lesson,
    teaching: getTeaching(lesson.id),
    questions: generateSet(lesson, 5)
  }));
}

function paint() {
  const app = document.getElementById('app');
  const inc = state.include;
  const chk = (k, label) => `<label class="ws-check"><input type="checkbox" data-inc="${k}" ${inc[k] ? 'checked' : ''}> ${label}</label>`;
  const tabs = [1, 2, 3, 4].map((s) => `<button class="ws-mode ${s === state.stage ? 'active' : ''}" data-stage="${s}">Stage ${s}</button>`).join('');

  app.innerHTML = `
    <div class="book-screen">
      <div class="ws-controls no-print">
        <button class="back-button" id="back-btn">← Back</button>
        <div class="ws-modes">${tabs}</div>
        <div class="book-includes">${chk('story', 'Stories')} ${chk('explain', 'Explanations')} ${chk('exercise', 'Exercises')} ${chk('answers', 'Answer key')}</div>
        <button class="primary-btn" id="print-btn">🖨️ Print / Save PDF</button>
      </div>
      <div class="book" id="book">${bookHTML()}</div>
    </div>`;

  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  app.querySelectorAll('.ws-mode').forEach((b) => b.addEventListener('click', () => { state.stage = Number(b.dataset.stage); buildItems(); paint(); }));
  app.querySelectorAll('[data-inc]').forEach((c) => c.addEventListener('change', (e) => { state.include[e.target.dataset.inc] = e.target.checked; paint(); }));
}

function bookHTML() {
  const s = STAGES[state.stage];
  const cover = `<div class="book-cover"><div class="book-cover-emoji">📘</div><h1>Stage ${state.stage}</h1><h2>${esc(s.name)}</h2><p>${esc(s.blurb)}</p></div>`;
  const lessons = state.items.map((it, i) => lessonHTML(it, i)).join('');
  const answers = (state.include.answers && state.include.exercise) ? answerKeyHTML() : '';
  return cover + lessons + answers;
}

function lessonHTML(it, idx) {
  const inc = state.include, { lesson, teaching, questions } = it;
  const hasStory = !!(teaching && teaching.story && teaching.story.scenes && teaching.story.scenes.length);
  let parts = `<h2 class="book-lesson-title">${idx + 1}. ${esc(lesson.title)}</h2><p class="ws-obj">${esc(lesson.objective)}</p>`;

  if (inc.story && hasStory) {
    const s = teaching.story;
    parts += `<div class="ws-story"><p class="ws-story-char">${esc(s.emoji || '')} ${esc(s.character)}</p>${s.scenes.map((sc) => `<div class="ws-scene"><span class="ws-scene-emoji">${esc(sc.emoji || '')}</span><p>${esc(sc.text)}</p></div>`).join('')}</div>`;
  }
  if (inc.explain) {
    const d = getDiagramFor(lesson);
    const paras = (teaching && teaching.plain) || [lesson.objective];
    parts += `${d ? `<figure class="concept-figure">${d.svg}<figcaption>${esc(d.caption)}</figcaption></figure>` : ''}<div class="ws-notes">${paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`;
  }
  if (inc.exercise) {
    parts += `<ol class="ws-questions">${questions.map(questionHTML).join('')}</ol>`;
  }
  return `<section class="book-lesson">${parts}</section>`;
}

function questionHTML(q) {
  const visual = q.visual && q.visual.emoji ? `<div class="ws-visual">${q.visual.emoji.repeat(q.visual.count)}</div>` : '';
  const answer = q.type === 'mcq'
    ? `<span class="ws-options">${q.options.map((o, i) => `<span class="ws-opt">${['A', 'B', 'C', 'D'][i]}) ${esc(o)}</span>`).join('')}</span>`
    : `<span class="ws-answer-line">____________</span>`;
  return `<li class="ws-q"><span class="ws-prompt">${esc(q.prompt)}</span>${visual}${answer}</li>`;
}

function answerKeyHTML() {
  const blocks = state.items.map((it, i) =>
    `<div class="book-key-lesson"><h3>${i + 1}. ${esc(it.lesson.title)}</h3><ol class="ws-key-list">${it.questions.map((q) => `<li>${esc(q.answer)}</li>`).join('')}</ol></div>`).join('');
  return `<div class="ws-key book-answers"><h2>Answer key</h2>${blocks}</div>`;
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
