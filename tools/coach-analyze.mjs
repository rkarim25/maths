#!/usr/bin/env node
// =============================================================================
// Nightly coach analysis — step 1 of the coach routine (see docs/COACH.md).
//
// Checks the live site is healthy, pulls the family sync document from
// Firestore, and prints a single JSON report to stdout:
//   site health, activity in the last 7 days, per-skill accuracy, progress,
//   weak areas, what to celebrate, the next lesson on the path, whether an
//   assessment is due, and the current coach note (to avoid repeating it).
//
// Usage:  node tools/coach-analyze.mjs
// Needs only Node 18+ (built-in fetch). Read-only — writes nothing anywhere.
// =============================================================================
import { LESSONS, getLesson } from '../src/data/curriculum.js';
import { getMethod } from '../src/data/mental-maths.js';
import { getTeaching } from '../src/data/teaching.js';
import { computeSunshinePoints } from '../src/services/points.js';

const SITE = 'https://rkarim25.github.io/maths/';
const PROJECT = 'kid-s-maths';
const API_KEY = 'AIzaSyAgdobBWYUdPmxpyxdUpSUkdSysqYQbNBE';
const FAMILY = '2353';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

// --- Firestore typed-JSON → plain JS ----------------------------------------
function val(v) {
  if (v == null || typeof v !== 'object') return v;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, val(x)]));
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
  return v;
}

async function getToken() {
  const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"returnSecureToken":true}'
  });
  if (!r.ok) throw new Error(`auth failed: ${r.status}`);
  return (await r.json()).idToken;
}

async function getDoc(path, token) {
  const r = await fetch(`${BASE}/${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GET ${path}: ${r.status}`);
  const doc = await r.json();
  return val({ mapValue: { fields: doc.fields || {} } });
}

