// we want to suffix our entities with "Entity".
// prisma does not handle it yet so we trick here to export with the "Entity" suffic.
// issue: https://github.com/prisma/prisma/issues/9816
export type {
  User as UserEntity,
	Password as PasswordEntity,
  UserPasswordToken as UserPasswordTokenEntity,
  Place as PlaceEntity,
  PseGlobalFormation as PseGlobalFormationEntity,
  PseGlobalModule as PseGlobalModuleEntity,
  UserOnPseGlobalFormation as UserOnPseGlobalFormationEntity,
  PseGlobalUserPreparatoryWork as PseGlobalUserPreparatoryWorkEntity,
} from "@prisma/client";
