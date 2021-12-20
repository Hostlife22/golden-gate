localStorage.setItem('name', 'Tom');
localStorage.setItem('hobbies', JSON.stringify({ name: 'Alex' }));

const getLocalStorageData = () =>
  Object.entries(localStorage).reduce((acc, [key, value]) => {
    let newValue;

    try {
      newValue = JSON.parse(value);
    } catch (e) {
      newValue = value;
    }

    return {
      ...acc,
      [key]: newValue,
    };
  }, {});

console.log(getLocalStorageData());
