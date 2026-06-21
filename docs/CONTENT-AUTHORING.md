# Content Authoring Guide

This guide explains how to create and manage content for Liyana's Maths Adventure using the Gemini-powered offline generation tools.

## Overview

All content for the application is pre-generated offline using Gemini API and stored as static JSON files in the `content/` directory. This approach ensures:
- No API keys are exposed in the client
- Fast loading times for content
- Complete offline capability
- Easy version control of content

## Content Structure

The content is organized as follows:
```
content/
├── curriculum.json              # Master curriculum registry
├── y1/                          # Year 1 content
│   ├── autumn/                  # Autumn term
│   │   ├── ep1/                 # Episode 1
│   │   │   ├── story-slides.json # Teaching content
│   │   │   ├── story-game.json   # Practice content
│   │   │   ├── assessment.json   # Assessment content
│   │   │   └── assets/           # Episode assets
│   │   │       ├── scene-1.svg
│   │   │       └── scene-2.svg
│   │   └── ...
│   └── ...
├── y2/                          # Year 2 content (stubbed)
├── y3/                          # Year 3 content (stubbed)
├── y4/                          # Year 4 content (stubbed)
└── remedial/                    # Remedial content
    └── {skillTag}/
        └── story-game.json
```

## Content Generation Workflow

### 1. Prerequisites
- Node.js installed
- Gemini API key
- This repository cloned locally

### 2. Setup
1. Navigate to the project directory:
   ```bash
   cd tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Gemini API key:
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```

### 3. Generate Content
1. Update the curriculum in `src/config/curriculum-registry.js` if needed

2. Run the content generation script:
   ```bash
   node generate-content.mjs
   ```

3. The script will:
   - Read the curriculum registry
   - Generate content for each episode
   - Validate the generated JSON
   - Save files to the `content/` directory

### 4. Generate Remedial Content
1. Export weak area data from the parent dashboard (JSON format)

2. Run the remedial content generation script:
   ```bash
   node generate-remedial.mjs path/to/weak-areas-export.json
   ```

3. The script will:
   - Analyze the weak areas
   - Generate targeted remedial content
   - Save files to `content/remedial/{skillTag}/`

## Content Schema

### Story Slides (`story-slides.json`)
```json
{
  "episodeId": "string",
  "title": "string",
  "strand": "string",
  "skillTag": "string",
  "slides": [
    {
      "slideId": "number",
      "sceneDescription": "string",
      "narrationText": "string",
      "characterDialogue": [
        {
          "speaker": "string",
          "text": "string",
          "emotion": "string"
        }
      ],
      "visualElements": [
        {
          "type": "string",
          "asset": "string",
          "position": "string"
        }
      ],
      "interaction": {
        "type": "string",
        "prompt": "string"
      },
      "durationMs": "number"
    }
  ]
}
```

### Story Game (`story-game.json`)
```json
{
  "episodeId": "string",
  "title": "string",
  "strand": "string",
  "skillTag": "string",
  "scenes": [
    {
      "sceneId": "string",
      "narrationText": "string",
      "challenge": {
        "type": "string",
        "question": "string",
        "visual": {
          "type": "string",
          "item": "string",
          "count": "number"
        },
        "options": ["string"],
        "correctAnswer": "string",
        "skillTag": "string",
        "hintText": "string",
        "successText": "string",
        "retryText": "string"
      },
      "nextSceneOnCorrect": "string",
      "nextSceneOnWrong": "string"
    }
  ]
}
```

### Assessment (`assessment.json`)
```json
{
  "episodeId": "string",
  "title": "string",
  "passThreshold": "number",
  "questions": [
    {
      "questionId": "string",
      "type": "string",
      "skillTag": "string",
      "question": "string",
      "options": ["string"],
      "correctAnswer": "string",
      "maxTimeMs": "number|null"
    }
  ]
}
```

## Gemini Prompt Engineering

The content generation scripts use carefully crafted prompts to ensure age-appropriate, engaging content.

