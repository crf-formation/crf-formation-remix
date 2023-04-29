import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { PseFormationPutDto } from "~/dto/pseformation.dto";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import {
	dataToPseFormationPutDto,
	pseFormationApiObjectToDto,
	pseFormationPutDtoToApiObject
} from "~/mapper/pseformation.mapper";
import { findPseFormationById, getPseFormationById, updatePseFormation } from "~/service/pseformation.server";
import { requireAdmin } from "~/service/session.server";
import { namedAction } from "~/util/named-actions";

const ParamsSchema = z.object({
  formationId: z.string()
});

const security: SecurityFunction<{
  pseFormationApiObject: PseFormationApiObject;
}> = async (request: Request, params: Params) => {
  const { formationId } = getParamsOrFail(params, ParamsSchema);

  await requireAdmin(request);

  const pseFormationApiObject = await getPseFormationById(formationId);

  return {
    pseFormationApiObject
  };
};

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const { pseFormationApiObject } = await security(request, params);

  return json(pseFormationApiObjectToDto(pseFormationApiObject));
};

// PUT, PATCH, or DELETE
export const action: ActionFunction = async ({ request, params }) => {
  await security(request, params);

  return namedAction(request, params, {
    putAction
  });
};

async function putAction(request: Request, params: Params<string>) {
  const { formationId } = getParamsOrFail(params, ParamsSchema);

  const data = await request.json();

  const pseFormationApiObject = await findPseFormationById(formationId);

  if (!pseFormationApiObject) {
    throw new Error(`Formation not found: ${formationId}`);
  }

  // TODO: use zod to map data
  const pseFormationPutDto: PseFormationPutDto = dataToPseFormationPutDto(data);

  const updatedApiObject = await updatePseFormation(formationId, pseFormationPutDtoToApiObject(pseFormationPutDto, pseFormationApiObject));

  return json(pseFormationApiObjectToDto(updatedApiObject));
}
