// we want to suffix our entities with "Entity".
// prisma does not handle it yet so we trick here to export with the "Entity" suffic.
// issue: https://github.com/prisma/prisma/issues/9816
export type {
  Password as PasswordEntity,
  Place as PlaceEntity,
  PseCompetence as PseCompetenceEntity,
  PseConcreteCaseGroup as PseConcreteCaseGroupEntity,
  PseConcreteCaseSession as PseConcreteCaseSessionEntity,
  PseConcreteCaseSituation as PseConcreteCaseSituationEntity,
  PseConcreteCaseType as PseConcreteCaseTypeEntity,
  PseFormation as PseFormationEntity,
  PseModule as PseModuleEntity,
  PseSituationConcreteCaseGroup as PseSituationConcreteCaseGroupEntity,
  PseTechnique as PseTechniqueEntity,
  PseUserConcreteCaseCompetence as PseUserConcreteCaseCompetenceEntity,
  PseUserConcreteCase as PseUserConcreteCaseEntity,
  PseUserConcreteCaseGroupStudent as PseUserConcreteCaseGroupStudentEntity,
  PseUserPreparatoryWork as PseUserPreparatoryWorkEntity,
  PseUserTechnique as PseUserTechniqueEntity,
  User as UserEntity,
  UserOnPseFormation as UserOnPseFormationEntity,
  UserPasswordToken as UserPasswordTokenEntity
} from "@prisma/client";

