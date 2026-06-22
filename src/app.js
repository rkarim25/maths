// Main application controller
import { initializeDatabase } from './services/db.js';
import { loadProfiles, getCurrentProfileId } from './services/profile-manager.js';
import { logEvent } from './services/tracking.js';

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
    
    // Load profiles
    appState.profiles = await loadProfiles();
    
    // Get current profile (if any)
    appState.currentProfileId = getCurrentProfileId();
    
    // Choose a default route only when none is in the URL, so a reload on a
    // deep link (e.g. #/lesson/count-to-10) is preserved. The router renders.
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      window.location.hash = appState.currentProfileId ? '/lessons' : '/profiles';
    }
    if (appState.currentProfileId) {
      logEvent(appState.currentProfileId, 'session-start', {}).catch(() => {});
    }

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