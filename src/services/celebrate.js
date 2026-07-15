// =============================================================================
// Celebration — a joyful pop-up with floating confetti and stars plus a warm
// phrase ("Well done!", "Mashallah!", …), spoken in the chirpy voice. Used
// whenever Liyana finishes a practice set, trick, table or assessment.
//
// Tone rules (docs/COACH.md): celebrations praise effort, never speed; they
// appear for a decent effort (≥50%), with an extra-sparkly version for
// mastery. Below that the views keep their gentle "nice try" message instead —
// popping confetti over a struggle would feel mocking.
// Respects prefers-reduced-motion (phrase only, no animation).
// =============================================================================
import { speak } from './tts.js';

const PHRASES = [
  'Well done, Liyana! 🌟',
  'Mashallah! Beautiful work! ✨',
  'Good job — you did it! 🎉',
  "You're doing so well! 💜",
  'What lovely careful thinking! 🧠',
  'Super work, superstar! ⭐',
  'Mashallah — what a star! 🌟',
  'You should feel so proud! 🥰',
  'Hooray for you! 🎈',
  'Brilliant — high five! 🙌'
];
const BIG_PHRASES = [
  'WOW — Mashallah, amazing! 🌟✨',
  'Three stars — incredible work! ⭐⭐⭐',
  'You superstar — that was brilliant! 🎉',
  'Daddy will be so proud — Mashallah! 💜'
];
const STARS = ['⭐', '🌟', '✨', '💜', '🎈', '🎉'];
const COLORS = ['#FF6B9D', '#4ECDC4', '#FFD93D', '#A78BFA', '#63C779'];

let lastPhrase = '';

function pick(list) {
  let p = list[Math.floor(Math.random() * list.length)];
  if (p === lastPhrase && list.length > 1) p = list[(list.indexOf(p) + 1) % list.length];
  lastPhrase = p;
  return p;
}

/**
 * Show a celebration. `big` = extra sparkle (mastery / 3 stars).
 * Safe to call from any view; cleans itself up.
 */
export function celebrate({ big = false } = {}) {
  const phrase = pick(big ? BIG_PHRASES : PHRASES);
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const layer = document.createElement('div');
  layer.className = 'celebration';

  if (!reduced) {
    const pieces = big ? 70 : 40;
    for (let i = 0; i < pieces; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = `${Math.random() * 100}%`;
      p.style.background = COLORS[i % COLORS.length];
      p.style.animationDelay = `${Math.random() * 1.2}s`;
      p.style.opacity = '1';
      layer.appendChild(p);
    }
    const stars = big ? 14 : 8;
    for (let i = 0; i < stars; i++) {
      const s = document.createElement('span');
      s.className = 'float-star';
      s.textContent = STARS[i % STARS.length];
      s.style.left = `${5 + Math.random() * 90}%`;
      s.style.animationDelay = `${Math.random() * 1.4}s`;
      s.style.fontSize = `${1.2 + Math.random() * 1.4}rem`;
      layer.appendChild(s);
    }
  }

  const card = document.createElement('div');
  card.className = 'celebrate-phrase' + (big ? ' celebrate-big' : '');
  card.textContent = phrase;
  layer.appendChild(card);

  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), big ? 4200 : 3200);

  // Say it out loud in the chirpy voice (strip the emoji for speech).
  const spoken = phrase.replace(/[^\p{L}\p{N}\s,!'’—-]/gu, '').trim();
  if (spoken) speak(spoken);
}
