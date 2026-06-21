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
 * Only sets up the hashchange listener — does NOT render immediately.
 * initApp() will call navigateTo() after DB is ready, which triggers rendering.
 */
export function initRouter() {
  // Listen for hash changes
  window.addEventListener('hashchange', handleRouteChange);
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
  
  // Parse the route to handle dynamic routes
  if (hash.startsWith('/strand/')) {
    // Handle strand detail route
    const strand = decodeURIComponent(hash.substring(8)); // Remove '/strand/' prefix
    renderStrandDetail(strand);
    return;
  }
  
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

/**
 * Render strand detail view
 * @param {string} strand - The strand name
 */
function renderStrandDetail(strand) {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  appElement.innerHTML = `
    <div class="strand-detail">
      <div class="header">
        <button id="back-btn" class="back-button">← Back to Map</button>
        <h1>${strand}</h1>
        <p>Explore the mathematical adventures in this land</p>
      </div>
      <div class="strand-content">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading adventures...</p>
        </div>
      </div>
    </div>
  `;
  
  // Add back button event listener
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigateTo('/world-map');
    });
  }
  
  // Load strand data
  loadStrandData(strand);
}

/**
 * Load strand data and render content
 * @param {string} strand - The strand name
 */
function loadStrandData(strand) {
  // Import the curriculum registry
  import('./config/curriculum-registry.js').then(({ CURRICULUM, STRANDS }) => {
    // Find episodes for this strand
    const episodes = [];
    
    // Search through all years and terms for episodes in this strand
    for (const year in CURRICULUM) {
      for (const term in CURRICULUM[year]) {
        const termEpisodes = CURRICULUM[year][term].filter(ep => ep.strand === strand);
        episodes.push(...termEpisodes);
      }
    }
    
    // Render the strand content
    renderStrandContent(strand, episodes);
  }).catch(error => {
    console.error('Failed to load curriculum data:', error);
    const contentElement = document.querySelector('.strand-content');
    if (contentElement) {
      contentElement.innerHTML = `
        <div class="error-message">
          <p>Failed to load adventures. Please try again.</p>
          <button id="retry-btn">Retry</button>
        </div>
      `;
      
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          loadStrandData(strand);
        });
      }
    }
  });
}

/**
 * Render strand content
 * @param {string} strand - The strand name
 * @param {Array} episodes - Array of episodes for this strand
 */
function renderStrandContent(strand, episodes) {
  const contentElement = document.querySelector('.strand-content');
  if (!contentElement) return;
  
  // If no episodes found, show a message
  if (episodes.length === 0) {
    contentElement.innerHTML = `
      <div class="no-episodes">
        <p>More adventures are coming soon to this land!</p>
        <button id="back-btn-2" class="secondary-btn">Back to Map</button>
      </div>
    `;
    
    const backBtn2 = document.getElementById('back-btn-2');
    if (backBtn2) {
      backBtn2.addEventListener('click', () => {
        navigateTo('/world-map');
      });
    }
    return;
  }
  
  // Create episode cards
  const episodesHTML = episodes.map(episode => `
    <div class="episode-card" data-episode-id="${episode.id}">
      <div class="episode-header">
        <h3>${episode.title}</h3>
        <div class="episode-meta">
          <span class="skill-tag">${episode.skillTag}</span>
          <span class="duration">10 min</span>
        </div>
      </div>
      <div class="episode-content">
        <p>${episode.description}</p>
        <div class="episode-actions">
          <button class="lesson-btn" data-episode-id="${episode.id}">📖 Story Lesson</button>
          <button class="practice-btn" data-episode-id="${episode.id}">🎮 Practice Game</button>
        </div>
      </div>
    </div>
  `).join('');
  
  contentElement.innerHTML = `
    <div class="episodes-grid">
      ${episodesHTML}
    </div>
    
    <div class="strand-summary">
      <h2>Your Progress</h2>
      <div class="progress-overview">
        <div class="progress-stat">
          <span class="stat-value">0/${episodes.length}</span>
          <span class="stat-label">Episodes Completed</span>
        </div>
        <div class="progress-stat">
          <span class="stat-value">0%</span>
          <span class="stat-label">Accuracy</span>
        </div>
        <div class="progress-stat">
          <span class="stat-value">0</span>
          <span class="stat-label">Gems Earned</span>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for episode actions
  const lessonButtons = document.querySelectorAll('.lesson-btn');
  lessonButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const episodeId = button.getAttribute('data-episode-id');
      alert(`Story lesson for ${episodeId} would start here`);
    });
  });
  
  const practiceButtons = document.querySelectorAll('.practice-btn');
  practiceButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const episodeId = button.getAttribute('data-episode-id');
      alert(`Practice game for ${episodeId} would start here`);
    });
  });
}
