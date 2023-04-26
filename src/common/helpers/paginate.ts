export function paginateResponse(
  data: [any, any],
  page: number,
  limit: number,
) {
  const [result, total] = data;

  page = Number(page);
  limit = Number(limit);

  const lastPage = Math.ceil(total / limit) || 1;
  const nextPage = +page + 1 > +lastPage ? null : +page + 1;
  const prevPage = +page - 1 < 1 ? null : +page - 1;

  return {
    data: [...result],
    count: total,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  };
}
