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
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

export function isConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}
