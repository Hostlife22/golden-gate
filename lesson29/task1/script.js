'use strict';

const randomDelay = (from, to) => {
  const MILLISECOND_DELAY = 1000;

  return Math.floor(Math.random() * (to - from + 1) + from) * MILLISECOND_DELAY;
};

const requestUserData = (userId, callback) => {
  const delay = randomDelay(1, 3);

  const user =
    userId === 'broken'
      ? [null, 'Failed to load user data']
      : [
          {
            userId,
            email: `${userId}@example.com`,
          },
        ];

  setTimeout(() => {
    callback(...user);
  }, delay);
};

requestUserData('id12', 'dfd');
