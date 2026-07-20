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
import { isSyncConfigured, isConnected } from '../services/sync.js';
import { getCoachNote, getCachedNoteSync } from '../services/coach.js';
import { getSunshinePoints } from '../services/points.js';
import { playB64, stopVoice } from '../services/voice.js';

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
  const savedStage = Number(sessionStorage.getItem('selectedStage'));
  currentStage = (savedStage && STAGES[savedStage]) ? savedStage
    : (profile.currentYear && STAGES[profile.currentYear] ? profile.currentYear : 1);

  const [progressMap, sunshinePoints] = await Promise.all([
    getProgressMap(profileId),
    getSunshinePoints(profileId).catch(() => 0)
  ]);
  const totalStars = Object.values(progressMap).reduce((s, p) => s + (p.stars || 0), 0);
  const initial = (profile.name || '?').charAt(0).toUpperCase();

  app.innerHTML = `
    <div class="lessons-screen">
      <header class="ls-header">
        <div class="ls-who">
          <div class="ls-avatar">${profile.avatarImage ? `<img src="${profile.avatarImage}" alt="${escapeHtml(profile.name)}">` : initial}</div>
          <div>
            <h1>Hi ${escapeHtml(profile.name)}!</h1>
            <p class="ls-sub" id="stage-sub"></p>
          </div>
        </div>
        <div class="ls-header-actions">
          <button class="ls-points" id="points-chip" title="Sunshine points — every go earns one">☀️ <span>${sunshinePoints}</span></button>
          <div class="ls-stars" title="Stars earned">⭐ <span>${totalStars}</span></div>
          <button class="icon-btn sync-btn" id="sync-btn" title="Sync across devices">${(isSyncConfigured() && isConnected()) ? '☁️✓' : '☁️'}</button>
          <button class="icon-btn grownups-btn" id="grownups-btn" title="Grown-ups">🔒</button>
        </div>
      </header>

      <div class="quick-links">
        <button class="chip" id="ql-level">🎯 Level check</button>
        <button class="chip" id="ql-learn">🔢 Learn tables</button>
        <button class="chip" id="ql-tt">🧮 Tables drill</button>
        <button class="chip" id="ql-fun">✨ Maths fun</button>
        <button class="chip" id="ql-puzzles">🧩 Puzzles</button>
        <button class="chip" id="ql-realworld">🌍 Real-world</button>
        <button class="chip" id="ql-mental">🧠 Mental maths</button>
        <button class="chip" id="ql-mocks">📝 Mock exams</button>
        <button class="chip" id="ql-book">📚 Print book</button>
      </div>

      <section id="coach-card"></section>

      <div class="stage-tabs" id="stage-tabs"></div>
      <div id="placement-banner"></div>
      <div id="continue-banner"></div>
      <div id="lesson-groups"></div>
    </div>
  `;

  document.getElementById('points-chip').addEventListener('click', showPointsToast);
  document.getElementById('grownups-btn').addEventListener('click', () => navigateTo('/grownups'));
  document.getElementById('sync-btn').addEventListener('click', () => navigateTo('/sync'));
  document.getElementById('ql-level').addEventListener('click', () => navigateTo('/placement'));
  document.getElementById('ql-tt').addEventListener('click', () => navigateTo('/times-tables'));
  document.getElementById('ql-learn').addEventListener('click', () => navigateTo('/learn-tables'));
  document.getElementById('ql-puzzles').addEventListener('click', () => navigateTo('/puzzles'));
  document.getElementById('ql-realworld').addEventListener('click', () => navigateTo(`/real-world/${currentStage}`));
  document.getElementById('ql-mental').addEventListener('click', () => navigateTo('/mental-maths'));
  document.getElementById('ql-fun').addEventListener('click', () => navigateTo(`/fun/${currentStage}`));
  document.getElementById('ql-mocks').addEventListener('click', () => navigateTo('/mocks'));
  document.getElementById('ql-book').addEventListener('click', () => navigateTo(`/book/${currentStage}`));

  renderPlacementBanner(progressMap);
  renderStageTabs();
  renderContinue(progressMap);
  renderGroups(progressMap);
  renderCoach(profile).catch(() => {});   // fills in when ready; never blocks the page
}

