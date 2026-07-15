// =============================================================================
// Coach note — a warm, personal message and up to three gentle "Do now" tasks,
// shown on the home screen. Written nightly by the coach routine into
// families/2353-coach (see docs/COACH.md for the schema, tone rules and
// guardrails); this module is the app-side guardrail layer.
//
// Everything read from the cloud is treated as UNTRUSTED data:
//   - all text is length-capped here and HTML-escaped by the view (never
//     rendered as HTML),
//   - task routes must match a whitelist of known app routes AND (for lesson /
//     trick routes) an id that actually exists in the curriculum,
//   - at most 3 tasks are kept,
//   - a stale note (> 7 days) is dropped in favour of the local fallback, so
//     a broken routine can never leave weeks-old instructions in front of her.
// =============================================================================
import { fetchCoachDoc, isConnected } from './sync.js';
import { getLesson } from '../data/curriculum.js';
import { getMethod } from '../data/mental-maths.js';
import { nextLessonId } from './analysis.js';
import { getProgressMap } from './tracking.js';

const CACHE_KEY = 'coachNote';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * The note to show on the home screen. Always resolves (falls back to a local
 * gentle default) — never throws, never blocks rendering for long.
 */
export async function getCoachNote(profileId, profileName) {
  let note = null;
  if (isConnected()) {
    const raw = await fetchCoachDoc();
    note = sanitize(raw);
    if (note) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(note)); } catch (e) { /* full — fine */ } }
  }
  if (!note) note = readCache();
  if (!note) note = await localFallback(profileId, profileName);
  return note;
}

function readCache() {
  try {
    const note = sanitize(JSON.parse(localStorage.getItem(CACHE_KEY)));
    return note && !isStale(note) ? note : null;
  } catch (e) { return null; }
}

function isStale(note) {
  return !note.updatedAt || (Date.now() - note.updatedAt) > MAX_AGE_MS;
}

// --- validation ---------------------------------------------------------------

const clip = (s, n) => String(s == null ? '' : s).trim().slice(0, n);

// Routes a coach task may point at. Ids are verified against real content.
function validRoute(route) {
  if (typeof route !== 'string' || route.length > 80) return false;
  let m = route.match(/^\/(lesson|practice|worksheet)\/([a-z0-9-]+)$/);
  if (m) return !!getLesson(m[2]);
  m = route.match(/^\/mental-practice\/([a-z0-9-]+)$/);
  if (m) return !!getMethod(m[1]);
  if (/^\/assessment\/[1-4]$/.test(route)) return true;
  return ['/placement', '/mental-maths', '/puzzles', '/times-tables', '/learn-tables', '/mocks'].includes(route);
}

function sanitize(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const message = clip(raw.message, 600);
  if (!message) return null;
  const note = {
    message,
    celebrate: clip(raw.celebrate, 140),
    signoff: clip(raw.signoff, 48) || 'Sunny 🦉 — Daddy’s helper',
    updatedAt: Number(raw.updatedAt) || 0,
    doNow: []
  };
  if (isStale(note)) return null;
  const tasks = Array.isArray(raw.doNow) ? raw.doNow : [];
  for (const t of tasks) {
    if (!t || typeof t !== 'object') continue;
    const label = clip(t.label, 64);
    const route = typeof t.route === 'string' ? t.route.trim() : '';
    if (label && validRoute(route)) note.doNow.push({ label, route, emoji: clip(t.emoji, 4) || '⭐' });
    if (note.doNow.length >= 3) break;
  }
  return note;
}

// --- offline / first-run fallback ----------------------------------------------

async function localFallback(profileId, profileName) {
  const name = clip(profileName, 24) || 'superstar';
  let doNow = [];
  try {
    const progressMap = await getProgressMap(profileId);
    const nextId = nextLessonId(progressMap);
    const lesson = getLesson(nextId);
    if (lesson) doNow = [{ label: `Try “${lesson.title}”`, route: `/lesson/${lesson.id}`, emoji: '🌟' }];
  } catch (e) { /* fine */ }
  return {
    message: `Hello ${name}! It's me, Sunny — Daddy asked me to keep you company while you play. Pick whatever looks fun today — one little step at a time is exactly right. I'm so proud of how you keep going. 💜`,
    celebrate: '',
    signoff: 'Sunny 🦉 — Daddy’s helper',
    updatedAt: Date.now(),
    doNow
  };
}
