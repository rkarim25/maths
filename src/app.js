// Main application controller
import { initializeDatabase } from './services/db.js';
import { ensureSingleProfile, setCurrentProfileId } from './services/profile-manager.js';
import { logEvent } from './services/tracking.js';
import { startSync } from './services/sync.js';

// App state
let appState = {
  initialized: false,
  db: null,
  profiles: [],
  currentProfileId: null
};

/**
 * Initialize the main application
 */
export async function initApp() {
  try {
    // Show loading state
    showLoadingState();
    
    // Initialize the database
    appState.db = await initializeDatabase();
    
    // Single-profile mode: always use one canonical Liyana profile and enter
    // straight into the lessons (no profile chooser, no accidental new profiles).
    const profile = await ensureSingleProfile();
    setCurrentProfileId(profile.profileId);
    appState.currentProfileId = profile.profileId;
    appState.profiles = [profile];

    // Keep a deep link (e.g. #/lesson/count-to-10) on reload; else go to lessons.
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === '/profiles') window.location.hash = '/lessons';
    logEvent(profile.profileId, 'session-start', {}).catch(() => {});
    // Cross-device cloud sync (no-op unless Firebase is configured + a family code set).
    startSync(profile.profileId).catch(() => {});

    appState.initialized = true;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showErrorState('Failed to initialize the app. Please refresh the page.');
  }
}

/**
 * Show loading state
 */
function showLoadingState() {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading Liyana's Maths Adventure...</p>
      </div>
    `;
  }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
  // The router will replace the loading state with the actual view
}

/**
 * Show error state
 */
function showErrorState(message) {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.innerHTML = `
      <div class="error">
        <h2>Oops! Something went wrong</h2>
        <p>${message}</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
  }
}

/**
 * Get current app state
 */
export function getAppState() {
  return { ...appState };
}

/**
 * Set current profile
 */
export function setCurrentProfile(profileId) {
  appState.currentProfileId = profileId;
  // Store in localStorage for persistence
  localStorage.setItem('currentProfileId', profileId);
}