// Main application controller
import { navigateTo } from './router.js';
import { initializeDatabase } from './services/db.js';
import { loadProfiles, getCurrentProfileId } from './services/profile-manager.js';

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
    
    // Hide loading state
    hideLoadingState();
    
    // If no profile is selected, go to profile switcher
    if (!appState.currentProfileId) {
      navigateTo('/profile-switcher');
    } else {
      // Go to the main world map
      navigateTo('/world-map');
    }
    
    appState.initialized = true;
    console.log('App initialized with', appState.profiles.length, 'profiles');
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