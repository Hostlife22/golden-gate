export const finishList = () => {
    const listItems = document.querySelector('.list');
    listItems.innerHTML = '';
    for (let i = 1; i <= 8; i++) {
        const itemList = document.createElement('li');
        itemList.textContent = i;
        listItems.append(itemList);
    }
};
