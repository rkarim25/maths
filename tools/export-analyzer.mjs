#!/usr/bin/env node

/**
 * Export Data Analyzer Script
 * 
 * This script analyzes exported usage data to identify trends and insights
 * for improving the curriculum and content.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load export data from file
 */
async function loadExportData(exportFile) {
  try {
    const data = await fs.readFile(exportFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading export data from ${exportFile}:`, error);
    process.exit(1);
  }
}

/**
 * Analyze answer log data
 */
function analyzeAnswerLog(answerLog) {
  console.log('\n=== Answer Log Analysis ===');
  
  // Overall statistics
  const totalAnswers = answerLog.length;
  const correctAnswers = answerLog.filter(a => a.correct).length;
  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
  
  console.log(`Total answers: ${totalAnswers}`);
  console.log(`Correct answers: ${correctAnswers}`);
  console.log(`Overall accuracy: ${accuracy.toFixed(1)}%`);
  
  // Accuracy by strand
  const strandStats = {};
  for (const answer of answerLog) {
    if (!strandStats[answer.strand]) {
      strandStats[answer.strand] = { total: 0, correct: 0 };
    }
    strandStats[answer.strand].total++;
    if (answer.correct) {
      strandStats[answer.strand].correct++;
    }
  }
  
  console.log('\nAccuracy by strand:');
  for (const [strand, stats] of Object.entries(strandStats)) {
    const strandAccuracy = (stats.correct / stats.total) * 100;
    console.log(`  ${strand}: ${strandAccuracy.toFixed(1)}% (${stats.correct}/${stats.total})`);
  }
  
  // Accuracy by skill tag
  const skillStats = {};
  for (const answer of answerLog) {
    if (!skillStats[answer.skillTag]) {
      skillStats[answer.skillTag] = { total: 0, correct: 0 };
    }
    skillStats[answer.skillTag].total++;
    if (answer.correct) {
      skillStats[answer.skillTag].correct++;
    }
  }
  
  console.log('\nTop 10 challenging skills (lowest accuracy):');
  const sortedSkills = Object.entries(skillStats)
    .map(([skill, stats]) => ({
      skill,
      accuracy: (stats.correct / stats.total) * 100,
      correct: stats.correct,
      total: stats.total
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
  
  for (let i = 0; i < Math.min(10, sortedSkills.length); i++) {
    const skill = sortedSkills[i];
    console.log(`  ${skill.skill}: ${skill.accuracy.toFixed(1)}% (${skill.correct}/${skill.total})`);
  }
  
  // Hint usage
  const hintsUsed = answerLog.filter(a => a.hintUsed).length;
  const hintRate = totalAnswers > 0 ? (hintsUsed / totalAnswers) * 100 : 0;
  console.log(`\nHint usage: ${hintRate.toFixed(1)}% (${hintsUsed}/${totalAnswers})`);
  
  // Time spent statistics
  const times = answerLog.map(a => a.timeSpentMs).filter(t => t > 0);
  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    console.log(`\nTime spent per question:`);
    console.log(`  Average: ${Math.round(avgTime)}ms`);
    console.log(`  Minimum: ${minTime}ms`);
    console.log(`  Maximum: ${maxTime}ms`);
  }
}

/**
 * Analyze progress data
 */
function analyzeProgress(progress) {
  console.log('\n=== Progress Analysis ===');
  
  // Overall completion
  const totalEpisodes = progress.length;
  const completedEpisodes = progress.filter(p => p.status === 'completed').length;
  const inProgressEpisodes = progress.filter(p => p.status === 'in-progress').length;
  const lockedEpisodes = progress.filter(p => p.status === 'locked').length;
  
  console.log(`Total episodes: ${totalEpisodes}`);
  console.log(`Completed episodes: ${completedEpisodes}`);
  console.log(`In-progress episodes: ${inProgressEpisodes}`);
  console.log(`Locked episodes: ${lockedEpisodes}`);
  
  // Completion by strand
  const strandCompletion = {};
  for (const episode of progress) {
    if (!strandCompletion[episode.strand]) {
      strandCompletion[episode.strand] = { total: 0, completed: 0 };
    }
    strandCompletion[episode.strand].total++;
    if (episode.status === 'completed') {
      strandCompletion[episode.strand].completed++;
    }
  }
  
  console.log('\nCompletion by strand:');
  for (const [strand, stats] of Object.entries(strandCompletion)) {
    const completionRate = (stats.completed / stats.total) * 100;
    console.log(`  ${strand}: ${completionRate.toFixed(1)}% (${stats.completed}/${stats.total})`);
  }
  
  // Star distribution
  const starCounts = [0, 0, 0, 0]; // Index 0 = 0 stars, Index 1 = 1 star, etc.
  for (const episode of progress) {
    if (episode.status === 'completed') {
      starCounts[episode.stars]++;
    }
  }
  
  console.log('\nStar distribution for completed episodes:');
  for (let i = 0; i < starCounts.length; i++) {
    console.log(`  ${i} stars: ${starCounts[i]}`);
  }
}

/**
 * Analyze usage events data
 */
function analyzeUsageEvents(usageEvents) {
  console.log('\n=== Usage Events Analysis ===');
  
  // Session analysis
  const sessionStarts = usageEvents.filter(e => e.eventType === 'session-start');
  const sessionEnds = usageEvents.filter(e => e.eventType === 'session-end');
  
  console.log(`Total sessions: ${sessionStarts.length}`);
  
  // Session duration (if we have both start and end events)
  const sessionDurations = [];
  for (const startEvent of sessionStarts) {
    const sessionId = startEvent.metadata?.sessionId;
    if (sessionId) {
      const endEvent = sessionEnds.find(e => e.metadata?.sessionId === sessionId);
      if (endEvent) {
        const start = new Date(startEvent.timestamp);
        const end = new Date(endEvent.timestamp);
        const duration = end - start;
        sessionDurations.push(duration);
      }
    }
  }
  
  if (sessionDurations.length > 0) {
    const avgDuration = sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length;
    const minDuration = Math.min(...sessionDurations);
    const maxDuration = Math.max(...sessionDurations);
    
    console.log(`\nSession duration:`);
    console.log(`  Average: ${Math.round(avgDuration / 1000 / 60)} minutes`);
    console.log(`  Minimum: ${Math.round(minDuration / 1000 / 60)} minutes`);
    console.log(`  Maximum: ${Math.round(maxDuration / 1000 / 60)} minutes`);
  }
  
  // Popular event types
  const eventCounts = {};
  for (const event of usageEvents) {
    if (!eventCounts[event.eventType]) {
      eventCounts[event.eventType] = 0;
    }
    eventCounts[event.eventType]++;
  }
  
  console.log('\nEvent type distribution:');
  for (const [eventType, count] of Object.entries(eventCounts)) {
    console.log(`  ${eventType}: ${count}`);
  }
}

/**
 * Analyze weak areas data
 */
function analyzeWeakAreas(weakAreas) {
  console.log('\n=== Weak Areas Analysis ===');
  
  const totalWeakAreas = weakAreas.length;
  console.log(`Total weak areas identified: ${totalWeakAreas}`);
  
  // Severity distribution
  const severityCounts = { low: 0, medium: 0, high: 0 };
  for (const area of weakAreas) {
    severityCounts[area.severity]++;
  }
  
  console.log('\nSeverity distribution:');
  for (const [severity, count] of Object.entries(severityCounts)) {
    console.log(`  ${severity}: ${count}`);
  }
  
  // Top weak areas by severity
  console.log('\nTop 5 high severity weak areas:');
  const highSeverity = weakAreas
    .filter(a => a.severity === 'high')
    .sort((a, b) => b.accuracy - a.accuracy); // Sort by accuracy (lowest first)
  
  for (let i = 0; i < Math.min(5, highSeverity.length); i++) {
    const area = highSeverity[i];
    console.log(`  ${area.skillTag}: ${area.accuracy.toFixed(1)}% accuracy`);
  }
}

/**
 * Main function
 */
async function main() {
  // Get export file from command line arguments
  const exportFile = process.argv[2];
  
  if (!exportFile) {
    console.error('Usage: node export-analyzer.mjs <export-data.json>');
    process.exit(1);
  }
  
  console.log('Starting export data analysis...');
  
  try {
    // Load export data
    const exportData = await loadExportData(exportFile);
    
    // Analyze each data type
    if (exportData.answer_log) {
      analyzeAnswerLog(exportData.answer_log);
    }
    
    if (exportData.progress) {
      analyzeProgress(exportData.progress);
    }
    
    if (exportData.usage_events) {
      analyzeUsageEvents(exportData.usage_events);
    }
    
    if (exportData.weak_areas) {
      analyzeWeakAreas(exportData.weak_areas);
    }
    
    console.log('\n=== Analysis Complete ===');
  } catch (error) {
    console.error('Export data analysis failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}