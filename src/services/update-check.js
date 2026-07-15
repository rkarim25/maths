// =============================================================================
// Self-updating check for stale cached builds.
//
// GitHub Pages + iPad Safari (especially a saved home-screen page) can keep an
// old copy of the site alive for a long time, so new features "don't appear".
// Every build embeds a __BUILD_ID__ (vite.config.js) and ships a version.json
// with the same id. The app compares the two — on load, when the tab becomes
// visible again, and every 15 minutes — and reloads once if they differ.
//
// The reload only happens on "safe" screens (lessons list / hubs), never in the
// middle of an exercise, and only once per new build id so a misbehaving cache
// can't cause a reload loop.
// =============================================================================

const CHECK_EVERY_MS = 15 * 60 * 1000;
const RELOADED_KEY = 'updateReloadedFor';

// Screens where an automatic reload can't lose any work.
const SAFE_HASH_PREFIXES = ['/lessons', '/sync', '/puzzles', '/mental-maths', '/mocks', '/book', '/learn-tables'];

function currentBuildId() {
  try { return __BUILD_ID__; } catch (e) { return 'dev'; }
}

function onSafeScreen() {
  const hash = window.location.hash.replace('#', '') || '/lessons';
  return SAFE_HASH_PREFIXES.some((p) => hash === p || hash.startsWith(p));
}

async function fetchLiveBuildId() {
  const url = `${import.meta.env.BASE_URL}version.json?t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data && data.buildId ? String(data.buildId) : null;
}

async function checkOnce() {
  try {
    const live = await fetchLiveBuildId();
    if (!live || live === currentBuildId()) return;
    // Newer build deployed. Reload once for it, and only from a safe screen.
    if (sessionStorage.getItem(RELOADED_KEY) === live) return;
    if (!onSafeScreen()) return;              // try again on the next check
    sessionStorage.setItem(RELOADED_KEY, live);
    window.location.reload();
  } catch (e) { /* offline or dev server — fine */ }
}

export function startUpdateCheck() {
  checkOnce();
  setInterval(checkOnce, CHECK_EVERY_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkOnce();
  });
}
