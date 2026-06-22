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

const SEVERITY_RANK = { high: 0, medium: 1, low: 2, none: 3 };

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
  const lessonsStarted = Object.keys(progressMap).length;
  const lessonsMastered = Object.values(progressMap).filter((p) => p.status === 'completed').length;

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

  return {
    profileId,
    summary: {
      totalAnswers,
      overallAccuracy,
      lessonsStarted,
      lessonsTotal: lessons.length,
      lessonsMastered,
      lastActive: lastTimestamp(answerLog, events)
    },
    skills,
    weakAreas,
    recommendations: recommendFrom(progressMap, weakAreas),
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

  return {
    meta: {
      app: "Liyana's Maths",
      exportedAt: new Date().toISOString(),
      profileId,
      profileName
    },
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
