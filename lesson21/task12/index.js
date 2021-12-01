export const squaredNumbers = () => {
    const listElements = document.querySelectorAll('.number');

    listElements.forEach((list) => {
        const dataBasic = list.dataset.number;
        list.dataset.squaredNumber = dataBasic * dataBasic;
    });
};
