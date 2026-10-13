// ===================== State =====================
let tasks = [];

// ===================== Storage =====================
const STORAGE_KEY = "class-tasks";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  tasks = raw ? JSON.parse(raw) : [];
}

// ===================== Task logic =====================
function createTask(text) {
  return {
    id: Date.now(),
    text: text,
    done: false
  };
}

function addTask(text) {
  tasks.push(createTask(text));
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

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "✕";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  li.append(checkbox, label, deleteButton);
  return li;
}

function renderList() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const query = document.getElementById("search").value.trim().toLowerCase();
  const visibleTasks = tasks.filter((t) => t.text.toLowerCase().includes(query));

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
  addTask(text);
  input.value = "";
});

document.getElementById("search").addEventListener("input", renderList);

loadTasks();
renderList();
