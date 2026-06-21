// Curriculum registry based on the provided 11+ Math Syllabus
// This defines the structure for 4 years of learning, aligned with UK curriculum and 11+ prep

// Strands (broad categories of math)
export const STRANDS = {
  NUMBER: 'Number & Place Value',
  OPERATIONS: 'Addition, Subtraction, Multiplication & Division',
  FRACTIONS: 'Fractions, Decimals & Percentages',
  GEOMETRY: 'Geometry - Properties of Shapes',
  MEASUREMENT: 'Measurement',
  DATA: 'Statistics & Data Handling',
  ALGEBRA: 'Algebra & Sequences',
  RATIO: 'Ratio & Proportion',
  LOGIC: 'Mathematical Logic & Reasoning',
  SPATIAL: 'Spatial Reasoning & Non-Verbal'
};

// Years with their focus areas
export const YEARS = {
  1: {
    name: 'Foundation Year',
    focus: 'Visual Mastery and Fluency',
    description: 'Building core number sense, basic operations, and shape recognition',
    strands: [
      STRANDS.NUMBER,
      STRANDS.OPERATIONS,
      STRANDS.GEOMETRY,
      STRANDS.FRACTIONS
    ]
  },
  2: {
    name: 'Explorer Year',
    focus: 'Operational Basics and Foundational Shapes',
    description: 'Developing formal methods, multiplication/division basics, and data handling',
    strands: [
      STRANDS.NUMBER,
      STRANDS.OPERATIONS,
      STRANDS.FRACTIONS,
      STRANDS.MEASUREMENT,
      STRANDS.DATA,
      STRANDS.GEOMETRY
    ]
  },
  3: {
    name: 'Challenger Year',
    focus: 'Formal Written Mechanics and Introductory Multiplication',
    description: 'Mastering written methods, core times tables, and measurement',
    strands: [
      STRANDS.NUMBER,
      STRANDS.OPERATIONS,
      STRANDS.FRACTIONS,
      STRANDS.MEASUREMENT,
      STRANDS.GEOMETRY,
      STRANDS.DATA,
      STRANDS.ALGEBRA
    ]
  },
  4: {
    name: '11+ Sprint Year',
    focus: 'Complete Multiplication Automaticity and Exam Mechanics',
    description: 'Advanced arithmetic, algebra, ratio, and exam strategy',
    strands: [
      STRANDS.NUMBER,
      STRANDS.OPERATIONS,
      STRANDS.FRACTIONS,
      STRANDS.GEOMETRY,
      STRANDS.MEASUREMENT,
      STRANDS.DATA,
      STRANDS.ALGEBRA,
      STRANDS.RATIO,
      STRANDS.LOGIC,
      STRANDS.SPATIAL
    ]
  }
};

// Terms
export const TERMS = {
  AUTUMN: 'Autumn',
  SPRING: 'Spring',
  SUMMER: 'Summer'
};

