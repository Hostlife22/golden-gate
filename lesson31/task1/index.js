const userNameElem = document.querySelector('.user__name');
const userLocation = document.querySelector('.user__location');
const userAvatarElem = document.querySelector('.user__avatar');

const fetchNameContent = (userName) =>
  fetch(`https://api.github.com/users/${userName}`).then((response) => response.json());

const inputElem = document.querySelector('.name-form__input');
const btnFormElem = document.querySelector('.name-form__btn');

const renderUser = (data) => {
  const { avatar_url, name, location } = data;

  userAvatarElem.src = avatar_url;
  userNameElem.textContent = name;
  userLocation.textContent = location;
};

const onGetValue = () => {
  const userName = inputElem.value;
  fetchNameContent(userName).then((data) => renderUser(data));
};

btnFormElem.addEventListener('click', onGetValue);
