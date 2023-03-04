import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { placeApiObjectToDto } from "~/mapper/place.mapper";
import { getPlaces } from "~/service/place.server";
import { requireAdmin } from "~/service/session.server";
import { getSearchParamsOrFail } from "~/util/remix.params";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
	orderBy: z.string().default("createdAt"),
	orderByDirection: z.enum([ 'asc', 'desc']),
})

// GET list of formations
export async function loader({ request, params }: LoaderArgs) {
	await requireAdmin(request)

	const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema)


	const formationsPaginatedObjectApiObject = await getPlaces(page, pageSize, orderBy, orderByDirection)

  return json(paginateEntityToApiObject(formationsPaginatedObjectApiObject, placeApiObjectToDto));
};
