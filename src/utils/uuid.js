// UUID generation utility

/**
 * Generate a random UUID v4
 * @returns {string} A UUID v4 string
 */
export function generateUUID() {
  // If crypto is available, use it for better randomness
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.randomUUID ? crypto.randomUUID() : generateUUIDCrypto();
  }
  
  // Fallback to Math.random() for older environments
  return generateUUIDMath();
}

/**
 * Generate UUID using crypto.getRandomValues
 * @returns {string} A UUID v4 string
 */
function generateUUIDCrypto() {
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);
  
  // Set the version (4) and variant (RFC4122)
  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  buffer[8] = (buffer[8] & 0x3f) | 0x80;
  
  // Convert to hex string
  const hex = Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Format as UUID
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}

/**
 * Generate UUID using Math.random() (fallback)
 * @returns {string} A UUID v4 string
 */
function generateUUIDMath() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}