import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { PseFormationPostDto } from "~/dto/pseformation.dto";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { dataToPseFormationPostDto, pseFormationApiObjectToDto, pseFormationPostDtoToApiObject } from "~/mapper/pseformation.mapper";
import { createPseFormation, getPseFormations } from "~/services/pseformation.server";
import { requireAdmin } from "~/services/session.server";
import { getSearchParamsOrFail } from "~/utils/remix.params";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
	orderBy: z.string().default("createdAt"),
	orderByDirection: z.enum([ 'asc', 'desc']),
})

// GET list of formations
export const loader: LoaderFunction = async ({
  request,
}) => {
	await requireAdmin(request)

	const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema)

	const formationsPaginatedObjectApiObject = await getPseFormations(page, pageSize, orderBy, orderByDirection)

  return json(paginateEntityToApiObject(formationsPaginatedObjectApiObject, pseFormationApiObjectToDto));
};

// POST
export const action: ActionFunction = async ({ request, params }) => {
	switch (request.method) {
    case "POST":
      return await postAction(request, params);
  }
};

async function postAction(request: Request, params: Params<string>) {
	await requireAdmin(request)

	const data = await request.json();

	const formationPutDto: PseFormationPostDto = dataToPseFormationPostDto(data);

	const createdApiObject = await createPseFormation(pseFormationPostDtoToApiObject(formationPutDto));

  return json(pseFormationApiObjectToDto(createdApiObject));
}
