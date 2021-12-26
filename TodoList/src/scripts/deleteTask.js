import { deleteTask } from './tasksGateway.js';
import { renderTasks } from './renderer.js';

export const onDeleteTask = e => {
  let taskId;

  e.target.closest('.list-item').childNodes.forEach(el => {
    if (el.classList.contains('list-item__checkbox')) {
      taskId = el.dataset.id;
    }
  });

  deleteTask(taskId).then(() => renderTasks());
};
