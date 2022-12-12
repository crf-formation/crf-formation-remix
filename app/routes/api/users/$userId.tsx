import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { userApiObjectToUserDto } from "~/mapper/user.mapper";
import { requireAdmin } from "~/services/session.server";
import { findUserById } from "~/services/user.server";

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

// TODO: handle PUT