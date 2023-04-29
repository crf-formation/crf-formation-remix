import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { placeApiObjectToDto } from "~/mapper/place.mapper";
import { findPlaceById } from "~/service/place.server";
import { requireAdmin } from "~/service/session.server";

const ParamsSchema = z.object({
  placeId: z.string()
});

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const { placeId } = getParamsOrFail(params, ParamsSchema);

  await requireAdmin(request);

  const formationApiObject = await findPlaceById(placeId);

  if (!formationApiObject) {
    throw new Error(`Formation not found: ${placeId}`);
  }

  return json(placeApiObjectToDto(formationApiObject));
};
