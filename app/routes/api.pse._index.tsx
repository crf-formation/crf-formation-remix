import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationPostDto } from "~/dto/pseformation.dto";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import {
  dataToPseFormationPostDto,
  pseFormationApiObjectToDto,
  pseFormationPostDtoToApiObject
} from "~/mapper/pseformation.mapper";
import { createPseFormation, getPseFormations } from "~/service/pseformation.server";
import { requireAdmin } from "~/service/session.server";
import { namedAction } from "~/util/named-actions";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
  orderBy: z.string().default("createdAt"),
  orderByDirection: z.enum(["asc", "desc"])
});

const security: SecurityFunction<void> = async (request: Request, params: Params) => {
  await requireAdmin(request);
};

// GET list of formations
export const loader: LoaderFunction = async (
  {
    request,
    params
  }) => {
  await security(request, params);


  const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema);

  const formationsPaginatedObjectApiObject = await getPseFormations(page, pageSize, orderBy, orderByDirection);

  return json(paginateEntityToApiObject(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto));
};

// POST
export const action: ActionFunction = async ({ request, params }) => {
  await security(request, params);

  return namedAction(request, params, {
    postAction
  });

};

async function postAction(request: Request, params: Params<string>) {
  const data = await request.json();

  // TODO: use zod to map data
  const formationPutDto: PseFormationPostDto = dataToPseFormationPostDto(data);

  const createdApiObject = await createPseFormation(pseFormationPostDtoToApiObject(formationPutDto));

  return json(pseFormationApiObjectToDto(createdApiObject));
}
