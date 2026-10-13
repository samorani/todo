// ===================== Storage =====================
const STORAGE_KEY = "class-tasks";

function persist() {
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
