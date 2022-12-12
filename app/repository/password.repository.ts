import { prisma } from "~/db.server";
import type { UserPasswordTokenApiObject } from "~/apiobject/passwordrecovery.apiobject";
import type { UserPasswordTokenEntity } from "~/apiobject/entity";

export async function createUserPasswordTokenEntity(
  userPasswordTokenApiObject: UserPasswordTokenApiObject
): Promise<UserPasswordTokenEntity> {
  const userPasswordTokenEntity = await prisma.userPasswordToken.create({
    data: {
      userId: userPasswordTokenApiObject.userId,
			token: userPasswordTokenApiObject.token,
			tokenExpirationDate: userPasswordTokenApiObject.tokenExpirationDate,
    },
  });

  return userPasswordTokenEntity
}

export async function getUserPasswordTokenEntity(
  token: string
): Promise<Optional<UserPasswordTokenEntity>> {
  const userPasswordTokenEntity = await prisma.userPasswordToken.findUnique({
    where: {
      token,
    },
  });

  return userPasswordTokenEntity
}

export async function removeUserPasswordTokenEntity(
  id: string
): Promise<Optional<UserPasswordTokenEntity>> {
  const userPasswordTokenEntity = await prisma.userPasswordToken.delete({
    where: {
      id,
    },
  });

  return userPasswordTokenEntity
}