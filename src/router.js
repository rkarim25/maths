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
  
  // Parse the route to handle dynamic routes
  if (hash.startsWith('/strand/')) {
    // Handle strand detail route
    const strand = decodeURIComponent(hash.substring(8)); // Remove '/strand/' prefix
    renderStrandDetail(strand);
    return;
  }
  
  // Handle lesson route
  if (hash.startsWith('/lesson/')) {
    const episodeId = decodeURIComponent(hash.substring(8)); // Remove '/lesson/' prefix
    renderLesson(episodeId);
    return;
  }
  
  // Handle practice route
  if (hash.startsWith('/practice/')) {
    const episodeId = decodeURIComponent(hash.substring(10)); // Remove '/practice/' prefix
    renderPractice(episodeId);
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
      navigateTo(`/lesson/${encodeURIComponent(episodeId)}`);
    });
  });
  
  const practiceButtons = document.querySelectorAll('.practice-btn');
  practiceButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const episodeId = button.getAttribute('data-episode-id');
      navigateTo(`/practice/${encodeURIComponent(episodeId)}`);
    });
  });
}

/**
 * Render lesson view
 * @param {string} episodeId - The episode ID
 */
function renderLesson(episodeId) {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  // Show loading state while we fetch the lesson content
  appElement.innerHTML = `
    <div class="lesson-player">
      <div class="header">
        <button id="back-btn" class="back-button">← Back to Strand</button>
        <h1>Loading Lesson...</h1>
      </div>
      <div class="lesson-content">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading your adventure...</p>
        </div>
      </div>
    </div>
  `;
  
  // Add back button event listener
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      // Go back to the strand view
      const strand = getStrandForEpisode(episodeId);
      if (strand) {
        navigateTo(`/strand/${encodeURIComponent(strand)}`);
      } else {
        navigateTo('/world-map');
      }
    });
  }
  
  // Load lesson content
  loadLessonContent(episodeId);
}

/**
 * Render practice view
 * @param {string} episodeId - The episode ID
 */
function renderPractice(episodeId) {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  // Show loading state while we fetch the practice content
  appElement.innerHTML = `
    <div class="practice-player">
      <div class="header">
        <button id="back-btn" class="back-button">← Back to Strand</button>
        <h1>Loading Practice...</h1>
      </div>
      <div class="practice-content">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading your practice game...</p>
        </div>
      </div>
    </div>
  `;
  
  // Add back button event listener
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      // Go back to the strand view
      const strand = getStrandForEpisode(episodeId);
      if (strand) {
        navigateTo(`/strand/${encodeURIComponent(strand)}`);
      } else {
        navigateTo('/world-map');
      }
    });
  }
  
  // Load practice content
  loadPracticeContent(episodeId);
}

/**
 * Get strand for an episode ID
 * @param {string} episodeId - The episode ID
 * @returns {string|null} The strand name or null if not found
 */
function getStrandForEpisode(episodeId) {
  // This function should be synchronous for the router to work properly
  // In a real implementation, you would need to pass the strand information
  // when navigating or have a synchronous way to get it
  return null;
}

/**
 * Load lesson content and render
 * @param {string} episodeId - The episode ID
 */
