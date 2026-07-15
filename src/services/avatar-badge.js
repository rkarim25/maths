// A small floating photo of Liyana shown on every screen (top-right), so her
// face follows her through the app. Lives on <body> (outside #app, which each
// view replaces) and is updated by the router on every route change. Hidden on
// the lessons home (its header already has the big avatar) and on print views.
import { getCurrentProfileId, getProfile } from './profile-manager.js';

const HIDE_PREFIXES = ['/lessons', '/worksheet', '/book', '/profiles', '/profile-create'];

export async function updateAvatarBadge(route) {
  const el = ensureElement();
  const hide = HIDE_PREFIXES.some((p) => route === p || route.startsWith(p + '/') || route.startsWith(p + '?'));
  if (hide) { el.hidden = true; return; }
  try {
    const pid = getCurrentProfileId();
    const profile = pid ? await getProfile(pid) : null;
    if (profile && profile.avatarImage) {
      const img = el.querySelector('img');
      if (img.src !== profile.avatarImage) img.src = profile.avatarImage;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  } catch (e) {
    el.hidden = true;
  }
}

function ensureElement() {
  let el = document.getElementById('avatar-badge');
  if (el) return el;
  el = document.createElement('button');
  el.id = 'avatar-badge';
  el.type = 'button';
  el.title = 'Back to my lessons';
  el.setAttribute('aria-label', 'Back to my lessons');
  el.hidden = true;
  el.innerHTML = '<img alt="">';
  el.addEventListener('click', () => { window.location.hash = '/lessons'; });
  document.body.appendChild(el);
  return el;
}
