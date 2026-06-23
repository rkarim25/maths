// =============================================================================
// Analysis & export service.
// Turns the raw tracked data into: per-skill stats, ranked weak areas,
// recommended next lessons, and a JSON/CSV export for offline analysis.
//
// The JSON export uses the same top-level keys (answer_log, weak_areas,
// usage_events) that tools/export-analyzer.mjs already reads, so the
// "export → analyse → plan next lessons" loop works end to end.
// =============================================================================
import { getAllLessons, getLesson, getLessonOrder } from '../data/curriculum.js';
import {
  getProgressMap, getAnswerLog, getAllWeakAreaStats, getUsageEvents
} from './tracking.js';
import { getProfile } from './profile-manager.js';
import { getMethod } from '../data/mental-maths.js';

const SEVERITY_RANK = { high: 0, medium: 1, low: 2, none: 3 };

// --- time score (parent-only) ------------------------------------------------
// Expected seconds per question by stage; the speed rating compares the child's
// actual pace to this. Captured silently — never shown to the child.
const STAGE_BASE = { 1: 8, 2: 10, 3: 12, 4: 15 };

function baselineSecondsForId(id) {
  if (id.startsWith('mock-')) return 15;
  const am = id.match(/^assessment-s(\d)-/);
  if (am) return STAGE_BASE[Number(am[1])] || 12;
  if (id.startsWith('trick-')) return 8;
  const lesson = getLesson(id);
  if (lesson) return STAGE_BASE[lesson.stage] || 10;
  return 10;
}

function speedRating(avgSec, baseline) {
  const ratio = baseline > 0 ? avgSec / baseline : 1;
  if (ratio <= 0.7) return { label: 'Lightning', emoji: '⚡⚡⚡', stars: 3, ratio };
  if (ratio <= 1.0) return { label: 'Quick', emoji: '⚡⚡', stars: 2, ratio };
  if (ratio <= 1.4) return { label: 'Steady', emoji: '⚡', stars: 1, ratio };
  return { label: 'Took time', emoji: '🐢', stars: 0, ratio };
}

function titleForId(id) {
  const lesson = getLesson(id);
  if (lesson) return { title: lesson.title, kind: 'Lesson' };
  let m = id.match(/^assessment-s(\d)-(\d+)$/);
  if (m) return { title: `Stage ${m[1]} · Assessment ${m[2]}`, kind: 'Assessment' };
  m = id.match(/^mock-(\d+)$/);
  if (m) return { title: `Mock Paper ${m[1]}`, kind: 'Mock' };
  m = id.match(/^trick-(.+)$/);
  if (m) { const meth = getMethod(m[1]); return { title: `Trick · ${meth ? meth.title : m[1]}`, kind: 'Mental' }; }
  return { title: id, kind: 'Other' };
}

// Per-exercise results with score + silent time + speed rating.
function buildResults(progressMap) {
  const rows = [];
  for (const [id, p] of Object.entries(progressMap)) {
    if (!p || !p.attempts) continue;
    const meta = titleForId(id);
    let speed = null;
    let avgSec = null;
    if (p.lastTimeMs != null && p.lastCount) {
      avgSec = (p.lastTimeMs / 1000) / p.lastCount;
      speed = speedRating(avgSec, baselineSecondsForId(id));
    }
    rows.push({
      id, title: meta.title, kind: meta.kind, attempts: p.attempts,
      bestScore: p.bestScore || 0, lastScore: p.lastScore || 0,
      lastAt: p.lastAttemptAt || null, avgSec, speed
    });
  }
  rows.sort((a, b) => String(b.lastAt || '').localeCompare(String(a.lastAt || '')));
  return rows;
}

/**
 * Full analysis for a profile.
 */
