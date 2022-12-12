import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { UserPutDto } from "~/dto/user.dto";
import { dataToUserPutDto, userApiObjectToUserDto, userPutDtoToUserPutApiObject } from "~/mapper/user.mapper";
import { requireAdmin } from "~/services/session.server";
import { findUserById, updateUser } from "~/services/user.server";

// GET a user
export const loader: LoaderFunction = async ({
  request,
	params
}) => {
	invariant(params.userId, `Missing userId parameter`)

	await requireAdmin(request)

	const userApiObject = await findUserById(params.userId)
	
	if (!userApiObject) {
		throw new Error(`User not found: ${params.userId}`);
	}

  return json(userApiObjectToUserDto(userApiObject));
};

// POST, PUT, PATCH, or DELETE
export const action: ActionFunction = async ({ request, params }) => {
	if (request.method === 'PUT') {
		return putAction(request, params)
	}
	if (request.method === 'POST') {
		// not handled yet
		// return putAction(request, params)
	}
};


async function putAction(request: Request, params: Params<string>) {
	invariant(params.userId, `Missing userId parameter`)
	await requireAdmin(request)

	const data = await request.json();

	const userPutDto: UserPutDto = dataToUserPutDto(data);

	const updatedApiObject = await updateUser(params.userId, userPutDtoToUserPutApiObject(userPutDto));

  return json(userApiObjectToUserDto(updatedApiObject));
}