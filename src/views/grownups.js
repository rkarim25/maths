// Grown-ups screen — PIN-gated results, recommendations and data export.
import { navigateTo } from '../router.js';
import { getCurrentProfileId, getProfile, verifyPin } from '../services/profile-manager.js';
import { analyzeProfile, buildExport, answerLogToCSV, downloadFile } from '../services/analysis.js';
import { getAnswerLog, clearProfileData } from '../services/tracking.js';
import { getLesson } from '../data/curriculum.js';

const SEVERITY_LABEL = { high: "Let's revisit", medium: 'Needs practice', low: 'Nearly there' };

export async function renderGrownups() {
  const profileId = getCurrentProfileId();
  const app = document.getElementById('app');
  if (!app) return;
  const profile = await getProfile(profileId);
  if (!profile) { navigateTo('/profiles'); return; }

  if (profile.pinHash) showLock(profile);
  else showDashboard(profileId, profile);
}

function showLock(profile) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="grownups">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back</button>
        <h1>🔒 Grown-ups area</h1>
        <p class="lp-objective">Enter the parent PIN to see ${escapeHtml(profile.name)}'s progress.</p>
      </header>
      <div class="pin-card">
        <input type="password" inputmode="numeric" maxlength="4" id="pin-input" class="answer-input" placeholder="••••">
        <button class="primary-btn" id="unlock-btn">Unlock</button>
        <p class="pin-error" id="pin-error" hidden>That PIN didn't match. Try again.</p>
      </div>
    </div>
  `;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  const input = document.getElementById('pin-input');
  const tryUnlock = async () => {
    const ok = await verifyPin(profile.profileId, input.value);
    if (ok) showDashboard(profile.profileId, profile);
    else { document.getElementById('pin-error').hidden = false; input.value = ''; input.focus(); }
  };
  document.getElementById('unlock-btn').addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
  input.focus();
}

async function showDashboard(profileId, profile) {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading progress…</p></div>`;
  const a = await analyzeProfile(profileId);

  app.innerHTML = `
    <div class="grownups">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>${escapeHtml(profile.name)}'s progress</h1>
        <p class="lp-objective">Use this to decide what to practise next, or export the data for a deeper look.</p>
      </header>

      <div class="stat-grid">
        ${stat('Overall accuracy', a.summary.totalAnswers ? a.summary.overallAccuracy + '%' : '—')}
        ${stat('Lessons mastered', a.summary.lessonsMastered + ' / ' + a.summary.lessonsTotal)}
        ${stat('Questions answered', a.summary.totalAnswers)}
        ${stat('Last active', fmtDate(a.summary.lastActive))}
      </div>

      <section class="gu-section">
        <h2>Suggested next lessons</h2>
        ${a.summary.totalAnswers === 0
          ? `<p class="muted">No practice data yet. Once ${escapeHtml(profile.name)} answers some questions, tailored suggestions appear here.</p>`
          : `<div class="rec-list">${a.recommendations.map(recRow).join('')}</div>`}
      </section>

      <section class="gu-section">
        <h2>Skills breakdown</h2>
        ${a.skills.length ? skillsTable(a.skills) : `<p class="muted">No skills tracked yet.</p>`}
      </section>

      <section class="gu-section">
        <h2>Export &amp; data</h2>
        <p class="muted">Export the full history to review it, keep a record, or share it for lesson-plan suggestions.</p>
        <div class="export-row">
          <button class="primary-btn" id="json-btn">⬇ Download JSON</button>
          <button class="secondary-btn" id="csv-btn">⬇ Download answers (CSV)</button>
          <button class="danger-btn" id="reset-btn">Reset ${escapeHtml(profile.name)}'s data</button>
        </div>
      </section>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  app.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => navigateTo(b.dataset.go)));

  document.getElementById('json-btn').addEventListener('click', async () => {
    const data = await buildExport(profileId, profile.name);
    downloadFile(`${slug(profile.name)}-maths-${today()}.json`, JSON.stringify(data, null, 2), 'application/json');
  });
  document.getElementById('csv-btn').addEventListener('click', async () => {
    const log = await getAnswerLog(profileId);
    downloadFile(`${slug(profile.name)}-answers-${today()}.csv`, answerLogToCSV(log), 'text/csv');
  });
  document.getElementById('reset-btn').addEventListener('click', async () => {
    if (!confirm(`Delete all progress for ${profile.name}? This cannot be undone.`)) return;
    await clearProfileData(profileId);
    showDashboard(profileId, profile);
  });
}

function stat(label, value) {
  return `<div class="stat-card"><span class="stat-label">${label}</span><span class="stat-value">${value}</span></div>`;
}

function recRow(r) {
  const tag = r.kind === 'revisit' ? '<span class="rec-tag revisit">Revisit</span>'
    : r.kind === 'continue' ? '<span class="rec-tag continue">Continue</span>'
    : '<span class="rec-tag new">New</span>';
  return `
    <div class="rec-row">
      <div class="rec-info">${tag}<span class="rec-title">${escapeHtml(r.title)}</span><span class="rec-reason">${escapeHtml(r.reason)}</span></div>
      <div class="rec-actions">
        <button class="mini-btn" data-go="/lesson/${encodeURIComponent(r.lessonId)}">Teach</button>
        <button class="mini-btn primary" data-go="/practice/${encodeURIComponent(r.lessonId)}">Practise</button>
      </div>
    </div>`;
}

function skillsTable(skills) {
  return `
    <div class="table-wrap">
      <table class="skills-table">
        <thead><tr><th>Skill</th><th>Accuracy</th><th>Answers</th><th>Status</th></tr></thead>
        <tbody>
          ${skills.map((s) => `
            <tr>
              <td>${escapeHtml(prettyTag(s.skillTag))}</td>
              <td>${s.accuracy}%</td>
              <td>${s.correct}/${s.total}</td>
              <td>${statusPill(s.severity)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function statusPill(severity) {
  if (!severity || severity === 'none') return `<span class="pill mastered">Mastered</span>`;
  return `<span class="pill sev-${severity}">${SEVERITY_LABEL[severity]}</span>`;
}

function prettyTag(tag) { return String(tag).replace(/-/g, ' '); }
function slug(name) { return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'player'; }
function today() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso) { return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'; }
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
