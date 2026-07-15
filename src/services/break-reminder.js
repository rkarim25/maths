// =============================================================================
// Gentle break reminder — after ~30 minutes of actual use (only counts time
// while the tab is visible), a soft overlay suggests a stretch and a drink.
// One tap dismisses it; it won't nag again for another 15 minutes of use.
// Tone per docs/COACH.md: an invitation, never a telling-off, and it makes
// clear the maths will wait for her.
// =============================================================================
import { speak, stopSpeaking } from './tts.js';

const FIRST_AT_MS = 30 * 60 * 1000;     // first nudge after 30 active minutes
const REPEAT_MS = 15 * 60 * 1000;       // then every 15 active minutes
const TICK_MS = 5000;
const KEY_ACTIVE = 'activeMsToday';     // active ms, per calendar day
const KEY_SHOWN = 'breakShownAtMs';     // active-ms mark when last shown
const KEY_DAY = 'activeMsDay';

const MESSAGES = [
  "You've been doing such lovely thinking for a whole half hour! How about a little stretch and a drink of water? The maths will wait happily for you. 💧🧸",
  "What a lot of wonderful brain-work! Time for a wiggle, a stretch and maybe a snack. Everything here will be right where you left it. 🌈",
  "Your brain has been busy growing! A little rest makes it even stronger — go have a bounce and come back whenever you like. 🎈"
];

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
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  const el = document.createElement('div');
  el.id = 'break-overlay';
  el.innerHTML = `
    <div class="break-card" role="dialog" aria-label="Break time suggestion">
      <div class="break-emoji">🧸💧</div>
      <h2>Little break time?</h2>
      <p>${msg}</p>
      <button class="primary-btn" id="break-ok">Okay! I'll be back 👋</button>
    </div>`;
  document.body.appendChild(el);
  document.getElementById('break-ok').addEventListener('click', () => { stopSpeaking(); el.remove(); });
  speak(msg.replace(/[^\p{L}\p{N}\s,.!?'’—-]/gu, ''));
}
