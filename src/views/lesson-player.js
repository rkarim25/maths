// Lesson player view with narration
import { navigateTo } from '../router.js';

// Current slide index
let currentSlideIndex = 0;
// Lesson content
let currentLesson = null;
// Episode data
let currentEpisode = null;

/**
 * Render the lesson player view
 * @param {Object} episode - The episode data
 * @param {Object} lessonContent - The lesson content
 */
export function renderLessonPlayer(episode, lessonContent) {
  currentEpisode = episode;
  currentLesson = lessonContent;
  currentSlideIndex = 0;
  
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  appElement.innerHTML = `
    <div class="lesson-player">
      <div class="header">
        <button id="back-btn" class="back-button">← Back to Strand</button>
        <h1>${lessonContent.title}</h1>
        <p>${episode.description}</p>
      </div>
      <div class="lesson-content">
        <div class="slide-container">
          <div id="slide-content" class="slide-content">
            <!-- Slide content will be loaded here -->
          </div>
          <div class="slide-controls">
            <button id="prev-btn" class="secondary-btn" disabled>Previous</button>
            <span id="slide-counter">1 / ${lessonContent.slides.length}</span>
            <button id="next-btn" class="primary-btn">Next</button>
          </div>
        </div>
        <div class="narration-panel">
          <div class="narration-content">
            <div class="speaker-icon">🔊</div>
            <div id="narration-text" class="narration-text">
              <!-- Narration text will be loaded here -->
            </div>
          </div>
          <button id="play-narration-btn" class="play-btn">▶ Play Narration</button>
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
  
  const prevBtn = document.getElementById('prev-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', showPreviousSlide);
  }
  
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', showNextSlide);
  }
  
  const playBtn = document.getElementById('play-narration-btn');
  if (playBtn) {
    playBtn.addEventListener('click', playNarration);
  }
  
  // Load the first slide
  loadSlide(0);
}

/**
 * Load and display a slide
 * @param {number} index - The slide index
 */
function loadSlide(index) {
  if (!currentLesson || !currentLesson.slides || index < 0 || index >= currentLesson.slides.length) {
    return;
  }
  
  currentSlideIndex = index;
  const slide = currentLesson.slides[index];
  
  const slideContentElement = document.getElementById('slide-content');
  const narrationTextElement = document.getElementById('narration-text');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const slideCounter = document.getElementById('slide-counter');
  
  if (!slideContentElement || !narrationTextElement || !prevBtn || !nextBtn || !slideCounter) {
    return;
  }
  
  // Update slide counter
  slideCounter.textContent = `${index + 1} / ${currentLesson.slides.length}`;
  
  // Update button states
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === currentLesson.slides.length - 1;
  
  // Render slide content based on type
  switch (slide.type) {
    case 'story':
      slideContentElement.innerHTML = `
        <div class="slide-story">
          <h2>${slide.title}</h2>
          ${slide.character ? `<div class="character">${slide.character}</div>` : ''}
          <div class="story-content">
            <p>${slide.text}</p>
            ${slide.diagram ? `<div class="diagram"><img src="./assets/diagrams/${slide.diagram}" alt="Story illustration"></div>` : ''}
          </div>
        </div>
      `;
      break;
      
    case 'teaching':
      slideContentElement.innerHTML = `
        <div class="slide-teaching">
          <h2>${slide.title}</h2>
          ${slide.character ? `<div class="character">${slide.character}</div>` : ''}
          <div class="teaching-content">
            <p>${slide.text}</p>
            ${slide.diagram ? `<div class="diagram"><img src="./assets/diagrams/${slide.diagram}" alt="Teaching diagram"></div>` : ''}
          </div>
        </div>
      `;
      break;
      
    case 'video':
      slideContentElement.innerHTML = `
        <div class="slide-video">
          <h2>${slide.title}</h2>
          <p>${slide.text}</p>
          ${slide.youtubeEmbed ? `
            <div class="video-container">
              <iframe src="https://www.youtube.com/embed/${currentLesson.youtubeVideoId}" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen></iframe>
            </div>
          ` : `
            <div class="video-placeholder">
              <p>Video would play here: ${currentLesson.youtubeVideoId}</p>
            </div>
          `}
        </div>
      `;
      break;
      
    case 'interactive':
      slideContentElement.innerHTML = `
        <div class="slide-interactive">
          <h2>${slide.title}</h2>
          ${slide.character ? `<div class="character">${slide.character}</div>` : ''}
          <div class="interactive-content">
            <p>${slide.text}</p>
            ${slide.diagram ? `<div class="diagram"><img src="./assets/diagrams/${slide.diagram}" alt="Interactive diagram"></div>` : ''}
            <div class="quiz-question">
              <p>${slide.interactivePrompt}</p>
              <div class="quiz-options">
                ${slide.options.map((option, i) => `
                  <button class="quiz-option" data-value="${option}">${option}</button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners for quiz options
      const quizOptions = slideContentElement.querySelectorAll('.quiz-option');
      quizOptions.forEach(option => {
        option.addEventListener('click', () => {
          const selectedValue = option.getAttribute('data-value');
          const isCorrect = selectedValue == slide.correctAnswer;
          
          // Provide feedback
          if (isCorrect) {
            option.classList.add('correct');
            option.textContent = `${selectedValue} ✓`;
            setTimeout(() => {
              showNextSlide();
            }, 1000);
          } else {
            option.classList.add('incorrect');
            option.textContent = `${selectedValue} ✗`;
          }
        });
      });
      break;
      
    default:
      slideContentElement.innerHTML = `
        <div class="slide-default">
          <h2>${slide.title}</h2>
          ${slide.character ? `<div class="character">${slide.character}</div>` : ''}
          <p>${slide.text}</p>
          ${slide.diagram ? `<div class="diagram"><img src="./assets/diagrams/${slide.diagram}" alt="Diagram"></div>` : ''}
        </div>
      `;
  }
  
  // Update narration text
  narrationTextElement.textContent = slide.narration || slide.text;
}

/**
 * Show the next slide
 */
function showNextSlide() {
  if (currentSlideIndex < currentLesson.slides.length - 1) {
    loadSlide(currentSlideIndex + 1);
  }
}

/**
 * Show the previous slide
 */
function showPreviousSlide() {
  if (currentSlideIndex > 0) {
    loadSlide(currentSlideIndex - 1);
  }
}

/**
 * Play narration (placeholder)
 */
function playNarration() {
  const playBtn = document.getElementById('play-narration-btn');
  if (playBtn) {
    playBtn.textContent = '🔊 Playing...';
    playBtn.disabled = true;
    
    // Simulate playing narration
    setTimeout(() => {
      playBtn.textContent = '▶ Play Narration';
      playBtn.disabled = false;
    }, 3000);
  }
  
  // In a real implementation, this would play actual audio narration
  console.log('Playing narration for slide:', currentSlideIndex);
}