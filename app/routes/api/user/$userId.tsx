import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { UserPutDto } from "~/dto/user.dto";
import { dataToUserPutDto, userApiObjectToUserDto, userPutDtoToUserPutApiObject } from "~/mapper/user.mapper";
import { requireAdmin } from "~/services/session.server";
import { findUserById, updateUser } from "~/services/user.server";
import { getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  userId: z.string(),
})

// GET a user
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	const { userId } = getParamsOrFail(params, ParamsSchema)

	await requireAdmin(request)

	const userApiObject = await findUserById(userId)
	
	if (!userApiObject) {
		throw new Error(`User not found: ${userId}`);
	}

  return json(userApiObjectToUserDto(userApiObject));
};

// POST, PUT, PATCH, or DELETE
export const action: ActionFunction = async ({ request, params }) => {
	switch (request.method) {
    case "PUT":
      return await putAction(request, params);
  }
};

async function putAction(request: Request, params: Params<string>) {
	const { userId } = getParamsOrFail(params, ParamsSchema)

	await requireAdmin(request)

	const data = await request.json();

	const userPutDto: UserPutDto = dataToUserPutDto(data);

	const updatedApiObject = await updateUser(userId, userPutDtoToUserPutApiObject(userPutDto));

  return json(userApiObjectToUserDto(updatedApiObject));
}