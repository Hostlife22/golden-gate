import { renderTasks } from './renderer.js';
import { initTodoListHandlers } from './todoList.js';

document.addEventListener('DOMContentLoaded', () => {
  renderTasks();

  initTodoListHandlers();
});
