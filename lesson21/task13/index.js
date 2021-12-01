export const getSection = (num) => {
    const listElements = document.querySelector(`span[data-number="${num}"]`);

    return listElements.parentElement.dataset.section;
};
