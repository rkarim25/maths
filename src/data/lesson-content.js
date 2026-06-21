// Lesson content data for episodes
const lessonContent = {
  'counting-1-10': {
    id: 'counting-1-10',
    title: 'Counting 1 to 10',
    learningObjective: 'Count from 1 to 10 with confidence',
    youtubeVideoId: 'counting-1-10-video',
    slides: [
      {
        type: 'story',
        title: 'The Magical Apple Tree',
        character: 'Finn the Fox',
        text: 'Finn the Fox was walking through the Enchanted Forest when he discovered a magical apple tree. "Wow!" said Finn, "This tree has exactly 10 apples!" But as he watched, one apple fell down.',
        diagram: 'apple-tree-mystery.svg',
        narration: 'Finn the Fox was walking through the Enchanted Forest when he discovered a magical apple tree. Wow! This tree has exactly 10 apples! But as he watched, one apple fell down.'
      },
      {
        type: 'teaching',
        title: 'Counting Apples',
        character: 'Finn the Fox',
        text: 'When one apple fell, Finn realized he needed to count how many were left. He started with 10 apples and counted backwards as each one fell.',
        diagram: 'counting-eggs.svg',
        narration: 'When one apple fell, Finn realized he needed to count how many were left. He started with 10 apples and counted backwards as each one fell.'
      },
      {
        type: 'video',
        title: 'Counting with Finn',
        text: 'Watch Finn count from 1 to 10 in this fun video!',
        youtubeEmbed: true
      },
      {
        type: 'interactive',
        title: 'Count the Apples',
        character: 'Finn the Fox',
        text: 'How many apples are left on the tree?',
        diagram: 'apple-tree-mystery.svg',
        interactivePrompt: 'Look at the tree. How many apples are still on it?',
        options: ['10', '9', '8', '7'],
        correctAnswer: '9',
        narration: 'Look at the tree. How many apples are still on it?'
      }
    ]
  },
  'number-bonds-10': {
    id: 'number-bonds-10',
    title: 'Number Bonds to 10',
    learningObjective: 'Understand how numbers can be split into parts that add to 10',
    youtubeVideoId: 'number-bonds-10-video',
    slides: [
      {
        type: 'story',
        title: 'The Wizard\'s Spellbook',
        character: 'Luna the Wizard',
        text: 'Luna the Wizard was practicing her magic spells. She discovered that to make the most powerful spells, she needed exactly 10 magic ingredients. But she could use different combinations!',
        diagram: 'number-bond-spellbook.svg',
        narration: 'Luna the Wizard was practicing her magic spells. She discovered that to make the most powerful spells, she needed exactly 10 magic ingredients. But she could use different combinations!'
      },
      {
        type: 'teaching',
        title: 'Magic Number Bonds',
        character: 'Luna the Wizard',
        text: 'Luna learned that 10 can be made by adding two numbers together in many ways. For example, 7 + 3 = 10, or 5 + 5 = 10. These are called number bonds!',
        diagram: 'number-bond-rainbow.svg',
        narration: 'Luna learned that 10 can be made by adding two numbers together in many ways. For example, 7 plus 3 equals 10, or 5 plus 5 equals 10. These are called number bonds!'
      },
      {
        type: 'video',
        title: 'Number Bonds Rainbow',
        text: 'Watch this colorful video about number bonds to 10!',
        youtubeEmbed: true
      },
      {
        type: 'interactive',
        title: 'Magic Number Bonds',
        character: 'Luna the Wizard',
        text: 'Luna needs 10 ingredients for her spell. She already has 6. How many more does she need?',
        diagram: 'number-bond-spellbook.svg',
        interactivePrompt: 'What number added to 6 makes 10?',
        options: ['3', '4', '5', '6'],
        correctAnswer: '4',
        narration: 'Luna needs 10 ingredients for her spell. She already has 6. How many more does she need? What number added to 6 makes 10?'
      }
    ]
  },
  'addition-basics': {
    id: 'addition-basics',
    title: 'Addition Basics',
    learningObjective: 'Add small numbers together using objects',
    youtubeVideoId: 'addition-basics-video',
    slides: [
      {
        type: 'story',
        title: 'The Bridge Builder',
        character: 'Benny the Beaver',
        text: 'Benny the Beaver was building a bridge across the stream. He needed planks of wood. His friend gave him 3 planks, and his neighbor gave him 4 more planks.',
        diagram: 'bridge-planks.svg',
        narration: 'Benny the Beaver was building a bridge across the stream. He needed planks of wood. His friend gave him 3 planks, and his neighbor gave him 4 more planks.'
      },
      {
        type: 'teaching',
        title: 'Adding Planks',
        character: 'Benny the Beaver',
        text: 'To find out how many planks Benny has in total, we add 3 + 4. We can count them all together: 1, 2, 3, 4, 5, 6, 7. So 3 + 4 = 7!',
        diagram: 'addition-planks.svg',
        narration: 'To find out how many planks Benny has in total, we add 3 plus 4. We can count them all together: 1, 2, 3, 4, 5, 6, 7. So 3 plus 4 equals 7!'
      },
      {
        type: 'video',
        title: 'Adding with Benny',
        text: 'Watch Benny add numbers in this fun video!',
        youtubeEmbed: true
      },
      {
        type: 'interactive',
        title: 'Bridge Building Math',
        character: 'Benny the Beaver',
        text: 'Benny started with 3 planks. His neighbor gave him 4 more. How many planks does he have now?',
        diagram: 'bridge-planks.svg',
        interactivePrompt: 'What is 3 + 4?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '7',
        narration: 'Benny started with 3 planks. His neighbor gave him 4 more. How many planks does he have now? What is 3 plus 4?'
      }
    ]
  }
};

/**
 * Get lesson content by episode ID
 * @param {string} episodeId - The episode ID
 * @returns {object|null} The lesson content or null if not found
 */
export function getLessonContent(episodeId) {
  return lessonContent[episodeId] || null;
}

/**
 * Get all lesson content
 * @returns {object} All lesson content
 */
export function getAllLessonContent() {
  return lessonContent;
}