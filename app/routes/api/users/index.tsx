import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userApiObjectToUserDto } from "~/mapper/user.mapper";
import { getSearchParam, getSearchParamNumber } from "~/services/request.server";
import { requireAdmin } from "~/services/session.server";
import { getUsers } from "~/services/user.server";

// GET list of users
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	await requireAdmin(request)

	const page = getSearchParamNumber(request, 'page') || 0
	const pageSize = getSearchParamNumber(request, 'pageSize') || 25

	const orderBy = getSearchParam(request, 'orderBy')
	const orderByDirection = getSearchParam(request, 'orderByDirection')

	invariant(orderBy, `Missing orderBy`)
	invariant(orderByDirection, `Missing orderByDirection`)

	const usersPaginatedObjectApiObject = await getUsers(page, pageSize, orderBy, orderByDirection)

  return json(paginateEntityToApiObject(usersPaginatedObjectApiObject, userApiObjectToUserDto));
};
