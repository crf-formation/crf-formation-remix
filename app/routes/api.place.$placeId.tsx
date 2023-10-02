import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { z } from "zod";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { placeApiObjectToDto } from "~/mapper/place.mapper";
import { findPlaceById } from "~/service/place.server";
import { requireLoggedInRequestContext } from "~/service/session.server";
import { preAuthorize } from "~/service/security.server";
import { Permission } from "~/constant/permission";

const ParamsSchema = z.object({
  placeId: z.string()
});

// GET a formation
export async function loader({ request, params }: LoaderArgs) {
  const requestContext = await requireLoggedInRequestContext(request);

  preAuthorize(
    requestContext.permissions,
    Permission.ADMIN
  );

  const { placeId } = getParamsOrFail(params, ParamsSchema);
  const formationApiObject = await findPlaceById(placeId);

  if (!formationApiObject) {
    throw new Error(`Formation not found: ${placeId}`);
  }

  return json(placeApiObjectToDto(formationApiObject));
};
