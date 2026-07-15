#!/usr/bin/env node
// =============================================================================
// Pre-generate Sunny's spoken phrases as mp3s with a lively neural voice
// (Microsoft Edge TTS, en-GB-MaisieNeural — a bright British child voice),
// because the browser's built-in speechSynthesis sounds mechanical.
//
// Usage:   node tools/generate-audio.mjs        (regenerates all phrase mp3s)
// Needs:   pip install edge-tts   (free, no API key; network to Microsoft)
// Output:  src/assets/audio/{file}.mp3 for every phrase in src/data/phrases.js
// Run this after ANY text change in phrases.js, then commit the mp3s.
// =============================================================================
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CELEBRATE_PHRASES, CELEBRATE_BIG, BREAK_MESSAGES, START_PHRASES, speakable, arabicize, hasArabic } from '../src/data/phrases.js';

// English-only lines use Maisie (lively British child voice). Lines with
// Islamic words are arabicized (Arabic script) and use Ava, a multilingual
// voice that pronounces the Arabic properly instead of with an English accent.
export const VOICES = {
  english: { voice: 'en-GB-MaisieNeural', rate: '+8%', pitch: '+15Hz' },
  multilingual: { voice: 'en-US-AvaMultilingualNeural', rate: '+5%', pitch: '+10Hz' }
};

export function speechFor(text) {
  const spoken = arabicize(speakable(text));
  return { spoken, ...(hasArabic(spoken) ? VOICES.multilingual : VOICES.english) };
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'audio');
mkdirSync(outDir, { recursive: true });

const all = [...CELEBRATE_PHRASES, ...CELEBRATE_BIG, ...BREAK_MESSAGES, ...START_PHRASES];
for (const p of all) {
  const out = join(outDir, `${p.file}.mp3`);
  const { spoken, voice, rate, pitch } = speechFor(p.text);
  execFileSync('python', [
    '-m', 'edge_tts', '--voice', voice, '--rate', rate, '--pitch', pitch,
    '--text', spoken, '--write-media', out
  ], { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log('✓', p.file, `[${voice.includes('Multilingual') ? 'Ava/ar' : 'Maisie'}]`, '—', speakable(p.text).slice(0, 46));
}
console.log(`\n${all.length} clips written to src/assets/audio/`);
