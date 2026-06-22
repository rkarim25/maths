// Friendly text-to-speech. Picks the most natural available voice and uses a
// warm, slightly higher pitch so narration sounds chirpy rather than robotic.
let preferred = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const find = (re) => voices.find((v) => re.test(v.name));
  // Prefer known natural/expressive voices, then a friendly female en voice.
  return (
    find(/Google UK English Female/i) ||
    find(/Google US English/i) ||
    find(/Microsoft (Libby|Sonia|Maisie|Aria|Jenny|Hazel)/i) ||
    find(/(Samantha|Karen|Moira|Tessa|Fiona|Female)/i) ||
    voices.find((v) => /^en-GB/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0]
  );
}

if ('speechSynthesis' in window) {
  preferred = pickVoice();
  // Voices often load asynchronously.
  window.speechSynthesis.onvoiceschanged = () => { preferred = pickVoice(); };
}

/**
 * Speak text in a warm, child-friendly voice. Cancels anything already playing.
 */
export function speak(text) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  if (!preferred) preferred = pickVoice();
  const u = new SpeechSynthesisUtterance(text);
  if (preferred) { u.voice = preferred; u.lang = preferred.lang; }
  u.rate = 0.95;   // a touch slower so a young child can follow
  u.pitch = 1.3;   // higher = brighter and chirpier
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
