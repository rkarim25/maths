// World map view with interactive lands
import { navigateTo } from '../router.js';
import { STRANDS } from '../config/curriculum-registry.js';

/**
 * Render the world map view
 */
export function renderWorldMap() {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  appElement.innerHTML = `
    <div class="world-map">
      <div class="header">
        <h1>Maths Adventure World</h1>
        <p>Choose a land to explore its mathematical adventures</p>
      </div>
      <div class="map-container">
        <div class="lands-grid">
          <div class="land-card" data-strand="${STRANDS.NUMBER}">
            <div class="land-icon">
              <img src="./assets/number-icon.svg" alt="Number Sense" />
            </div>
            <h3>Numberland</h3>
            <p>${getStrandDescription(STRANDS.NUMBER)}</p>
            <button class="explore-btn" data-strand="${STRANDS.NUMBER}">Explore</button>
          </div>
          
          <div class="land-card" data-strand="${STRANDS.OPERATIONS}">
            <div class="land-icon">
              <img src="./assets/operations-icon.svg" alt="Operations" />
            </div>
            <h3>Operationville</h3>
            <p>${getStrandDescription(STRANDS.OPERATIONS)}</p>
            <button class="explore-btn" data-strand="${STRANDS.OPERATIONS}">Explore</button>
          </div>
          
          <div class="land-card" data-strand="${STRANDS.FRACTIONS}">
            <div class="land-icon">
              <img src="./assets/fractions-icon.svg" alt="Fractions" />
            </div>
            <h3>Fraction Forest</h3>
            <p>${getStrandDescription(STRANDS.FRACTIONS)}</p>
            <button class="explore-btn" data-strand="${STRANDS.FRACTIONS}">Explore</button>
          </div>
          
          <div class="land-card" data-strand="${STRANDS.GEOMETRY}">
            <div class="land-icon">
              <img src="./assets/geometry-icon.svg" alt="Geometry" />
            </div>
            <h3>Geometry Gardens</h3>
            <p>${getStrandDescription(STRANDS.GEOMETRY)}</p>
            <button class="explore-btn" data-strand="${STRANDS.GEOMETRY}">Explore</button>
          </div>
          
          <div class="land-card" data-strand="${STRANDS.MEASUREMENT}">
            <div class="land-icon">
              <img src="./assets/measurement-icon.svg" alt="Measurement" />
            </div>
            <h3>Measurement Mountains</h3>
            <p>${getStrandDescription(STRANDS.MEASUREMENT)}</p>
            <button class="explore-btn" data-strand="${STRANDS.MEASUREMENT}">Explore</button>
          </div>
          
          <div class="land-card" data-strand="${STRANDS.DATA}">
            <div class="land-icon">
              <img src="./assets/data-icon.svg" alt="Data & Statistics" />
            </div>
            <h3>Data Desert</h3>
            <p>${getStrandDescription(STRANDS.DATA)}</p>
            <button class="explore-btn" data-strand="${STRANDS.DATA}">Explore</button>
          </div>
        </div>
        
        <div class="map-legend">
          <h3>Legend</h3>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-color legend-completed"></span>
              <span>Completed</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-in-progress"></span>
              <span>In Progress</span>
            </div>
            <div class="legend-item">
              <span class="legend-color legend-not-started"></span>
              <span>Not Started</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for explore buttons
  const exploreButtons = document.querySelectorAll('.explore-btn');
  exploreButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const strand = button.getAttribute('data-strand');
      navigateTo(`/strand/${encodeURIComponent(strand)}`);
    });
  });
}

/**
 * Get description for a strand
 * @param {string} strand - The strand name
 * @returns {string} The strand description
 */
function getStrandDescription(strand) {
  const descriptions = {
    [STRANDS.NUMBER]: 'Count, compare, and understand numbers',
    [STRANDS.OPERATIONS]: 'Add, subtract, multiply, and divide',
    [STRANDS.FRACTIONS]: 'Understand parts of a whole',
    [STRANDS.GEOMETRY]: 'Explore shapes, angles, and spatial relationships',
    [STRANDS.MEASUREMENT]: 'Measure length, weight, capacity, and time',
    [STRANDS.DATA]: 'Collect, organize, and interpret data',
    [STRANDS.ALGEBRA]: 'Find patterns and solve equations',
    [STRANDS.RATIO]: 'Compare quantities and proportions',
    [STRANDS.LOGIC]: 'Solve puzzles and reasoning problems',
    [STRANDS.SPATIAL]: 'Visualize and manipulate shapes'
  };
  
  return descriptions[strand] || 'Explore this mathematical land';
}