#!/usr/bin/env node

/**
 * Remedial Content Generation Script
 * 
 * This script generates targeted remedial content based on weak area data
 * exported from the application.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CONTENT_DIR = path.join(__dirname, '..', 'content');
const PROMPTS_DIR = path.join(__dirname, 'prompts');

// Validate API key
if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in environment variables.');
  console.error('Please create a .env file with your Gemini API key.');
  console.error('See .env.example for the required format.');
  process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Load weak areas data from export file
 */
async function loadWeakAreas(exportFile) {
  try {
    const data = await fs.readFile(exportFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading weak areas data from ${exportFile}:`, error);
    process.exit(1);
  }
}

/**
 * Load prompt template
 */
async function loadPrompt(templateName) {
  try {
    const promptPath = path.join(PROMPTS_DIR, templateName);
    return await fs.readFile(promptPath, 'utf8');
  } catch (error) {
    console.error(`Error loading prompt ${templateName}:`, error);
    process.exit(1);
  }
}

/**
 * Generate content using Gemini
 */
async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response (Gemini sometimes includes markdown formatting)
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw error;
  }
}

/**
 * Save content to file
 */
async function saveContent(filePath, content) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    console.log(`Saved remedial content to ${filePath}`);
  } catch (error) {
    console.error(`Error saving content to ${filePath}:`, error);
    throw error;
  }
}

/**
 * Generate remedial story game content
 */
async function generateRemedialGame(weakArea) {
  const promptTemplate = await loadPrompt('remedial-prompt.txt');
  
  // Define schema for story game
  const schema = {
    type: "object",
    properties: {
      episodeId: { type: "string" },
      title: { type: "string" },
      strand: { type: "string" },
      skillTag: { type: "string" },
      scenes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            sceneId: { type: "string" },
            narrationText: { type: "string" },
            challenge: {
              type: "object",
              properties: {
                type: { type: "string" },
                question: { type: "string" },
                visual: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    item: { type: "string" },
                    count: { type: "number" }
                  }
                },
                options: {
                  type: "array",
                  items: { type: "string" }
                },
                correctAnswer: { type: "string" },
                skillTag: { type: "string" },
                hintText: { type: "string" },
                successText: { type: "string" },
                retryText: { type: "string" }
              },
              required: ["type", "question", "visual", "options", "correctAnswer", "skillTag", "hintText", "successText", "retryText"]
            },
            nextSceneOnCorrect: { type: "string" },
            nextSceneOnWrong: { type: "string" }
          },
          required: ["sceneId", "narrationText", "challenge", "nextSceneOnCorrect", "nextSceneOnWrong"]
        }
      }
    },
    required: ["episodeId", "title", "strand", "skillTag", "scenes"]
  };
  
  // Format prompt with weak area data
  const prompt = promptTemplate
    .replace('{skillTag}', weakArea.skillTag)
    .replace('{accuracy}', (weakArea.accuracy * 100).toFixed(0))
    .replace('{learningObjective}', `Master ${weakArea.skillTag}`)
    .replace('{strand}', weakArea.strand)
    .replace('{favoriteCharacters}', 'Professor Hoot, Scorch') // Placeholder
    .replace('{misconceptions}', 'Common counting errors') // Placeholder
    .replace('{schema}', JSON.stringify(schema, null, 2));
  
  console.log(`Generating remedial game for ${weakArea.skillTag}...`);
  const content = await generateContent(prompt);
  return content;
}

/**
 * Main function
 */
async function main() {
  // Get export file from command line arguments
  const exportFile = process.argv[2];
  
  if (!exportFile) {
    console.error('Usage: node generate-remedial.mjs <weak-areas-export.json>');
    process.exit(1);
  }
  
  console.log('Starting remedial content generation...');
  
  try {
    // Load weak areas data
    const weakAreas = await loadWeakAreas(exportFile);
    
    // Process each weak area
    for (const weakArea of weakAreas) {
      // Only generate content for high severity weak areas
      if (weakArea.severity === 'high') {
        console.log(`Processing weak area: ${weakArea.skillTag}`);
        
        try {
          // Generate and save remedial story game
          const storyGame = await generateRemedialGame(weakArea);
          const gamePath = path.join(CONTENT_DIR, 'remedial', weakArea.skillTag, 'story-game.json');
          await saveContent(gamePath, storyGame);
          
          console.log(`Completed remedial content for: ${weakArea.skillTag}\n`);
        } catch (error) {
          console.error(`Failed to generate remedial content for ${weakArea.skillTag}:`, error);
          // Continue with other weak areas
        }
      }
    }
    
    console.log('Remedial content generation complete!');
  } catch (error) {
    console.error('Remedial content generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}