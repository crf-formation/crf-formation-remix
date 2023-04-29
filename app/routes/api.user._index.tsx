import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getSearchParamsOrFail } from "~/helper/remix.params.helper";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userApiObjectToDto } from "~/mapper/user.mapper";
import { requireAdmin } from "~/service/session.server";
import { getUsers } from "~/service/user.server";

const URLSearchParamsSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(25),
  orderBy: z.string().default("createdAt"),
  orderByDirection: z.enum(["asc", "desc"])
});

const security: SecurityFunction<void> = async (request: Request, params: Params) => {
  await requireAdmin(request);
};

// GET list of users
export const loader: LoaderFunction = async (
  {
    request,
    params
  }) => {
  await security(request, params);

  const { page, pageSize, orderBy, orderByDirection } = getSearchParamsOrFail(request, URLSearchParamsSchema);

  const usersPaginatedObjectApiObject = await getUsers(page, pageSize, orderBy, orderByDirection);

  return json(paginateEntityToApiObject(usersPaginatedObjectApiObject, userApiObjectToDto));
};
// No POST, must use /join action