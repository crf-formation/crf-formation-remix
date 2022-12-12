// we want to suffix our entities with "Entity".
// prisma does not handle it yet so we trick here to export with the "Entity" suffic.
// issue: https://github.com/prisma/prisma/issues/9816
export type {
  UserPasswordToken as UserPasswordTokenEntity,
  User as UserEntity,
	Password as PasswordEntity
} from "@prisma/client";
