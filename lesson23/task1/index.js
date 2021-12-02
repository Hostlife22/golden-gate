const mailFormElement = document.querySelector('#email');
const passwordFormElement = document.querySelector('#password');

const errorMailElement = document.querySelector('.error-text_email');
const errorPasswordElement = document.querySelector('.error-text_password');

const isRequired = (field) => (field ? undefined : 'Required');
const isMail = (field) =>
    field.includes('@') ? undefined : 'Should be an email';

const fieldValid = {
    email: [isRequired, isMail],
    password: [isRequired],
};

const onByValidator = (field, value) => {
    const fieldText = fieldValid[field];

    return fieldText
        .map((validator) => validator(value))
        .filter((error) => error)
        .join(', ');
};

const onByMailValidator = (event) => {
    const textError = onByValidator('email', event.target.value);
    errorMailElement.textContent = textError;
};

const onByPasswordValidator = (event) => {
    const textError = onByValidator('password', event.target.value);
    errorPasswordElement.textContent = textError;
};

mailFormElement.addEventListener('input', onByMailValidator);
passwordFormElement.addEventListener('input', onByPasswordValidator);

const loginFormElement = document.querySelector('.login-form');

const getFormFields = (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(loginFormElement));

    alert(JSON.stringify(formData));
};

loginFormElement.addEventListener('submit', getFormFields);