// --- site health --------------------------------------------------------------
async function checkSite() {
  const out = { ok: false, httpStatus: 0, buildId: null, hasAppMarkup: false, problems: [] };
  try {
    const r = await fetch(`${SITE}?t=${Date.now()}`, { cache: 'no-store' });
    out.httpStatus = r.status;
    const html = await r.text();
    out.hasAppMarkup = /id="app"/.test(html) && /assets\/main-.*\.js/.test(html);
    if (r.status !== 200) out.problems.push(`homepage HTTP ${r.status}`);
    if (!out.hasAppMarkup) out.problems.push('homepage missing app markup or bundle reference');
    const v = await fetch(`${SITE}version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (v.ok) out.buildId = (await v.json()).buildId || null;
    else out.problems.push(`version.json HTTP ${v.status}`);
  } catch (e) {
    out.problems.push(`fetch failed: ${e.message}`);
  }
  out.ok = out.problems.length === 0;
  return out;
}

// --- main ----------------------------------------------------------------------
const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const since7d = new Date(now - 7 * DAY).toISOString();

const site = await checkSite();
const token = await getToken();
const fam = await getDoc(`families/${FAMILY}`, token);
const coachDoc = await getDoc(`families/${FAMILY}-coach`, token);

if (!fam || !fam.snapshot) {
  console.log(JSON.stringify({ site, error: 'no family snapshot found' }, null, 2));
  process.exit(0);
}
const snap = fam.snapshot;
const answers = snap.answer_log || [];
const progress = snap.progress || [];

const recentAnswers = answers.filter((a) => (a.timestamp || '') >= since7d);
const recentCorrect = recentAnswers.filter((a) => a.correct).length;
const daysActive = new Set(recentAnswers.map((a) => (a.timestamp || '').slice(0, 10))).size;
const minutes7d = Math.round(recentAnswers.reduce((s, a) => s + (a.timeSpentMs || 0), 0) / 60000);

const bySkill = {};
for (const a of recentAnswers) {
  const t = a.skillTag || 'unknown';
  bySkill[t] = bySkill[t] || { total: 0, correct: 0 };
  bySkill[t].total++;
  if (a.correct) bySkill[t].correct++;
}
const bySkillRecent = Object.entries(bySkill)
  .map(([skillTag, s]) => ({ skillTag, ...s, accuracy: Math.round((s.correct / s.total) * 100) }))
  .sort((a, b) => a.accuracy - b.accuracy);

// Wobbles: recent skills under 80% with a meaningful sample. With none, the
// coach celebrates and stretches instead of remediating.
const wobbles = bySkillRecent.filter((s) => s.total >= 4 && s.accuracy < 80);

const titled = (id) => {
  const l = getLesson(id);
  if (l) return l.title || l.objective || id;
  const m = id && id.startsWith('trick-') ? getMethod(id.slice(6)) : null;
  return m ? `mental trick: ${m.title}` : id;
};
const progressOut = progress
  .map((p) => ({ id: p.episodeId, title: titled(p.episodeId), status: p.status, best: p.bestScore, stars: p.stars, attempts: p.attempts, lastAttemptAt: p.lastAttemptAt }))
  .sort((a, b) => String(b.lastAttemptAt || '').localeCompare(String(a.lastAttemptAt || '')));
const completedIds = new Set(progress.filter((p) => p.status === 'completed').map((p) => p.episodeId));
const nextOnPath = LESSONS.find((l) => !completedIds.has(l.id));

// The next few lessons she'll reach, with content flags — lessons missing a
// video are things Dad could record (the app shows a "Dad's video" button the
// moment `dadVideo` is set in curriculum.js). Feeds the weekly parent email.
const upcoming = LESSONS.filter((l) => !completedIds.has(l.id)).slice(0, 6).map((l) => {
  const t = getTeaching(l.id);
  return {
    id: l.id, title: l.title, topic: l.topic, route: `/lesson/${l.id}`,
    hasStory: !!(t && t.story && t.story.scenes && t.story.scenes.length),
    hasVideo: !!(l.youtubeId || l.videoUrl),
    hasDadVideo: !!l.dadVideo
  };
});
const videoGaps = upcoming.filter((l) => !l.hasVideo && !l.hasDadVideo);

// Sunshine points ☀️ — same formula the app header shows (src/services/points.js):
// effort only, monotonic. Sunny may celebrate the total or the week's earnings,
// never set a points target.
const allEvents = snap.usage_events || [];
const setsFinished = allEvents.filter((e) => e.eventType === 'lesson-complete');
const sunshinePoints = {
  total: computeSunshinePoints(answers.length, setsFinished.length),
  last7days: computeSunshinePoints(
    recentAnswers.length,
    setsFinished.filter((e) => (e.timestamp || '') >= since7d).length
  )
};

// Assessment cadence: suggest one when practice data is thin or none taken recently.
const assessAnswers = answers.filter((a) => /^s[1-4]-a|assessment|mock/i.test(a.episodeId || ''));
const assessEvents = (snap.usage_events || []).filter((e) => e.eventType === 'lesson-complete' && /assessment|mock|^s[1-4]-a/i.test((e.metadata && e.metadata.lessonId) || ''));
const lastAssessment = [...assessAnswers.map((a) => a.timestamp), ...assessEvents.map((e) => e.timestamp)].sort().pop() || null;
const daysSinceAssessment = lastAssessment ? Math.floor((now - Date.parse(lastAssessment)) / DAY) : null;
const needsAssessment = recentAnswers.length < 20 || daysSinceAssessment === null || daysSinceAssessment > 14;

console.log(JSON.stringify({
  generatedAt: new Date(now).toISOString(),
  site,
  summary: snap.summary || null,
  photoSynced: !!(snap.profile && snap.profile.avatarImage),
  last7days: {
    answers: recentAnswers.length,
    correct: recentCorrect,
    accuracy: recentAnswers.length ? Math.round((recentCorrect / recentAnswers.length) * 100) : null,
    daysActive,
    minutesOnTask: minutes7d
  },
  sunshinePoints,
  bySkillRecent,
  wobbles,
  progress: progressOut,
  totals: { completed: completedIds.size, started: progress.length, totalLessons: LESSONS.length },
  nextOnPath: nextOnPath ? { id: nextOnPath.id, title: nextOnPath.title || nextOnPath.objective, route: `/lesson/${nextOnPath.id}` } : null,
  upcoming,
  videoGaps,
  assessment: { lastAssessment, daysSinceAssessment, needsAssessment },
  currentCoachNote: coachDoc ? { message: coachDoc.message, celebrate: coachDoc.celebrate, doNow: coachDoc.doNow, updatedAt: coachDoc.updatedAt } : null
}, null, 2));
