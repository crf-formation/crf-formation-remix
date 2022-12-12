import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { OrderByDirection } from "~/constants/types";
import type { PseFormationPostDto  } from "~/dto/pseformation.dto";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { dataToPseFormationPostDto, pseFormationApiObjectToDto, pseFormationPostDtoToApiObject, pseFormationPutDtoToApiObject } from "~/mapper/pseformation.mapper";
import { createPseFormation, getPseFormations, updatePseFormation } from "~/services/pseformation.server";
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

	const formationsPaginatedObjectApiObject = await getPseFormations(page, pageSize, orderBy, orderByDirection)

  return json(paginateEntityToApiObject(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto));
};

// POST
export const action: ActionFunction = async ({ request, params }) => {
	if (request.method === 'POST') {
		return postAction(request, params)
	}
};


async function postAction(request: Request, params: Params<string>) {
	await requireAdmin(request)

	const data = await request.json();

	const formationPutDto: PseFormationPostDto = dataToPseFormationPostDto(data);

	const createdApiObject = await createPseFormation(pseFormationPostDtoToApiObject(formationPutDto));

  return json(pseFormationApiObjectToDto(createdApiObject));
}
