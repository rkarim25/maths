// =============================================================================
// Sunshine Points ☀️ — a gentle effort counter.
//
// Tone contract (docs/COACH.md): points measure EFFORT, never talent, speed or
// correctness. Every answer she gives earns a point — right or wrong — and
// finishing any practice set, trick or assessment adds a small bonus. Points
// only ever go UP: nothing expires, nothing resets, there are no streaks,
// targets, levels or comparisons. Because the number is derived from the
// synced answer log and usage events, every device agrees and her whole
// history counts from day one.
//
// tools/coach-analyze.mjs imports computeSunshinePoints so Sunny's nightly
// note sees exactly the same number the app shows. Keep the formula here —
// nowhere else.
// =============================================================================
import { getAnswerLog, getUsageEvents } from './tracking.js';

export const POINTS_PER_ANSWER = 1;   // every single go counts — right or wrong
export const POINTS_PER_SET = 5;      // finishing any set earns a sunny bonus

/** Pure formula: answers given + sets finished → points. App and analyzer share this. */
export function computeSunshinePoints(answerCount, setsFinished) {
  return (answerCount * POINTS_PER_ANSWER) + (setsFinished * POINTS_PER_SET);
}

/** Total Sunshine Points for a profile, derived from local (synced) data. */
export async function getSunshinePoints(profileId) {
  const [answers, events] = await Promise.all([
    getAnswerLog(profileId),
    getUsageEvents(profileId)
  ]);
  const setsFinished = events.filter((e) => e.eventType === 'lesson-complete').length;
  return computeSunshinePoints(answers.length, setsFinished);
}
