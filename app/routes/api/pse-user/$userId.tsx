import type { LoaderFunction} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { userOnPseformationApiObjectToDto } from "~/mapper/useronpseformation.mapper";
import { findUserOnPseFormationById } from "~/services/useronpseformation.server";
import { requireAdmin } from "~/services/session.server";

// GET a formation
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	invariant(params.userId, `Missing userId parameter`)

	await requireAdmin(request)

	const formationApiObject = await findUserOnPseFormationById(params.userId)
	
	if (!formationApiObject) {
		throw new Error(`Formation not found: ${params.userId}`);
	}

  return json(userOnPseformationApiObjectToDto(formationApiObject));
};
