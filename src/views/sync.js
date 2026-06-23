// Sync page — manage cross-device sync WITHOUT the parent PIN. The PIN only
// guards the grown-ups reports; turning sync on/off lives here, in the open.
// Once a family code is set, sync runs automatically in the background.
import { navigateTo } from '../router.js';
import { getCurrentProfileId } from '../services/profile-manager.js';
import {
  isSyncConfigured, getFamilyCode, isConnected, makeFamilyCode,
  connectSync, disconnectSync, pushNow, pullNow
} from '../services/sync.js';

export function renderSync() {
  const app = document.getElementById('app');
  if (!app) return;
  const pid = getCurrentProfileId();
  const connected = isSyncConfigured() && isConnected();
  const code = getFamilyCode();

  let body;
  if (!isSyncConfigured()) {
    body = `<p class="muted">Cloud sync isn't switched on for this app yet. The one-time setup is in <strong>SYNC-SETUP.md</strong>.</p>`;
  } else if (connected) {
    body = `
      <div class="sync-status on">☁️ Sync is ON — saving automatically</div>
      <p class="muted">Everything ${''}saves to all your devices on its own. You don't need to press anything.</p>
      <p class="sync-code-label">Your family code</p>
      <div class="sync-code-big">${esc(code)}</div>
      <p class="muted">To add another device: open this Sync page on it and enter the same code.</p>
      <div class="sync-row">
        <button class="secondary-btn" id="syncnow-btn">Sync now</button>
        <button class="danger-btn" id="syncoff-btn">Turn off on this device</button>
      </div>`;
  } else {
    const suggested = code || makeFamilyCode();
    body = `
      <div class="sync-status off">Sync is off on this device</div>
      <ol class="sync-steps">
        <li>Pick a family code (we made one for you below) and tap <strong>Turn on sync</strong>.</li>
        <li>On every other device, open this Sync page and enter the <strong>same</strong> code.</li>
        <li>That's it — from then on it syncs automatically.</li>
      </ol>
      <div class="sync-row">
        <input id="famcode-input" class="answer-input sync-input" placeholder="family code" value="${esc(suggested)}">
        <button class="secondary-btn" id="gencode-btn">New code</button>
      </div>
      <div class="sync-row">
        <button class="primary-btn" id="syncon-btn">Turn on sync</button>
      </div>`;
  }

  app.innerHTML = `
    <div class="grownups sync-page">
      <header class="lp-header">
        <button class="back-button" id="back-btn">← Back to lessons</button>
        <h1>☁️ Sync across devices</h1>
        <p class="lp-objective">Keep Liyana's progress, scores and photo the same on every phone, tablet and computer. No PIN needed here.</p>
      </header>
      <section class="gu-section sync-hero">
        ${body}
      </section>
    </div>`;

  document.getElementById('back-btn').addEventListener('click', () => navigateTo('/lessons'));

  const gen = document.getElementById('gencode-btn');
  if (gen) gen.addEventListener('click', () => { document.getElementById('famcode-input').value = makeFamilyCode(); });

  const on = document.getElementById('syncon-btn');
  if (on) on.addEventListener('click', async () => {
    const value = (document.getElementById('famcode-input').value || '').trim();
    if (!value) { alert('Enter a family code — the same one on each device.'); return; }
    on.disabled = true;
    on.textContent = 'Turning on…';
    const ok = await connectSync(value, pid);
    if (!ok) { alert('Could not connect. Check your internet and try again.'); on.disabled = false; on.textContent = 'Turn on sync'; return; }
    renderSync();
  });

  const now = document.getElementById('syncnow-btn');
  if (now) now.addEventListener('click', async () => {
    now.disabled = true; now.textContent = 'Syncing…';
    try { await pullNow(pid); await pushNow(pid); } catch (e) { /* offline ok */ }
    now.textContent = 'Synced ✓';
    setTimeout(() => { now.disabled = false; now.textContent = 'Sync now'; }, 1500);
  });

  const off = document.getElementById('syncoff-btn');
  if (off) off.addEventListener('click', () => { disconnectSync(); renderSync(); });
}

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[m]));
}
