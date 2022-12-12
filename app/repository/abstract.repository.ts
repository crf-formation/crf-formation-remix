import { prisma } from "@prisma/client";
import type { PaginateObject } from "~/constants/types";

interface Props<T> {
  model: T;
	page: number;
	pageSize: number;
  orderBy?: string;
  orderByDirection?: 'asc' | 'desc' | undefined;
  include?: any;
  where?: any;
}

export async function createPaginateObject<T>({ model, page, pageSize, orderBy = 'createdAt', orderByDirection = 'asc', include, where }: Props<typeof model>): Promise<PaginateObject<T>> {
	// totalCount
  const totalCount = await model.count({
    where: {
      ...where,
    },
  });

  console.log({ toto: 'toto', orderBy, orderByDirection, page, pageSize })

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