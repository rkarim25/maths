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
import { CELEBRATE_PHRASES, CELEBRATE_BIG, BREAK_MESSAGES, speakable } from '../src/data/phrases.js';

export const VOICE = 'en-GB-MaisieNeural';
export const RATE = '+8%';
export const PITCH = '+15Hz';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'audio');
mkdirSync(outDir, { recursive: true });

const all = [...CELEBRATE_PHRASES, ...CELEBRATE_BIG, ...BREAK_MESSAGES];
for (const p of all) {
  const out = join(outDir, `${p.file}.mp3`);
  execFileSync('python', [
    '-m', 'edge_tts', '--voice', VOICE, '--rate', RATE, '--pitch', PITCH,
    '--text', speakable(p.text), '--write-media', out
  ], { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log('✓', p.file, '—', speakable(p.text).slice(0, 50));
}
console.log(`\n${all.length} clips written to src/assets/audio/`);
