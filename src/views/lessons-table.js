// Lessons table — the home screen after choosing a player.
// Topic-grouped row-cards with live progress badges driven by saved scores.
import { navigateTo } from '../router.js';
import { getCurrentProfileId, getProfile, clearCurrentProfileId } from '../services/profile-manager.js';
import {
  STAGES, getLessonsByStage, getTopicsForStage, getLessonsByTopic, getLesson
} from '../data/curriculum.js';
import { getProgressMap } from '../services/tracking.js';
import { nextLessonId } from '../services/analysis.js';
import { getTeaching } from '../data/teaching.js';

const TOPIC_EMOJI = {
  'Counting': '🔢', 'Number bonds': '🔗', 'Adding & taking away': '➕', 'Adding & subtracting': '➕',
  'Place value': '🏛️', 'Shapes': '🔷', 'Money': '🪙', 'Patterns': '🌈',
  'Multiplication & division': '✖️', 'Times tables': '⏱️', 'Fractions': '🍕', 'Time': '🕐',
  'Measuring': '📏', 'Data': '📊', 'Word problems': '🧩', 'Written methods': '📝',
  'Decimals': '🔟', 'Number properties': '🧮', 'Fractions, decimals & %': '％',
  'Ratio & proportion': '⚖️', 'Algebra': '🔤', 'Geometry': '📐', 'Coordinates & data': '🗺️',
  'Reasoning': '🧠', 'Exam skills': '🏁'
};

let currentStage = 1;

export async function renderLessonsTable() {
  const profileId = getCurrentProfileId();
  const app = document.getElementById('app');
  if (!app) return;

  const profile = await getProfile(profileId);
  if (!profile) { clearCurrentProfileId(); navigateTo('/profiles'); return; }
  currentStage = profile.currentYear && STAGES[profile.currentYear] ? profile.currentYear : currentStage;

  const progressMap = await getProgressMap(profileId);
  const totalStars = Object.values(progressMap).reduce((s, p) => s + (p.stars || 0), 0);
  const initial = (profile.name || '?').charAt(0).toUpperCase();

  app.innerHTML = `
    <div class="lessons-screen">
      <header class="ls-header">
        <div class="ls-who">
          <div class="ls-avatar">${initial}</div>
          <div>
            <h1>Hi ${escapeHtml(profile.name)}!</h1>
            <p class="ls-sub" id="stage-sub"></p>
          </div>
        </div>
        <div class="ls-header-actions">
          <div class="ls-stars" title="Stars earned">⭐ <span>${totalStars}</span></div>
          <button class="icon-btn" id="switch-btn" title="Switch player">👤</button>
          <button class="icon-btn grownups-btn" id="grownups-btn" title="Grown-ups">🔒</button>
        </div>
      </header>

      <div class="stage-tabs" id="stage-tabs"></div>
      <div id="continue-banner"></div>
      <div id="lesson-groups"></div>
    </div>
  `;

  document.getElementById('switch-btn').addEventListener('click', () => { clearCurrentProfileId(); navigateTo('/profiles'); });
  document.getElementById('grownups-btn').addEventListener('click', () => navigateTo('/grownups'));

  renderStageTabs();
  renderContinue(progressMap);
  renderGroups(progressMap);
}

function renderStageTabs() {
  const tabs = document.getElementById('stage-tabs');
  tabs.innerHTML = Object.entries(STAGES).map(([n, s]) => `
    <button class="stage-tab ${Number(n) === currentStage ? 'active' : ''}" data-stage="${n}">
      <span class="stage-num">Stage ${n}</span>
      <span class="stage-name">${escapeHtml(s.name)}</span>
    </button>
  `).join('');
  document.getElementById('stage-sub').textContent = `${STAGES[currentStage].schoolYear} · ${STAGES[currentStage].blurb}`;
  tabs.querySelectorAll('.stage-tab').forEach((b) => b.addEventListener('click', async () => {
    currentStage = Number(b.dataset.stage);
    const progressMap = await getProgressMap(getCurrentProfileId());
    renderStageTabs();
    renderContinue(progressMap);
    renderGroups(progressMap);
  }));
}

