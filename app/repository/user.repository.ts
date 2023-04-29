import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import type { UserPostApiObject, UserPutApiObject } from "~/apiobject/user.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constant/types";
import type { PasswordEntity, UserEntity } from "~/entity";
import { prisma } from "~/entity/db.server";
import { createPaginateObject } from "./abstract.repository";

export async function createUserEntity(
  userPostApiObject: UserPostApiObject
): Promise<UserEntity> {
  // default random password
  const hashedPassword = await bcrypt.hash(uuid(), 10);

  const userEntity = await prisma.user.create({
    data: {
      ...userPostApiObject,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });

  return userEntity;
}

export async function updateUserEntity(
  id: string,
  userPutApiObject: UserPutApiObject
): Promise<UserEntity> {
  const userEntity = await prisma.user.update({
    data: userPutApiObject,
    where: {
      id
    }
  });

  return userEntity;
}

export async function updateUserEntityPassword(
  userId: string,
  password: string
): Promise<PasswordEntity> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const passwordEntity = await prisma.password.update({
    where: {
      userId
    },
    data: {
      hash: hashedPassword
    }
  });

  return passwordEntity;
}

export async function findUserEntityByEmail(
  email: string
): Promise<Optional<UserEntity>> {
  const userEntity = await prisma.user.findUnique({ where: { email } });
  if (!userEntity) {
    return null;
  }
  return userEntity;
}

export async function findUserEntityById(
  id: string
): Promise<Optional<UserEntity>> {
  const userEntity = await prisma.user.findUnique({ where: { id } });
  if (!userEntity) {
    return null;
  }
  return userEntity;
}

export async function findUserEntityByEmailAndPassword(
  email: string,
  password: string
): Promise<Optional<UserEntity>> {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true
    }
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function findUserEntities(
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserEntity>> {
  return await createPaginateObject<UserEntity>({
    model: prisma.user,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {}
  });
}

export async function getFormationStudentsEntities(
  formationId: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserEntity>> {
  // TODO: fix?
  return await createPaginateObject<UserEntity>({
    model: prisma.user,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {
      usersOnPseFormation: {
        every: {
          formationId,
          role: "STUDENT"
        }
      }
    }
  });
}


export async function searchFormationStudentsEntities(
  formationId: string,
  query: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserEntity>> {
  return await createPaginateObject<UserEntity>({
    model: prisma.user,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {
      usersOnPseFormation: {
        every: {
          formationId,
          role: "STUDENT"
        }
      },

      // TODO: if not using sqlite anymore: https://www.prisma.io/docs/concepts/component/prisma-client/full-text-search

      // TODO: real search
      OR: [
        {
          firstName: {
            endsWith: query
            // mode: "insensitive",
          }
        },
        {
          lastName: {
            endsWith: query
            // mode: "insensitive",
          }
        },
        {
          email: {
            endsWith: query
            // mode: "insensitive",
          }
        }
      ]
    }
  });
}


export async function getFormationTeachersEntities(
  formationId: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserEntity>> {
  return await createPaginateObject<UserEntity>({
    model: prisma.user,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {
      usersOnPseFormation: {
        every: {
          formationId,
          role: "TEACHER"
        }
      }
    }
  });
}


export async function searchFormationTeachersEntities(
  formationId: string,
  query: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<UserEntity>> {
  return await createPaginateObject<UserEntity>({
    model: prisma.user,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {
      usersOnPseFormation: {
        every: {
          formationId,
          role: "TEACHER"
        }
      },

      // TODO: if not using sqlite anymore: https://www.prisma.io/docs/concepts/component/prisma-client/full-text-search

      // TODO: real search
      OR: [
        {
          firstName: {
            endsWith: query
            // mode: "insensitive",
          }
        },
        {
          lastName: {
            endsWith: query
            // mode: "insensitive",
          }
        },
        {
          email: {
            endsWith: query
            // mode: "insensitive",
          }
        }
      ]
    }
  });
}

