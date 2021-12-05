const tasks = [
  { text: 'Buy milk', done: false, id: '1638708683932' },
  { text: 'Pick up Tom from airport', done: false, id: '1638708682921' },
  { text: 'Visit party', done: false, id: '16387023283921' },
  { text: 'Visit doctor', done: true, id: '1638238683921' },
  { text: 'Buy meat', done: true, id: '1638708683421' },
];

const listElem = document.querySelector('.list');

const compareTasks = (a, b) => {
  if (a.done - b.done !== 0) {
    return a.done - b.done;
  }

  if (a.done) {
    return new Date(b.finishDate) - new Date(a.finishDate);
  }

  return new Date(b.createDate) - new Date(a.createDate);
};

const createCheckbox = ({ done, id }) => {
  const checkboxElem = document.createElement('input');
  checkboxElem.setAttribute('type', 'checkbox');
  checkboxElem.setAttribute('data-id', id);
  checkboxElem.checked = done;
  checkboxElem.classList.add('list__item-checkbox');

  return checkboxElem;
};

const createListItem = ({ text, done, id }) => {
  const listItemElem = document.createElement('li');
  listItemElem.classList.add('list__item');
  const checkboxElem = createCheckbox({ done, id });
  if (done) {
    listItemElem.classList.add('list__item_done');
  }

  const textElem = document.createElement('span');
  textElem.classList.add('list-item__text');
  textElem.textContent = text;

  listItemElem.append(checkboxElem, textElem);

  return listItemElem;
};

const renderTasks = () => {
  listElem.innerHTML = '';

  const tasksElems = tasks.sort(compareTasks).map(createListItem);

  listElem.append(...tasksElems);
};

renderTasks();

const onCreateTask = () => {
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
  console.log(tasks);
  renderTasks();
};

const createBtnElem = document.querySelector('.create-task-btn');
createBtnElem.addEventListener('click', onCreateTask);

const onToggleTask = (e) => {
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

const todoListElem = document.querySelector('.list');
todoListElem.addEventListener('click', onToggleTask);
