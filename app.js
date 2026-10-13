// ===================== State =====================
let tasks = [];
let currentFilter = "all"; // "all" | "active" | "done"

// ===================== Task logic =====================
function createTask(text, priority, dueDate) {
  return {
    id: Date.now(),
    text: text,
    priority: priority,
    dueDate: dueDate,
    done: false
  };
}

function addTask(text, priority, dueDate) {
  tasks.push(createTask(text, priority, dueDate));
  persist();
  renderList();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.done = !task.done;
  persist();
  renderList();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  persist();
  renderList();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  persist();
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

  const parts = [checkbox, label, priority];
  if (task.dueDate) {
    const dueDate = document.createElement("time");
    dueDate.className = "task-date";
    dueDate.dateTime = task.dueDate;
    dueDate.textContent = task.dueDate;
    const today = new Date().toLocaleDateString("en-CA");
    if (!task.done && task.dueDate < today) {
      dueDate.classList.add("overdue");
    }
    parts.push(dueDate);
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "✕";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  li.append(...parts, deleteButton);
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
  const dateInput = document.getElementById("new-task-date");
  const text = input.value.trim();
  if (text === "") return;
  const priority = document.getElementById("task-priority").value;
  addTask(text, priority, dateInput.value);
  input.value = "";
  dateInput.value = "";
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
