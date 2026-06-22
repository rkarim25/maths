// Profile switcher view
import { loadProfiles, setCurrentProfileId } from '../services/profile-manager.js';
import { logEvent } from '../services/tracking.js';
import { navigateTo } from '../router.js';

// Cache for profiles
let profilesCache = [];

/**
 * Render the profile switcher view
 */
export async function renderProfileSwitcher() {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  // Show loading state while fetching profiles
  appElement.innerHTML = `
    <div class="profile-switcher">
      <div class="header">
        <h1>Who's Playing?</h1>
        <p>Select a profile to continue your adventure</p>
      </div>
      <div class="profiles-container">
        <div class="loading-profiles">
          <div class="spinner"></div>
          <p>Loading profiles...</p>
        </div>
      </div>
      <div class="actions">
        <button id="create-profile-btn" class="secondary-btn">Create New Player</button>
      </div>
    </div>
  `;
  
  try {
    // Load profiles
    profilesCache = await loadProfiles();
    
    // Render profiles
    renderProfiles(profilesCache);
    
    // Add event listener for create profile button
    const createBtn = document.getElementById('create-profile-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        navigateTo('/profile-create');
      });
    }
  } catch (error) {
    console.error('Failed to load profiles:', error);
    appElement.innerHTML = `
      <div class="profile-switcher">
        <div class="header">
          <h1>Who's Playing?</h1>
          <p>Select a profile to continue your adventure</p>
        </div>
        <div class="profiles-container">
          <div class="error-message">
            <p>Failed to load profiles. Please try again.</p>
            <button id="retry-btn">Retry</button>
          </div>
        </div>
        <div class="actions">
          <button id="create-profile-btn" class="secondary-btn">Create New Player</button>
        </div>
      </div>
    `;
    
    // Add event listeners for retry and create buttons
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', renderProfileSwitcher);
    }
    
    const createBtn = document.getElementById('create-profile-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        navigateTo('/profile-create');
      });
    }
  }
}

/**
 * Render the profiles grid
 * @param {Array} profiles - Array of profile objects
 */
function renderProfiles(profiles) {
  const container = document.querySelector('.profiles-container');
  if (!container) return;
  
  if (profiles.length === 0) {
    container.innerHTML = `
      <div class="no-profiles">
        <p>No profiles found. Create your first player to get started!</p>
      </div>
    `;
    return;
  }
  
  // Create profile cards
  const profilesHTML = profiles.map(profile => `
    <div class="profile-card" data-profile-id="${profile.profileId}">
      <div class="avatar-placeholder">
        ${profile.avatarImage ? `<img class="avatar-img" src="${profile.avatarImage}" alt="">` : '<div class="avatar-icon">👤</div>'}
      </div>
      <div class="profile-info">
        <h3>${escapeHtml(profile.name)}</h3>
        <p>Last played: ${formatDate(profile.lastActive)}</p>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = `
    <div class="profiles-grid">
      ${profilesHTML}
    </div>
  `;
  
  // Add event listeners to profile cards
  const profileCards = container.querySelectorAll('.profile-card');
  profileCards.forEach(card => {
    card.addEventListener('click', () => {
      const profileId = card.getAttribute('data-profile-id');
      selectProfile(profileId);
    });
  });
}

/**
 * Select a profile and navigate to the world map
 * @param {string} profileId - The profile ID to select
 */
function selectProfile(profileId) {
  // Set as current profile
  setCurrentProfileId(profileId);
  logEvent(profileId, 'session-start', {}).catch(() => {});

  // Navigate to the lessons table
  navigateTo('/lessons');
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => {
    const escapeMap = {
      '&': '&',
      '<': '<',
      '>': '>',
      '"': '"',
      "'": '&#x27;'
    };
    return escapeMap[match];
  });
}

/**
 * Format date for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}