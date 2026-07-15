# Cross-device sync — design, operations, troubleshooting

*The* reference for how Liyana's progress, scores and photo stay the same on
every device. Written so any person (or chat session) can pick this up cold.

## The one number to remember: **2353**

| What | Where | Code |
|------|-------|------|
| Parent PIN (opens the Grown-ups reports) | 🔒 button, top right | **2353** (default, per-device custom override possible) |
| Family sync code (joins a device to sync) | ☁️ button, top right → Sync page | **2353** (prefilled) |

They are deliberately the same number. Setting up a new device is:
**open the site → ☁️ Sync → Turn on sync** (2353 is already filled in). Done.

## How it works

- **Backend**: Firebase Firestore, project `kid-s-maths` (Google account:
  rkarim88@gmail.com). Config is committed in [src/config/firebase.js](../src/config/firebase.js)
  — web config is not secret; anonymous auth + Firestore rules gate access.
- **Data model**: ONE document per family — `families/{code}`, i.e.
  `families/2353` — containing `{ snapshot, updatedAt }`. The snapshot is the
  full export from `buildExport()` ([src/services/analysis.js](../src/services/analysis.js)):
  profile (name + `avatarImage` as a small base64 JPEG ≤256px), progress rows,
  answer log, usage events, weak areas, summary.
- **Client logic**: [src/services/sync.js](../src/services/sync.js).
  - On app start (`startSync`, called from [src/app.js](../src/app.js)): if a
    family code is stored in `localStorage.familyCode` → **pull** (merge the
    cloud snapshot into local IndexedDB), **push** (upload the merged local
    state), subscribe with `onSnapshot` for live remote changes, and push every
    8 s when something changed.
  - **Merging is additive** (`importData` in
    [src/services/tracking.js](../src/services/tracking.js) upserts records and
    remaps `profileId` to the local profile), so two devices' answers unite —
    nothing is overwritten destructively.
  - **Push skip-signature**: a push is skipped when nothing changed. The
    signature covers answer count, progress count, `lastActive` **and the
    photo length** (so a photo-only change still syncs), and is only updated
    after a *successful* write (so failed pushes retry).
- **Sync is opt-in per device** (one tap on the Sync page). It does NOT
  auto-join on first visit: the site is public, and auto-joining would let any
  stranger's browsing session merge into (and read) Liyana's data.

## Legacy-code migration (July 2026)

Older builds suggested a **random** `fam-…` code per device. That split the
family: the iPad synced alone into `families/fam-9s41dcozbw` while the photo
sat in `families/2353`. Two-part fix:

1. `startSync` now auto-migrates: a device whose stored code starts with
   `fam-` pulls its old document once (nothing lost), switches its stored code
   to `2353`, then pulls + pushes normally. No taps needed on that device.
2. A one-off server-side merge (15 Jul 2026) copied the iPad snapshot + photo
   into `families/2353`. The old `fam-9s41dcozbw` document was left in place
   (harmless; the migration re-reads it before hopping).

## Stale builds / "new features don't appear on the iPad"

iPad Safari (especially a page saved to the home screen) can cache an old
build for a long time. Fixed by a self-update check
([src/services/update-check.js](../src/services/update-check.js)): every build
embeds a `__BUILD_ID__` (see [vite.config.js](../vite.config.js)) and ships
`version.json` with the same id; the app compares them on load, on tab
re-focus, and every 15 min, and reloads itself once when a new build is live —
only from "safe" screens (never mid-exercise), never in a loop.

**A device already stuck on a pre-July-2026 build must be reloaded manually
once** (pull down to refresh in Safari, or close and reopen the tab). After
that it keeps itself current.

## Troubleshooting

- **Is this device syncing?** Home page, top right: ☁️ = off, ☁️✓ = on. Or
  open the Sync page — it shows ON/OFF and the code.
- **Photo/progress missing on a device** → check both devices show ☁️✓ and the
  SAME code (2353). If a device shows a `fam-…` code, it's on an old build —
  reload the page once.
- **Force it**: Sync page → "Sync now" (does pull + push).
- **Inspect the cloud directly** (any machine, no login — anonymous auth):

  ```bash
  # get a token
  TOKEN=$(curl -s -X POST 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=<apiKey from src/config/firebase.js>' \
    -H 'Content-Type: application/json' -d '{"returnSecureToken":true}' | python -c "import sys,json;print(json.load(sys.stdin)['idToken'])")
  # list family docs (names + updatedAt only)
  curl -s 'https://firestore.googleapis.com/v1/projects/kid-s-maths/databases/(default)/documents/families?mask.fieldPaths=updatedAt' \
    -H "Authorization: Bearer $TOKEN"
  # summary of the family doc
  curl -s 'https://firestore.googleapis.com/v1/projects/kid-s-maths/databases/(default)/documents/families/2353?mask.fieldPaths=snapshot.summary' \
    -H "Authorization: Bearer $TOKEN"
  ```

  Expect exactly ONE active doc: `families/2353`. Extra `fam-…` docs mean some
  device is on an old build/code.
- **Firestore console**: https://console.firebase.google.com/project/kid-s-maths/firestore

## Known limits (fine at this scale, revisit if they bite)

- The whole history is one Firestore document (limit 1 MiB). At ~235 answers
  it's far below that, but the answer log + usage events grow forever. If the
  doc ever nears the limit, prune `usage_events` from the snapshot or split
  the doc.
- Last-writer-wins at the *document* level; correctness relies on every device
  pulling (and merging) before pushing, which `startSync` guarantees.
- The family code is guessable by design (usability for one family). Anyone
  with the code + URL could read/write the sync doc. Acceptable trade-off
  here; use a long random code if that ever changes.
