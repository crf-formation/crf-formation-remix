import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { OrderByDirection } from "~/constants/types";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { placeApiObjectToDto } from "~/mapper/place.mapper";
import { getPlaces } from "~/services/place.server";
import { getSearchParam, getSearchParamNumber } from "~/services/request.server";
import { requireAdmin } from "~/services/session.server";

// GET list of formations
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	await requireAdmin(request)

	const page = getSearchParamNumber(request, 'page') || 0
	const pageSize = getSearchParamNumber(request, 'pageSize') || 25

	const orderBy = getSearchParam(request, 'orderBy')
	const orderByDirection = getSearchParam(request, 'orderByDirection') as OrderByDirection

	invariant(orderBy, `Missing orderBy`)
	invariant(orderByDirection, `Missing orderByDirection`)

	const formationsPaginatedObjectApiObject = await getPlaces(page, pageSize, orderBy, orderByDirection)

  return json(paginateEntityToApiObject(formationsPaginatedObjectApiObject, placeApiObjectToDto));
};
