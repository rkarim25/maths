// Simple hash-based router
import { renderProfileSwitcher } from './views/profile-switcher.js';
import { renderProfileCreate } from './views/profile-create.js';
import { renderWorldMap } from './views/world-map.js';

// Route definitions
const routes = {
  '/profile-switcher': renderProfileSwitcher,
  '/profile-create': renderProfileCreate,
  '/world-map': renderWorldMap
};

// Current route state
let currentRoute = '';

/**
 * Initialize the router
 */
export function initRouter() {
  // Handle initial load
  handleRouteChange();
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleRouteChange);
  
  // Also listen for direct navigation
  window.addEventListener('load', handleRouteChange);
}

/**
 * Handle route changes
 */
function handleRouteChange() {
  // Get the current hash route (remove #)
  const hash = window.location.hash.replace('#', '') || '/profile-switcher';
  
  // If route hasn't changed, do nothing
  if (hash === currentRoute) return;
  
  currentRoute = hash;
  
  // Find and render the matching route
  const routeHandler = routes[hash] || routes['/profile-switcher'];
  
  if (routeHandler) {
    routeHandler();
  } else {
    // Fallback to profile switcher
    renderProfileSwitcher();
  }
}

/**
 * Navigate to a specific route
 * @param {string} path - The route path to navigate to
 */
export function navigateTo(path) {
  // Update the hash which will trigger the hashchange event
  window.location.hash = path;
}

/**
 * Get current route
 */
export function getCurrentRoute() {
  return currentRoute;
}