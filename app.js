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
function createTask(text, dueDate) {
  return {
    id: Date.now(),
    text: text,
    dueDate: dueDate,
    done: false
  };
}

function addTask(text, dueDate) {
  tasks.push(createTask(text, dueDate));
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

  if (task.dueDate) {
    const dueDate = document.createElement("time");
    dueDate.className = "task-date";
    dueDate.dateTime = task.dueDate;
    dueDate.textContent = task.dueDate;
    const today = new Date().toLocaleDateString("en-CA");
    if (!task.done && task.dueDate < today) {
      dueDate.classList.add("overdue");
    }
    li.appendChild(dueDate);
  }

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

  for (const task of tasks) {
    list.appendChild(renderTask(task));
  }

  const remaining = tasks.filter((t) => !t.done).length;
  document.getElementById("counter").textContent = remaining + " task(s) left";
}

// ===================== Startup =====================
document.getElementById("add-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("new-task");
  const dateInput = document.getElementById("new-task-date");
  const text = input.value.trim();
  if (text === "") return;
  addTask(text, dateInput.value);
  input.value = "";
  dateInput.value = "";
});

loadTasks();
renderList();
