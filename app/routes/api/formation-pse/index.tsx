import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { pseFormationApiObjectToDto } from "~/mapper/pseformation.mapper";
import { getPseFormations } from "~/services/pseformation.server";
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
	const orderByDirection = getSearchParam(request, 'orderByDirection')

	invariant(orderBy, `Missing orderBy`)
	invariant(orderByDirection, `Missing orderByDirection`)

	const formationsPaginatedObjectApiObject = await getPseFormations(page, pageSize, orderBy, orderByDirection)

  return json(paginateEntityToApiObject(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto));
};
