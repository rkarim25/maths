// Curriculum registry with episodes and strands
export const STRANDS = {
  NUMBER: 'Number Sense',
  OPERATIONS: 'Operations',
  FRACTIONS: 'Fractions',
  GEOMETRY: 'Geometry',
  MEASUREMENT: 'Measurement',
  DATA: 'Data & Statistics',
  ALGEBRA: 'Algebra',
  RATIO: 'Ratio & Proportion',
  LOGIC: 'Logic & Reasoning',
  SPATIAL: 'Spatial Awareness'
};

export const YEARS = {
  1: {
    name: 'Adventures in Numberland',
    strands: [STRANDS.NUMBER, STRANDS.OPERATIONS, STRANDS.GEOMETRY]
  },
  2: {
    name: 'Journey Through Mathland',
    strands: [STRANDS.NUMBER, STRANDS.OPERATIONS, STRANDS.FRACTIONS, STRANDS.MEASUREMENT]
  },
  3: {
    name: 'Quest for Mathoria',
    strands: [STRANDS.NUMBER, STRANDS.OPERATIONS, STRANDS.FRACTIONS, STRANDS.GEOMETRY, STRANDS.MEASUREMENT]
  },
  4: {
    name: 'Expedition to Calculand',
    strands: [STRANDS.NUMBER, STRANDS.OPERATIONS, STRANDS.FRACTIONS, STRANDS.GEOMETRY, STRANDS.MEASUREMENT, STRANDS.DATA, STRANDS.ALGEBRA]
  }
};

// Curriculum structure with episodes
export const CURRICULUM = {
  1: {
    term1: [
      {
        id: 'counting-1-10',
        title: 'Counting 1 to 10',
        description: 'Learn to count from 1 to 10 with magical objects',
        strand: STRANDS.NUMBER,
        skillTag: 'Counting',
        youtubeVideoId: 'counting-1-10-video'
      },
      {
        id: 'number-bonds-10',
        title: 'Number Bonds to 10',
        description: 'Discover how numbers can be split into parts',
        strand: STRANDS.NUMBER,
        skillTag: 'Number Bonds',
        youtubeVideoId: 'number-bonds-10-video'
      },
      {
        id: 'addition-basics',
        title: 'Addition Basics',
        description: 'Learn how to add small numbers together',
        strand: STRANDS.OPERATIONS,
        skillTag: 'Addition',
        youtubeVideoId: 'addition-basics-video'
      }
    ],
    term2: [
      {
        id: 'subtraction-basics',
        title: 'Subtraction Basics',
        description: 'Learn how to take away objects',
        strand: STRANDS.OPERATIONS,
        skillTag: 'Subtraction',
        youtubeVideoId: 'subtraction-basics-video'
      },
      {
        id: 'shapes-intro',
        title: 'Introduction to Shapes',
        description: 'Discover circles, squares, triangles, and rectangles',
        strand: STRANDS.GEOMETRY,
        skillTag: 'Shapes',
        youtubeVideoId: 'shapes-intro-video'
      }
    ]
  },
  2: {
    term1: [
      {
        id: 'counting-1-100',
        title: 'Counting 1 to 100',
        description: 'Count higher numbers with the hundred chart',
        strand: STRANDS.NUMBER,
        skillTag: 'Counting',
        youtubeVideoId: 'counting-1-100-video'
      },
      {
        id: 'place-value',
        title: 'Place Value',
        description: 'Understand tens and ones',
        strand: STRANDS.NUMBER,
        skillTag: 'Place Value',
        youtubeVideoId: 'place-value-video'
      }
    ]
  }
};

/**
 * Get episode by ID
 * @param {string} episodeId - The episode ID
 * @returns {object|null} The episode object or null if not found
 */
export function getEpisodeById(episodeId) {
  for (const year in CURRICULUM) {
    for (const term in CURRICULUM[year]) {
      const episode = CURRICULUM[year][term].find(ep => ep.id === episodeId);
      if (episode) {
        return episode;
      }
    }
  }
  return null;
}

/**
 * Get all episodes for a strand
 * @param {string} strand - The strand name
 * @returns {Array} Array of episodes for the strand
 */
export function getEpisodesByStrand(strand) {
  const episodes = [];
  for (const year in CURRICULUM) {
    for (const term in CURRICULUM[year]) {
      const strandEpisodes = CURRICULUM[year][term].filter(ep => ep.strand === strand);
      episodes.push(...strandEpisodes);
    }
  }
  return episodes;
}