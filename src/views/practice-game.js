// Practice game view with scoring
import { navigateTo } from '../router.js';

// Current game state
let currentGame = null;
let currentEpisode = null;
let score = 0;
let totalQuestions = 0;
let currentQuestionIndex = 0;
let userAnswers = [];

/**
 * Render the practice game view
 * @param {Object} episode - The episode data
 * @param {Object} lessonContent - The lesson content
 */
export function renderPracticeGame(episode, lessonContent) {
  currentEpisode = episode;
  currentGame = lessonContent;
  score = 0;
  totalQuestions = 0;
  currentQuestionIndex = 0;
  userAnswers = [];
  
  // Count interactive slides for total questions
  if (lessonContent.slides) {
    totalQuestions = lessonContent.slides.filter(slide => slide.type === 'interactive').length;
  }
  
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  appElement.innerHTML = `
    <div class="practice-game">
      <div class="header">
        <button id="back-btn" class="back-button">← Back to Strand</button>
        <h1>${lessonContent.title} - Practice</h1>
        <p>${episode.description}</p>
      </div>
      <div class="game-content">
        <div class="game-header">
          <div class="score-display">
            <span class="score-label">Score:</span>
            <span class="score-value" id="current-score">0</span>
            <span class="score-divider">/</span>
            <span class="score-total" id="total-questions">${totalQuestions}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
          </div>
        </div>
        <div id="game-area" class="game-area">
          <!-- Game content will be loaded here -->
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
  
  // Load the first interactive question
  loadNextQuestion();
}

/**
 * Load and display the next question
 */
function loadNextQuestion() {
  if (!currentGame || !currentGame.slides) {
    showGameComplete();
    return;
  }
  
  // Find the next interactive slide
  let interactiveSlides = currentGame.slides.filter(slide => slide.type === 'interactive');
  
  if (currentQuestionIndex >= interactiveSlides.length) {
    showGameComplete();
    return;
  }
  
  const slide = interactiveSlides[currentQuestionIndex];
  const gameArea = document.getElementById('game-area');
  
  if (!gameArea) return;
  
  // Update progress
  updateProgress();
  
  // Render the question
  gameArea.innerHTML = `
    <div class="question-container">
      <div class="question-header">
        ${slide.character ? `<div class="character">${slide.character}</div>` : ''}
        <h2>${slide.title}</h2>
      </div>
      <div class="question-content">
        <p>${slide.text}</p>
        ${slide.diagram ? `<div class="diagram"><img src="./assets/diagrams/${slide.diagram}" alt="Question illustration"></div>` : ''}
        <p class="question-prompt">${slide.interactivePrompt}</p>
        <div class="answer-options">
          ${slide.options.map((option, i) => `
            <button class="answer-option" data-value="${option}">${option}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for answer options
  const answerButtons = gameArea.querySelectorAll('.answer-option');
  answerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedValue = button.getAttribute('data-value');
      checkAnswer(selectedValue, slide.correctAnswer, button);
    });
  });
}

/**
 * Check the user's answer
 * @param {string} userAnswer - The user's selected answer
 * @param {string} correctAnswer - The correct answer
 * @param {HTMLElement} button - The button element
 */
function checkAnswer(userAnswer, correctAnswer, button) {
  const isCorrect = userAnswer == correctAnswer;
  
  // Store the answer
  userAnswers.push({
    questionIndex: currentQuestionIndex,
    userAnswer: userAnswer,
    correctAnswer: correctAnswer,
    isCorrect: isCorrect
  });
  
  // Update score if correct
  if (isCorrect) {
    score++;
    updateScore();
    button.classList.add('correct');
    button.textContent = `${userAnswer} ✓`;
  } else {
    button.classList.add('incorrect');
    button.textContent = `${userAnswer} ✗`;
  }
  
  // Disable all buttons
  const answerButtons = document.querySelectorAll('.answer-option');
  answerButtons.forEach(btn => {
    btn.disabled = true;
  });
  
  // Move to next question after a delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
      loadNextQuestion();
    } else {
      showGameComplete();
    }
  }, 1500);
}

/**
 * Update the score display
 */
function updateScore() {
  const scoreElement = document.getElementById('current-score');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

/**
 * Update the progress bar
 */
function updateProgress() {
  const progressFill = document.getElementById('progress-fill');
  if (progressFill && totalQuestions > 0) {
    const progressPercent = ((currentQuestionIndex) / totalQuestions) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }
}

/**
 * Show the game completion screen
 */
function showGameComplete() {
  const gameArea = document.getElementById('game-area');
  if (!gameArea) return;
  
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  // Determine performance message
  let performanceMessage = '';
  let performanceClass = '';
  
  if (percentage >= 90) {
    performanceMessage = 'Excellent! You\'re a math wizard! 🌟';
    performanceClass = 'excellent';
  } else if (percentage >= 70) {
    performanceMessage = 'Great job! You\'re getting really good! 🎉';
    performanceClass = 'good';
  } else if (percentage >= 50) {
    performanceMessage = 'Good effort! Keep practicing and you\'ll improve! 💪';
    performanceClass = 'fair';
  } else {
    performanceMessage = 'Nice try! Practice makes perfect! 📚';
    performanceClass = 'needs-improvement';
  }
  
  gameArea.innerHTML = `
    <div class="game-complete ${performanceClass}">
      <h2>Game Complete! 🎮</h2>
      <div class="final-score">
        <div class="score-circle">
          <span class="score-number">${score}</span>
          <span class="score-total-small">/${totalQuestions}</span>
        </div>
        <div class="score-percentage">${percentage}%</div>
      </div>
      <p class="performance-message">${performanceMessage}</p>
      <div class="game-actions">
        <button id="play-again-btn" class="primary-btn">Play Again</button>
        <button id="back-to-strand-btn" class="secondary-btn">Back to Strand</button>
      </div>
    </div>
  `;
  
  // Add event listeners
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      // Reset game and start over
      score = 0;
      currentQuestionIndex = 0;
      userAnswers = [];
      updateScore();
      loadNextQuestion();
    });
  }
  
  const backToStrandBtn = document.getElementById('back-to-strand-btn');
  if (backToStrandBtn) {
    backToStrandBtn.addEventListener('click', () => {
      const strand = currentEpisode.strand;
      if (strand) {
        navigateTo(`/strand/${encodeURIComponent(strand)}`);
      } else {
        navigateTo('/world-map');
      }
    });
  }
}