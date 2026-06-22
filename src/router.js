// Hash-based router. Clean route table + param parsing.
import { renderProfileSwitcher } from './views/profile-switcher.js';
import { renderProfileCreate } from './views/profile-create.js';
import { renderLessonsTable } from './views/lessons-table.js';
import { renderLessonPlayer } from './views/lesson-player.js';
import { renderPractice } from './views/practice-game.js';
import { renderWorksheet } from './views/worksheet.js';
import { renderGrownups } from './views/grownups.js';
import { renderPlacement } from './views/placement-test.js';
import { renderBook } from './views/book.js';
import { renderAssessment } from './views/assessment.js';
import { renderTimesTables } from './views/times-tables.js';
import { renderFun } from './views/fun.js';
import { renderMockExams } from './views/mock-exam.js';
import { getCurrentProfileId } from './services/profile-manager.js';

// Static routes: hash -> render()
const STATIC_ROUTES = {
  '/profiles': renderProfileSwitcher,
  '/profile-create': renderProfileCreate,
  '/lessons': renderLessonsTable,
  '/grownups': renderGrownups,
  '/placement': renderPlacement,
  '/book': renderBook,
  '/times-tables': renderTimesTables,
  '/mocks': renderMockExams
};

// Dynamic routes: '/prefix/:id' -> render(id)
const DYNAMIC_ROUTES = [
  { prefix: '/lesson/', render: renderLessonPlayer },
  { prefix: '/practice/', render: renderPractice },
  { prefix: '/worksheet/', render: renderWorksheet },
  { prefix: '/book/', render: renderBook },
  { prefix: '/assessment/', render: renderAssessment },
  { prefix: '/fun/', render: renderFun }
];

// Routes reachable without a selected profile
const PUBLIC_ROUTES = new Set(['/profiles', '/profile-create']);

let currentRoute = '';

export function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

function handleRouteChange() {
  const hash = window.location.hash.replace('#', '') || '/profiles';
  currentRoute = hash;

  // Guard: everything except profile screens needs a current profile.
  const base = hash.split('/').slice(0, 2).join('/');
  const needsProfile = !PUBLIC_ROUTES.has(hash) && !PUBLIC_ROUTES.has(base);
  if (needsProfile && !getCurrentProfileId()) {
    navigateTo('/profiles');
    return;
  }

  for (const route of DYNAMIC_ROUTES) {
    if (hash.startsWith(route.prefix)) {
      const id = decodeURIComponent(hash.slice(route.prefix.length));
      route.render(id);
      return;
    }
  }

  const handler = STATIC_ROUTES[hash];
  if (handler) handler();
  else renderProfileSwitcher();
}

export function navigateTo(path) {
  if (window.location.hash === `#${path}`) {
    // same hash won't fire hashchange — render directly
    handleRouteChange();
  } else {
    window.location.hash = path;
  }
}

export function getCurrentRoute() {
  return currentRoute;
}
