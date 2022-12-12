import type { UserApiObject, UserAuthTokenApiObject, UserPostApiObject, UserPutApiObject } from '~/apiobject/user.apiobject';
import { createUserEntity, findUserEntityByEmail, findUserEntityByEmailAndPassword, findUserEntityById, findUsers } from '~/repository/user.repository';
import { badRequest } from '~/utils/responses';
import { userEntityToUserApiObject } from "~/mapper/user.mapper";
import { USER_PASSWORD_MIN_LENGTH } from '~/constants';
import { paginateEntityToApiObject } from '~/mapper/abstract.mapper';
import { PaginateObject } from '~/constants/types';

export async function updateUser(userId: string, body: UserPutApiObject) {
  return null
}

export async function createUser(userPostApiObject: UserPostApiObject): Promise<UserApiObject> {
  const userEntity = await createUserEntity(userPostApiObject);
  return userEntityToUserApiObject(userEntity)
}

export async function updatePassword(userId: string, password: string) {
  // TODO:
  throw badRequest("not implemented")
}

export async function findUserById(id: string): Promise<Optional<UserApiObject>> {
  const userEntity = await findUserEntityById(id);
  if (!userEntity) {
    return null
  }
  return userEntityToUserApiObject(userEntity)
}

export async function verifyLogin(email: string, password: string): Promise<UserAuthTokenApiObject> {
  const userEntity = await findUserEntityByEmailAndPassword(email, password);
  if (!userEntity) {
    throw new Error("Invalid user");
  }

	return {
    user: userEntityToUserApiObject(userEntity)
  }
}

export async function findUserByEmail(email: string): Promise<Optional<UserApiObject>> {
  const userEntity = await findUserEntityByEmail(email);
  if (!userEntity) {
    return null
  }
  return userEntityToUserApiObject(userEntity)
}

export function validateUserEmail(email: unknown): email is string {
  return typeof email === "string" && email.length >= USER_PASSWORD_MIN_LENGTH && email.includes("@");
}

export async function getUsers(page?: number, limit?: number): Promise<PaginateObject<UserApiObject>> {
  const userEntities = await findUsers(page, limit)
  return paginateEntityToApiObject(userEntities, userEntityToUserApiObject) 
}

//
// user me
//

export async function getUserMe(userId: string) {
  const userEntity = await findUserById(userId)
  if (!userEntity) {
    throw new Error(`User ${userId} could not be found`)
  }
  return userEntityToUserApiObject(userEntity)
}
