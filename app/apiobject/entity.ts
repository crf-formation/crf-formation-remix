// we want to suffix our entities with "Entity".
// prisma does not handle it yet so we trick here to export with the "Entity" suffic.
// issue: https://github.com/prisma/prisma/issues/9816
export type {
  User as UserEntity,
  Password as PasswordEntity,
  UserPasswordToken as UserPasswordTokenEntity,
  Place as PlaceEntity,
  PseFormation as PseFormationEntity,
  PseModule as PseModuleEntity,
  UserOnPseFormation as UserOnPseFormationEntity,
  PseUserPreparatoryWork as PseUserPreparatoryWorkEntity,
  PseTechnique as PseTechniqueEntity,
  PseUserTechnique as PseUserTechniqueEntity,
} from "@prisma/client";
