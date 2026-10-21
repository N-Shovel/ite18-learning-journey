// Study Task Dashboard
// ITE-18 · Topic 2 — Intermediate JavaScript activity

// DOM references, grabbed once at the top.
const statusFilter = document.getElementById("statusFilter");
const completeAllBtn = document.getElementById("completeAll");
const resetBtn = document.getElementById("resetTasks");
const summary = document.getElementById("summary");
const message = document.getElementById("message");
const taskList = document.getElementById("taskList");

// Original data. Kept separate from the live task objects so Reset can
// always rebuild fresh, unmutated objects instead of reusing old ones.
const initialData = [
  { title: "Read HTML notes", minutes: 25, completed: false },
  { title: "Practice CSS", minutes: 30, completed: true },
  { title: "Solve JavaScript exercises", minutes: 45, completed: false },
  { title: "Review quiz", minutes: 15, completed: false }
];

// Creates one task object with ordinary methods, so `this` refers to
// that specific task when complete() or describe() runs.
function createTask(title, minutes, completed) {
  return {
    title,
    minutes,
    completed,
    complete() {
      this.completed = true;
    },
    describe() {
      const status = this.completed ? "Completed" : "Pending";
      return `${this.title} — ${status} (${this.minutes} min)`;
    }
  };
}

// Builds a fresh array of task objects from the original data.
// Arrow callback with map() turns each plain record into a task object.
function buildTasks() {
  return initialData.map(d => createTask(d.title, d.minutes, d.completed));
}

// Returns the subset of tasks that match the current filter.
// Arrow callbacks with filter() do the actual selecting.
function filterTasks(list, filterValue) {
  if (filterValue === "pending") {
    return list.filter(t => !t.completed);
  }
  if (filterValue === "completed") {
    return list.filter(t => t.completed);
  }
  return list; // "all"
}

// The live, current set of tasks. Declared with let because Reset
// replaces it with a brand-new array.
let tasks = buildTasks();

// Redraws the summary, message, and list based on the current filter.
function renderTasks() {
  const filterValue = statusFilter.value;
  const visible = filterTasks(tasks, filterValue);

  // map (arrow callback) turns visible tasks into their display labels
  const labels = visible.map(t => t.describe());

  // Clear the existing rows before adding the current ones, so
  // repeated renders never duplicate list items.
  taskList.textContent = "";

  // Loop displays each label as its own list item.
  for (let i = 0; i < labels.length; i++) {
    const li = document.createElement("li");
    li.textContent = labels[i];
    taskList.appendChild(li);
  }

  // reduce (arrow callback) totals the minutes of the visible tasks.
  const totalMinutes = visible.reduce((sum, t) => sum + t.minutes, 0);
  summary.textContent = `${visible.length} tasks, ${totalMinutes} minutes`;

  if (visible.length === 0) {
    message.textContent = "No tasks match this filter.";
  } else {
    message.textContent = "";
  }
}

// Filter change updates the visible list immediately.
statusFilter.addEventListener("change", renderTasks);

// Mark all completed changes every stored task, even ones hidden by
// the current filter, then re-renders without changing the filter.
completeAllBtn.addEventListener("click", () => {
  // A plain loop (not forEach) calls complete() on every stored task.
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].complete();
  }
  renderTasks();
});

// Reset restores the original four tasks and their starting
// completion values, and selects "All" again.
resetBtn.addEventListener("click", () => {
  tasks = buildTasks();
  statusFilter.value = "all";
  renderTasks();
});

// Initial render on page load.
renderTasks();