// ===================== State =====================
let tasks = [];
let currentFilter = "all"; // "all" | "active" | "done"

// ===================== Storage =====================
const STORAGE_KEY = "class-tasks";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  tasks = raw ? JSON.parse(raw) : [];
}

const FILTER_KEY = "class-tasks-filter";

function saveFilter() {
  localStorage.setItem(FILTER_KEY, currentFilter);
}

function loadFilter() {
  const saved = localStorage.getItem(FILTER_KEY);
  if (saved === "all" || saved === "active" || saved === "done") {
    currentFilter = saved;
  }
}

// ===================== Task logic =====================
function createTask(text, priority) {
  return {
    id: Date.now(),
    text: text,
    priority: priority,
    done: false
  };
}

function addTask(text, priority) {
  tasks.push(createTask(text, priority));
  saveTasks();
  renderList();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.done = !task.done;
  saveTasks();
  renderList();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderList();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderList();
}

const clearButton = document.createElement("button");
clearButton.type = "button";
clearButton.textContent = "Clear completed";
clearButton.addEventListener("click", clearCompleted);

document.getElementById("add-form").appendChild(clearButton);

// ===================== Rendering =====================
function renderTask(task) {
  const li = document.createElement("li");
  li.className = task.done ? "task done" : "task";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const label = document.createElement("span");
  label.className = "task-text";
  label.textContent = task.text;

  const priority = document.createElement("span");
  priority.className = "priority-label priority-" + (task.priority || "medium");
  priority.textContent = task.priority || "medium";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "✕";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  li.append(checkbox, label, priority, deleteButton);
  return li;
}

function renderList() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const visibleTasks = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  for (const task of visibleTasks) {
    list.appendChild(renderTask(task));
  }

  const remaining = tasks.filter((t) => !t.done).length;
  document.getElementById("counter").textContent = remaining + " task(s) left";
}

// ===================== Startup =====================
document.getElementById("add-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("new-task");
  const text = input.value.trim();
  if (text === "") return;
  const priority = document.getElementById("task-priority").value;
  addTask(text, priority);
  input.value = "";
});

function highlightFilterButton() {
  for (const b of document.querySelectorAll(".filter-btn")) {
    b.classList.toggle("active", b.dataset.filter === currentFilter);
  }
}

for (const button of document.querySelectorAll(".filter-btn")) {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    saveFilter();
    highlightFilterButton();
    renderList();
  });
}

loadTasks();
loadFilter();
highlightFilterButton();
renderList();
