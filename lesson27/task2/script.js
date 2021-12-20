const counterElement = document.querySelector('.counter');
const counterValueElement = document.querySelector('.counter__value');

const onClickCounter = (event) => {
  const isButton = event.target.classList.contains('counter__button');

  if (!isButton) {
    return;
  }

  const { action } = event.target.dataset;
  const oldValue = Number(counterValueElement.textContent);
  const newValue = action === 'decrease' ? oldValue - 1 : oldValue + 1;

  localStorage.setItem('counterValue', newValue);

  counterValueElement.textContent = newValue;
};

const onChangeStorage = (event) => {
  counterValueElement.textContent = event.newValue;
};

const onDocumentLoaded = () => {
  counterValueElement.textContent = localStorage.getItem('counterValue') || 0;
};

counterElement.addEventListener('click', onClickCounter);
window.addEventListener('storage', onChangeStorage);
document.addEventListener('DOMContentLoaded', onDocumentLoaded);
