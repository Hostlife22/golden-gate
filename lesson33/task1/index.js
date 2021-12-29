const formElem = document.querySelector('.login-form');
const submitBtnElem = document.querySelector('.submit-button');

const onInputChange = () =>
  formElem.reportValidity() === true
    ? submitBtnElem.removeAttribute('disabled')
    : submitBtnElem.setAttribute('disabled', true);

const clearEventForm = () => {
  formElem.reset();
};

const createUser = data => {
  const baseUrl = 'https://61c8c4dcadee460017260de8.mockapi.io/form';

  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      user: data,
    }),
  })
    .then(response => response.text())
    .then(responseData => {
      clearEventForm();
      alert(responseData);
    });
};

const onSubmitForm = e => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(formElem));
  const textForm = Object.entries(formData)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  onInputChange();
  createUser(textForm);
};

formElem.addEventListener('keyup', onInputChange);
submitBtnElem.addEventListener('click', onSubmitForm);
