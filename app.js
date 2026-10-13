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
  label.addEventListener("dblclick", () => {
    const editor = document.createElement("input");
    editor.type = "text";
    editor.value = task.text;
    editor.className = "task-edit";
    label.replaceWith(editor);
    editor.focus();
    editor.select();

    let editing = true;
    const finishEditing = (cancel = false) => {
      if (!editing) return;
      editing = false;

      const text = editor.value.trim();
      if (!cancel && text !== "") {
        task.text = text;
        saveTasks();
      }
      renderList();
    };

    editor.addEventListener("blur", () => finishEditing());
    editor.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        finishEditing();
      } else if (event.key === "Escape") {
        finishEditing(true);
      }
    });
  });

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
  const text = input.value.trim();
  if (text === "") return;
  addTask(text);
  input.value = "";
});

loadTasks();
renderList();
