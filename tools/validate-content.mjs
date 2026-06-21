#!/usr/bin/env node

/**
 * Content Validation Script
 * 
 * This script validates generated content against schemas to ensure quality and consistency.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'content');

/**
 * Validate JSON file against a schema
 */
function validateSchema(data, schema) {
  const errors = [];
  
  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }
  
  // Validate properties
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in data) {
        const value = data[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        
        // Check type
        if (propSchema.type) {
          const expectedTypes = Array.isArray(propSchema.type) 
            ? propSchema.type 
            : [propSchema.type];
            
          if (!expectedTypes.includes(type)) {
            errors.push(`Field ${key} has type ${type}, expected ${expectedTypes.join(' or ')}`);
          }
        }
        
        // Recursively validate objects
        if (type === 'object' && propSchema.properties) {
          const nestedErrors = validateSchema(value, propSchema);
          errors.push(...nestedErrors.map(err => `${key}.${err}`));
        }
        
        // Validate array items
        if (type === 'array' && propSchema.items) {
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const itemType = Array.isArray(item) ? 'array' : typeof item;
            
            if (propSchema.items.type && itemType !== propSchema.items.type) {
              errors.push(`Array item ${key}[${i}] has type ${itemType}, expected ${propSchema.items.type}`);
            }
            
            // Recursively validate object items
            if (itemType === 'object' && propSchema.items.properties) {
              const nestedErrors = validateSchema(item, propSchema.items);
              errors.push(...nestedErrors.map(err => `${key}[${i}].${err}`));
            }
          }
        }
      }
    }
  }
  
  return errors;
}

/**
 * Validate story slides content
 */
function validateStorySlides(content) {
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
  
  const errors = validateSchema(content, schema);
  
  // Additional content-specific validations
  if (content.slides) {
    for (let i = 0; i < content.slides.length; i++) {
      const slide = content.slides[i];
      
      // Check for empty narration text
      if (!slide.narrationText || slide.narrationText.trim() === '') {
        errors.push(`Slide ${i + 1} has empty narrationText`);
      }
      
      // Check for reasonable duration
      if (slide.durationMs < 1000 || slide.durationMs > 30000) {
        errors.push(`Slide ${i + 1} has unusual duration: ${slide.durationMs}ms`);
      }
    }
  }
  
  return errors;
}

/**
 * Validate story game content
 */
function validateStoryGame(content) {
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
  
  const errors = validateSchema(content, schema);
  
  // Additional content-specific validations
  if (content.scenes) {
    for (let i = 0; i < content.scenes.length; i++) {
      const scene = content.scenes[i];
      
      // Check for empty narration text
      if (!scene.narrationText || scene.narrationText.trim() === '') {
        errors.push(`Scene ${i + 1} has empty narrationText`);
      }
      
      // Validate challenge
      if (scene.challenge) {
        const challenge = scene.challenge;
        
        // Check for empty question
        if (!challenge.question || challenge.question.trim() === '') {
          errors.push(`Scene ${i + 1} challenge has empty question`);
        }
        
        // Check options
        if (challenge.options && challenge.options.length > 0) {
          // Check for empty options
          for (let j = 0; j < challenge.options.length; j++) {
            if (!challenge.options[j] || challenge.options[j].trim() === '') {
              errors.push(`Scene ${i + 1} challenge option ${j + 1} is empty`);
            }
          }
          
          // Check if correct answer is in options
          if (challenge.correctAnswer && !challenge.options.includes(challenge.correctAnswer)) {
            errors.push(`Scene ${i + 1} challenge correctAnswer not found in options`);
          }
        }
        
        // Check for empty hint text
        if (!challenge.hintText || challenge.hintText.trim() === '') {
          errors.push(`Scene ${i + 1} challenge has empty hintText`);
        }
        
        // Check for empty success text
        if (!challenge.successText || challenge.successText.trim() === '') {
          errors.push(`Scene ${i + 1} challenge has empty successText`);
        }
        
        // Check for empty retry text
        if (!challenge.retryText || challenge.retryText.trim() === '') {
          errors.push(`Scene ${i + 1} challenge has empty retryText`);
        }
      }
    }
  }
  
  return errors;
}

/**
 * Validate assessment content
 */
function validateAssessment(content) {
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
  
  const errors = validateSchema(content, schema);
  
  // Additional content-specific validations
  if (content.questions) {
    // Check pass threshold
    if (content.passThreshold < 0 || content.passThreshold > 1) {
      errors.push(`Invalid passThreshold: ${content.passThreshold} (should be between 0 and 1)`);
    }
    
    for (let i = 0; i < content.questions.length; i++) {
      const question = content.questions[i];
      
      // Check for empty question
      if (!question.question || question.question.trim() === '') {
        errors.push(`Question ${i + 1} has empty question text`);
      }
      
      // Check options
      if (question.options && question.options.length > 0) {
        // Check for empty options
        for (let j = 0; j < question.options.length; j++) {
          if (!question.options[j] || question.options[j].trim() === '') {
            errors.push(`Question ${i + 1} option ${j + 1} is empty`);
          }
        }
        
        // Check if correct answer is in options
        if (question.correctAnswer && !question.options.includes(question.correctAnswer)) {
          errors.push(`Question ${i + 1} correctAnswer not found in options`);
        }
      }
    }
  }
  
  return errors;
}

/**
 * Validate a content file
 */
async function validateContentFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const content = JSON.parse(data);
    
    // Determine content type from file name
    const fileName = path.basename(filePath);
    let errors = [];
    
    if (fileName === 'story-slides.json') {
      errors = validateStorySlides(content);
    } else if (fileName === 'story-game.json') {
      errors = validateStoryGame(content);
    } else if (fileName === 'assessment.json') {
      errors = validateAssessment(content);
    } else {
      console.log(`Skipping unknown content file: ${fileName}`);
      return [];
    }
    
    if (errors.length > 0) {
      console.log(`Validation errors in ${filePath}:`);
      errors.forEach(error => console.log(`  - ${error}`));
      return errors;
    } else {
      console.log(`✓ ${filePath} is valid`);
      return [];
    }
  } catch (error) {
    console.error(`Error validating ${filePath}:`, error.message);
    return [error.message];
  }
}

/**
 * Recursively find all JSON files in a directory
 */
async function findJsonFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = await fs.stat(itemPath);
    
    if (stat.isDirectory()) {
      files.push(...await findJsonFiles(itemPath));
    } else if (item.endsWith('.json')) {
      files.push(itemPath);
    }
  }
  
  return files;
}

/**
 * Main function
 */
async function main() {
  console.log('Starting content validation...');
  
  try {
    // Find all JSON files in content directory
    const jsonFiles = await findJsonFiles(CONTENT_DIR);
    
    // Validate each file
    let totalErrors = 0;
    for (const file of jsonFiles) {
      const errors = await validateContentFile(file);
      totalErrors += errors.length;
    }
    
    if (totalErrors > 0) {
      console.log(`\nValidation completed with ${totalErrors} errors.`);
      process.exit(1);
    } else {
      console.log('\n✓ All content files are valid!');
    }
  } catch (error) {
    console.error('Content validation failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}