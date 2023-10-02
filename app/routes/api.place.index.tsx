import { json } from "@remix-run/node";
import { z } from "zod";
import { getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { placeApiObjectToDto } from "~/mapper/place.mapper";
import { getPlaces } from "~/service/place.server";
import { requireLoggedInRequestContext } from "~/service/session.server";
import { preAuthorize } from "~/service/security.server";
import { Permission } from "~/constant/permission";
import type { LoaderArgs } from "@remix-run/server-runtime";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
  orderBy: z.string().default("createdAt"),
  orderByDirection: z.enum(["asc", "desc"])
});

// GET list of formations
export async function loader({ request, params }: LoaderArgs) {
  const requestContext = await requireLoggedInRequestContext(request);

  preAuthorize(
    requestContext.permissions,
    Permission.ADMIN
  );

  const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema);


  const formationsPaginatedObjectApiObject = await getPlaces(page, pageSize, orderBy, orderByDirection);

  return json(paginateEntityToApiObject(formationsPaginatedObjectApiObject, placeApiObjectToDto));
};
