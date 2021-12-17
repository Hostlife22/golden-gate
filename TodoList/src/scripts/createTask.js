import { getItem, setItem } from './storage.js';
import { renderTasks } from './renderer.js';

export const onCreateTask = () => {
  const taskTitleInputElem = document.querySelector('.task-input');

  const text = taskTitleInputElem.value;

  if (!text) {
    return;
  }
  taskTitleInputElem.value = '';
  const taskList = getItem('tasksList') || [];

  const newTasksList = taskList.concat({
    text,
    done: false,
    createDate: new Date().toISOString(),
    id: Date.now().toString(),
  });

  setItem('tasksList', newTasksList);

  renderTasks();
};
