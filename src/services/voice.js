// =============================================================================
// Sunny's voice — plays the pre-generated neural mp3 clips (lively, warm),
// falling back to the browser's speechSynthesis only when a clip is missing
// or playback is blocked. Clips are produced by tools/generate-audio.mjs from
// src/data/phrases.js; Sunny's nightly note carries its own audio (base64)
// generated at publish time by tools/coach-publish.mjs.
// =============================================================================
import { speak, stopSpeaking } from './tts.js';
import { speakable } from '../data/phrases.js';

const CLIP_URLS = import.meta.glob('../assets/audio/*.mp3', { eager: true, as: 'url' });

let current = null;

export function stopVoice() {
  if (current) { try { current.pause(); } catch (e) { /* noop */ } current = null; }
  stopSpeaking();
}

/** Play a phrase object ({file, text}) from src/data/phrases.js. */
export function sayPhrase(phrase) {
  stopVoice();
  const url = CLIP_URLS[`../assets/audio/${phrase.file}.mp3`];
  if (url && playUrl(url, phrase.text)) return;
  speak(speakable(phrase.text));
}

/** Play base64 mp3 audio (e.g. Sunny's note), falling back to TTS of `text`. */
export function playB64(b64, text) {
  stopVoice();
  if (b64 && playUrl(`data:audio/mpeg;base64,${b64}`, text)) return;
  speak(speakable(text));
}

function playUrl(url, fallbackText) {
  try {
    const a = new Audio(url);
    current = a;
    a.play().catch(() => { if (current === a) { current = null; speak(speakable(fallbackText)); } });
    return true;
  } catch (e) {
    return false;
  }
}
