// World map view
import { getAppState } from '../app.js';
import { getProfile } from '../services/profile-manager.js';
import { navigateTo } from '../router.js';
import { STRANDS, YEARS } from '../config/curriculum-registry.js';

/**
 * Render the world map view
 */
export async function renderWorldMap() {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  // Show loading state while fetching profile
  appElement.innerHTML = `
    <div class="world-map">
      <div class="header">
        <h1>The Kingdom of Numberland</h1>
        <p>Select a land to explore</p>
      </div>
      <div class="map-container">
        <div class="loading-map">
          <div class="spinner"></div>
          <p>Loading the kingdom map...</p>
        </div>
      </div>
    </div>
  `;
  
  try {
    // Get current profile
    const appState = getAppState();
    const profile = await getProfile(appState.currentProfileId);
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Render the world map
    renderMap(profile);
  } catch (error) {
    console.error('Failed to load world map:', error);
    appElement.innerHTML = `
      <div class="world-map">
        <div class="header">
          <h1>The Kingdom of Numberland</h1>
          <p>Select a land to explore</p>
        </div>
        <div class="map-container">
          <div class="error-message">
            <p>Failed to load the kingdom map. Please try again.</p>
            <button id="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listener for retry button
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', renderWorldMap);
    }
  }
}

/**
 * Render the world map with lands
 * @param {object} profile - The current profile
 */
function renderMap(profile) {
  const container = document.querySelector('.map-container');
  if (!container) return;
  
  // Get current year data
  const currentYear = YEARS[profile.currentYear] || YEARS[1];
  
  // Create land cards for each strand in the current year
  const landsHTML = currentYear.strands.map(strand => {
    // For now, we'll use a placeholder for progress
    // In a full implementation, this would come from the progress tracking system
    const progress = Math.floor(Math.random() * 4); // 0-3 stars for demo
    
    return `
      <div class="land-card" data-strand="${strand}">
        <div class="land-header">
          <h3>${strand}</h3>
          <div class="progress-stars">
            ${renderStars(progress)}
          </div>
        </div>
        <div class="land-content">
          <div class="land-icon">
            <!-- Land icon will be added later -->
            🌟
          </div>
          <p>${getStrandDescription(strand)}</p>
        </div>
        <div class="land-footer">
          <button class="explore-btn" data-strand="${strand}">
            Explore Land
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = `
    <div class="profile-header">
      <div class="profile-info">
        <h2>Welcome, ${profile.name}!</h2>
        <p>Year ${profile.currentYear} - ${currentYear.name}</p>
      </div>
      <div class="profile-actions">
        <button id="switch-profile-btn" class="secondary-btn">Switch Player</button>
        <button id="parent-dashboard-btn" class="secondary-btn">Parent Dashboard</button>
      </div>
    </div>
    
    <div class="lands-grid">
      ${landsHTML}
    </div>
    
    <div class="world-actions">
      <button id="treasure-cave-btn" class="secondary-btn">
        Treasure Cave 🏴‍☠️
      </button>
      <button id="avatar-customize-btn" class="secondary-btn">
        Customize Avatar 👕
      </button>
    </div>
  `;
  
  // Add event listeners
  setupEventListeners();
}

/**
 * Set up event listeners for the world map
 */
function setupEventListeners() {
  // Explore buttons for each land
  const exploreButtons = document.querySelectorAll('.explore-btn');
  exploreButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const strand = button.getAttribute('data-strand');
      // In a full implementation, this would navigate to the land detail view
      alert(`Exploring ${strand} land! This will show episodes for this strand.`);
    });
  });
  
  // Switch profile button
  const switchProfileBtn = document.getElementById('switch-profile-btn');
  if (switchProfileBtn) {
    switchProfileBtn.addEventListener('click', () => {
      navigateTo('/profile-switcher');
    });
  }
  
  // Parent dashboard button
  const parentDashboardBtn = document.getElementById('parent-dashboard-btn');
  if (parentDashboardBtn) {
    parentDashboardBtn.addEventListener('click', () => {
      // In a full implementation, this would show a PIN entry dialog
      alert('Parent dashboard would open here (PIN protected)');
    });
  }
  
  // Treasure cave button
  const treasureCaveBtn = document.getElementById('treasure-cave-btn');
  if (treasureCaveBtn) {
    treasureCaveBtn.addEventListener('click', () => {
      alert('Treasure cave would open here');
    });
  }
  
  // Avatar customize button
  const avatarCustomizeBtn = document.getElementById('avatar-customize-btn');
  if (avatarCustomizeBtn) {
    avatarCustomizeBtn.addEventListener('click', () => {
      alert('Avatar customization would open here');
    });
  }
}

/**
 * Render star icons for progress
 * @param {number} count - Number of stars (0-3)
 * @returns {string} HTML for star icons
 */
function renderStars(count) {
  let starsHTML = '';
  for (let i = 0; i < 3; i++) {
    if (i < count) {
      starsHTML += '<span class="star filled">⭐</span>';
    } else {
      starsHTML += '<span class="star empty">☆</span>';
    }
  }
  return starsHTML;
}

/**
 * Get a short description for a strand
 * @param {string} strand - The strand name
 * @returns {string} Short description
 */
function getStrandDescription(strand) {
  const descriptions = {
    [STRANDS.NUMBER]: 'Count, compare, and understand numbers',
    [STRANDS.OPERATIONS]: 'Add, subtract, multiply, and divide',
    [STRANDS.FRACTIONS]: 'Learn about parts of a whole',
    [STRANDS.GEOMETRY]: 'Discover shapes and their properties',
    [STRANDS.MEASUREMENT]: 'Measure length, weight, and time',
    [STRANDS.DATA]: 'Collect, organize, and interpret data',
    [STRANDS.ALGEBRA]: 'Find patterns and solve equations',
    [STRANDS.RATIO]: 'Compare quantities and proportions',
    [STRANDS.LOGIC]: 'Solve puzzles and reasoning problems',
    [STRANDS.SPATIAL]: 'Visualize and manipulate shapes'
  };
  
  return descriptions[strand] || 'Explore this mathematical land';
}