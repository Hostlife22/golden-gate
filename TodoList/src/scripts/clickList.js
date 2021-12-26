import { onToggleTask } from './updateTask.js';
import { onDeleteTask } from './deleteTask.js';

export const onListClick = e => {
  if (e.target.classList.contains('list-item__checkbox')) {
    onToggleTask(e);
  }

  if (e.target.classList.contains('list-item__delete-btn')) {
    onDeleteTask(e);
  }
};
