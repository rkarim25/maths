// Application constants

// App metadata
export const APP_NAME = "Liyana's Maths Adventure";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "A gamified math learning platform for children preparing for 11+ exams";

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024
};

// Profile constants
export const MAX_PIN_LENGTH = 4;
export const MIN_PROFILE_NAME_LENGTH = 1;
export const MAX_PROFILE_NAME_LENGTH = 20;

// Game constants
export const MIN_TAP_TARGET_SIZE = 44; // pixels
export const CONFETTI_DURATION = 5000; // milliseconds
export const NARRATION_SPEED = 1; // normal speed

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_PROFILE_ID: 'currentProfileId',
  SETTINGS: 'appSettings',
  LAST_ACTIVE: 'lastActive'
};

// Event types for usage tracking
export const EVENT_TYPES = {
  SESSION_START: 'session-start',
  SESSION_END: 'session-end',
  LESSON_START: 'lesson-start',
  LESSON_COMPLETE: 'lesson-complete',
  GAME_START: 'game-start',
  GAME_COMPLETE: 'game-complete',
  REWARD_EARNED: 'reward-earned',
  HINT_REQUESTED: 'hint-requested',
  REPLAY_REQUESTED: 'replay-requested'
};

// Progress status values
export const PROGRESS_STATUS = {
  LOCKED: 'locked',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

// Weak area severity levels
export const WEAK_AREA_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Default avatar options
export const DEFAULT_AVATAR_OPTIONS = {
  HAIR: [
    { id: 'brown-short', name: 'Brown Short' },
    { id: 'brown-long', name: 'Brown Long' },
    { id: 'blonde-short', name: 'Blonde Short' },
    { id: 'blonde-long', name: 'Blonde Long' },
    { id: 'black-short', name: 'Black Short' },
    { id: 'black-long', name: 'Black Long' }
  ],
  OUTFIT: [
    { id: 'blue', name: 'Blue Shirt' },
    { id: 'red', name: 'Red Shirt' },
    { id: 'green', name: 'Green Shirt' },
    { id: 'purple', name: 'Purple Shirt' },
    { id: 'yellow', name: 'Yellow Shirt' }
  ],
  PET: [
    { id: 'none', name: 'No Pet' },
    { id: 'cat', name: 'Cat' },
    { id: 'dog', name: 'Dog' },
    { id: 'bird', name: 'Bird' },
    { id: 'rabbit', name: 'Rabbit' }
  ]
};