// === IMPORTS FOR WEBPACK ===

// Import CSS using Webpack
import "./style.css";

// Import image assets using Webpack's asset loader
import iconMoon from "./images/icon-moon.svg";
import iconSun from "./images/icon-sun.svg";
import iconCross from "./images/icon-cross.svg";

// === TYPES ===
type Todo = {
  text: string;
  completed: boolean;
};

// === DOM ELEMENTS ===
const body = document.body;
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement;
const themeIcon = document.getElementById("theme-icon") as HTMLImageElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLUListElement;
const itemsLeft = document.getElementById("items-left") as HTMLElement;
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed") as HTMLButtonElement;

// === APP STATE ===
let todos: Todo[] = [];

// === INIT ON PAGE LOAD ===
window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  renderTodos(getActiveFilter());
  setInitialTheme();
});

// === EVENT LISTENERS ===
themeToggle.addEventListener("click", toggleTheme);
todoForm.addEventListener("submit", handleNewTodo);
clearCompletedBtn.addEventListener("click", clearCompletedTodos);
filters.forEach((btn) => btn.addEventListener("click", handleFilterClick));

// === FUNCTIONS ===

// Set initial theme icon based on body class
function setInitialTheme(): void {
  const isDark = body.classList.contains("dark-theme");
  themeIcon.src = isDark ? iconMoon : iconSun;
}

// Toggle between light and dark mode
function toggleTheme(): void {
  const isDark = body.classList.contains("dark-theme");
  body.classList.toggle("dark-theme", !isDark);
  body.classList.toggle("light-theme", isDark);
  themeIcon.src = isDark ? iconMoon : iconSun;
}

// Handle new todo form submission
function handleNewTodo(e: Event): void {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, completed: false });
  todoInput.value = "";
  saveTodos();
  renderTodos(getActiveFilter());
}

// Render todos into the list
function renderTodos(filter: string = "all"): void {
  todoList.innerHTML = "";

  const filtered = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach((todo, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todos[index].completed = !todos[index].completed;
      saveTodos();
      renderTodos(getActiveFilter());
    });

    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.5";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<img src="${iconCross}" alt="Delete">`;
    deleteBtn.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos(getActiveFilter());
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });

  updateItemsLeft();
}

// Update "items left" counter
function updateItemsLeft(): void {
  const activeCount = todos.filter((todo) => !todo.completed).length;
  itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}

// Clear completed todos
function clearCompletedTodos(): void {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos(getActiveFilter());
}

// Handle filter button clicks
function handleFilterClick(e: Event): void {
  filters.forEach((btn) => btn.classList.remove("active"));
  (e.target as HTMLElement).classList.add("active");
  renderTodos(getActiveFilter());
}

// Get current filter value
function getActiveFilter(): string {
  const activeBtn = document.querySelector(".filter.active") as HTMLElement | null;
  return activeBtn?.dataset.filter || "all";
}

// Save todos to localStorage
function saveTodos(): void {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos(): void {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
  }
}
