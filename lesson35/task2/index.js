const getUserData = userId =>
  fetch(`https://api.github.com/users/${userId}`).then(response => {
    if (!response.ok) {
      return null;
    }
    return response.json();
  });

const getUsersBlogs = async usersId => {
  try {
    const allPromise = usersId.map(user => getUserData(user));
    const response = await Promise.all(allPromise);
    return response.includes(null) ? null : response.map(({ blog }) => blog);
  } catch (err) {
    throw new Error('Failed to fetch user');
  }
};
getUsersBlogs(['godogle', 'facebook']).then(list => console.log(list));
