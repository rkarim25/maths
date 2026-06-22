// =============================================================================
// Cross-device cloud sync via Firebase Firestore (loaded lazily from the
// official gstatic CDN, only when configured). Both devices use the SAME
// "family code" → they read/write one shared Firestore document, so Liyana's
// progress follows her everywhere.
//
// Strategy: pull on start + live onSnapshot (remote changes) + debounced push.
// Merging is additive (importData upserts), so answers from both devices unite.
// If not configured, every function is a safe no-op.
// =============================================================================
import { firebaseConfig, isConfigured } from '../config/firebase.js';

const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
const CODE_KEY = 'familyCode';

let db = null, fns = null, familyCode = null, connected = false, unsub = null, pushTimer = null, lastSig = '';

export function isSyncConfigured() { return isConfigured(); }
export function getFamilyCode() { return localStorage.getItem(CODE_KEY) || ''; }
export function isConnected() { return connected; }
export function makeFamilyCode() {
  return 'fam-' + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
}

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
  const sig = `${(snapshot.answer_log || []).length}|${(snapshot.progress || []).length}|${(snapshot.summary && snapshot.summary.lastActive) || ''}`;
  if (sig === lastSig) return;          // nothing new since last push
  lastSig = sig;
  await fns.setDoc(fns.doc(db, 'families', familyCode), { snapshot, updatedAt: Date.now() });
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
  const code = getFamilyCode();
  if (!code) return;
  if (!(await loadFirebase())) return;
  familyCode = code; connected = true;

  await pullNow(profileId);
  await pushNow(profileId);

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
  connected = false;
  if (unsub) { unsub(); unsub = null; }
  await startSync(profileId, onRemote);
  return connected;
}

export function disconnectSync() {
  localStorage.removeItem(CODE_KEY);
  connected = false;
  if (unsub) { unsub(); unsub = null; }
  if (pushTimer) { clearInterval(pushTimer); pushTimer = null; }
}