### Story Slide Prompt Template
```
You are an expert children's educational content creator. Generate a story-based
math lesson for a 6.5-year-old girl named Liyana who loves stories.

EPISODE: {title}
MATH CONCEPT: {skillTag} — {learningObjective}
STRAND: {strand}
CHARACTERS: Professor Hoot (wise owl tutor), Scorch (friendly dragon),
           Sparkle (fairy), Cog (robot)

Generate JSON matching this schema: {schema}
Rules:
- All language must be British English, age-appropriate (reading age 6).
- Every slide must have narrationText suitable for text-to-speech in en-GB.
- Include 5-8 slides for the lesson, 3-5 scenes for the practice game.
- Wrong answers must never use negative language.
- Embed the math concept naturally in the story narrative.
- Include hints that guide without giving the answer directly.
```

### Story Game Prompt Template
```
You are an expert children's educational game designer. Create an interactive
story game that practices the math concept through narrative choices.

EPISODE: {title}
MATH CONCEPT: {skillTag} — {learningObjective}
STRAND: {strand}
CHARACTERS: Professor Hoot (wise owl tutor), Scorch (friendly dragon),
           Sparkle (fairy), Cog (robot)

Generate JSON matching this schema: {schema}
Rules:
- All language must be British English, age-appropriate (reading age 6).
- Create 3-5 scenes with branching narrative based on math challenges.
- Wrong answers should lead to gentle guidance, not failure.
- Include encouraging feedback for correct answers.
- Make the math integral to the story progression.
```

### Assessment Prompt Template
```
You are an expert educational assessment designer. Create a 5-question
assessment that checks mastery of the math concept.

EPISODE: {title}
MATH CONCEPT: {skillTag} — {learningObjective}
STRAND: {strand}

Generate JSON matching this schema: {schema}
Rules:
- All questions must directly assess the specified skillTag.
- Include a mix of question types (multiple choice, drag-drop, input).
- All language must be British English, age-appropriate.
- Correct answers must be unambiguous.
- Include plausible distractors for multiple choice questions.
- Set appropriate difficulty for the learning objective.
```

## Content Validation

All generated content is validated against schemas to ensure:
- Required fields are present
- Data types are correct
- No empty narration text
- Correct answers exist in options
- Skill tags match the curriculum registry
- No inappropriate language
- British English spelling

## Asset Generation

### SVG Illustrations
Gemini can generate scene descriptions that can be used with image generation tools to create SVG assets.

### Audio Narration
The application uses the Web Speech API for text-to-speech, so no audio files need to be generated.

## Customization

### Character Personalization
The prompt templates can be modified to include different characters or story themes.

### Difficulty Adjustment
The curriculum registry can be adjusted to change the progression or difficulty of concepts.

### Localization
The prompts can be modified to generate content in different languages or dialects.

## Troubleshooting

### Content Generation Errors
- Check your Gemini API key in `.env`
- Ensure you have internet connectivity
- Verify the curriculum registry is valid JSON
- Check the Node.js version (requires 18+)

### Validation Failures
- Review the error message for specific validation issues
- Check that all required fields are present
- Ensure skill tags match the curriculum registry
- Verify British English spelling

### Performance Issues
- Content generation for many episodes may take time
- Consider generating content in batches
- Monitor API usage limits

## Best Practices

### Storytelling
- Always embed math concepts naturally in the narrative
- Use consistent characters that children can relate to
- Include emotional elements to increase engagement
- Provide clear stakes or goals for each episode

### Educational Value
- Ensure each episode has a single, clear learning objective
- Include spaced repetition of previously learned concepts
- Provide immediate, constructive feedback
- Scaffold difficulty within each episode

### Accessibility
- Write all text at an appropriate reading level
- Include visual descriptions for all scenes
- Ensure color contrast meets accessibility standards
- Provide alternative text for all visual elements

### Technical Quality
- Validate all generated JSON against schemas
- Test content in the application before committing
- Keep file sizes reasonable for web delivery
- Use semantic file naming conventions