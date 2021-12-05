export const tasks = [
  { text: 'Buy milk', done: false, id: '1638708683932', createDate: '2021-12-05T13:40:37.599Z' },
  {
    text: 'Pick up Tom from airport',
    done: false,
    id: '1638708682921',
    createDate: '2021-12-05T13:40:37.598Z',
  },
  {
    text: 'Visit party',
    done: false,
    id: '16387023283921',
    createDate: '2021-12-05T13:40:37.597Z',
  },
  {
    text: 'Visit doctor',
    done: true,
    id: '1638238683921',
    createDate: '2021-12-05T13:40:37.596Z',
    finishDate: '2021-12-05T13:46:30.154Z',
  },
  {
    text: 'Buy meat',
    done: true,
    id: '1638708683421',
    createDate: '2021-12-05T13:40:37.594Z',
    finishDate: '2021-12-05T13:46:30.152Z',
  },
];

const storage = {};

export const setItem = (key, value) => {
  Object.assign(storage, { [key]: value });
};

export const getItem = (key) => storage[key];
