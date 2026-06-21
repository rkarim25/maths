// Main application entry point
import { initApp } from './app.js';
import { initRouter } from './router.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Liyana\'s Maths Adventure is starting...');
  
  // Initialize the router
  initRouter();
  
  // Initialize the main app
  initApp();
  
  console.log('App initialized successfully!');
});