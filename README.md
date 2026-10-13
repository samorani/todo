# Class Tasks

A tiny to-do app in plain HTML, CSS and JavaScript. No framework, no build step:
open `index.html` in your browser and it runs.

## Your job

You've been assigned **one feature**. Build it on your own branch and open a pull request.
Your instructor will merge everyone's work live in class.

## Workflow

```bash
# 1. Download the repo to your computer
git clone <repo-url>
cd class-tasks

# 2. Create your own branch and move onto it
git switch -c feature/<your-name>

# 3. Implement your feature, then test it in the browser

# 4. Save your work in a commit
git add .
git commit -m "Add <your feature>"

# 5. Upload your branch to GitHub (-u links it to GitHub the first time)
git push -u origin feature/<your-name>
```

6. On GitHub, open a pull request from `feature/<your-name>` into `main`.

## Rules (these matter!)

1. **Turn off format-on-save** (Prettier etc.) before you start. Reformatting the file
   makes your PR conflict with everyone's.
2. **Change only what your feature needs.** No renaming, reordering or cleaning up
   code you didn't need to touch (unless that *is* your feature).
3. **Test in the browser** before you push. Open the console (F12) and check for errors.
4. **Do not merge your own PR.** Do not pull `main` into your branch unless asked.
5. If localStorage gets into a weird state while testing, run
   `localStorage.clear()` in the browser console.

## Code map

| Where | What it does |
|---|---|
| `index.html` `#toolbar` | The add form; new controls go here |
| `createTask(text)` | Builds a task object `{ id, text, done }` |
| `addTask` / `toggleTask` / `deleteTask` | Change the task list, then save and re-render |
| `renderTask(task)` | Builds the `<li>` for one task |
| `renderList()` | Draws all tasks and the "N task(s) left" counter |
| `saveTasks()` / `loadTasks()` | Read/write localStorage |
| `style.css` | All styling |
