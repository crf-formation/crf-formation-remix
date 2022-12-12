import invariant from "tiny-invariant";
import type { OrderByDirection, PaginateObject } from "~/constants/types";

interface Props<T> {
  model: T;
	page: number;
	pageSize: number;
  orderBy?: string;
  orderByDirection?: OrderByDirection;
  include?: any;
  where?: any;
}

export async function createPaginateObject<T>({ model, page, pageSize, orderBy = 'createdAt', orderByDirection = 'asc', include, where }: Props<typeof model>): Promise<PaginateObject<T>> {
  invariant(model, `Missing model`)
  invariant(page >= 0, `Invalid page ${page}`)
  invariant(pageSize > 0, `Invalid pageSize ${pageSize}`)
  invariant(orderBy, `Missing orderBy ${orderBy}`)
  invariant(orderByDirection, `Missing orderByDirection ${orderByDirection}`)

	// totalCount
  const totalCount = await model.count({
    where: {
      ...where,
    },
  });

	if (!totalCount) {
		return {
			data: [],
			page: {
				page,
				pageSize,
				totalElements: 0,
				totalPages: 0,
			},
			sort: {
				direction: orderByDirection,
				orderBy,
			},
		}; 
	}

	const data = await model.findMany({
    skip: page * pageSize,
    take: pageSize,
		where,
		include,
    orderBy: { [orderBy]: orderByDirection }
  });

	return {
    data,
    page: {
      page,
      pageSize,
      totalElements: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    sort: {
      direction: orderByDirection,
      orderBy,
    },
  }; 
}