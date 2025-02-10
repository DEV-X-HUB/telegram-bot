import { PageQuery } from '../../types/api';

type Paginator = {
  take: number;
  skip: number;
};

export const getPaginationInfo = (query: PageQuery) => {
  const { page, itemsPerPage } = query;
  console.log(page, typeof page);
  console.log(itemsPerPage, typeof itemsPerPage);
  let paginator: Paginator | undefined;

  if (page && itemsPerPage) {
    paginator = { take: parseInt(itemsPerPage.toString(), 10), skip: (parseInt(page.toString()) - 1) * itemsPerPage };
  }
  return paginator;
};
