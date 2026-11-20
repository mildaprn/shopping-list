# 05 · Shopping List

> Part of the **Building with AI** course at Turing College. [← Back to all projects](../README.md)

| | |
|---|---|
| **Type** | App |
| **Status** | In progress |
| **Tools** | Claude Code, HTML, CSS, JavaScript |

## Problem / goal

A simple shopping list that I can open on any device, with no account and no install. Success: I can add items, tick them off in the shop, and the list is still there next time I open the page.

## What I built

A small web app made only with HTML, CSS and JavaScript. No frameworks, no server, no database and no build step. It is designed to be hosted on GitHub Pages.

Features:

- Add an item
- Tick an item as bought
- Delete an item
- Clear all ticked items
- A counter showing how many items are checked

## How it works

```
Type item → Add → saved in localStorage → list re-drawn on screen
```

- `index.html`: the page structure
- `style.css`: the look and layout
- `script.js`: the logic. The list is kept in an array and saved in the browser's `localStorage` under the key `shopping-list-items`. Item text is inserted with `textContent`, so typed text is never run as HTML.

Data stays in the browser on one device. It is not shared between devices or browsers, and clearing site data deletes the list.

## How to run

No installs and no API keys are needed.

- Locally: open `index.html` in a browser.
- On GitHub Pages: push the project to GitHub and enable Pages in the repository settings, with the folder that contains `index.html` as the source.

## How AI was used

- Claude Code created the three files from a short brief: HTML, CSS and JavaScript only, data saved in the browser, hosted on GitHub Pages.
- Still to do: test it by hand in a browser (add, tick, delete, clear, reload the page).

## Results

Not tested in a browser yet.

## Reflection

To be filled in after testing. Possible next steps: edit an item, group by category, quantities.
