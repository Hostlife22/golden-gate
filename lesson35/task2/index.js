export const parseUser = dataUser => {
  try {
    return JSON.parse(dataUser);
  } catch (error) {
    return null;
  }
};
