const STORAGE_KEY = "shopping-list-items";

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const summaryEl = document.getElementById("summary");
const clearBtn = document.getElementById("clear-checked");

let items = load();

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be full or blocked; the list still works until the page closes.
  }
}

function render() {
  listEl.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");
    if (item.done) li.classList.add("done");

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
    listEl.append(li);
  }

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
  items.push({ id: Date.now() + Math.random().toString(36).slice(2, 6), text, done: false });
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
