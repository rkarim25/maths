// =============================================================================
// Tracking service — the wiring that was missing.
// Every answer, every attempt, every session is written to IndexedDB here, and
// weak areas are recomputed from the answer log. This is what makes progress
// real and the Grown-ups reports / lesson-plan suggestions possible.
// =============================================================================
import {
  addToStore, getFromStore, updateInStore, getAllFromStore, deleteFromStore
} from './db.js';
import { generateUUID } from '../utils/uuid.js';
import { getLesson, getAllLessons } from '../data/curriculum.js';

const now = () => new Date().toISOString();

export function scoreToStars(pct) {
  if (pct >= 90) return 3;
  if (pct >= 70) return 2;
  if (pct >= 50) return 1;
  return 0;
}

export function severityFor(accuracy) {
  if (accuracy >= 80) return null;        // mastered, not a weak area
  if (accuracy >= 70) return 'low';
  if (accuracy >= 50) return 'medium';
  return 'high';
}

const MIN_ANSWERS_FOR_SEVERITY = 5;       // matches Math syllabus.md, Part D

// --- writes ------------------------------------------------------------------

/**
 * Record a single answer to answer_log.
 */
export async function recordAnswer({
  profileId, lessonId, skillTag, questionType, questionText,
  userAnswer, correctAnswer, correct, timeSpentMs = 0, hintUsed = false
}) {
  const lesson = getLesson(lessonId);
  const record = {
    answerId: generateUUID(),
    profileId,
    episodeId: lessonId,
    strand: lesson ? lesson.topic : 'Unknown',
    skillTag: skillTag || (lesson ? lesson.skillTags[0] : 'unknown'),
    questionType: questionType || 'mcq',
    questionText: questionText || '',
    userAnswer: String(userAnswer),
    correctAnswer: String(correctAnswer),
    correct: Boolean(correct),
    timeSpentMs,
    timestamp: now(),
    hintUsed: Boolean(hintUsed)
  };
  await addToStore('answer_log', record);
  return record;
}

/**
 * Record a completed practice attempt: upsert the lesson's progress row and log
 * a usage event. Returns { progress, stars, percent }.
 */
export async function recordAttempt(profileId, lessonId, { score, total, setName = 'A' }) {
  const lesson = getLesson(lessonId);
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  const stars = scoreToStars(percent);

  const key = [profileId, lessonId];
  const existing = await getFromStore('progress', key);

  const progress = existing || {
    profileId,
    episodeId: lessonId,
    strand: lesson ? lesson.topic : 'Unknown',
    skillTag: lesson ? lesson.skillTags[0] : 'unknown',
    status: 'in-progress',
    stars: 0,
    bestScore: 0,
    lastScore: 0,
    attempts: 0,
    firstCompletedAt: null,
    lastAttemptAt: null
  };

  progress.attempts += 1;
  progress.lastScore = percent;
  progress.bestScore = Math.max(progress.bestScore || 0, percent);
  progress.stars = Math.max(progress.stars || 0, stars);
  progress.lastAttemptAt = now();
  if (percent >= 80) {
    progress.status = 'completed';
    if (!progress.firstCompletedAt) progress.firstCompletedAt = now();
  } else if (progress.status !== 'completed') {
    progress.status = 'in-progress';
  }

  await updateInStore('progress', progress);
  await logEvent(profileId, 'lesson-complete', { lessonId, setName, score, total, percent, stars });
  await recomputeWeakAreas(profileId);

  return { progress, stars, percent };
}

/**
 * Record a score the parent entered for paper work. Writes synthetic per-skill
 * answers (so the skills breakdown and weak-area recommendations update) and a
 * progress attempt. Returns { progress, stars, percent }.
 */
export async function recordManualScore(profileId, lessonId, score, total) {
  const lesson = getLesson(lessonId);
  // For a real lesson, write synthetic per-skill answers so the skills breakdown
  // and weak-area recommendations update. For mixed papers (assessments / mocks,
  // which aren't lessons) just record the attempt — no skill to attribute to.
  if (lesson) {
    const skill = lesson.skillTags[0];
    for (let i = 0; i < total; i++) {
      const correct = i < score;
      await recordAnswer({
        profileId, lessonId, skillTag: skill, questionType: 'paper',
        questionText: 'Paper exercise', userAnswer: correct ? 'correct' : 'incorrect',
        correctAnswer: 'correct', correct, timeSpentMs: 0
      });
    }
  }
  return recordAttempt(profileId, lessonId, { score, total, setName: 'paper' });
}

