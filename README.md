# Liyana's Maths Adventure

A gamified, story-driven children's math teaching website for deployment via GitHub Pages at https://rkarim25.github.io/maths.

## Overview

This project is designed for Liyana, a 6.5-year-old girl in UK Year 1 preparing for the 11+ exam in four years. The platform features:

- **Story-Driven Learning**: Math concepts taught through engaging narratives
- **Multi-Profile Support**: Isolated progress tracking for multiple children
- **Fully Responsive**: Works on mobile phones, tablets, and desktops
- **Offline Progress Tracking**: Uses browser storage to save progress
- **Parent Dashboard**: Progress reports and data export capabilities
- **11+ Exam Preparation**: Curriculum aligned with UK standards

## Features

### For Children
- Interactive world map with different "lands" for math strands
- Animated story-slides with text-to-speech narration
- Branching story-games for practice
- Reward system with gems and stickers
- Avatar customization
- Age-appropriate UI with large tap targets

### For Parents
- Progress tracking dashboard
- Weekly reports with accuracy trends
- Data export (JSON/CSV/PDF)
- PIN-protected access
- Curriculum override options

### Technical Features
- Client-side storage with IndexedDB
- Fully static site (no server required)
- Pre-generated content (no API keys in client)
- Responsive design for all devices
- Accessibility features (TTS, dyslexia font, reduced motion)

## Technology Stack

- **Frontend**: Vanilla JavaScript with ES modules
- **Build Tool**: Vite
- **Styling**: CSS with custom properties
- **Storage**: IndexedDB for structured data
- **Deployment**: GitHub Pages
- **Content**: Pre-generated static JSON files

## Project Structure

```
├── index.html              # Main HTML file
├── favicon.svg             # Site favicon
├── robots.txt              # Search engine instructions
├── .nojekyll               # Disable GitHub Pages Jekyll
├── package.json            # Project metadata and scripts
├── vite.config.js          # Vite build configuration
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
├── tools/                  # Development tools (offline content generation)
└── docs/                   # Documentation
```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Deployment

The site is deployed to GitHub Pages at https://rkarim25.github.io/maths/.

To deploy updates:
1. Build the project: `npm run build`
2. Commit and push changes to the `main` branch
3. GitHub Actions will automatically deploy the site

## Content Generation

Content is pre-generated offline using Gemini API scripts in the `tools/` directory:
1. Edit curriculum in `src/config/curriculum-registry.js`
2. Run content generation scripts with your Gemini API key
3. Generated JSON files are saved to `content/` directory
4. Commit and deploy

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Accessibility

- Text-to-speech narration on all screens
- Large tap targets (minimum 44px)
- Dyslexia-friendly font option
- Reduced motion support
- High contrast color scheme

## Contributing

This is a personal project for Liyana's education, but suggestions are welcome!

## License

MIT License - see LICENSE file for details.