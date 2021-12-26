import { renderTasks } from './renderer.js';
import { initTodoListHandlers } from './todoList.js';
import { getTasksList } from './tasksGateway.js';

document.addEventListener('DOMContentLoaded', () => {
  getTasksList().then(() => {
    renderTasks();
  });
  initTodoListHandlers();
});
