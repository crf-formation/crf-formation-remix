import type { UserDto, UserPostDto, UserPutDto } from '~/dto/user.dto';
import { badRequest } from '~/utils/responses';

export async function updateUser(token: string, userId: string, body: UserPutDto) {
  return null
}

export async function createUser(token: string, body: UserPostDto) {
	return null
}

export async function updatePassword(userId: string, password: string) {
  // TODO:
  throw badRequest("not implemented")
}

export async function verifyLogin(
  email: UserDto["email"],
  password: UserDto["password"]
): Promise<null> {
	return null
}

export async function getUserById(token: string, id: UserDto["id"]) {
  return null
}


export function validateUserEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 5 && email.includes("@");
}

//
// user me
//

export async function getUserMe(token: string) {
  return null
}