// =============================================================================
// Sunny's spoken phrases — the single source of truth for celebration and
// break-time lines. The family is Muslim, so encouragement is geared the
// Islamic way where it fits naturally (Mashallah, Alhamdulillah) — warm family
// speech, never preachy. Tone contract: docs/COACH.md.
//
// Each phrase has a pre-generated neural-voice mp3 (lively, NOT the robotic
// browser voice) created by `node tools/generate-audio.mjs` into
// src/assets/audio/{file}.mp3 — regenerate after ANY text change here.
// =============================================================================

export const CELEBRATE_PHRASES = [
  { file: 'cheer-0', text: 'Mashallah! Beautiful work, Liyana! ✨' },
  { file: 'cheer-1', text: 'Well done, Liyana! 🌟' },
  { file: 'cheer-2', text: 'Alhamdulillah — you did it! 🎉' },
  { file: 'cheer-3', text: "You're doing so well! 💜" },
  { file: 'cheer-4', text: 'What lovely careful thinking! 🧠' },
  { file: 'cheer-5', text: 'Mashallah — what a star! 🌟' },
  { file: 'cheer-6', text: 'Super work, superstar! ⭐' },
  { file: 'cheer-7', text: 'You should feel so proud! 🥰' },
  { file: 'cheer-8', text: 'Hooray for you! 🎈' },
  { file: 'cheer-9', text: 'Brilliant — high five! 🙌' }
];

export const CELEBRATE_BIG = [
  { file: 'big-0', text: 'WOW — Mashallah, that was amazing! 🌟✨' },
  { file: 'big-1', text: 'Three stars — Alhamdulillah, incredible work! ⭐⭐⭐' },
  { file: 'big-2', text: 'You superstar — that was brilliant! 🎉' },
  { file: 'big-3', text: 'Daddy will be so proud — Mashallah! 💜' },
  { file: 'big-4', text: 'Allah has given you such a wonderful brain — and you used it beautifully! ✨' }
];

export const BREAK_MESSAGES = [
  { file: 'break-0', text: "Alhamdulillah, what a lot of wonderful brain-work! How about a little stretch and a drink of water? The maths will wait happily for you. 💧🧸" },
  { file: 'break-1', text: 'What a busy brain you have! Time for a wiggle, a stretch and maybe a snack. Everything here will be right where you left it. 🌈' },
  { file: 'break-2', text: 'Your brain has been growing and growing, Mashallah! A little rest makes it even stronger — go have a bounce and come back whenever you like. 🎈' }
];

/** Strip emoji & symbols so the TTS reads only the words. */
export function speakable(text) {
  return text.replace(/[^\p{L}\p{N}\s,.!?'’—-]/gu, '').replace(/\s+/g, ' ').trim();
}

// For SPOKEN audio only (display text stays in Latin script): Islamic words
// are converted to Arabic script so a multilingual neural voice pronounces
// them with proper Arabic phonology instead of an English accent.
const ARABIC_WORDS = [
  [/mashallah|masha'?\s?allah/gi, 'ما شاء الله'],
  [/alhamdulillah/gi, 'الحمد لله'],
  [/inshallah|insha'?\s?allah/gi, 'إن شاء الله'],
  [/subhanallah/gi, 'سبحان الله'],
  [/bismillah/gi, 'بسم الله'],
  [/\ballah\b/gi, 'الله']
];

export function arabicize(text) {
  let t = text;
  for (const [re, ar] of ARABIC_WORDS) t = t.replace(re, ar);
  return t;
}

export function hasArabic(text) {
  return /[؀-ۿ]/.test(text);
}
