#!/usr/bin/env node

/**
 * Content Generation Script
 * 
 * This script generates story-slides, story-games, and assessments for each episode
 * using the Gemini API. Content is saved as static JSON files in the content/ directory.
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
const CURRICULUM_FILE = path.join(__dirname, '..', 'src', 'config', 'curriculum-registry.js');
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
 * Load curriculum registry
 */
async function loadCurriculum() {
  try {
    // For now, we'll manually define the curriculum structure
    // In a full implementation, this would dynamically import the JS file
    const curriculum = {
      1: {
        Autumn: [
          {
            id: 'y1-autumn-ep1',
            title: 'The Missing Crown Jewels',
            strand: 'Number & Place Value',
            skillTag: 'count-to-20',
            learningObjective: 'Count reliably up to 20 objects'
          }
        ]
      }
    };
    return curriculum;
  } catch (error) {
    console.error('Error loading curriculum:', error);
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
    console.log(`Saved content to ${filePath}`);
  } catch (error) {
    console.error(`Error saving content to ${filePath}:`, error);
    throw error;
  }
}

/**
 * Generate story slides content
 */
async function generateStorySlides(episode) {
  const promptTemplate = await loadPrompt('lesson-prompt.txt');
  
  // Define schema for story slides
  const schema = {
    type: "object",
    properties: {
      episodeId: { type: "string" },
      title: { type: "string" },
      strand: { type: "string" },
      skillTag: { type: "string" },
      slides: {
        type: "array",
        items: {
          type: "object",
          properties: {
            slideId: { type: "number" },
            sceneDescription: { type: "string" },
            narrationText: { type: "string" },
            characterDialogue: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  speaker: { type: "string" },
                  text: { type: "string" },
                  emotion: { type: "string" }
                },
                required: ["speaker", "text"]
              }
            },
            visualElements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  asset: { type: "string" },
                  position: { type: "string" }
                }
              }
            },
            interaction: {
              type: ["object", "null"],
              properties: {
                type: { type: "string" },
                prompt: { type: "string" }
              }
            },
            durationMs: { type: "number" }
          },
          required: ["slideId", "sceneDescription", "narrationText", "characterDialogue", "visualElements", "durationMs"]
        }
      }
    },
    required: ["episodeId", "title", "strand", "skillTag", "slides"]
  };
  
  // Format prompt with episode data
  const prompt = promptTemplate
    .replace('{title}', episode.title)
    .replace('{skillTag}', episode.skillTag)
    .replace('{learningObjective}', episode.learningObjective)
    .replace('{strand}', episode.strand)
    .replace('{schema}', JSON.stringify(schema, null, 2));
  
  console.log(`Generating story slides for ${episode.title}...`);
  const content = await generateContent(prompt);
  return content;
}

/**
 * Generate story game content
 */
async function generateStoryGame(episode) {
  const promptTemplate = await loadPrompt('game-prompt.txt');
  
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
  
  // Format prompt with episode data
  const prompt = promptTemplate
    .replace('{title}', episode.title)
    .replace('{skillTag}', episode.skillTag)
    .replace('{learningObjective}', episode.learningObjective)
    .replace('{strand}', episode.strand)
    .replace('{schema}', JSON.stringify(schema, null, 2));
  
  console.log(`Generating story game for ${episode.title}...`);
  const content = await generateContent(prompt);
  return content;
}

/**
 * Generate assessment content
 */
async function generateAssessment(episode) {
  const promptTemplate = await loadPrompt('assessment-prompt.txt');
  
  // Define schema for assessment
  const schema = {
    type: "object",
    properties: {
      episodeId: { type: "string" },
      title: { type: "string" },
      passThreshold: { type: "number" },
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            questionId: { type: "string" },
            type: { type: "string" },
            skillTag: { type: "string" },
            question: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" }
            },
            correctAnswer: { type: "string" },
            maxTimeMs: { type: ["number", "null"] }
          },
          required: ["questionId", "type", "skillTag", "question", "options", "correctAnswer"]
        }
      }
    },
    required: ["episodeId", "title", "passThreshold", "questions"]
  };
  
  // Format prompt with episode data
  const prompt = promptTemplate
    .replace('{title}', episode.title)
    .replace('{skillTag}', episode.skillTag)
    .replace('{learningObjective}', episode.learningObjective)
    .replace('{strand}', episode.strand)
    .replace('{schema}', JSON.stringify(schema, null, 2));
  
  console.log(`Generating assessment for ${episode.title}...`);
  const content = await generateContent(prompt);
  return content;
}

/**
 * Main function
 */
async function main() {
  console.log('Starting content generation...');
  
  try {
    // Load curriculum
    const curriculum = await loadCurriculum();
    
    // Process each year
    for (const year in curriculum) {
      console.log(`Processing Year ${year}...`);
      
      // Process each term
      for (const term in curriculum[year]) {
        console.log(`Processing ${term} term...`);
        
        // Process each episode
        for (const episode of curriculum[year][term]) {
          console.log(`Processing episode: ${episode.title}`);
          
          // Create episode directory
          const episodeDir = path.join(CONTENT_DIR, `y${year}`, term.toLowerCase(), episode.id);
          
          try {
            // Generate and save story slides
            const storySlides = await generateStorySlides(episode);
            const slidesPath = path.join(episodeDir, 'story-slides.json');
            await saveContent(slidesPath, storySlides);
            
            // Generate and save story game
            const storyGame = await generateStoryGame(episode);
            const gamePath = path.join(episodeDir, 'story-game.json');
            await saveContent(gamePath, storyGame);
            
            // Generate and save assessment
            const assessment = await generateAssessment(episode);
            const assessmentPath = path.join(episodeDir, 'assessment.json');
            await saveContent(assessmentPath, assessment);
            
            console.log(`Completed episode: ${episode.title}\n`);
          } catch (error) {
            console.error(`Failed to generate content for ${episode.title}:`, error);
            // Continue with other episodes
          }
        }
      }
    }
    
    console.log('Content generation complete!');
  } catch (error) {
    console.error('Content generation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateStorySlides, generateStoryGame, generateAssessment };