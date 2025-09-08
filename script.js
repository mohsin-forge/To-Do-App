const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const searchInput = document.getElementById("searchInput");
const progressText = document.getElementById("progress");
const themeToggle = document.getElementById("themeToggle");

const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modalMessage");
const closeModal = document.getElementById("closeModal");

// Load tasks from localStorage
window.onload = loadTasks;

// Events
addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);
searchInput.addEventListener("input", filterTasks);
themeToggle.addEventListener("click", toggleTheme);
closeModal.addEventListener("click", () => (modal.style.display = "none"));

// Show modal
function showModal(message) {
  modalMessage.textContent = message;
  modal.style.display = "flex";
}

// Add Task
function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = taskDate.value;
  const category = taskCategory.value;

  if (taskText === "") {
    showModal("⚠️ Please enter a task before adding.");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    date: dueDate,
    category: category,
    completed: false,
  };

  saveTask(task);
  displayTask(task);
  taskInput.value = "";
  taskDate.value = "";
  taskCategory.value = "General";
  updateProgress();

  showModal("✅ Task added successfully!");
}

// Display Task
function displayTask(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${task.text} 
      <small style="color:#94a3b8">[${task.category}] ${task.date ? " - " + task.date : ""}</small>
    </span>
    <div class="actions">
      <button class="complete">${task.completed ? "Undo" : "Done"}</button>
      <button class="delete">Delete</button>
    </div>
  `;

  // Complete toggle
  li.querySelector(".complete").addEventListener("click", () => {
    task.completed = !task.completed;
    updateTask(task);
    li.classList.toggle("completed");
    li.querySelector(".complete").textContent = task.completed ? "Undo" : "Done";
    updateProgress();
  });

  // Delete
  li.querySelector(".delete").addEventListener("click", () => {
    removeTask(task.id);
    li.remove();
    updateProgress();
    showModal("🗑️ Task deleted.");
  });

  taskList.appendChild(li);
}

// Save Task
function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(displayTask);
  updateProgress();
}

// Update Task
function updateTask(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove Task
function removeTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear All
function clearAllTasks() {
  localStorage.removeItem("tasks");
  taskList.innerHTML = "";
  updateProgress();
  showModal("🧹 All tasks cleared!");
}

// Filter Tasks
function filterTasks() {
  const searchValue = searchInput.value.toLowerCase();
  document.querySelectorAll("li").forEach((task) => {
    const text = task.querySelector("span").innerText.toLowerCase();
    task.style.display = text.includes(searchValue) ? "flex" : "none";
  });
}

// Progress Tracker
function updateProgress() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (tasks.length === 0) {
    progressText.textContent = "Progress: 0%";
    return;
  }
  let completed = tasks.filter((t) => t.completed).length;
  let percent = Math.round((completed / tasks.length) * 100);
  progressText.textContent = `Progress: ${percent}%`;
}

// Dark/Light Mode
function toggleTheme() {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
}
