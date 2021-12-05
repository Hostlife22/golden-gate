import { tasks } from './storage.js';
import { renderTasks } from './renderer.js';

export const onToggleTask = (e) => {
  const isCheckbox = e.target.classList.contains('list__item-checkbox');

  if (!isCheckbox) {
    return;
  }

  const taskId = e.target.dataset.id;
  const tasksList = tasks;
  const { id } = tasksList.find((task) => task.id === taskId);
  const done = e.target.checked;

  tasks.map((task) => {
    if (task.id === id) {
      task.done = done;
      task.finishDate = done ? new Date().toISOString() : null;
    }
    return task;
  });
  renderTasks();
};