export async function analyzeProfile(profileId) {
  const [progressMap, answerLog, weakStats, events] = await Promise.all([
    getProgressMap(profileId),
    getAnswerLog(profileId),
    getAllWeakAreaStats(profileId),
    getUsageEvents(profileId)
  ]);

  const totalAnswers = answerLog.length;
  const totalCorrect = answerLog.filter((a) => a.correct).length;
  const overallAccuracy = totalAnswers ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  const lessons = getAllLessons();
  // Count only real lessons (exclude assessment/mock paper progress rows).
  const lessonProgress = Object.entries(progressMap).filter(([id]) => getLesson(id));
  const lessonsStarted = lessonProgress.length;
  const lessonsMastered = lessonProgress.filter(([, p]) => p.status === 'completed').length;

  const skills = weakStats
    .map((w) => ({
      skillTag: w.skillTag,
      strand: w.strand,
      total: w.totalAttempts,
      correct: w.correctAttempts,
      accuracy: w.accuracy,
      severity: w.severity,
      lessons: w.recommendedRemedialEpisodes || []
    }))
    .sort((a, b) => (SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]) || (a.accuracy - b.accuracy));

  const weakAreas = skills.filter((s) => s.severity && s.severity !== 'none');

  const results = buildResults(progressMap);
  const timed = results.filter((r) => r.speed);
  const overallTimeScore = timed.length
    ? speedRating(timed.reduce((acc, r) => acc + r.speed.ratio, 0) / timed.length, 1)
    : null;
  const timeOnTaskMin = Math.round(
    Object.values(progressMap).reduce((acc, p) => acc + (p.totalTimeMs || 0), 0) / 60000
  );

  return {
    profileId,
    summary: {
      totalAnswers,
      overallAccuracy,
      lessonsStarted,
      lessonsTotal: lessons.length,
      lessonsMastered,
      lastActive: lastTimestamp(answerLog, events),
      timeOnTaskMin,
      overallTimeScore: overallTimeScore
        ? { label: overallTimeScore.label, emoji: overallTimeScore.emoji, stars: overallTimeScore.stars }
        : null
    },
    skills,
    weakAreas,
    recommendations: recommendFrom(progressMap, weakAreas),
    results,
    progressMap
  };
}

function lastTimestamp(answerLog, events) {
  const all = [...answerLog.map((a) => a.timestamp), ...events.map((e) => e.timestamp)].sort();
  return all.length ? all[all.length - 1] : null;
}

/**
 * Recommend what to do next: remedial first (weak skills), then the next new
 * lesson in curriculum order. Returns [{ lessonId, title, reason, kind }].
 */
function recommendFrom(progressMap, weakAreas, limit = 5) {
  const recs = [];
  const used = new Set();

  for (const w of weakAreas) {
    for (const lessonId of w.lessons) {
      if (used.has(lessonId)) continue;
      const lesson = getLesson(lessonId);
      if (!lesson) continue;
      recs.push({
        lessonId,
        title: lesson.title,
        kind: 'revisit',
        reason: `Revisit — ${w.accuracy}% correct on "${prettyTag(w.skillTag)}"`
      });
      used.add(lessonId);
      break; // one lesson per weak skill keeps the list varied
    }
    if (recs.length >= limit) break;
  }

  // fill with the next not-yet-mastered lessons in order
  for (const lessonId of getLessonOrder()) {
    if (recs.length >= limit) break;
    if (used.has(lessonId)) continue;
    const p = progressMap[lessonId];
    if (p && p.status === 'completed') continue;
    const lesson = getLesson(lessonId);
    recs.push({
      lessonId,
      title: lesson.title,
      kind: p ? 'continue' : 'new',
      reason: p ? 'Keep practising to master it' : 'Next new lesson on the path'
    });
    used.add(lessonId);
  }

  return recs.slice(0, limit);
}

/**
 * The single lesson the table should highlight as "next".
 */
export function nextLessonId(progressMap) {
  for (const lessonId of getLessonOrder()) {
    const p = progressMap[lessonId];
    if (!p || p.status !== 'completed') return lessonId;
  }
  return getLessonOrder()[getLessonOrder().length - 1];
}

function prettyTag(tag) {
  return String(tag).replace(/-/g, ' ');
}

// --- export ------------------------------------------------------------------

/**
 * Build the full JSON export object for a profile.
 */
export async function buildExport(profileId, profileName = '') {
  const [progressMap, answerLog, weakStats, events] = await Promise.all([
    getProgressMap(profileId),
    getAnswerLog(profileId),
    getAllWeakAreaStats(profileId),
    getUsageEvents(profileId)
  ]);
  const analysis = await analyzeProfile(profileId);
  const profile = await getProfile(profileId);

  return {
    meta: {
      app: "Liyana's Maths",
      exportedAt: new Date().toISOString(),
      profileId,
      profileName
    },
    profile: profile ? { name: profile.name, avatarImage: profile.avatarImage || null, avatarConfig: profile.avatarConfig || null } : null,
    summary: analysis.summary,
    progress: Object.values(progressMap),
    answer_log: answerLog,
    weak_areas: weakStats,
    usage_events: events
  };
}

/**
 * CSV of the answer log — the most useful sheet for spreadsheet analysis.
 */
export function answerLogToCSV(answerLog) {
  const cols = ['timestamp', 'episodeId', 'skillTag', 'strand', 'questionText',
    'userAnswer', 'correctAnswer', 'correct', 'timeSpentMs', 'hintUsed'];
  const esc = (v) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [cols.join(',')];
  for (const a of answerLog) rows.push(cols.map((c) => esc(a[c])).join(','));
  return rows.join('\n');
}

/**
 * Trigger a browser download of a string as a file.
 */
export function downloadFile(filename, content, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
