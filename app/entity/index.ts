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
  PseCompetence as PseCompetenceEntity,
  PseConcreteCaseGroup as PseConcreteCaseGroupEntity,
  PseUserConcreteCaseGroupStudent as PseUserConcreteCaseGroupStudentEntity,
  PseConcreteCaseSession as PseConcreteCaseSessionEntity,
  PseConcreteCaseSituation as PseConcreteCaseSituationEntity,
  PseSituationConcreteCaseGroup as PseSituationConcreteCaseGroupEntity,
  PseUserConcreteCase as PseUserConcreteCaseEntity,
  PseUserConcreteCaseCompetence as PseUserConcreteCaseCompetenceEntity,
  PseConcreteCaseType as PseConcreteCaseTypeEntity,
} from "@prisma/client";
