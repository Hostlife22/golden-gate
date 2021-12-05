import { tasks } from './storage.js';
import { renderTasks } from './renderer.js';

export const onCreateTask = () => {
  const taskTitleInputElem = document.querySelector('.task-input');

  const text = taskTitleInputElem.value;

  if (!text) {
    return;
  }
  taskTitleInputElem.value = '';

  const newTask = {
    text,
    done: false,
    createDate: new Date().toISOString(),
    id: Date.now().toString(),
  };

  tasks.push(newTask);
  renderTasks();
};
