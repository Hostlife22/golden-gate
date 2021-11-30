export const getTitleElement = () => {
    const titleElem = document.querySelector('.title');

    console.dir(titleElem);

    return titleElem;
};
getTitleElement();

export const getInputElement = () => {
    const inputElement = document.querySelector('input[type="text"]', 'text');

    console.dir(inputElement);

    return inputElement;
};

getInputElement();
