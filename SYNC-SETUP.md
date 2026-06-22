# Cross-device cloud sync — one-time setup (≈5 minutes)

By default, the site saves data **on each device only**. To make Liyana's progress sync
automatically across devices (your phone, your wife's phone, the iPad…), connect it to a free
**Firebase** project. You do this once; then on each device you enter the same **family code**.

The Firebase web config is **not secret** — it's safe to commit. Security is handled by the
Firestore rules below (only signed-in app users can read/write, and only the `families` area).

## Step 1 — Create a Firebase project
1. Go to <https://console.firebase.google.com> and sign in with your Google account.
2. Click **Add project**, give it a name (e.g. `liyana-maths`), accept defaults, **Create**.

## Step 2 — Add a Web app and copy the config
1. On the project home, click the **`</>`** (Web) icon to "Add an app".
2. Give it a nickname, click **Register app**.
3. You'll see a `const firebaseConfig = { … }` block. **Copy those values.**

## Step 3 — Turn on Firestore
1. Left menu → **Build → Firestore Database → Create database**.
2. Choose **Start in production mode**, pick a location near you, **Enable**.
3. Open the **Rules** tab, replace everything with this, and **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /families/{familyId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 4 — Turn on Anonymous sign-in
1. Left menu → **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Anonymous** → **Save**.

## Step 5 — Paste the config into the app
1. Edit [`src/config/firebase.js`](src/config/firebase.js) and fill in the values you copied
   in Step 2 (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
2. Commit and push:
   ```bash
   git add src/config/firebase.js
   git commit -m "Add Firebase config for cloud sync"
   git push
   ```
   GitHub Actions redeploys automatically.

## Step 6 — Connect each device
1. Open the site → **🔒 Grown-ups** (PIN **2353**) → **Sync across devices**.
2. Tap **Generate** to make a family code (or type your own), then **Turn on sync**.
3. On the **other** device, open the same screen and enter the **exact same family code**, then
   **Turn on sync**.

That's it. From then on, every answer, score and report syncs between the connected devices —
automatically on a timer, when you open the Grown-ups report, and live while the app is open.
You can **Turn off here** on any device, or **Sync now** to force an immediate sync.

### Notes
- Keep the family code private-ish (it's how devices find the shared data). It's only maths
  progress, so the risk is low, but don't post it publicly.
- It works offline too: changes are saved locally and pushed next time you're online.
- The free Firebase "Spark" plan is plenty for one family.
