# Architecture Documentation

This document provides a detailed overview of the architecture for Liyana's Maths Adventure.

## System Overview

Liyana's Maths Adventure is a client-side web application designed for children aged 6.5+ preparing for the 11+ exam. The application is built as a static website that can be hosted on GitHub Pages with no server-side dependencies.

## Technology Stack

### Frontend
- **Language**: Vanilla JavaScript (ES6+ modules)
- **Build Tool**: Vite
- **Styling**: CSS with custom properties
- **Routing**: Hash-based routing
- **Storage**: IndexedDB for persistent data storage

### Development Tools
- **Package Manager**: npm
- **Code Editor**: Visual Studio Code
- **Version Control**: Git
- **Deployment**: GitHub Pages with GitHub Actions

### Content Generation
- **Offline Generation**: Node.js scripts using Gemini API
- **Content Format**: Pre-generated static JSON files
- **Storage**: Static files in the `content/` directory

## Project Structure

```
├── index.html              # Main HTML entry point
├── favicon.svg             # Application icon
├── robots.txt              # Search engine directives
├── .nojekyll               # Disable Jekyll on GitHub Pages
├── package.json            # Project metadata and scripts
├── vite.config.js          # Vite configuration
├── src/                    # Source code
│   ├── main.js             # Application entry point
│   ├── app.js              # Main application controller
│   ├── router.js           # Hash-based router
│   ├── config/             # Configuration files
│   ├── styles/             # CSS stylesheets
│   ├── views/              # View components
│   ├── components/         # Reusable UI components
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   └── assets/             # Static assets
├── content/                # Pre-generated content (static JSON)
├── tools/                  # Development tools
└── docs/                   # Documentation
```

## Core Modules

### 1. Application Core (`src/app.js`)
The main application controller that manages:
- Application state
- Database initialization
- Profile management
- Navigation between views

### 2. Router (`src/router.js`)
A hash-based router that handles navigation between different views:
- Profile switcher
- Profile creation
- World map
- Learning modules (future)

### 3. Database Service (`src/services/db.js`)
A wrapper around IndexedDB that provides:
- Schema definition
- CRUD operations
- Profile isolation
- Data validation

### 4. Profile Manager (`src/services/profile-manager.js`)
Handles all profile-related operations:
- Profile creation
- Profile retrieval
- Profile updates
- PIN management

### 5. Views (`src/views/`)
Individual view components:
- Profile switcher
- Profile creation
- World map

### 6. Utilities (`src/utils/`)
Helper functions:
- UUID generation
- String hashing
- Date formatting

### 7. Configuration (`src/config/`)
Application configuration:
- Constants
- Curriculum registry

## Data Model

### Profiles
Stored in the `profiles` object store:
```javascript
{
  profileId: string,        // UUID
  name: string,             // Player name
  avatarConfig: object,     // Avatar customization
  pinHash: string|null,     // Hashed parent PIN
  createdAt: string,        // ISO date
  lastActive: string,       // ISO date
  currentYear: number,      // Current learning year
  currentTerm: string,      // Current term
  gems: number,             // Collected gems
  stickers: array           // Collected stickers
}
```

### Progress Tracking
Stored in the `progress` object store:
```javascript
{
  profileId: string,        // Profile UUID
  episodeId: string,        // Episode identifier
  strand: string,           // Math strand
  status: string,           // locked|in-progress|completed
  stars: number,            // 0-3 stars
  bestScore: number,        // Best assessment score
  attempts: number,         // Number of attempts
  firstCompletedAt: string, // ISO date
  lastAttemptAt: string     // ISO date
}
```

### Answer Log
Stored in the `answer_log` object store:
```javascript
{
  answerId: string,         // UUID
  profileId: string,        // Profile UUID
  episodeId: string,        // Episode identifier
  strand: string,           // Math strand
  skillTag: string,         // Specific skill
  questionType: string,     // multiple-choice|drag-drop|input
  questionText: string,     // Question text
  userAnswer: string,       // User's answer
  correctAnswer: string,    // Correct answer
  correct: boolean,         // Whether answer was correct
  timeSpentMs: number,      // Time spent on question
  timestamp: string,        // ISO date
  hintUsed: boolean         // Whether hint was used
}
```

### Usage Events
Stored in the `usage_events` object store:
```javascript
{
  eventId: string,          // UUID
  profileId: string,        // Profile UUID
  eventType: string,        // session-start|lesson-complete|etc.
  metadata: object,         // Event-specific data
  timestamp: string         // ISO date
}
```

### Weak Areas
Stored in the `weak_areas` object store:
```javascript
{
  profileId: string,        // Profile UUID
  skillTag: string,         // Specific skill
  strand: string,           // Math strand
  totalAttempts: number,    // Total attempts
  correctAttempts: number,  // Correct attempts
  accuracy: number,         // Accuracy percentage
  severity: string,         // low|medium|high
  lastEncountered: string,  // ISO date
  recommendedRemedialEpisodes: array // Recommended episodes
}
```

## Security Considerations

### Profile Isolation
All database queries are profile-guarded to ensure strict data separation between users.

### PIN Security
Parent PINs are hashed using SHA-256 before storage.

### Content Security
All content is pre-generated and statically served, eliminating runtime API key exposure.

## Performance Considerations

### Database Design
IndexedDB is used for structured data storage with appropriate indexing for efficient queries.

### Asset Loading
CSS and JavaScript are bundled and minified during the build process.

### Responsive Design
CSS media queries ensure optimal performance across all device sizes.

## Accessibility Features

### Text-to-Speech
Web Speech API provides narration for all content.

### Touch Targets
All interactive elements meet minimum 44px touch target requirements.

### Reduced Motion
Respects user preference for reduced motion.

### Dyslexia Support
Supports dyslexia-friendly font options.

## Deployment Architecture

### GitHub Pages
The application is deployed as a static site to GitHub Pages.

### Base Path
Configured with `/maths/ base path for proper routing.

### GitHub Actions
Automated deployment via GitHub Actions workflow.

## Future Extensibility

### Content Modules
Additional learning modules can be added by extending the curriculum registry.

### Analytics
Usage data can be exported for analysis and curriculum improvement.

### Multi-language Support
Internationalization can be added through translation files.

### Offline Support
Service workers can be added for full offline functionality.