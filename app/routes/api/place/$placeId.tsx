import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { placeApiObjectToDto } from "~/mapper/place.mapper";
import { findPlaceById } from "~/services/place.server";
import { requireAdmin } from "~/services/session.server";
import { getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  placeId: z.string(),
})

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { placeId } = getParamsOrFail(params, ParamsSchema)

	await requireAdmin(request)

	const formationApiObject = await findPlaceById(placeId)
	
	if (!formationApiObject) {
		throw new Error(`Formation not found: ${placeId}`);
	}

  return json(placeApiObjectToDto(formationApiObject));
};
