import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userApiObjectToUserDto } from "~/mapper/user.mapper";
import { getSearchParams } from "~/services/request.server";
import { requireAdmin } from "~/services/session.server";
import { getUsers } from "~/services/user.server";

// GET list of users
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const searchParams = getSearchParams(request)

	await requireAdmin(request)

	const usersPaginatedObjectApiObject = await getUsers(searchParams.page, searchParams.limit)

  return json(paginateEntityToApiObject(usersPaginatedObjectApiObject, userApiObjectToUserDto) 
	);
};