/**
 * Log a usage event (session-start, lesson-start, lesson-complete, …).
 */
export async function logEvent(profileId, eventType, metadata = {}) {
  await addToStore('usage_events', {
    eventId: generateUUID(),
    profileId,
    eventType,
    metadata,
    timestamp: now()
  });
}

/**
 * Recompute weak areas for a profile from the full answer log.
 */
export async function recomputeWeakAreas(profileId) {
  const answers = await getAllFromStore('answer_log', 'profileId', profileId);
  const byTag = {};
  for (const a of answers) {
    const t = a.skillTag || 'unknown';
    if (!byTag[t]) byTag[t] = { total: 0, correct: 0, strand: a.strand, last: a.timestamp };
    byTag[t].total += 1;
    if (a.correct) byTag[t].correct += 1;
    if (a.timestamp > byTag[t].last) byTag[t].last = a.timestamp;
  }

  for (const [skillTag, s] of Object.entries(byTag)) {
    const accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    const severity = s.total >= MIN_ANSWERS_FOR_SEVERITY ? severityFor(accuracy) : null;
    const record = {
      profileId,
      skillTag,
      strand: s.strand || 'Unknown',
      totalAttempts: s.total,
      correctAttempts: s.correct,
      accuracy,
      severity: severity || 'none',
      lastEncountered: s.last,
      recommendedRemedialEpisodes: lessonsForSkill(skillTag)
    };
    await updateInStore('weak_areas', record);
  }
}

function lessonsForSkill(skillTag) {
  return getAllLessons().filter((l) => l.skillTags.includes(skillTag)).map((l) => l.id);
}

// --- reads -------------------------------------------------------------------

export async function getProgressMap(profileId) {
  const rows = await getAllFromStore('progress', 'profileId', profileId);
  const map = {};
  for (const r of rows) map[r.episodeId] = r;
  return map;
}

export async function getProgressForLesson(profileId, lessonId) {
  return getFromStore('progress', [profileId, lessonId]);
}

export async function getAnswerLog(profileId) {
  return getAllFromStore('answer_log', 'profileId', profileId);
}

export async function getWeakAreas(profileId) {
  const rows = await getAllFromStore('weak_areas', 'profileId', profileId);
  return rows.filter((r) => r.severity && r.severity !== 'none');
}

export async function getAllWeakAreaStats(profileId) {
  return getAllFromStore('weak_areas', 'profileId', profileId);
}

export async function getUsageEvents(profileId) {
  return getAllFromStore('usage_events', 'profileId', profileId);
}

// --- maintenance -------------------------------------------------------------

/**
 * Merge an exported data object into a profile (used by "Import data" so the
 * same child's progress can be moved between devices). All records are remapped
 * to `profileId` so they join this device's profile regardless of source id.
 */
export async function importData(profileId, data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid data');
  for (const p of data.progress || []) await updateInStore('progress', { ...p, profileId });
  for (const a of data.answer_log || []) await updateInStore('answer_log', { ...a, profileId });
  for (const e of data.usage_events || []) await updateInStore('usage_events', { ...e, profileId });
  await recomputeWeakAreas(profileId);
}

/**
 * Delete all tracked data for a profile (keeps the profile itself).
 */
export async function clearProfileData(profileId) {
  const answers = await getAllFromStore('answer_log', 'profileId', profileId);
  for (const a of answers) await deleteFromStore('answer_log', a.answerId);

  const events = await getAllFromStore('usage_events', 'profileId', profileId);
  for (const e of events) await deleteFromStore('usage_events', e.eventId);

  const progress = await getAllFromStore('progress', 'profileId', profileId);
  for (const p of progress) await deleteFromStore('progress', [p.profileId, p.episodeId]);

  const weak = await getAllFromStore('weak_areas', 'profileId', profileId);
  for (const w of weak) await deleteFromStore('weak_areas', [w.profileId, w.skillTag]);
}
