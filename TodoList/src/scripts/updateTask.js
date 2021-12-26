import { renderTasks } from './renderer.js';
import { updateTask, getTasksList } from './tasksGateway.js';

export const onToggleTask = e => {
  const done = e.target.checked;
  const taskId = e.target.dataset.id;

  let updateTaskItem;

  getTasksList()
    .then(tasksList => {
      const { text, createDate } = tasksList.find(task => task.id === taskId);

      updateTaskItem = {
        text,
        createDate,
        done,
        finishDate: done ? new Date().toISOString() : null,
      };
    })
    .then(() => updateTask(taskId, updateTaskItem))
    .then(() => renderTasks());
};
