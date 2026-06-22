// Lesson player — Story / Explain / Video, with real text-to-speech narration.
import { navigateTo } from '../router.js';
import { getLesson } from '../data/curriculum.js';
import { getTeaching } from '../data/teaching.js';
import { getDiagramFor } from '../data/diagrams.js';
import { logEvent } from '../services/tracking.js';
import { getCurrentProfileId } from '../services/profile-manager.js';
import { speak, stopSpeaking } from '../services/tts.js';

let state = { lesson: null, teaching: null, view: 'story', scene: 0 };

// arg can be "lesson-id" or "lesson-id?view=plain"
function parseArg(arg) {
  const [id, query = ''] = String(arg).split('?');
  const params = new URLSearchParams(query);
  return { id, view: params.get('view') };
}

export function renderLessonPlayer(arg) {
  const { id, view } = parseArg(arg);
  const lesson = getLesson(id);
  const app = document.getElementById('app');
  if (!app) return;

  if (!lesson) {
    app.innerHTML = notFound();
    document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
    return;
  }

  const teaching = getTeaching(id);
  const hasStory = !!(teaching && teaching.story && teaching.story.scenes.length);
  let initialView = view || 'story';
  if (initialView === 'story' && !hasStory) initialView = 'plain';
  if (initialView === 'video' && !lesson.youtubeId) initialView = hasStory ? 'story' : 'plain';

  state = { lesson, teaching, view: initialView, scene: 0, hasStory };

  app.innerHTML = `
    <div class="lesson-player">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lp-objective">${escapeHtml(lesson.objective)}</p>
      </header>

      <div class="lp-toggle" id="lp-toggle">
        ${hasStory ? tab('story', '📖 Story') : ''}
        ${tab('plain', '📝 Explain')}
        ${lesson.youtubeId ? tab('video', '▶ Video') : ''}
      </div>

      <div class="lp-stage" id="lp-stage"></div>

      <div class="lp-footer">
        <button class="secondary-btn" id="speak-btn">🔊 Read to me</button>
        <button class="primary-btn" id="practice-btn">🎮 Practise this →</button>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => { stopSpeaking(); navigateTo('/lessons'); });
  document.getElementById('practice-btn').addEventListener('click', () => { stopSpeaking(); navigateTo(`/practice/${encodeURIComponent(lesson.id)}`); });
  document.getElementById('speak-btn').addEventListener('click', speakCurrent);
  document.getElementById('lp-toggle').querySelectorAll('[data-view]').forEach((b) =>
    b.addEventListener('click', () => { state.view = b.dataset.view; state.scene = 0; stopSpeaking(); paintTabs(); paintStage(); }));

  const pid = getCurrentProfileId();
  if (pid) logEvent(pid, 'lesson-start', { lessonId: id, view: initialView }).catch(() => {});

  paintTabs();
  paintStage();
}

function tab(view, label) {
  return `<button class="lp-tab" data-view="${view}">${label}</button>`;
}

function paintTabs() {
  document.querySelectorAll('.lp-tab').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === state.view));
}

function paintStage() {
  const stage = document.getElementById('lp-stage');
  if (state.view === 'plain') stage.innerHTML = plainHTML();
  else if (state.view === 'video') stage.innerHTML = videoHTML();
  else stage.innerHTML = storyHTML();

  if (state.view === 'story' && state.hasStory) {
    const prev = document.getElementById('scene-prev'), next = document.getElementById('scene-next');
    if (prev) prev.addEventListener('click', () => { if (state.scene > 0) { state.scene--; stopSpeaking(); paintStage(); } });
    if (next) next.addEventListener('click', () => {
      const last = state.teaching.story.scenes.length - 1;
      if (state.scene < last) { state.scene++; stopSpeaking(); paintStage(); }
    });
  }
}

function storyHTML() {
  const s = state.teaching.story;
  const scene = s.scenes[state.scene];
  const last = s.scenes.length - 1;
  return `
    <div class="story-card">
      <div class="story-char"><span class="story-char-emoji">${s.emoji || '✨'}</span> ${escapeHtml(s.character)}</div>
      <div class="story-scene">
        <div class="story-emoji">${scene.emoji || '✨'}</div>
        <p class="story-text">${escapeHtml(scene.text)}</p>
      </div>
      <div class="story-controls">
        <button class="secondary-btn" id="scene-prev" ${state.scene === 0 ? 'disabled' : ''}>← Back</button>
        <span class="scene-dots">${s.scenes.map((_, i) => i === state.scene ? '●' : '○').join(' ')}</span>
        <button class="primary-btn" id="scene-next" ${state.scene === last ? 'disabled' : ''}>Next →</button>
      </div>
    </div>
  `;
}

function plainHTML() {
  const paras = (state.teaching && state.teaching.plain) || [state.lesson.objective];
  const d = getDiagramFor(state.lesson);
  const fig = d ? `<figure class="concept-figure">${d.svg}<figcaption>${escapeHtml(d.caption)}</figcaption></figure>` : '';
  return `<div class="plain-card">${fig}${paras.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`;
}

function videoHTML() {
  const vid = encodeURIComponent(state.lesson.youtubeId);
  return `
    <div class="video-card">
      <div class="video-frame">
        <iframe src="https://www.youtube-nocookie.com/embed/${vid}?rel=0"
          title="Lesson video" frameborder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
      <a class="yt-link" href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener">Watch on YouTube ↗</a>
    </div>
  `;
}

// --- text to speech ----------------------------------------------------------
function currentNarration() {
  if (state.view === 'plain') return ((state.teaching && state.teaching.plain) || []).join(' ');
  if (state.view === 'story' && state.hasStory) return state.teaching.story.scenes[state.scene].text;
  return '';
}

function speakCurrent() {
  speak(currentNarration());
}

function notFound() {
  return `
    <div class="lesson-player">
      <header class="lp-header"><button class="back-button" id="back-btn">← Back to lessons</button>
      <h1>Lesson not found</h1></header>
    </div>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
