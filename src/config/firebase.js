// =============================================================================
// Firebase config for cross-device cloud sync. PASTE YOUR config below.
// See SYNC-SETUP.md (repo root) for the 5-minute, one-time setup.
//
// Until apiKey + projectId are filled in, cloud sync stays OFF and the app
// works exactly as before (data saved on each device only). The Firebase web
// config is NOT secret — it is safe to commit; security is enforced by the
// Firestore rules in SYNC-SETUP.md.
// =============================================================================

export const firebaseConfig = {
  apiKey: 'AIzaSyAgdobBWYUdPmxpyxdUpSUkdSysqYQbNBE',
  authDomain: 'kid-s-maths.firebaseapp.com',
  projectId: 'kid-s-maths',
  storageBucket: 'kid-s-maths.firebasestorage.app',
  messagingSenderId: '628005645770',
  appId: '1:628005645770:web:2f9760ea95bede170b7333',
  measurementId: 'G-0H6QDFF8RW'
};

export function isConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
