import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userApiObjectToUserDto } from "~/mapper/user.mapper";
import { requireAdmin } from "~/services/session.server";
import { getUsers } from "~/services/user.server";
import { getSearchParamsOrFail } from "~/utils/remix.params";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
	orderBy: z.string().default("createdAt"),
	orderByDirection: z.enum([ 'asc', 'desc']),
})

// GET list of users
export const loader: LoaderFunction = async ({
  request,
}) => {
	await requireAdmin(request)

	const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema)

	const usersPaginatedObjectApiObject = await getUsers(page, pageSize, orderBy, orderByDirection)

  return json(paginateEntityToApiObject(usersPaginatedObjectApiObject, userApiObjectToUserDto));
};


// No POST, must use /join action