// Episode structure - this will be populated with actual episodes
export const CURRICULUM = {
  // Year 1 - Foundation Year
  1: {
    [TERMS.AUTUMN]: [
      {
        id: 'y1-autumn-ep1',
        title: 'The Missing Crown Jewels',
        strand: STRANDS.NUMBER,
        skillTag: 'count-to-20',
        learningObjective: 'Count reliably up to 20 objects',
        description: 'Help Professor Hoot count the missing crown jewels to restore the King\'s crown'
      },
      {
        id: 'y1-autumn-ep2',
        title: 'The Dragon\'s Egg Hunt',
        strand: STRANDS.NUMBER,
        skillTag: 'count-to-50',
        learningObjective: 'Count reliably up to 50 objects',
        description: 'Join Scorch the dragon to find all her hidden eggs'
      },
      {
        id: 'y1-autumn-ep3',
        title: 'The Grand Feast',
        strand: STRANDS.NUMBER,
        skillTag: 'count-to-100',
        learningObjective: 'Count reliably up to 100 objects',
        description: 'Prepare for the royal feast by counting all the ingredients'
      },
      {
        id: 'y1-autumn-ep4',
        title: 'The Wizard\'s Spellbook',
        strand: STRANDS.NUMBER,
        skillTag: 'number-bonds-10',
        learningObjective: 'Know number bonds to 10',
        description: 'Help the wizard remember his number spells'
      },
      {
        id: 'y1-autumn-ep5',
        title: 'The Broken Bridge',
        strand: STRANDS.OPERATIONS,
        skillTag: 'addition-within-10',
        learningObjective: 'Add one-digit numbers within 10',
        description: 'Fix the bridge by solving addition problems'
      },
      {
        id: 'y1-autumn-ep6',
        title: 'The Stolen Apples',
        strand: STRANDS.OPERATIONS,
        skillTag: 'subtraction-within-10',
        learningObjective: 'Subtract one-digit numbers within 10',
        description: 'Find out how many apples the thief stole'
      },
      {
        id: 'y1-autumn-ep7',
        title: 'The Shape Garden',
        strand: STRANDS.GEOMETRY,
        skillTag: '2d-shapes',
        learningObjective: 'Recognize 2D shapes (circle, square, triangle, rectangle)',
        description: 'Plant a magical garden with different shaped seeds'
      }
    ],
    [TERMS.SPRING]: [
      {
        id: 'y1-spring-ep8',
        title: 'The Giant\'s Footsteps',
        strand: STRANDS.NUMBER,
        skillTag: 'compare-numbers',
        learningObjective: 'Compare and order numbers up to 100',
        description: 'Follow the giant\'s footsteps by comparing numbers'
      },
      {
        id: 'y1-spring-ep9',
        title: 'The Bakery Rescue',
        strand: STRANDS.OPERATIONS,
        skillTag: 'addition-within-20',
        learningObjective: 'Add one-digit and two-digit numbers up to 20',
        description: 'Help the baker rescue his cookies with addition'
      },
      {
        id: 'y1-spring-ep10',
        title: 'The Cookie Thief',
        strand: STRANDS.OPERATIONS,
        skillTag: 'subtraction-within-20',
        learningObjective: 'Subtract one-digit numbers from two-digit numbers up to 20',
        description: 'Catch the cookie thief by solving subtraction problems'
      },
      {
        id: 'y1-spring-ep11',
        title: 'The Clock Tower',
        strand: STRANDS.MEASUREMENT,
        skillTag: 'tell-time',
        learningObjective: 'Tell the time to the hour and half past',
        description: 'Fix the broken clock tower by learning to tell time'
      },
      {
        id: 'y1-spring-ep12',
        title: 'The Fairy\'s Ribbon',
        strand: STRANDS.MEASUREMENT,
        skillTag: 'measure-length',
        learningObjective: 'Measure and begin to record lengths',
        description: 'Help the fairy measure ribbons for her magic spells'
      },
      {
        id: 'y1-spring-ep13',
        title: 'The Potion Recipe',
        strand: STRANDS.NUMBER,
        skillTag: 'skip-counting',
        learningObjective: 'Count in multiples of 2s, 5s and 10s',
        description: 'Brew magical potions by skip counting ingredients'
      },
      {
        id: 'y1-spring-ep14',
        title: 'The Treasure Map',
        strand: STRANDS.GEOMETRY,
        skillTag: 'position-direction',
        learningObjective: 'Describe position, direction and movement',
        description: 'Follow a treasure map using positional language'
      }
    ],
    [TERMS.SUMMER]: [
      {
        id: 'y1-summer-ep15',
        title: 'The Royal Parade',
        strand: STRANDS.NUMBER,
        skillTag: 'ordinal-numbers',
        learningObjective: 'Use ordinal numbers to 20',
        description: 'Organize the royal parade using ordinal numbers'
      },
      {
        id: 'y1-summer-ep16',
        title: 'The Magic Cauldron',
        strand: STRANDS.NUMBER,
        skillTag: 'number-bonds-20',
        learningObjective: 'Know number bonds to 20',
        description: 'Master the magic cauldron by learning number bonds'
      },
      {
        id: 'y1-summer-ep17',
        title: 'The Pet Shop',
        strand: STRANDS.OPERATIONS,
        skillTag: 'money',
        learningObjective: 'Recognize and use money',
        description: 'Run a pet shop and practice using money'
      },
      {
        id: 'y1-summer-ep18',
        title: 'The Rainbow Bridge',
        strand: STRANDS.ALGEBRA,
        skillTag: 'patterns',
        learningObjective: 'Create and continue simple patterns',
        description: 'Rebuild the rainbow bridge with colorful patterns'
      },
      {
        id: 'y1-summer-ep19',
        title: 'The Star Festival',
        strand: STRANDS.OPERATIONS,
        skillTag: 'addition-word-problems',
        learningObjective: 'Solve one-step addition word problems',
        description: 'Count stars at the festival with addition word problems'
      },
      {
        id: 'y1-summer-ep20',
        title: 'The Dragon\'s Challenge',
        strand: STRANDS.OPERATIONS,
        skillTag: 'subtraction-word-problems',
        learningObjective: 'Solve one-step subtraction word problems',
        description: 'Complete the dragon\'s challenges with subtraction'
      },
      {
        id: 'y1-summer-ep21',
        title: 'The Kingdom Fair',
        strand: STRANDS.DATA,
        skillTag: 'mixed-review',
        learningObjective: 'Review and consolidate Year 1 learning',
        description: 'Enjoy the kingdom fair with mixed math challenges'
      }
    ]
  },
  // Years 2-4 will be stubbed for now
  2: {
    [TERMS.AUTUMN]: [],
    [TERMS.SPRING]: [],
    [TERMS.SUMMER]: []
  },
  3: {
    [TERMS.AUTUMN]: [],
    [TERMS.SPRING]: [],
    [TERMS.SUMMER]: []
  },
  4: {
    [TERMS.AUTUMN]: [],
    [TERMS.SPRING]: [],
    [TERMS.SUMMER]: []
  }
};

// Helper function to get all episodes for a year
export function getEpisodesForYear(year) {
  const episodes = [];
  const yearData = CURRICULUM[year];
  
  if (yearData) {
    for (const term in yearData) {
      episodes.push(...yearData[term]);
    }
  }
  
  return episodes;
}

// Helper function to get episode by ID
export function getEpisodeById(episodeId) {
  for (const year in CURRICULUM) {
    for (const term in CURRICULUM[year]) {
      const episode = CURRICULUM[year][term].find(ep => ep.id === episodeId);
      if (episode) return episode;
    }
  }
  return null;
}

// Helper function to get unlock requirements
// For now, episodes unlock sequentially, but this could be enhanced
export function getUnlockRequirements(episodeId) {
  // In a more complex system, this would define prerequisites
  // For now, we'll just return the episode itself as the requirement
  return {
    previousEpisode: null, // Would reference the previous episode ID
    masteryThreshold: 0.8 // 80% score required to unlock next episode
  };
}