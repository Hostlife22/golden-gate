export const finishForm = () => {
    const listElement = document.querySelector('.login-form');
    const inputElement = document.createElement('input');

    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('name', 'login');

    listElement.prepend(inputElement);

    const passwordElement = listElement.children;
    passwordElement[1].setAttribute('type', 'password');
};
