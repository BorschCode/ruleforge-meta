# RuleForge Meta — Demo

Visual drag-and-drop rule builder for Meta ad account automation.

## Live Demo

**GitHub Pages:** https://borschcode.github.io/ruleforge-meta/

## Tech Stack

- Vue 3 (Composition API)
- Tailwind CSS v4
- Vite

## Local Development

```bash
npm install
npm run dev
```

Open **http://localhost:5173/demo.html** — note the explicit `/demo.html` path, not just `/`.

> **Why `/demo.html`?** In dev mode Vite serves the raw source. The entry point is `demo.html` at the project root, so you must navigate to it explicitly. On GitHub Pages the built `index.html` is served automatically.

## Deployment

Pushing to `main` triggers GitHub Actions → builds → deploys to `gh-pages` branch automatically.

```
main branch push
  → npm run build:demo   (Vite builds to demo/, renames demo.html → index.html)
  → peaceiris/actions-gh-pages deploys demo/ to gh-pages branch
  → GitHub Pages serves at /ruleforge-meta/
```

### Manual deploy (optional)

```bash
npm install --save-dev gh-pages   # one-time
npm run deploy
```

### GitHub Pages repo settings

Go to **Settings → Pages** and set:
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` / `/ (root)`

No extra secrets needed — the workflow uses the automatic `GITHUB_TOKEN`.
