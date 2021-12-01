const divElement = document.querySelector('.rect_div');
const pElement = document.querySelector('.rect_p');
const spanElement = document.querySelector('.rect_span');
const eventsList = document.querySelector('.events-list');

const logElement = (element, color) => {
    eventsList.innerHTML += `<span style="color: ${color}; margin-left: 8px;">${element}</span>`;
};

const divElementGrey = logElement.bind(null, 'DIV', 'grey');
const divElementGreen = logElement.bind(null, 'DIV', 'green');
divElement.addEventListener('click', divElementGrey, true);
divElement.addEventListener('click', divElementGreen);

const pElementGrey = logElement.bind(null, 'P', 'grey');
const pElementGreen = logElement.bind(null, 'P', 'green');
pElement.addEventListener('click', pElementGrey, true);
pElement.addEventListener('click', pElementGreen);

const spanElementGrey = logElement.bind(null, 'span', 'grey');
const spanElementGreen = logElement.bind(null, 'span', 'green');
spanElement.addEventListener('click', spanElementGrey, true);
spanElement.addEventListener('click', spanElementGreen);

const clearBtn = document.querySelector('.clear-btn');

const getClearEventList = () => {
    eventsList.innerHTML = '';
};

clearBtn.addEventListener('click', getClearEventList);

const removeHandlersBtn = document.querySelector('.remove-handlers-btn');

const getRemoveHandlers = () => {
    divElement.removeEventListener('click', divElementGrey, true);
    divElement.removeEventListener('click', divElementGreen);
    pElement.removeEventListener('click', pElementGrey, true);
    pElement.removeEventListener('click', pElementGreen);
    spanElement.removeEventListener('click', spanElementGrey, true);
    spanElement.removeEventListener('click', spanElementGreen);
};
removeHandlersBtn.addEventListener('click', getRemoveHandlers);

const attachHandlersBtn = document.querySelector('.attach-handlers-btn');

attachHandlersBtn.addEventListener('click', () => {
    divElement.addEventListener('click', divElementGrey, true);
    divElement.addEventListener('click', divElementGreen);
    pElement.addEventListener('click', pElementGrey, true);
    pElement.addEventListener('click', pElementGreen);
    spanElement.addEventListener('click', spanElementGrey, true);
    spanElement.addEventListener('click', spanElementGreen);
});
