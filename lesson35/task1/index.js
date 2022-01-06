import { fetchRepositories, fetchUserData } from './scripts/gateways.js';
import { cleanReposList, renderRepos } from './scripts/repos.js';
import { hideSpinner, showSpinner } from './scripts/spinner.js';
import { redderUserData } from './scripts/user.js';

const defaultUser = {
  avatar_url: 'https://avatars3.githubusercontent.com/u10001',
  name: '',
  location: '',
};

redderUserData(defaultUser);

const showUserBtnElem = document.querySelector('.name-form__btn');
const userNameInputElem = document.querySelector('.name-form__input');

const onSearchUser = async () => {
  showSpinner();
  cleanReposList();
  const userName = userNameInputElem.value;
  try {
    const userData = await fetchUserData(userName);
    redderUserData(userData);
    const reposList = await fetchRepositories(userData.repos_url);
    renderRepos(reposList);
  } catch (err) {
    alert(err.message);
  } finally {
    hideSpinner();
  }
};

showUserBtnElem.addEventListener('click', onSearchUser);
