export const isRow = async (e, query) => {
  let is = 0;
  query.forEach((q) => {
    if (e[q.key] === q.value) {
      e[q.key] && is++;
    }
  });
  return is === query.length ? true : false;
};
