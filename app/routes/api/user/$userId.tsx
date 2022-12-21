import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { z } from "zod";
import type { SecurityFunction } from "~/constants/remix";
import type { UserPutDto } from "~/dto/user.dto";
import { dataToUserPutDto, userApiObjectToDto, userPutDtoToApiObject } from "~/mapper/user.mapper";
import { requireAdmin } from "~/services/session.server";
import { findUserById, updateUser } from "~/services/user.server";
import { namedAction } from "~/utils/named-actions";
import { getParamsOrFail } from "~/utils/remix.params";

const ParamsSchema = z.object({
  userId: z.string(),
})

// GET a user
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	await security(request, params)

	const { userId } = getParamsOrFail(params, ParamsSchema)

	const userApiObject = await findUserById(userId)
	
	if (!userApiObject) {
		throw new Error(`User not found: ${userId}`);
	}

  return json(userApiObjectToDto(userApiObject));
};

// POST, PUT, PATCH, or DELETE
export const action: ActionFunction = async ({ request, params }) => {
	await security(request, params)

	return namedAction(request, params, {
		putAction
	})
};

const security: SecurityFunction<{}> = async (request: Request, params: Params) => {
	await requireAdmin(request)

	return {}
}


async function putAction(request: Request, params: Params<string>) {
	const { userId } = getParamsOrFail(params, ParamsSchema)

	const data = await request.json();

	// TODO: use zod to map data
	const userPutDto: UserPutDto = dataToUserPutDto(data);

	const updatedApiObject = await updateUser(userId, userPutDtoToApiObject(userPutDto));

  return json(userApiObjectToDto(updatedApiObject));
}