// Tapping the ☀️ chip explains sunshine points in one warm line. Points measure
// effort only and can never go down (see services/points.js) — the wording must
// never turn them into a target.
function showPointsToast() {
  const old = document.getElementById('points-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.id = 'points-toast';
  el.textContent = 'Every single go earns a sunshine point, and they can only ever grow — Mashallah! ☀️';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// The coach card — a personal note (written nightly, synced via the cloud) and
// up to three gentle "Do now" tasks. All text is escaped; routes are validated
// in services/coach.js. See docs/COACH.md.
//
// Paints instantly from the cached note (no blank flash), then swaps in the
// fresh copy ONLY if the words actually changed — so background refreshes are
// invisible rather than "blippy".
let coachNote = null;   // freshest note; the 🔊 button always reads this

async function renderCoach(profile) {
  const cached = getCachedNoteSync();
  if (cached) { coachNote = cached; paintCoach(profile, cached); }
  const note = await getCoachNote(profile.profileId, profile.name);
  if (!note || !document.getElementById('coach-card')) return;   // view may have changed
  const same = cached && JSON.stringify([cached.message, cached.celebrate, cached.doNow])
    === JSON.stringify([note.message, note.celebrate, note.doNow]);
  coachNote = note;                       // freshest copy (incl. audio) for 🔊
  if (!same) paintCoach(profile, note);   // repaint only when the words changed
}

function paintCoach(profile, note) {
  const el = document.getElementById('coach-card');
  if (!el) return;

  const face = profile.avatarImage
    ? `<img class="coach-face" src="${profile.avatarImage}" alt="">`
    : `<span class="coach-face coach-face-emoji">🦉</span>`;
  const tasks = (note.doNow || []).map((t, i) =>
    `<button class="coach-task" data-route="${escapeHtml(t.route)}">
       <span class="coach-task-emoji">${escapeHtml(t.emoji)}</span>
       <span class="coach-task-label">${escapeHtml(t.label)}</span>
       <span class="cb-arrow">→</span>
     </button>`).join('');

  el.innerHTML = `
    <div class="coach-card">
      <div class="coach-head">
        ${face}
        <p class="coach-title">A little note from Sunny 💌</p>
        <button class="icon-btn coach-speak" id="coach-speak" title="Read to me">🔊</button>
      </div>
      ${note.celebrate ? `<p class="coach-celebrate">🎉 ${escapeHtml(note.celebrate)}</p>` : ''}
      <p class="coach-msg">${escapeHtml(note.message)}</p>
      ${tasks ? `<p class="coach-donow-label">If you fancy it today:</p><div class="coach-tasks">${tasks}</div>` : ''}
      <p class="coach-sign">— ${escapeHtml(note.signoff)}</p>
    </div>`;

  el.querySelectorAll('.coach-task').forEach((b) =>
    b.addEventListener('click', () => { stopVoice(); navigateTo(b.dataset.route); }));
  const sp = document.getElementById('coach-speak');
  if (sp) sp.addEventListener('click', () => {
    const n = coachNote || note;   // freshest copy carries the audio
    playB64(n.audioB64, `${n.celebrate ? n.celebrate + '. ' : ''}${n.message}`);
  });
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
    sessionStorage.setItem('selectedStage', String(currentStage));
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

function renderPlacementBanner(progressMap) {
  const el = document.getElementById('placement-banner');
  if (!el) return;
  if (Object.keys(progressMap).length > 0) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <button class="placement-banner" id="placement-banner-btn">
      <span class="cb-icon">🎯</span>
      <span class="cb-text"><span class="cb-label">New here?</span><span class="cb-title">Take a quick level check</span></span>
      <span class="cb-arrow">→</span>
    </button>`;
  document.getElementById('placement-banner-btn').addEventListener('click', () => navigateTo('/placement'));
}

function renderGroups(progressMap) {
  const wrap = document.getElementById('lesson-groups');
  const topics = getTopicsForStage(currentStage);
  wrap.innerHTML = topics.map((topic) => {
    const lessons = getLessonsByTopic(currentStage, topic);
    // Mastered lessons fold away into a compact strip so she never has to
    // scroll past what's already done — one tap re-opens them for a replay.
    const done = lessons.filter((l) => progressMap[l.id] && progressMap[l.id].status === 'completed');
    const todo = lessons.filter((l) => !done.includes(l));
    const doneFold = done.length ? `
      <details class="done-fold">
        <summary>🏅 ${done.length} finished — hooray! <span class="done-hint">tap to peek</span></summary>
        <div class="lesson-cards">${done.map((l) => cardHTML(l, progressMap[l.id])).join('')}</div>
      </details>` : '';
    return `
      <section class="lesson-group">
        <h2 class="group-title"><span class="group-emoji">${TOPIC_EMOJI[topic] || '⭐'}</span> ${escapeHtml(topic)}</h2>
        ${todo.length ? `<div class="lesson-cards">${todo.map((l) => cardHTML(l, progressMap[l.id])).join('')}</div>` : ''}
        ${doneFold}
      </section>
    `;
  }).join('') + `
    <div class="assess-cta">
      <button class="assess-btn" data-go="/assessment/${currentStage}">
        <span class="assess-icon">📋</span>
        <span class="assess-text">
          <span class="assess-label">When you're ready</span>
          <span class="assess-title">Take the Stage ${currentStage} assessment</span>
        </span>
        <span class="cb-arrow">→</span>
      </button>
    </div>`;

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
  const videoBtn = (lesson.youtubeId || lesson.videoUrl) ? `<button class="act" data-go="/lesson/${id}?view=video"><span class="act-i">▶</span>Video</button>` : '';
  const dadBtn = lesson.dadVideo ? `<button class="act act-dad" data-go="/lesson/${id}?view=dad"><span class="act-i">👨‍👧</span>Dad’s video</button>` : '';

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
        <button class="act" data-go="/worksheet/${id}"><span class="act-i">🖨️</span>Print</button>
        ${videoBtn}
        ${dadBtn}
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