function renderContinue(progressMap) {
  const el = document.getElementById('continue-banner');
  const nextId = nextLessonId(progressMap);
  const lesson = getLesson(nextId);
  if (!lesson) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <button class="continue-banner" id="continue-btn">
      <span class="cb-icon">▶</span>
      <span class="cb-text">
        <span class="cb-label">Carry on where you stopped</span>
        <span class="cb-title">${escapeHtml(lesson.title)}</span>
      </span>
      <span class="cb-arrow">→</span>
    </button>
  `;
  document.getElementById('continue-btn').addEventListener('click', () => navigateTo(`/lesson/${encodeURIComponent(nextId)}`));
}

function renderGroups(progressMap) {
  const wrap = document.getElementById('lesson-groups');
  const topics = getTopicsForStage(currentStage);
  wrap.innerHTML = topics.map((topic) => {
    const lessons = getLessonsByTopic(currentStage, topic);
    return `
      <section class="lesson-group">
        <h2 class="group-title"><span class="group-emoji">${TOPIC_EMOJI[topic] || '⭐'}</span> ${escapeHtml(topic)}</h2>
        <div class="lesson-cards">
          ${lessons.map((l) => cardHTML(l, progressMap[l.id])).join('')}
        </div>
      </section>
    `;
  }).join('');

  wrap.querySelectorAll('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.getAttribute('data-go')));
  });
}

function cardHTML(lesson, progress) {
  const emoji = TOPIC_EMOJI[lesson.topic] || '⭐';
  const id = encodeURIComponent(lesson.id);
  const teaching = getTeaching(lesson.id);
  const hasStory = !!(teaching && teaching.story && teaching.story.scenes && teaching.story.scenes.length);
  const hasPlain = !!(teaching && teaching.plain && teaching.plain.length);

  // Only show a button when there is real content behind it.
  const storyBtn = hasStory ? `<button class="act" data-go="/lesson/${id}"><span class="act-i">📖</span>Story</button>` : '';
  const explainBtn = hasPlain ? `<button class="act" data-go="/lesson/${id}?view=plain"><span class="act-i">📝</span>Explain</button>` : '';
  const videoBtn = lesson.youtubeId ? `<button class="act" data-go="/lesson/${id}?view=video"><span class="act-i">▶</span>Video</button>` : '';

  return `
    <div class="lesson-card">
      <div class="lc-top">
        <div class="lc-icon">${emoji}</div>
        <div class="lc-main">
          <p class="lc-title">${escapeHtml(lesson.title)}</p>
          <p class="lc-objective">${escapeHtml(lesson.objective)}</p>
          ${badgeHTML(progress)}
        </div>
      </div>
      <div class="lc-actions">
        ${storyBtn}
        ${explainBtn}
        <button class="act act-primary" data-go="/practice/${id}"><span class="act-i">🎮</span>Practice</button>
        <button class="act" data-go="/worksheet/${id}"><span class="act-i">📄</span>Sheet</button>
        ${videoBtn}
      </div>
    </div>
  `;
}

function badgeHTML(progress) {
  if (!progress || !progress.attempts) {
    return `<span class="badge badge-new">Not started yet</span>`;
  }
  const stars = '★'.repeat(progress.stars) + '☆'.repeat(3 - progress.stars);
  if (progress.status === 'completed') {
    return `<span class="lc-progress"><span class="stars">${stars}</span>
      <span class="badge badge-mastered">✓ Mastered · best ${progress.bestScore}%</span></span>`;
  }
  return `<span class="lc-progress"><span class="stars">${stars}</span>
    <span class="badge badge-practice">Keep practising · last ${progress.lastScore}%</span></span>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
