// Profile creation view
import { createProfile } from '../services/profile-manager.js';
import { navigateTo } from '../router.js';
import { DEFAULT_AVATAR_OPTIONS } from '../config/constants.js';

/**
 * Render the profile creation view
 */
export function renderProfileCreate() {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  appElement.innerHTML = `
    <div class="profile-create">
      <div class="header">
        <h1>Create New Player</h1>
        <p>Set up a new adventurer for the maths kingdom</p>
      </div>
      <form id="profile-form" class="profile-form">
        <div class="form-group">
          <label for="player-name">Player Name</label>
          <input type="text" id="player-name" name="player-name" required maxlength="20" placeholder="Enter player name">
          <div class="char-count"><span id="name-count">0</span>/20 characters</div>
        </div>
        
        <div class="form-group">
          <label>Avatar</label>
          <div class="avatar-customization">
            <div class="avatar-preview">
              <div class="avatar-placeholder">
                <div class="avatar-icon">👤</div>
              </div>
              <p>Preview</p>
            </div>
            
            <div class="avatar-options">
              <div class="option-group">
                <label for="hair-style">Hair Style</label>
                <select id="hair-style" name="hair-style">
                  ${DEFAULT_AVATAR_OPTIONS.HAIR.map(hair => 
                    `<option value="${hair.id}">${hair.name}</option>`
                  ).join('')}
                </select>
              </div>
              
              <div class="option-group">
                <label for="outfit-color">Outfit Color</label>
                <select id="outfit-color" name="outfit-color">
                  ${DEFAULT_AVATAR_OPTIONS.OUTFIT.map(outfit => 
                    `<option value="${outfit.id}">${outfit.name}</option>`
                  ).join('')}
                </select>
              </div>
              
              <div class="option-group">
                <label for="pet">Pet Companion</label>
                <select id="pet" name="pet">
                  ${DEFAULT_AVATAR_OPTIONS.PET.map(pet => 
                    `<option value="${pet.id}">${pet.name}</option>`
                  ).join('')}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="parent-pin">Parent PIN (Optional)</label>
          <input type="password" id="parent-pin" name="parent-pin" maxlength="4" placeholder="4-digit PIN for parent access">
          <p class="hint">This PIN will be required to access parent dashboard</p>
        </div>
        
        <div class="form-actions">
          <button type="button" id="cancel-btn" class="secondary-btn">Cancel</button>
          <button type="submit" id="create-btn">Create Player</button>
        </div>
      </form>
    </div>
  `;
  
  // Add event listeners
  setupEventListeners();
}

/**
 * Set up event listeners for the form
 */
function setupEventListeners() {
  const form = document.getElementById('profile-form');
  const nameInput = document.getElementById('player-name');
  const nameCount = document.getElementById('name-count');
  const cancelBtn = document.getElementById('cancel-btn');
  
  // Character counter for name input
  if (nameInput && nameCount) {
    nameInput.addEventListener('input', () => {
      const count = nameInput.value.length;
      nameCount.textContent = count;
      
      // Change color if approaching limit
      if (count > 15) {
        nameCount.style.color = '#FF9800';
      } else if (count > 18) {
        nameCount.style.color = '#F44336';
      } else {
        nameCount.style.color = '';
      }
    });
  }
  
  // Form submission
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      navigateTo('/profiles');
    });
  }
}

/**
 * Handle form submission
 * @param {Event} event - The submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  // Get form data
  const nameInput = document.getElementById('player-name');
  const pinInput = document.getElementById('parent-pin');
  const hairSelect = document.getElementById('hair-style');
  const outfitSelect = document.getElementById('outfit-color');
  const petSelect = document.getElementById('pet');
  
  const name = nameInput?.value.trim();
  const pin = pinInput?.value || null;
  const avatarConfig = {
    hair: hairSelect?.value || 'brown-short',
    outfit: outfitSelect?.value || 'blue',
    pet: petSelect?.value || 'none'
  };
  
  // Validate name
  if (!name || name.length === 0) {
    showError('Please enter a player name');
    return;
  }
  
  // Validate PIN if provided
  if (pin && pin.length !== 4) {
    showError('PIN must be 4 digits');
    return;
  }
  
  // Validate PIN is numeric if provided
  if (pin && !/^\d{4}$/.test(pin)) {
    showError('PIN must contain only digits');
    return;
  }
  
  // Disable submit button during creation
  const submitBtn = document.getElementById('create-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';
  }
  
  try {
    // Create the profile
    const profile = await createProfile(name, avatarConfig, pin);
    
    // Navigate to profile switcher
    navigateTo('/profiles');
  } catch (error) {
    console.error('Failed to create profile:', error);
    showError('Failed to create profile. Please try again.');
    
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Player';
    }
  }
}

/**
 * Show error message
 * @param {string} message - The error message to display
 */
function showError(message) {
  // Remove any existing error messages
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message element
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `<p>${message}</p>`;
  
  // Insert after the header
  const header = document.querySelector('.profile-create .header');
  if (header) {
    header.after(errorElement);
    
    // Scroll to error
    errorElement.scrollIntoView({ behavior: 'smooth' });
  }
}