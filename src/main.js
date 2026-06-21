// Main application entry point
import { initApp } from './app.js';
import { initRouter } from './router.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Liyana\'s Maths Adventure is starting...');
  
  // Initialize the router (sets up hashchange listener, but does NOT render yet)
  initRouter();
  
  // Initialize the main app FIRST (database, profiles)
  // This will call navigateTo() which triggers the router to render
  await initApp();
  
  console.log('App initialized successfully!');
});
