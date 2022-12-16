import type {
  UserApiObject,
  UserAuthTokenApiObject,
  UserPostApiObject,
  UserPutApiObject,
} from "~/apiobject/user.apiobject";
import {
  createUserEntity,
  findUserEntityByEmail,
  findUserEntityByEmailAndPassword,
  findUserEntityById,
  findUsers,
  updateUserEntity,
  updateUserEntityPassword,
} from "~/repository/user.repository";
import { userEntityToApiObject } from "~/mapper/user.mapper";
import { USER_PASSWORD_MIN_LENGTH } from "~/constants";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import type { OrderByDirection, PaginateObject } from "~/constants/types";

export async function updateUser(
  userId: string,
  userPutApiObject: UserPutApiObject
) {
  const userEntity = await updateUserEntity(userId, userPutApiObject);
  return userEntityToApiObject(userEntity);
}

export async function createUser(
  userPostApiObject: UserPostApiObject
): Promise<UserApiObject> {
  const userEntity = await createUserEntity(userPostApiObject);
  return userEntityToApiObject(userEntity);
}

export async function updatePassword(userId: string, password: string) {
  // 2- update password
  await updateUserEntityPassword(userId, password)
}

export async function findUserById(
  id: string
): Promise<Optional<UserApiObject>> {
  const userEntity = await findUserEntityById(id);
  if (!userEntity) {
    return null;
  }
  return userEntityToApiObject(userEntity);
}

export async function verifyLogin(
  email: string,
  password: string
): Promise<UserAuthTokenApiObject> {
  const userEntity = await findUserEntityByEmailAndPassword(email, password);
  if (!userEntity) {
    throw new Error("Invalid user");
  }

  return {
    user: userEntityToApiObject(userEntity),
  };
}

export async function findUserByEmail(
  email: string
): Promise<Optional<UserApiObject>> {
  const userEntity = await findUserEntityByEmail(email);
  if (!userEntity) {
    return null;
  }
  return userEntityToApiObject(userEntity);
}

export function validateUserEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.length >= USER_PASSWORD_MIN_LENGTH &&
    email.includes("@")
  );
}

export async function getUsers(
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserApiObject>> {
  const userEntities = await findUsers(page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(userEntities, userEntityToApiObject);
}

//
// user me
//

export async function getUserMe(userId: string): Promise<UserApiObject> {
  const userEntity = await findUserById(userId);
  if (!userEntity) {
    throw new Error(`User ${userId} could not be found`);
  }
  return userEntityToApiObject(userEntity);
}
