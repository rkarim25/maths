// Hash utility for PIN security

/**
 * Hash a string using SHA-256
 * @param {string} str - The string to hash
 * @returns {Promise<string>} The hex-encoded hash
 */
export async function hashString(str) {
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  // Hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fallback hash function using a simple approach for older browsers
 * Note: This is NOT secure and should only be used as a last resort
 * @param {string} str - The string to hash
 * @returns {string} A simple hash
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}