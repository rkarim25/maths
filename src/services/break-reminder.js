// =============================================================================
// Gentle break reminder — after ~30 minutes of actual use (only counts time
// while the tab is visible), a soft overlay suggests a stretch and a drink.
// One tap dismisses it; it won't nag again for another 15 minutes of use.
// Tone per docs/COACH.md: an invitation, never a telling-off, and it makes
// clear the maths will wait for her.
// =============================================================================
import { sayPhrase, stopVoice } from './voice.js';
import { BREAK_MESSAGES } from '../data/phrases.js';

const FIRST_AT_MS = 30 * 60 * 1000;     // first nudge after 30 active minutes
const REPEAT_MS = 15 * 60 * 1000;       // then every 15 active minutes
const TICK_MS = 5000;
const KEY_ACTIVE = 'activeMsToday';     // active ms, per calendar day
const KEY_SHOWN = 'breakShownAtMs';     // active-ms mark when last shown
const KEY_DAY = 'activeMsDay';

let started = false;

export function startBreakReminder() {
  if (started) return;
  started = true;

  const today = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(KEY_DAY) !== today) {
    localStorage.setItem(KEY_DAY, today);
    localStorage.setItem(KEY_ACTIVE, '0');
    localStorage.setItem(KEY_SHOWN, '0');
  }

  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    const active = (Number(localStorage.getItem(KEY_ACTIVE)) || 0) + TICK_MS;
    localStorage.setItem(KEY_ACTIVE, String(active));
    const shownAt = Number(localStorage.getItem(KEY_SHOWN)) || 0;
    const due = shownAt === 0 ? active >= FIRST_AT_MS : active - shownAt >= REPEAT_MS;
    if (due && !document.getElementById('break-overlay')) {
      localStorage.setItem(KEY_SHOWN, String(active));
      showOverlay();
    }
  }, TICK_MS);
}

function showOverlay() {
  const msg = BREAK_MESSAGES[Math.floor(Math.random() * BREAK_MESSAGES.length)];
  const el = document.createElement('div');
  el.id = 'break-overlay';
  el.innerHTML = `
    <div class="break-card" role="dialog" aria-label="Break time suggestion">
      <div class="break-emoji">🧸💧</div>
      <h2>Little break time?</h2>
      <p>${msg.text}</p>
      <button class="primary-btn" id="break-ok">Okay! I'll be back 👋</button>
    </div>`;
  document.body.appendChild(el);
  document.getElementById('break-ok').addEventListener('click', () => { stopVoice(); el.remove(); });
  sayPhrase(msg);
}
