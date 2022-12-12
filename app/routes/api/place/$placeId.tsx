import type { LoaderFunction} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { placeApiObjectToDto } from "~/mapper/place.mapper";
import { findPlaceById } from "~/services/place.server";
import { requireAdmin } from "~/services/session.server";

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	invariant(params.placeId, `Missing placeId parameter`)

	await requireAdmin(request)

	const formationApiObject = await findPlaceById(params.placeId)
	
	if (!formationApiObject) {
		throw new Error(`Formation not found: ${params.placeId}`);
	}

  return json(placeApiObjectToDto(formationApiObject));
};
