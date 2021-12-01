export const setButton = (butonText) => {
    const body = document.querySelector('body');
    body.innerHTML = `<button>${butonText}</button>`;
};

setButton('Create page');
