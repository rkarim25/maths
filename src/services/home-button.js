// A clear, always-there way home: a floating 🏠 button on every screen except
// the home page itself and print views. (This replaced an earlier floating
// avatar — a house is intuitive for a 6-year-old; her photo lives in the home
// header and Sunny's card instead.) Lives on <body>, outside #app which each
// view replaces; the router updates it on every route change.

const HIDE_PREFIXES = ['/lessons', '/worksheet', '/book', '/profiles', '/profile-create'];

export function updateHomeButton(route) {
  const el = ensureElement();
  el.hidden = HIDE_PREFIXES.some((p) => route === p || route.startsWith(p + '/') || route.startsWith(p + '?'));
}

function ensureElement() {
  let el = document.getElementById('home-fab');
  if (el) return el;
  el = document.createElement('button');
  el.id = 'home-fab';
  el.type = 'button';
  el.title = 'Back to my lessons';
  el.setAttribute('aria-label', 'Back to my lessons');
  el.hidden = true;
  el.innerHTML = '<span class="home-fab-icon">🏠</span><span class="home-fab-label">Home</span>';
  el.addEventListener('click', () => { window.location.hash = '/lessons'; });
  document.body.appendChild(el);
  return el;
}
