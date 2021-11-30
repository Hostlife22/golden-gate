'use strict';

const tasks = [
    { text: 'Buy milk', done: false },
    { text: 'Pick up Tom from airport', done: false },
    { text: 'Visit party', done: false },
    { text: 'Visit doctor', done: true },
    { text: 'Buy meat', done: true },
];

/**
 * @param {object[]} tasksList
 * @return {undefined}
 */

const renderTasks = (taskList) => {
    const listElement = document.querySelector('.list');

    const listItemsElems = taskList
        .sort((a, b) => a.done - b.done)
        .map(({ text, done }) => {
            const listItemElem = document.createElement('li');
            listItemElem.classList.add('list__item');

            if (done) {
                listItemElem.classList.add('list__item_done');
            }

            const listItemCheckbox = document.createElement('input');
            listItemCheckbox.setAttribute('type', 'checkbox');
            listItemCheckbox.checked = done;
            listItemCheckbox.classList.add('list__item-checkbox');

            listItemElem.append(listItemCheckbox, text);

            return listItemElem;
        });

    listElement.append(...listItemsElems);
};

renderTasks(tasks);
