// IndexedDB wrapper for the maths adventure app
const DB_NAME = 'maths_adventure_db';
const DB_VERSION = 1;

// Database instance
let dbInstance = null;

/**
 * Initialize the database
 * @returns {Promise<IDBDatabase>} The database instance
 */
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database failed to open');
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      console.log('Database opened successfully');
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create profiles object store
      if (!db.objectStoreNames.contains('profiles')) {
        const profileStore = db.createObjectStore('profiles', { keyPath: 'profileId' });
        profileStore.createIndex('name', 'name', { unique: false });
        profileStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      // Create progress object store
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: ['profileId', 'episodeId'] });
        progressStore.createIndex('profileId', 'profileId', { unique: false });
        progressStore.createIndex('episodeId', 'episodeId', { unique: false });
        progressStore.createIndex('status', 'status', { unique: false });
        progressStore.createIndex('strand', 'strand', { unique: false });
      }
      
      // Create answer_log object store
      if (!db.objectStoreNames.contains('answer_log')) {
        const answerStore = db.createObjectStore('answer_log', { keyPath: 'answerId' });
        answerStore.createIndex('profileId', 'profileId', { unique: false });
        answerStore.createIndex('episodeId', 'episodeId', { unique: false });
        answerStore.createIndex('strand', 'strand', { unique: false });
        answerStore.createIndex('skillTag', 'skillTag', { unique: false });
        answerStore.createIndex('correct', 'correct', { unique: false });
        answerStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Create usage_events object store
      if (!db.objectStoreNames.contains('usage_events')) {
        const usageStore = db.createObjectStore('usage_events', { keyPath: 'eventId' });
        usageStore.createIndex('profileId', 'profileId', { unique: false });
        usageStore.createIndex('eventType', 'eventType', { unique: false });
        usageStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Create weak_areas object store
      if (!db.objectStoreNames.contains('weak_areas')) {
        const weakStore = db.createObjectStore('weak_areas', { keyPath: ['profileId', 'skillTag'] });
        weakStore.createIndex('profileId', 'profileId', { unique: false });
        weakStore.createIndex('strand', 'strand', { unique: false });
        weakStore.createIndex('severity', 'severity', { unique: false });
      }
      
      console.log('Database schema created');
    };
  });
}

/**
 * Get database instance
 * @returns {IDBDatabase} The database instance
 */
export function getDB() {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbInstance;
}

/**
 * Generic function to add data to a store
 * @param {string} storeName - The name of the object store
 * @param {object} data - The data to add
 * @returns {Promise<any>} The key of the added record
 */
export function addToStore(storeName, data) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.add(data);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error(`Failed to add to ${storeName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Generic function to get data from a store by key
 * @param {string} storeName - The name of the object store
 * @param {any} key - The key to retrieve
 * @returns {Promise<object|null>} The retrieved object or null
 */
export function getFromStore(storeName, key) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    const request = store.get(key);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = () => {
      console.error(`Failed to get from ${storeName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Generic function to update data in a store
 * @param {string} storeName - The name of the object store
 * @param {object} data - The data to update
 * @returns {Promise<any>} The key of the updated record
 */
export function updateInStore(storeName, data) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.put(data);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error(`Failed to update in ${storeName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Generic function to delete data from a store by key
 * @param {string} storeName - The name of the object store
 * @param {any} key - The key to delete
 * @returns {Promise<void>}
 */
export function deleteFromStore(storeName, key) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.delete(key);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      console.error(`Failed to delete from ${storeName}:`, request.error);
      reject(request.error);
    };
  });
}

/**
 * Generic function to get all data from a store with optional index query
 * @param {string} storeName - The name of the object store
 * @param {string|null} indexName - The index to query (optional)
 * @param {any} queryValue - The value to query for (optional)
 * @returns {Promise<Array>} Array of all matching records
 */
export function getAllFromStore(storeName, indexName = null, queryValue = null) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    let request;
    
    if (indexName && queryValue !== null) {
      const index = store.index(indexName);
      request = index.getAll(queryValue);
    } else {
      request = store.getAll();
    }
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error(`Failed to get all from ${storeName}:`, request.error);
      reject(request.error);
    };
  });
}