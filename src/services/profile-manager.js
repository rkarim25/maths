// Profile management service
import { addToStore, getAllFromStore, getFromStore, updateInStore, deleteFromStore } from './db.js';
import { generateUUID } from '../utils/uuid.js';
import { hashString } from '../utils/hash.js';

/**
 * Create a new profile
 * @param {string} name - The profile name
 * @param {object} avatarConfig - The avatar configuration
 * @param {string|null} pin - The parent PIN (if provided)
 * @returns {Promise<object>} The created profile
 */
export async function createProfile(name, avatarConfig, pin = null) {
  // Validate inputs
  if (!name || name.trim().length === 0) {
    throw new Error('Profile name is required');
  }
  
  // Hash the PIN if provided
  const pinHash = pin ? await hashString(pin) : null;
  
  // Create profile object
  const profile = {
    profileId: generateUUID(),
    name: name.trim(),
    avatarConfig: avatarConfig || {
      hair: 'brown-short',
      outfit: 'blue',
      pet: 'none'
    },
    pinHash: pinHash,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    currentYear: 1,
    currentTerm: 'Autumn',
    gems: 0,
    stickers: []
  };
  
  // Save to database
  await addToStore('profiles', profile);
  
  return profile;
}

/**
 * Load all profiles
 * @returns {Promise<Array>} Array of profiles
 */
export async function loadProfiles() {
  try {
    const profiles = await getAllFromStore('profiles');
    return profiles.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
  } catch (error) {
    console.error('Failed to load profiles:', error);
    return [];
  }
}

/**
 * Get a profile by ID
 * @param {string} profileId - The profile ID
 * @returns {Promise<object|null>} The profile or null if not found
 */
export async function getProfile(profileId) {
  if (!profileId) return null;
  return await getFromStore('profiles', profileId);
}

/**
 * Update a profile
 * @param {object} profile - The profile to update
 * @returns {Promise<object>} The updated profile
 */
export async function updateProfile(profile) {
  if (!profile.profileId) {
    throw new Error('Profile ID is required');
  }
  
  // Update lastActive timestamp
  profile.lastActive = new Date().toISOString();
  
  await updateInStore('profiles', profile);
  return profile;
}

/**
 * Delete a profile
 * @param {string} profileId - The profile ID to delete
 * @returns {Promise<void>}
 */
export async function deleteProfile(profileId) {
  if (!profileId) {
    throw new Error('Profile ID is required');
  }
  
  await deleteFromStore('profiles', profileId);
}

/**
 * Set the current profile ID in localStorage
 * @param {string} profileId - The profile ID
 */
export function setCurrentProfileId(profileId) {
  if (profileId) {
    localStorage.setItem('currentProfileId', profileId);
  } else {
    localStorage.removeItem('currentProfileId');
  }
}

/**
 * Get the current profile ID from localStorage
 * @returns {string|null} The current profile ID or null
 */
export function getCurrentProfileId() {
  return localStorage.getItem('currentProfileId') || null;
}

/**
 * Clear the current profile ID
 */
export function clearCurrentProfileId() {
  localStorage.removeItem('currentProfileId');
}

/**
 * Verify a PIN against a profile's hash
 * @param {string} profileId - The profile ID
 * @param {string} pin - The PIN to verify
 * @returns {Promise<boolean>} Whether the PIN is correct
 */
export async function verifyPin(profileId, pin) {
  if (!profileId || !pin) return false;
  
  const profile = await getProfile(profileId);
  if (!profile || !profile.pinHash) return false;
  
  const pinHash = await hashString(pin);
  return pinHash === profile.pinHash;
}

/**
 * Update a profile's PIN
 * @param {string} profileId - The profile ID
 * @param {string} newPin - The new PIN
 * @returns {Promise<void>}
 */
export async function updatePin(profileId, newPin) {
  if (!profileId || !newPin) {
    throw new Error('Profile ID and new PIN are required');
  }
  
  const profile = await getProfile(profileId);
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  profile.pinHash = await hashString(newPin);
  await updateProfile(profile);
}

// --- Global parent PIN (one PIN for the whole app, shared across children) ---
const GLOBAL_PIN_KEY = 'parentPinHash';
const DEFAULT_PARENT_PIN = '2353';

// The parent area is ALWAYS protected: by a custom PIN if one has been set on
// this device, otherwise by the default PIN (2353). This makes the same PIN
// work on every device with no setup.
export function hasGlobalPin() {
  return true;
}

/** Whether a custom PIN (other than the default 2353) has been set here. */
export function hasCustomPin() {
  return !!localStorage.getItem(GLOBAL_PIN_KEY);
}

/** Set (or clear, with null) a custom parent PIN. Clearing falls back to 2353. */
export async function setGlobalPin(pin) {
  if (!pin) { localStorage.removeItem(GLOBAL_PIN_KEY); return; }
  localStorage.setItem(GLOBAL_PIN_KEY, await hashString(pin));
}

/** Verify a PIN against the custom PIN if set, otherwise the default 2353. */
export async function verifyGlobalPin(pin) {
  const stored = localStorage.getItem(GLOBAL_PIN_KEY);
  if (stored) return !!pin && (await hashString(pin)) === stored;
  return pin === DEFAULT_PARENT_PIN;
}

/**
 * Single-profile mode: always use one canonical "Liyana" profile.
 * Returns the existing profile (preferring one named Liyana) or creates it.
 */
export async function ensureSingleProfile() {
  const profiles = await loadProfiles();
  if (profiles.length) {
    return profiles.find((p) => /liyana/i.test(p.name)) || profiles[0];
  }
  return createProfile('Liyana', { hair: 'brown-long', outfit: 'purple', pet: 'cat' }, null);
}