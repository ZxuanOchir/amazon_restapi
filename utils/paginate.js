module.exports = async function (page, limit, model) {
  const total = await model.countDocuments(); //niit elementiin too db aas awna.
  const pageCount = Math.ceil(total / limit); // 12 = total / 3 = pageCount = 4
  //niit huudasnii too total / limit
  const start = (page - 1) * limit + 1; // 3 - 1 = 2 * 3 = 7
  //Zaagdsan huudasnii ehleh elementiin des dugaar
  let end = start + limit - 1; // 7 + 3 - 1 = 9
  //Zaagdsan huudasnii tugsuh elementiin des dugaar
  if (end > total) end = total; // 9 > 12 9 = 12

  const pagination = { total, pageCount, start, end, limit };

  if (page < pageCount) pagination.nextPage = page + 1;
  // 3 < 4    3 + 1 = 4
  if (page > 1) pagination.prevPage = page - 1;
  // 3 > 1

  return pagination;
};
