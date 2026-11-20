# Agent instructions: 05 Shopping List

See the root `../AGENTS.md` for the shared rules.

## Context

A simple shopping list app. The user adds items, ticks them off, and the app groups the items by category. Items are saved in the browser's `localStorage`. The app is hosted on GitHub Pages and also runs by opening `index.html` directly in a browser.

## Conventions

- Use only HTML, CSS and JavaScript. No frameworks, no build step, no server or database.
- Do not add any extra library or dependency without asking the user first.
- Keep everything in exactly three files: `index.html`, `style.css`, `script.js`. Do not add more files to the app. Keep all files for this project inside this folder.
- The app must work when `index.html` is opened from disk (`file://`). Do not use features that need a server, such as ES modules or `fetch` of local files.
- Use relative paths only, so the site works from a GitHub Pages subfolder.
- Insert user text with `textContent`, never `innerHTML`.
- Update `README.md` when something important is added or changed.
- Never hard-code API keys; there are none in this project.
