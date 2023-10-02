import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { UserPutDto } from "~/dto/user.dto";
import type { SecurityFunction } from "~/helper/remix.helper";
import { getParamsOrFail } from "~/helper/remix.params.helper";
import { dataToUserPutDto, userApiObjectToDto, userPutDtoToApiObject } from "~/mapper/user.mapper";
import { preAuthorize } from "~/service/security.server";
import { findUserById, updateUser } from "~/service/user.server";
import { namedAction } from "~/util/named-actions";
import { Permission } from "~/constant/permission";
import { requireLoggedInRequestContext } from "~/service/session.server";

const ParamsSchema = z.object({
  userId: z.string()
});

const security: SecurityFunction<{
  userApiObject: UserApiObject;
}> = async (request: Request, params: Params) => {
  const requestContext = await requireLoggedInRequestContext(request);

  preAuthorize(
    requestContext.permissions,
    Permission.ADMIN
  );

  const { userId } = getParamsOrFail(params, ParamsSchema);

  const userApiObject = await findUserById(userId);

  if (!userApiObject) {
    throw new Error(`User not found: ${userId}`);
  }
  return {
    userApiObject
  };
};

// GET a user
export const loader: LoaderFunction = async (
  {
    request,
    params
  }) => {
  const { userApiObject } = await security(request, params);

  return json(userApiObjectToDto(userApiObject));
};

// POST, PUT, PATCH, or DELETE
export const action: ActionFunction = async ({ request, params }) => {
  return namedAction(request, params, {
    putAction
  });
};


async function putAction(request: Request, params: Params<string>) {
  const { userApiObject } = await security(request, params);

  const data = await request.json();
  // TODO: use zod to map data
  const userPutDto: UserPutDto = dataToUserPutDto(data);

  const updatedApiObject = await updateUser(userApiObject.id, userPutDtoToApiObject(userPutDto));

  return json(userApiObjectToDto(updatedApiObject));
}