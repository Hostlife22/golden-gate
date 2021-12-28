const form = document.querySelector('.login-form');
const btn = document.querySelector('.submit-button');

const checkValidForm = () => {
  btn.disabled = !form.reportValidity();
};

const clearEventForm = () => {
  form.reset();
};

const createUser = data => {
  const baseUrl = 'https://61c8c4dcadee460017260de8.mockapi.io/form';

  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(request => {
      alert(JSON.stringify(request));
      clearEventForm();
    });
};

const onSubmitForm = e => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(form));

  checkValidForm();
  createUser(formData);
};

form.addEventListener('keyup', checkValidForm);
btn.addEventListener('click', onSubmitForm);
