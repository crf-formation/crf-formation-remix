import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { SecurityFunction } from "~/constants/remix";
import type { PseFormationPutDto } from "~/dto/pseformation.dto";
import { dataToPseFormationPutDto, pseFormationApiObjectToDto, pseFormationPutDtoToApiObject } from "~/mapper/pseformation.mapper";
import { findPseFormationById, getPseFormationById, updatePseFormation } from "~/services/pseformation.server";
import { requireAdmin } from "~/services/session.server";
import { namedAction } from "~/utils/named-actions";
import { getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  formationId: z.string(),
})

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { pseFormationApiObject }  = await security(request, params)

  return json(pseFormationApiObjectToDto(pseFormationApiObject));
};

// PUT, PATCH, or DELETE
export const action: ActionFunction = async ({ request, params }) => {
	await security(request, params)

	return namedAction(request, params, {
		putAction
	})
};

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema)

	await requireAdmin(request)

	const pseFormationApiObject = await getPseFormationById(formationId)

  return {
    pseFormationApiObject,
  }
}

async function putAction(request: Request, params: Params<string>) {
	const { formationId } = getParamsOrFail(params, ParamsSchema)

	const data = await request.json();

	const pseFormationApiObject = await findPseFormationById(formationId)
	
	if (!pseFormationApiObject) {
		throw new Error(`Formation not found: ${formationId}`);
	}

	// TODO: use zod to map data
	const pseFormationPutDto: PseFormationPutDto = dataToPseFormationPutDto(data);

	const updatedApiObject = await updatePseFormation(formationId, pseFormationPutDtoToApiObject(pseFormationPutDto, pseFormationApiObject));

  return json(pseFormationApiObjectToDto(updatedApiObject));
}
