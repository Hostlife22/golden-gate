const formElem = document.querySelector('.login-form');
const submitBtnElem = document.querySelector('.submit-button');

const onInputChange = () => {
  const isValidForm = formElem.reportValidity();
  if (isValidForm) {
    submitBtnElem.removeAttribute('disabled');
  } else {
    submitBtnElem.setAttribute('disabled', true);
  }

  return isValidForm;
};

const clearForm = () => {
  formElem.reset();
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
    .then(response => response.text())
    .then(responseData => {
      alert(responseData);
      clearForm();
      onInputChange();
    });
};

const onSubmitForm = e => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(formElem));

  if (onInputChange()) {
    createUser(formData);
  }
};

formElem.addEventListener('keyup', onInputChange);
submitBtnElem.addEventListener('click', onSubmitForm);
