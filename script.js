const STORAGE_KEY = "shopping-list-items";
const CATEGORIES_KEY = "shopping-list-categories";
const LEARNED_KEY = "shopping-list-learned";

const OTHER = "Other";

// Starter guesses: category -> words. Anything not matched goes to "Other".
const KEYWORDS = {
  "Fruit & Veg": ["apple", "banana", "orange", "lemon", "lime", "grape", "berry", "strawberry", "tomato", "potato", "onion", "garlic", "carrot", "cucumber", "lettuce", "salad", "spinach", "pepper", "broccoli", "avocado", "mushroom", "fruit", "vegetable"],
  Dairy: ["milk", "cheese", "butter", "yogurt", "yoghurt", "cream", "egg", "kefir"],
  "Meat & Fish": ["chicken", "beef", "pork", "ham", "bacon", "sausage", "turkey", "fish", "salmon", "tuna", "shrimp", "meat"],
  // Household comes before Bakery so "toilet roll" is not caught by "roll".
  Household: ["soap", "shampoo", "detergent", "toothpaste", "tissue", "toilet", "sponge", "foil"],
  Bakery: ["bread", "bun", "roll", "baguette", "croissant", "cake", "bagel", "toast"],
  Pantry: ["rice", "pasta", "flour", "sugar", "salt", "oil", "cereal", "oats", "beans", "lentil", "sauce", "honey", "jam", "coffee", "tea", "spice", "chocolate", "biscuit", "cookie", "crisp", "snack"],
  Drinks: ["water", "juice", "soda", "cola", "beer", "wine"],
};

// Two-word names that a single keyword would put in the wrong place. Checked first.
const PHRASES = {
  "black pepper": "Pantry",
  "peanut butter": "Pantry",
  "ice cream": OTHER,
};

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const summaryEl = document.getElementById("summary");
const clearBtn = document.getElementById("clear-checked");

function load(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    // Arrays and plain objects are both typeof "object", so check for arrays explicitly.
    const ok = data && typeof data === typeof fallback && Array.isArray(data) === Array.isArray(fallback);
    return ok ? data : fallback;
  } catch {
    return fallback;
  }
}

let items = load(STORAGE_KEY, []);
let customCategories = load(CATEGORIES_KEY, []); // categories the user created
let learned = load(LEARNED_KEY, {}); // item name -> category chosen by the user

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(customCategories));
    localStorage.setItem(LEARNED_KEY, JSON.stringify(learned));
  } catch {
    // Storage may be full or blocked; the list still works until the page closes.
  }
}

// Every category the user can pick: starter ones, their own, then "Other" last.
function allCategories() {
  const names = [...Object.keys(KEYWORDS), ...customCategories];
  for (const item of items) {
    if (item.category !== OTHER && !names.includes(item.category)) names.push(item.category);
  }
  return [...names, OTHER];
}

function guessCategory(text) {
  const name = text.trim().toLowerCase();
  // hasOwn: a plain object also "has" inherited names like "constructor".
  if (Object.hasOwn(learned, name)) return learned[name];
  for (const [phrase, category] of Object.entries(PHRASES)) {
    if (name.includes(phrase)) return category;
  }
  // Match each word as typed, and without a plural ending ("apples", "tomatoes").
  const words = name.split(/[^a-z]+/).flatMap((w) => [w, w.replace(/s$/, ""), w.replace(/es$/, "")]);
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((k) => words.includes(k))) return category;
  }
  return OTHER;
}

// Items saved before categories existed get one the first time the page loads.
// "Produce" was renamed to "Fruit & Veg"; move anything saved under the old name.
for (const item of items) {
  if (!item.category || item.category === "Produce") item.category = guessCategory(item.text);
}
for (const name of Object.keys(learned)) {
  if (learned[name] === "Produce") learned[name] = "Fruit & Veg";
}

function moveItem(item, category) {
  item.category = category;
  learned[item.text.trim().toLowerCase()] = category;
  save();
  render();
}

function addCategory() {
  const name = (prompt("Name of the new category:") || "").trim();
  if (!name) return;
  if (!allCategories().some((c) => c.toLowerCase() === name.toLowerCase())) {
    customCategories.push(name);
    save();
  }
  render();
}

let draggedId = null;

function renderItem(item) {
  const li = document.createElement("li");
  if (item.done) li.classList.add("done");
  li.draggable = true;
  li.addEventListener("dragstart", (event) => {
    draggedId = item.id;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.text); // Firefox needs some data
    // Wait a tick so showing the empty columns does not cancel the drag.
    setTimeout(() => listEl.classList.add("dragging"), 0);
  });
  li.addEventListener("dragend", () => {
    draggedId = null;
    listEl.classList.remove("dragging");
  });

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "item-" + item.id;
  checkbox.checked = item.done;
  checkbox.addEventListener("change", () => {
    item.done = checkbox.checked;
    save();
    render();
  });

  const label = document.createElement("label");
  label.htmlFor = checkbox.id;
  label.textContent = item.text;

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete";
  del.textContent = "×";
  del.setAttribute("aria-label", "Delete " + item.text);
  del.addEventListener("click", () => {
    items = items.filter((i) => i.id !== item.id);
    save();
    render();
  });

  li.append(checkbox, label, del);
  return li;
}

function render() {
  listEl.replaceChildren();

  for (const category of allCategories()) {
    const group = items.filter((i) => i.category === category);

    const section = document.createElement("section");
    // Empty starter columns only show while dragging; your own columns always show.
    if (!group.length && !customCategories.includes(category)) section.classList.add("empty-column");
    section.addEventListener("dragover", (event) => {
      if (draggedId === null) return;
      event.preventDefault(); // allows a drop here
      section.classList.add("over");
    });
    section.addEventListener("dragleave", (event) => {
      if (!section.contains(event.relatedTarget)) section.classList.remove("over");
    });
    section.addEventListener("drop", (event) => {
      event.preventDefault();
      const item = items.find((i) => i.id === draggedId);
      if (item && item.category !== category) moveItem(item, category);
      else section.classList.remove("over");
    });

    const heading = document.createElement("h2");
    heading.textContent = category;
    const ul = document.createElement("ul");
    section.append(heading, ul);
    listEl.append(section);

    for (const item of group) ul.append(renderItem(item));
  }

  const newColumn = document.createElement("button");
  newColumn.type = "button";
  newColumn.className = "add-column";
  newColumn.textContent = "+ New category";
  newColumn.addEventListener("click", addCategory);
  listEl.append(newColumn);

  const doneCount = items.filter((i) => i.done).length;
  emptyEl.hidden = items.length > 0;
  summaryEl.textContent = items.length
    ? doneCount + " of " + items.length + " checked"
    : "";
  clearBtn.hidden = doneCount === 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  items.push({
    id: Date.now() + Math.random().toString(36).slice(2, 6),
    text,
    done: false,
    category: guessCategory(text),
  });
  input.value = "";
  save();
  render();
  input.focus();
});

clearBtn.addEventListener("click", () => {
  items = items.filter((i) => !i.done);
  save();
  render();
});

render();
