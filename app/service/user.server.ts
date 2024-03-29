import type {
  UserApiObject,
  UserAuthTokenApiObject,
  UserMeApiObject,
  UserPostApiObject,
  UserPutApiObject
} from "~/apiobject/user.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constant/types";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { userEntityToApiObject, userEntityToMeApiObject } from "~/mapper/user.mapper";
import {
  createUserEntity,
  findUserEntities,
  findUserEntityByEmail,
  findUserEntityByEmailAndPassword,
  findUserEntityById,
  getFormationStudentsEntities,
  getFormationTeachersEntities,
  searchFormationStudentsEntities,
  searchFormationTeachersEntities,
  updateUserEntity,
  updateUserEntityPassword
} from "~/repository/user.repository";

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
  await updateUserEntityPassword(userId, password);
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
): Promise<Optional<UserAuthTokenApiObject>> {
  const userEntity = await findUserEntityByEmailAndPassword(email, password);
  if (!userEntity) {
    return null;
  }

  return {
    user: userEntityToApiObject(userEntity)
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
  // TODO: remove, use zod
  return (
    typeof email === "string" &&
    email.includes("@")
  );
}

export async function getUsers(
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserApiObject>> {
  const userEntities = await findUserEntities(page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(userEntities, userEntityToApiObject);
}

export async function getFormationStudents(
  formationId: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserApiObject>> {
  const userEntities = await getFormationStudentsEntities(formationId, page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(userEntities, userEntityToApiObject);
}

export async function searchFormationStudents(
  formationId: string,
  query: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserApiObject>> {
  const userEntities = await searchFormationStudentsEntities(formationId, query, page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(userEntities, userEntityToApiObject);
}


export async function getFormationTeachers(
  formationId: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserApiObject>> {
  const userEntities = await getFormationTeachersEntities(formationId, page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(userEntities, userEntityToApiObject);
}

export async function searchFormationTeachers(
  formationId: string,
  query: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserApiObject>> {
  const userEntities = await searchFormationTeachersEntities(formationId, query, page, pageSize, orderBy, orderByDirection);
  return paginateEntityToApiObject(userEntities, userEntityToApiObject);
}

//
// user me
//

export async function getUserMe(userId: string): Promise<UserMeApiObject> {
  const userEntity = await findUserEntityById(userId);
  if (!userEntity) {
    throw new Error(`User ${userId} could not be found`);
  }
  return userEntityToMeApiObject(userEntity);
}
