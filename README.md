# Deploying the Training Tracker Dashboard to Vercel 

This folder contains a single self-contained `index.html` — no build step, no
dependencies, no server required. Everything (data, styling, and logic) is
embedded in the file, with Chart.js loaded from a CDN.

## Option A — GitHub, then import into Vercel (recommended)

No git command line needed — GitHub's web upload handles it.

1. Go to https://github.com/new, name the repo (e.g. `training-tracker-dashboard`),
   leave it public or private, and click "Create repository."
2. On the new repo's page, click "uploading an existing file," drag in
   `index.html` and `README.md` from this folder, then click "Commit changes."
3. Go to https://vercel.com/new, click "Import Git Repository," authorize
   Vercel's GitHub app the first time it asks, then select this repo.
4. Leave the settings as-is (Vercel auto-detects a static site) and click
   Deploy — you'll have a live URL in under a minute.
5. Any time you want to update the live site, upload a refreshed `index.html`
   to the same GitHub repo (Add file → Upload files) — Vercel redeploys
   automatically.

## Option B — drag and drop straight into Vercel (skips GitHub)

1. Go to https://vercel.com/new
2. Choose "Deploy without Git" / the upload option
3. Drag this whole `vercel-deploy` folder (or just `index.html`) into the drop zone
4. Click Deploy — Vercel will give you a live URL in about 10 seconds

## Option C — Vercel CLI

```bash
cd vercel-deploy
npx vercel login      # opens a browser to authenticate, one-time
npx vercel --prod      # deploys this folder and prints a live URL
```

## Notes

- Edits made in the dashboard (dates, added trainings/certifications) are saved
  in each visitor's own browser via localStorage — they are per-browser, not
  shared across everyone who opens the deployed URL. If you want edits to be
  shared/persisted centrally, that needs a small backend (e.g. a Vercel KV
  store or a database) — let me know if you'd like that built out.
- To update the live site later, re-run the same deploy step with a refreshed
  `index.html`.
