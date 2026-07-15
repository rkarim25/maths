// Friendly text-to-speech. Picks the most natural available voice and uses a
// warm, slightly higher pitch so narration sounds chirpy rather than robotic.
let preferred = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const find = (re) => voices.find((v) => re.test(v.name));
  // Prefer the modern "natural" neural voices (liveliest by far), then known
  // expressive voices, then any friendly female en voice.
  return (
    voices.find((v) => /^en/i.test(v.lang) && /natural|online/i.test(v.name) && /(Maisie|Libby|Sonia|Aria|Jenny|Ana)/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang) && /natural|online/i.test(v.name)) ||
    find(/Google UK English Female/i) ||
    find(/Google US English/i) ||
    find(/Microsoft (Libby|Sonia|Maisie|Aria|Jenny|Hazel)/i) ||
    find(/(Samantha|Karen|Martha|Moira|Tessa|Fiona|Female)/i) ||
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
  u.rate = 1.0;    // lively but still easy for a young child to follow
  u.pitch = 1.35;  // higher = brighter and chirpier
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
