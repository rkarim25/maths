#!/usr/bin/env node
// =============================================================================
// Coach note publisher — step 2 of the coach routine (see docs/COACH.md).
//
// Reads a note JSON (file path as argv[2], or stdin) and, ONLY if it passes
// every guardrail, writes it to Firestore families/2353-coach. This script is
// the hard safety layer between whatever generated the note and what a
// 6-year-old reads: schema, length caps, route whitelist against the real
// curriculum, and a pressure-word screen. Validation failure exits 1 with the
// reasons — fix the note and run again. NEVER writes to families/2353 itself.
//
// Note JSON shape:
// {
//   "message":   "2-4 warm sentences to Liyana (required, <= 550 chars)",
//   "celebrate": "one short specific win (optional, <= 130 chars)",
//   "signoff":   "Your Maths Coach 🦉 (optional, <= 40 chars)",
//   "doNow":     [ { "label": "...", "route": "/practice/count-to-10", "emoji": "🌟" } ]  // 0-3
//   "planNote":  "1-2 sentences for the PARENTS' dashboard/email, not shown to her (optional)"
// }
// =============================================================================
import { readFileSync } from 'node:fs';
import { getLesson } from '../src/data/curriculum.js';
import { getMethod } from '../src/data/mental-maths.js';

const PROJECT = 'kid-s-maths';
const API_KEY = 'AIzaSyAgdobBWYUdPmxpyxdUpSUkdSysqYQbNBE';
const FAMILY = '2353';

// Words that put pressure on an anxious child — refuse the note outright.
// Case-insensitive, whole-word. Keep this list in sync with docs/COACH.md.
const BANNED = [
  'hurry', 'rush', 'race', 'faster', 'quickly', 'behind', 'catch up',
  'fail', 'failure', 'failed', 'wrong answers', 'mistake', 'mistakes',
  'disappointed', 'disappointing', 'lazy', 'careless', 'slow', 'must',
  'have to', 'need to work', 'not good', 'worst', 'bad at', 'test you'
];

const errs = [];
const input = process.argv[2] ? readFileSync(process.argv[2], 'utf8') : readFileSync(0, 'utf8');
let note;
try { note = JSON.parse(input); } catch (e) { console.error('not valid JSON:', e.message); process.exit(1); }

function checkText(name, s, max, required = false) {
  if (s == null || s === '') { if (required) errs.push(`${name} is required`); return ''; }
  if (typeof s !== 'string') { errs.push(`${name} must be a string`); return ''; }
  const t = s.trim();
  if (t.length > max) errs.push(`${name} too long (${t.length} > ${max})`);
  if (/<[a-z/!]/i.test(t)) errs.push(`${name} must be plain text, no HTML/markdown tags`);
  const lower = ' ' + t.toLowerCase() + ' ';
  for (const w of BANNED) {
    if (lower.includes(' ' + w) || lower.includes(w + ' ')) errs.push(`${name} contains pressure word "${w}" — rephrase kindly`);
  }
  return t;
}

function validRoute(route) {
  if (typeof route !== 'string' || route.length > 80) return false;
  let m = route.match(/^\/(lesson|practice|worksheet)\/([a-z0-9-]+)$/);
  if (m) return !!getLesson(m[2]);
  m = route.match(/^\/mental-practice\/([a-z0-9-]+)$/);
  if (m) return !!getMethod(m[1]);
  if (/^\/assessment\/[1-4]$/.test(route)) return true;
  return ['/placement', '/mental-maths', '/puzzles', '/times-tables', '/learn-tables', '/mocks'].includes(route);
}

const clean = {
  message: checkText('message', note.message, 550, true),
  celebrate: checkText('celebrate', note.celebrate, 130),
  signoff: checkText('signoff', note.signoff, 40) || 'Your Maths Coach 🦉',
  planNote: checkText('planNote', note.planNote, 400),
  updatedAt: Date.now(),
  doNow: []
};

const tasks = Array.isArray(note.doNow) ? note.doNow : [];
if (tasks.length > 3) errs.push(`doNow has ${tasks.length} tasks — 3 at most (small and doable)`);
for (const t of tasks.slice(0, 3)) {
  const label = checkText('doNow.label', t && t.label, 64, true);
  if (!t || !validRoute(t.route)) errs.push(`doNow route invalid or unknown: ${t && t.route}`);
  else clean.doNow.push({ label, route: t.route, emoji: (t.emoji || '⭐').slice(0, 4) });
}

if (errs.length) {
  console.error('REFUSED — fix these and run again:');
  for (const e of errs) console.error(' -', e);
  process.exit(1);
}

// Firestore typed encoding
const enc = (v) => {
  if (v === null) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(enc) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } };
};

const auth = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"returnSecureToken":true}'
});
if (!auth.ok) { console.error('auth failed:', auth.status); process.exit(1); }
const token = (await auth.json()).idToken;

const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/families/${FAMILY}-coach`;
const res = await fetch(url, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ fields: Object.fromEntries(Object.entries(clean).map(([k, v]) => [k, enc(v)])) })
});
if (!res.ok) { console.error('Firestore write failed:', res.status, await res.text()); process.exit(1); }
console.log('published coach note ✓', JSON.stringify({ chars: clean.message.length, tasks: clean.doNow.length, celebrate: !!clean.celebrate }));
