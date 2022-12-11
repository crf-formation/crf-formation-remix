import type { UserAuthToken, UserDto, UserPostDto, UserPutDto } from '~/dto/user.dto';
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
): Promise<UserAuthToken> {
  // TODO: fixture - remove me
	return {
    user: await getUserById("", "1"),
    token: "dewhdewih"
  }
}

export async function getUserById(token: string, id: UserDto["id"]): Promise<UserDto> {
  // TODO: fixture - remove me
  return { 
    id,
    firstName: "Loïc",
    lastName: "Lefloch",
    email: "test@test.com",
    state: "ENABLED",
    creationDate: "",
    modificationDate: "",
  }
}


export function validateUserEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 5 && email.includes("@");
}

//
// user me
//

export async function getUserMe(token: string) {
  // TODO: fixture - remove me
  return await getUserById("", "1")
}