// =============================================================================
// Cross-device cloud sync via Firebase Firestore (loaded lazily from the
// official gstatic CDN, only when configured). Every device uses the SAME
// family code — 2353, the same number as the parent PIN — so they all
// read/write one shared Firestore document (families/2353) and Liyana's
// progress and photo follow her everywhere.
//
// Strategy: pull on start + live onSnapshot (remote changes) + debounced push.
// Merging is additive (importData upserts), so answers from both devices unite.
// If not configured, every function is a safe no-op.
//
// See docs/SYNC.md for the full design and troubleshooting guide.
// =============================================================================
import { firebaseConfig, isConfigured } from '../config/firebase.js';

const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
const CODE_KEY = 'familyCode';

// One family, one code. 2353 is also the parent PIN, so there is a single
// number to remember: it unlocks the Grown-ups area AND joins a device to sync.
export const DEFAULT_FAMILY_CODE = '2353';

let db = null, fns = null, familyCode = null, connected = false, unsub = null, pushTimer = null, lastSig = '';

export function isSyncConfigured() { return isConfigured(); }
export function getFamilyCode() { return localStorage.getItem(CODE_KEY) || ''; }
export function isConnected() { return connected; }

async function loadFirebase() {
  if (db) return true;
  if (!isConfigured()) return false;
  const appMod = await import(/* @vite-ignore */ FB + 'firebase-app.js');
  const fsMod = await import(/* @vite-ignore */ FB + 'firebase-firestore.js');
  const authMod = await import(/* @vite-ignore */ FB + 'firebase-auth.js');
  const app = appMod.initializeApp(firebaseConfig);
  db = fsMod.getFirestore(app);
  fns = { doc: fsMod.doc, getDoc: fsMod.getDoc, setDoc: fsMod.setDoc, onSnapshot: fsMod.onSnapshot };
  await authMod.signInAnonymously(authMod.getAuth(app));
  return true;
}

async function snapshotFor(profileId) {
  const an = await import('./analysis.js');
  return an.buildExport(profileId);
}
async function mergeIn(profileId, data) {
  const snap = data && data.snapshot ? data.snapshot : data;
  if (!snap) return;
  const tr = await import('./tracking.js');
  await tr.importData(profileId, snap);
}

export async function pushNow(profileId) {
  if (!connected || !db) return;
  const snapshot = await snapshotFor(profileId);
  // Skip the write when nothing has changed since the last successful push.
  // The photo length is part of the signature so a photo-only change syncs too.
  const sig = [
    (snapshot.answer_log || []).length,
    (snapshot.progress || []).length,
    (snapshot.summary && snapshot.summary.lastActive) || '',
    (snapshot.profile && snapshot.profile.avatarImage) ? snapshot.profile.avatarImage.length : 0
  ].join('|');
  if (sig === lastSig) return;
  await fns.setDoc(fns.doc(db, 'families', familyCode), { snapshot, updatedAt: Date.now() });
  lastSig = sig;    // only after a successful write, so a failed push is retried
}

export async function pullNow(profileId) {
  if (!connected || !db) return false;
  try {
    const snap = await fns.getDoc(fns.doc(db, 'families', familyCode));
    if (snap.exists()) { await mergeIn(profileId, snap.data()); return true; }
  } catch (e) { /* offline — fine */ }
  return false;
}

export async function startSync(profileId, onRemote) {
  if (!isConfigured()) return;
  let code = getFamilyCode();
  if (!code) return;
  if (!(await loadFirebase())) return;

  // Migration (July 2026): older builds suggested a random 'fam-…' code per
  // device, which split the family across different cloud documents (the iPad
  // ended up alone on its own code). Pull this device's old document once so
  // nothing is lost, then hop onto the single family code.
  if (code !== DEFAULT_FAMILY_CODE && code.startsWith('fam-')) {
    familyCode = code; connected = true;
    try { await pullNow(profileId); } catch (e) { /* offline — migrate anyway */ }
    localStorage.setItem(CODE_KEY, DEFAULT_FAMILY_CODE);
    code = DEFAULT_FAMILY_CODE;
    connected = false; lastSig = '';
  }

  familyCode = code; connected = true;

  await pullNow(profileId);
  try { await pushNow(profileId); } catch (e) { /* offline — the timer retries */ }

  try {
    unsub = fns.onSnapshot(fns.doc(db, 'families', familyCode), (snap) => {
      if (snap.metadata && snap.metadata.hasPendingWrites) return;   // ignore our own writes
      if (snap.exists()) mergeIn(profileId, snap.data()).then(() => { if (onRemote) onRemote(); }).catch(() => {});
    });
  } catch (e) { /* noop */ }

  if (pushTimer) clearInterval(pushTimer);
  pushTimer = setInterval(() => pushNow(profileId).catch(() => {}), 8000);
  window.addEventListener('beforeunload', () => { try { pushNow(profileId); } catch (e) { /* noop */ } });
}

export async function connectSync(code, profileId, onRemote) {
  if (!code || !code.trim()) return false;
  localStorage.setItem(CODE_KEY, code.trim());
  connected = false; lastSig = '';
  if (unsub) { unsub(); unsub = null; }
  await startSync(profileId, onRemote);
  return connected;
}

// --- Coach note --------------------------------------------------------------
// The nightly coach routine writes an encouraging note + "do now" tasks to a
// SEPARATE document (families/2353-coach) — separate so pushNow, which replaces
// the whole snapshot document, can never wipe it. Read-only from the app; only
// available once this device has joined the family (sync on), so a random
// visitor to the public site never sees Liyana's personal note.
export async function fetchCoachDoc() {
  if (!connected || !db) return null;
  try {
    const snap = await fns.getDoc(fns.doc(db, 'families', `${familyCode}-coach`));
    return snap.exists() ? snap.data() : null;
  } catch (e) { return null; }
}

export function disconnectSync() {
  localStorage.removeItem(CODE_KEY);
  connected = false;
  if (unsub) { unsub(); unsub = null; }
  if (pushTimer) { clearInterval(pushTimer); pushTimer = null; }
}
