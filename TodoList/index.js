const tasks = [
    { text: 'Buy milk', done: false, id: 13 },
    { text: 'Pick up Tom from airport', done: false, id: 21 },
    { text: 'Visit party', done: false, id: 22 },
    { text: 'Visit doctor', done: true, id: 6 },
    { text: 'Buy meat', done: true, id: 5 },
];

const listElem = document.querySelector('.list');

const renderTasks = () => {
    const taskList = tasks;

    listElem.innerHTML = '';
    const tasksElems = taskList
        .sort((a, b) => a.done - b.done)
        .map(({ text, done, id }) => {
            const listItemElem = document.createElement('li');
            listItemElem.classList.add('list__item');

            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('data-id', id);
            checkbox.checked = done;
            checkbox.classList.add('list__item-checkbox');

            if (done) {
                listItemElem.classList.add('list__item_done');
            }

            listItemElem.append(checkbox, text);

            return listItemElem;
        });

    listElem.append(...tasksElems);
};

renderTasks();

const createTaskElement = document.querySelector('.create-task-btn');

const onCreateTask = () => {
    const taskInputElement = document.querySelector('.task-input');
    const textInput = taskInputElement.value;

    if (!textInput) {
        return;
    }

    taskInputElement.value = '';
    tasks.push({
        text: textInput,
        done: false,
        id: Math.random().toString(),
    });

    renderTasks();
};

createTaskElement.addEventListener('click', onCreateTask);

const todoListElem = document.querySelector('.list');

const onToggleTask = (event) => {
    const isCheckbox = event.target.classList.contains('list__item-checkbox');

    if (!isCheckbox) {
        return;
    }

    tasks.map((task) => {
        if (task.id === +event.target.dataset.id) {
            task.done = event.target.checked;
        }
        return task;
    });

    renderTasks();
};
todoListElem.addEventListener('click', onToggleTask);
