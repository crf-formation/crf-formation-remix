import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { PseFormationPutDto } from "~/dto/pseformation.dto";
import { dataToPseFormationPutDto, pseFormationApiObjectToDto, pseFormationPutDtoToApiObject } from "~/mapper/pseformation.mapper";
import { findPseFormationById, updatePseFormation } from "~/services/pseformation.server";
import { requireAdmin } from "~/services/session.server";

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	invariant(params.formationId, `Missing formationId parameter`)

	await requireAdmin(request)

	const pseFormationApiObject = await findPseFormationById(params.formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${params.formationId}`);
	}

  return json(pseFormationApiObjectToDto(pseFormationApiObject));
};

// PUT, PATCH, or DELETE
export const action: ActionFunction = async ({ request, params }) => {
	if (request.method === 'PUT') {
		return putAction(request, params)
	}
	if (request.method === 'POST') {
		// not handled yet
		// return putAction(request, params)
	}
};


async function putAction(request: Request, params: Params<string>) {
	invariant(params.formationId, `Missing formationId parameter`)
	await requireAdmin(request)

	const data = await request.json();

	const pseFormationApiObject = await findPseFormationById(params.formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${params.formationId}`);
	}

	const pseFormationPutDto: PseFormationPutDto = dataToPseFormationPutDto(data);

// 	console.log({ pseFormationPutDto: JSON.stringify(pseFormationPutDto, null, 2) })
// 	die();

	const updatedApiObject = await updatePseFormation(params.formationId, pseFormationPutDtoToApiObject(pseFormationPutDto, pseFormationApiObject));

  return json(pseFormationApiObjectToDto(updatedApiObject));
}
