import type { UserPasswordTokenApiObject } from "~/apiobject/passwordrecovery.apiobject";
import { v4 as uuid } from "uuid";
import { addDays } from 'date-fns'
import { PASSWORD_CREATION_EXPIRATION_IN_DAYS } from "~/constants/index.server";
import { createUserPasswordTokenEntity, getUserPasswordTokenEntity, removeUserPasswordTokenEntity } from "~/repository/password.repository";
import { UserPasswordTokenEntity } from "~/apiobject/entity";
import { findUserEntityById, updateUserEntityPassword } from "~/repository/user.repository";

export async function askForPasswordRecovery(
  email: string
) {
  return null
}

export async function recoverPassword(
  // RecoverPasswordPropsDto
  email: string,
  token: string,
  password: string
) {
	return null
}

export async function askForPasswordCreation(
  userId: string
) {
  const userPasswordTokenApiObject: UserPasswordTokenApiObject = {
    userId,
    token: uuid(),
    tokenExpirationDate: addDays(new Date(), PASSWORD_CREATION_EXPIRATION_IN_DAYS),
  }

  const userPasswordTokenEntity = await createUserPasswordTokenEntity(userPasswordTokenApiObject)

  // TODO: send email
  console.info("Created token: " + userPasswordTokenEntity.token)
  console.info(`http://localhost:4242/create-password/${userPasswordTokenEntity.token}`)
}

export async function verifyTokenIsValid(
  token: string,
) {
  // 1- find token
  const userPasswordTokenEntity: Optional<UserPasswordTokenEntity> = await getUserPasswordTokenEntity(token)
  if (!userPasswordTokenEntity) {
    throw new Error("Token not found")
  }

  // TODO:
  // 
  // throw new Error("Le token a expiré. Vous pouvez demander une réinitialisation de mot de passe")
  // -> TODO: redirect to password-recovery
}

export async function createPassword(
  email: string,
  token: string,
  password: string
) {
  // 1- find token
  const userPasswordTokenEntity: Optional<UserPasswordTokenEntity> = await getUserPasswordTokenEntity(token)
  if (!userPasswordTokenEntity) {
    throw new Error("Token not found")
  }

  // TODO:
  // 
  // throw new Error("Le token a expiré. Vous pouvez demander une réinitialisation de mot de passe")
  // -> TODO: redirect to password-recovery

  // security verify email
  const userEntity = await findUserEntityById(userPasswordTokenEntity.userId);
  if (!userEntity) {
    throw new Error("User not found");
  }
  if (email != userEntity.email) {
    throw new Error("Email is not matching");
  }

  // 2- create password
  await updateUserEntityPassword(userPasswordTokenEntity.userId, password)


  // 3- remove token
  await removeUserPasswordTokenEntity(userPasswordTokenEntity.id)

	return null
}
