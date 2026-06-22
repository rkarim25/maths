// Grown-ups screen — ONE global parent area (single PIN, view any child).
import { navigateTo } from '../router.js';
import {
  getCurrentProfileId, loadProfiles, hasGlobalPin, hasCustomPin, verifyGlobalPin, setGlobalPin, deleteProfile
} from '../services/profile-manager.js';
import { analyzeProfile, buildExport, answerLogToCSV, downloadFile } from '../services/analysis.js';
import { getAnswerLog, clearProfileData, recordManualScore, importData } from '../services/tracking.js';
import { STAGES, getLessonsByStage } from '../data/curriculum.js';

const SEVERITY_LABEL = { high: "Let's revisit", medium: 'Needs practice', low: 'Nearly there' };

let profiles = [];
let viewingId = null;

export async function renderGrownups() {
  const app = document.getElementById('app');
  if (!app) return;
  profiles = await loadProfiles();
  if (!profiles.length) { navigateTo('/profiles'); return; }
  const current = getCurrentProfileId();
  viewingId = profiles.some((p) => p.profileId === current) ? current : profiles[0].profileId;
  if (hasGlobalPin()) showLock();
  else showDashboard();
}

function showLock() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="grownups">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back</button>
        <h1>🔒 Grown-ups area</h1>
        <p class="lp-objective">Enter the parent PIN to see progress and reports.</p>
      </header>
      <div class="pin-card">
        <input type="password" inputmode="numeric" maxlength="4" id="pin-input" class="answer-input" placeholder="••••">
        <button class="primary-btn" id="unlock-btn">Unlock</button>
        <p class="pin-error" id="pin-error" hidden>That PIN didn't match. Try again.</p>
      </div>
    </div>`;
  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  const input = document.getElementById('pin-input');
  const tryUnlock = async () => {
    if (await verifyGlobalPin(input.value)) showDashboard();
    else { document.getElementById('pin-error').hidden = false; input.value = ''; input.focus(); }
  };
  document.getElementById('unlock-btn').addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });
  input.focus();
}

async function showDashboard(flash) {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="loading"><div class="spinner"></div><p>Loading progress…</p></div>`;
  const a = await analyzeProfile(viewingId);
  const child = profiles.find((p) => p.profileId === viewingId) || profiles[0];
  const lessonOptions = [1, 2, 3, 4].map((st) =>
    `<optgroup label="Stage ${st}: ${esc(STAGES[st].name)}">${getLessonsByStage(st).map((l) => `<option value="${l.id}">${esc(l.title)}</option>`).join('')}</optgroup>`).join('');
  const others = profiles.filter((p) => p.profileId !== viewingId);

  const childPicker = profiles.length > 1
    ? `<label class="child-pick">Viewing
         <select id="child-select">${profiles.map((p) => `<option value="${p.profileId}" ${p.profileId === viewingId ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select>
       </label>`
    : `<span class="child-pick">Viewing <strong>${esc(child.name)}</strong></span>`;

  app.innerHTML = `
    <div class="grownups">
      ${flash ? `<div class="flash-note">✓ ${esc(flash)}</div>` : ''}
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>Grown-ups area</h1>
        <p class="lp-objective">Progress and reports for every child on this device. ${childPicker}</p>
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
          ? `<p class="muted">No practice data yet for ${esc(child.name)}. Tailored suggestions appear once they answer some questions.</p>`
          : `<div class="rec-list">${a.recommendations.map(recRow).join('')}</div>`}
      </section>

      <section class="gu-section">
        <h2>Skills breakdown</h2>
        ${a.skills.length ? skillsTable(a.skills) : `<p class="muted">No skills tracked yet.</p>`}
      </section>

      <section class="gu-section">
        <h2>Export &amp; data</h2>
        <p class="muted">Export ${esc(child.name)}'s full history to review it or share it for lesson-plan suggestions.</p>
        <div class="export-row">
          <button class="primary-btn" id="json-btn">⬇ Download JSON</button>
          <button class="secondary-btn" id="csv-btn">⬇ Download answers (CSV)</button>
          <button class="secondary-btn" id="import-btn">⬆ Import data</button>
          <button class="danger-btn" id="reset-btn">Reset ${esc(child.name)}'s data</button>
        </div>
        <p class="muted gu-note">⚠️ This site saves data on <em>this device only</em> — there is no shared server. To see the same progress on another device, use the same device, or Download here and Import there.</p>
        ${others.length ? `<p class="muted gu-note">There ${others.length === 1 ? 'is 1 other profile' : 'are ' + others.length + ' other profiles'} on this device. <button class="danger-btn" id="tidy-btn">Keep only ${esc(child.name)}</button></p>` : ''}
      </section>

      <section class="gu-section">
        <h2>Record a paper score</h2>
        <p class="muted">Did ${esc(child.name)} do a lesson on paper? Enter the score and it updates progress, skills and recommendations.</p>
        <div class="paper-row">
          <select id="paper-lesson">${lessonOptions}</select>
          <input id="paper-score" type="number" min="0" class="paper-num" placeholder="got">
          <span class="paper-sep">out of</span>
          <input id="paper-total" type="number" min="1" class="paper-num" placeholder="total">
          <button class="primary-btn" id="paper-save">Save score</button>
        </div>
      </section>

      <section class="gu-section">
        <h2>Parent PIN</h2>
        ${pinSettingsHTML()}
      </section>
    </div>`;

  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));
  const sel = document.getElementById('child-select');
  if (sel) sel.addEventListener('change', (e) => { viewingId = e.target.value; showDashboard(); });
  app.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => navigateTo(b.dataset.go)));

  document.getElementById('json-btn').addEventListener('click', async () => {
    const data = await buildExport(viewingId, child.name);
    downloadFile(`${slug(child.name)}-maths-${today()}.json`, JSON.stringify(data, null, 2), 'application/json');
  });
  document.getElementById('csv-btn').addEventListener('click', async () => {
    const log = await getAnswerLog(viewingId);
    downloadFile(`${slug(child.name)}-answers-${today()}.csv`, answerLogToCSV(log), 'text/csv');
  });
  document.getElementById('reset-btn').addEventListener('click', async () => {
    if (!confirm(`Delete all progress for ${child.name}? This cannot be undone.`)) return;
    await clearProfileData(viewingId);
    showDashboard();
  });
  document.getElementById('import-btn').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'application/json,.json';
    inp.addEventListener('change', async () => {
      const file = inp.files && inp.files[0];
      if (!file) return;
      try { await importData(viewingId, JSON.parse(await file.text())); showDashboard(`Imported and merged progress into ${child.name}.`); }
      catch (e) { alert('Sorry, that file could not be read. Please choose a JSON file exported from this app.'); }
    });
    inp.click();
  });
  const tidy = document.getElementById('tidy-btn');
  if (tidy) tidy.addEventListener('click', async () => {
    if (!confirm(`Remove all OTHER profiles and their data, keeping only ${child.name}?`)) return;
    for (const p of others) { await clearProfileData(p.profileId); await deleteProfile(p.profileId); }
    profiles = profiles.filter((p) => p.profileId === viewingId);
    showDashboard('Other profiles removed.');
  });

  const paperSave = document.getElementById('paper-save');
  paperSave.addEventListener('click', async () => {
    const lessonId = document.getElementById('paper-lesson').value;
    const score = Number(document.getElementById('paper-score').value);
    const total = Number(document.getElementById('paper-total').value);
    if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0 || score < 0 || score > total) {
      alert('Enter a score from 0 up to the total (e.g. 8 out of 10).');
      return;
    }
    paperSave.disabled = true;
    await recordManualScore(viewingId, lessonId, score, total);
    showDashboard(`Saved ${score} out of ${total} for ${child.name}. Recommendations updated.`);
  });

  wirePinSettings();
}

function pinSettingsHTML() {
  return hasCustomPin()
    ? `<p class="muted">A custom parent PIN is set on this device.</p>
       <div class="export-row">
         <button class="secondary-btn" id="changepin-btn">Change PIN</button>
         <button class="danger-btn" id="removepin-btn">Reset to default</button>
       </div>
       <div id="pin-form"></div>`
    : `<p class="muted">The parent area uses the default PIN <strong>2353</strong> on every device. You can set your own PIN to override it on this device.</p>
       <div class="pin-set-row">
         <input type="password" inputmode="numeric" maxlength="4" id="newpin-input" class="answer-input" placeholder="••••" style="width:120px">
         <button class="primary-btn" id="setpin-btn">Set custom PIN</button>
       </div>`;
}

function wirePinSettings() {
  const setBtn = document.getElementById('setpin-btn');
  if (setBtn) setBtn.addEventListener('click', async () => {
    const v = document.getElementById('newpin-input').value;
    if (!/^\d{4}$/.test(v)) { alert('Please enter a 4-digit number.'); return; }
    await setGlobalPin(v); showDashboard();
  });
  const changeBtn = document.getElementById('changepin-btn');
  if (changeBtn) changeBtn.addEventListener('click', () => {
    document.getElementById('pin-form').innerHTML = `
      <div class="pin-set-row">
        <input type="password" inputmode="numeric" maxlength="4" id="newpin-input" class="answer-input" placeholder="new ••••" style="width:140px">
        <button class="primary-btn" id="savepin-btn">Save</button>
      </div>`;
    document.getElementById('savepin-btn').addEventListener('click', async () => {
      const v = document.getElementById('newpin-input').value;
      if (!/^\d{4}$/.test(v)) { alert('Please enter a 4-digit number.'); return; }
      await setGlobalPin(v); showDashboard();
    });
  });
  const removeBtn = document.getElementById('removepin-btn');
  if (removeBtn) removeBtn.addEventListener('click', async () => {
    if (!confirm('Reset to the default PIN (2353)?')) return;
    await setGlobalPin(null); showDashboard();
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
      <div class="rec-info">${tag}<span class="rec-title">${esc(r.title)}</span><span class="rec-reason">${esc(r.reason)}</span></div>
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
          ${skills.map((sk) => `
            <tr>
              <td>${esc(prettyTag(sk.skillTag))}</td>
              <td>${sk.accuracy}%</td>
              <td>${sk.correct}/${sk.total}</td>
              <td>${statusPill(sk.severity)}</td>
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
function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
