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
- Categories: each item has one category and the list is shown as a board with one column per category (columns wrap onto new rows on narrow screens). A new item gets a category automatically, and you move it by dragging it into another column. The "+ New category" button at the end of the board makes your own column. While you drag, empty starter columns appear so you can drop into them

Look and feel: a cream card with a thick white border on an off-white grid background, a large bold title, pill-shaped buttons and white rounded list rows. The style follows a reference image I supplied. There is no illustration, because the app is limited to three files.

Automatic categories: a small built-in word list guesses the category (for example "milk" goes to Dairy, "apple" goes to Fruit & Veg). Anything it does not know goes to "Other". When you change an item's category, the app remembers that choice for the same item name and uses it next time.

## How it works

```
Type item → Add → saved in localStorage → list re-drawn on screen
```

- `index.html`: the page structure
- `style.css`: the look and layout. The colours are kept as CSS variables at the top of the file.
- `script.js`: the logic. The list is kept in an array and saved in the browser's `localStorage` under the key `shopping-list-items`. Item text is inserted with `textContent`, so typed text is never run as HTML.

Categories use two more `localStorage` keys: `shopping-list-categories` (categories you created) and `shopping-list-learned` (your corrections). Items saved before categories existed are given a category when the page first loads.

Data stays in the browser on one device. It is not shared between devices or browsers, and clearing site data deletes the list.

## How to run

No installs and no API keys are needed.

- Locally: open `index.html` in a browser.
- On GitHub Pages: push the project to GitHub and enable Pages in the repository settings, with the folder that contains `index.html` as the source. The live page is at https://mildaprn.github.io/shopping-list/. Browsers cache files for about 10 minutes, so after an update do a hard refresh to see the new version.

## How AI was used

- Claude Code created the three files from a short brief: HTML, CSS and JavaScript only, data saved in the browser, hosted on GitHub Pages.
- Claude Code restyled the page to match a reference image (CSS only; `index.html` and `script.js` were not changed). The change went through a branch and a pull request.
- Claude Code added categories on a `categories` branch. It could only check the guessing logic and the syntax of `script.js`, because no browser was available to it.
- Still to do: a full hand test of add, tick, delete, clear and reload.

## Results

After the restyle I opened the page in a browser and it looked fine. A full test of every feature is not recorded yet.

## Reflection

To be filled in after testing. Possible next steps: edit an item, rename or delete categories, quantities.
