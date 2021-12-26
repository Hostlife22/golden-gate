const getCommitAuthors = (data, days) => {
  const currentDay = new Date();
  const startDate = new Date(new Date().setDate(currentDay.getDate() - days));

  return data
    .map(({ commit }) => commit.author)
    .filter(({ date }) => startDate < new Date(date) && new Date(date) < currentDay)
    .reduce((acc, { name, email }) => {
      acc[name] = acc[name] || { name, email, count: 0 };
      acc[name].count += 1;
      return acc;
    }, {});
};

const getRequiredData = (data) => {
  const arr = Object.values(data).sort((a, b) => b.count - a.count);
  arr.push({ name: ' Vaughn', email: 'bvaughn@fb.com', count: 11 });

  const as = arr.filter((obj) => obj.count === arr[0].count);
  console.log(as);

  //   const autors = Object.values(data);
  //   autors.push({ name: 'Brian ', email: 'bvaughn@fb.com', count: 11 });
  //   autors.push({ name: 'Ann ', email: 'bvaughn@fb.com', count: 11 });
  //   const d = autors.reduce(
  //     (acc, obj) =>
  //       acc.count < obj.count
  //         ? obj
  //         : acc.count === obj.count
  //         ? [acc, obj]
  //         : acc.length < 1
  //         ? obj
  //         : acc,
  //     [],
  //   );
  //   console.log(d);
};

function getMostActiveDevs(user) {
  const { days, userId, repoId } = user;

  const url = `https://api.github.com/repos/${userId}/${repoId}/commits?per_page=100`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => getCommitAuthors(data, days))
    .then((commitsArr) => getRequiredData(commitsArr));
}

const searchSetup = {
  days: 17,
  userId: 'facebook',
  repoId: 'react',
};

getMostActiveDevs(searchSetup);
