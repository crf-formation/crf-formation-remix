import invariant from "tiny-invariant";
import { z } from "zod";
import type { OrderByDirection, PaginateObject } from "~/constants/types";

interface Props<T> {
  model: T;
	page: number;
	pageSize: number;
  orderBy?: string;
  orderByDirection?: OrderByDirection;
  include?: any;
  where?: any;
  select?: any;
}

const PropsSchema = z.object({
  model: z.any(),
	page: z.number(),
	pageSize: z.number(),
  orderBy: z.string().default("createdAt"),
  orderByDirection: z.string().default("asc"),
  include: z.any().optional(),
  where: z.any().optional(),
  select: z.any().optional(),
});

export async function createPaginateObject<T>(props: Props<typeof model>): Promise<PaginateObject<T>> {
  const { 
    model, 
    page, 
    pageSize, 
    orderBy, 
    orderByDirection,
    include, 
    select, 
    where 
  } = PropsSchema.parse(props)

  invariant(model, `Missing model`)
  invariant(page >= 0, `Invalid page ${page}`)
  invariant(pageSize > 0, `Invalid pageSize ${pageSize}`)
  invariant(orderBy, `Missing orderBy ${orderBy}`)
  invariant(orderByDirection, `Missing orderByDirection ${orderByDirection}`)

	// totalCount
  const totalCount = await model.count({
    where,
    select,
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
				direction: orderByDirection as string,
				orderBy,
			},
		}; 
	}

	const data = await model.findMany({
    skip: page * pageSize,
    take: pageSize,
		where,
		include,
    select,
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
      direction: orderByDirection as string,
      orderBy,
    },
  }; 
}