function loadLessonContent(episodeId) {
  // Import the lesson content
  Promise.all([
    import('./config/curriculum-registry.js'),
    import('./data/lesson-content.js')
  ]).then(([{ getEpisodeById }, { getLessonContent }]) => {
    const episode = getEpisodeById(episodeId);
    const lessonContent = getLessonContent(episodeId);
    
    if (!episode || !lessonContent) {
      // Show error if episode not found
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.innerHTML = `
          <div class="lesson-player">
            <div class="header">
              <button id="back-btn" class="back-button">← Back to Strand</button>
              <h1>Lesson Not Found</h1>
            </div>
            <div class="lesson-content">
              <div class="error-message">
                <p>Sorry, this lesson is not available yet.</p>
                <button id="retry-btn">Try Again</button>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            const strand = getStrandForEpisode(episodeId);
            if (strand) {
              navigateTo(`/strand/${encodeURIComponent(strand)}`);
            } else {
              navigateTo('/world-map');
            }
          });
        }
        
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            loadLessonContent(episodeId);
          });
        }
      }
      return;
    }
    
    // Render the lesson content
    renderLessonContent(episode, lessonContent);
  }).catch(error => {
    console.error('Failed to load lesson content:', error);
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div class="lesson-player">
          <div class="header">
            <button id="back-btn" class="back-button">← Back to Strand</button>
            <h1>Lesson Error</h1>
          </div>
          <div class="lesson-content">
            <div class="error-message">
              <p>Failed to load lesson. Please try again.</p>
              <button id="retry-btn">Retry</button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners
      const backBtn = document.getElementById('back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          const strand = getStrandForEpisode(episodeId);
          if (strand) {
            navigateTo(`/strand/${encodeURIComponent(strand)}`);
          } else {
            navigateTo('/world-map');
          }
        });
      }
      
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          loadLessonContent(episodeId);
        });
      }
    }
  });
}

/**
 * Load practice content and render
 * @param {string} episodeId - The episode ID
 */
function loadPracticeContent(episodeId) {
  // Import the practice game view
  Promise.all([
    import('./config/curriculum-registry.js'),
    import('./data/lesson-content.js')
  ]).then(([{ getEpisodeById }, { getLessonContent }]) => {
    const episode = getEpisodeById(episodeId);
    const lessonContent = getLessonContent(episodeId);
    
    if (!episode || !lessonContent) {
      // Show error if episode not found
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.innerHTML = `
          <div class="practice-player">
            <div class="header">
              <button id="back-btn" class="back-button">← Back to Strand</button>
              <h1>Practice Not Found</h1>
            </div>
            <div class="practice-content">
              <div class="error-message">
                <p>Sorry, this practice game is not available yet.</p>
                <button id="retry-btn">Try Again</button>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            const strand = getStrandForEpisode(episodeId);
            if (strand) {
              navigateTo(`/strand/${encodeURIComponent(strand)}`);
            } else {
              navigateTo('/world-map');
            }
          });
        }
        
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            loadPracticeContent(episodeId);
          });
        }
      }
      return;
    }
    
    // Import and render the practice game view
    import('./views/practice-game.js').then(({ renderPracticeGame }) => {
      renderPracticeGame(episode, lessonContent);
    }).catch(error => {
      console.error('Failed to load practice game:', error);
      // Fallback to simple view
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.innerHTML = `
          <div class="practice-player">
            <div class="header">
              <button id="back-btn" class="back-button">← Back to Strand</button>
              <h1>${lessonContent.title} - Practice</h1>
            </div>
            <div class="practice-content">
              <div class="coming-soon">
                <h2>Practice Game Coming Soon!</h2>
                <p>This practice game is still being developed. Check back soon for interactive math challenges!</p>
                <div class="practice-preview">
                  <img src="./assets/fractions-icon.svg" alt="Practice Preview" />
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add back button event listener
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
          backBtn.addEventListener('click', () => {
            const strand = getStrandForEpisode(episodeId);
            if (strand) {
              navigateTo(`/strand/${encodeURIComponent(strand)}`);
            } else {
              navigateTo('/world-map');
            }
          });
        }
      }
    });
  }).catch(error => {
    console.error('Failed to load practice content:', error);
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div class="practice-player">
          <div class="header">
            <button id="back-btn" class="back-button">← Back to Strand</button>
            <h1>Practice Error</h1>
          </div>
          <div class="practice-content">
            <div class="error-message">
              <p>Failed to load practice game. Please try again.</p>
              <button id="retry-btn">Retry</button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners
      const backBtn = document.getElementById('back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          const strand = getStrandForEpisode(episodeId);
          if (strand) {
            navigateTo(`/strand/${encodeURIComponent(strand)}`);
          } else {
            navigateTo('/world-map');
          }
        });
      }
      
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          loadPracticeContent(episodeId);
        });
      }
    }
  });
}

/**
 * Render lesson content
 * @param {Object} episode - The episode data
 * @param {Object} lessonContent - The lesson content
 */
function renderLessonContent(episode, lessonContent) {
  // Import and render the lesson player view
  import('./views/lesson-player.js').then(({ renderLessonPlayer }) => {
    renderLessonPlayer(episode, lessonContent);
  }).catch(error => {
    console.error('Failed to load lesson player:', error);
    // Fallback to simple view
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div class="lesson-player">
          <div class="header">
            <button id="back-btn" class="back-button">← Back to Strand</button>
            <h1>${lessonContent.title}</h1>
            <p>${episode.description}</p>
          </div>
          <div class="lesson-content">
            <div class="lesson-intro">
              <h2>Story Lesson</h2>
              <p>Welcome to your math adventure! This lesson will help you learn ${lessonContent.learningObjective}.</p>
              <div class="lesson-preview">
                <img src="./assets/number-icon.svg" alt="Lesson Preview" />
              </div>
              <button id="start-lesson-btn" class="primary-btn">Start Lesson</button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners
      const backBtn = document.getElementById('back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          const strand = episode.strand;
          if (strand) {
            navigateTo(`/strand/${encodeURIComponent(strand)}`);
          } else {
            navigateTo('/world-map');
          }
        });
      }
      
      const startBtn = document.getElementById('start-lesson-btn');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          // For now, just show an alert
          // In a full implementation, this would start the slide-based lesson player
          alert('Lesson would start here with interactive slides, narration, and diagrams!');
        });
      }
    }
  });
}