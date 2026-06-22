// Main application entry point
import { initApp } from './app.js';
import { initRouter } from './router.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the database and profiles FIRST, then start the router so the
  // first view never renders against an uninitialised database.
  try {
    await initApp();
  } catch (error) {
    console.error('App init failed:', error);
  }
  initRouter();
});
