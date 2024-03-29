import type { PseUserConcreteCaseCompetenceEntity, PseUserConcreteCaseEntity } from "~/entity";
import { prisma } from "~/entity/db.server";
import type { PseUserConcreteCasePostEntity } from "~/entity/pseuserconcretecase.entity";

const includeForUser = {
  user: false,
  pseSituationConcreteCaseGroup: {
    include: {
      pseConcreteCaseSituation: { include: { pseConcreteCaseType: true } },
      pseConcreteCaseGroup: true
    }
  },
  competences: {
    include: { pseCompetence: true }
  }
};

const includeForGroup = {
  user: false,
  pseSituationConcreteCaseGroup: false,
  competences: {
    include: { pseCompetence: true }
  }
};

export async function getPseUserConcreteCasesEntities(formationId: string, userId: string): Promise<PseUserConcreteCaseEntity[]> {
  return prisma.pseUserConcreteCase.findMany({
    where: {
      userId,
      pseSituationConcreteCaseGroup: {
        pseConcreteCaseSituation: {
          pseConcreteCaseSession: {
            formationId
          }
        }
      }
    },
    include: includeForUser
  });
}


export async function getSelectedPseUserConcreteCaseEntities(formationId: string, userId: string): Promise<PseUserConcreteCaseEntity[]> {
  return prisma.pseUserConcreteCase.findMany({
    where: {
      userId,
      selected: true,
      pseSituationConcreteCaseGroup: {
        pseConcreteCaseSituation: {
          pseConcreteCaseSession: {
            formationId
          }
        }
      }
    },
    include: includeForUser
  });
}


export async function getPseUserConcreteCasesForGroupAndSituationEntities(
  pseConcreteCaseGroupId: string,
  pseConcreteCaseSituationId: string
): Promise<Array<PseUserConcreteCaseEntity>> {
  return prisma.pseUserConcreteCase.findMany({
    where: {
      pseSituationConcreteCaseGroup: {
        pseConcreteCaseGroup: {
          id: pseConcreteCaseGroupId
        },
        pseConcreteCaseSituation: {
          id: pseConcreteCaseSituationId
        }
      }
    },
    include: includeForGroup
  });
}

export async function createOrUpdatePseUserConcreteCases(
  userConcreteCases: Array<PseUserConcreteCasePostEntity>
): Promise<Array<PseUserConcreteCaseEntity>> {
  return prisma.$transaction<Array<PseUserConcreteCaseEntity>>(async (tx)=> {

    return await Promise.all(userConcreteCases.map(async userConcreteCase => {
      const pseUserConcreteCaseData = {
        role: userConcreteCase.role,
        selected: true,

        userId: userConcreteCase.userId,
        pseSituationConcreteCaseGroupId: userConcreteCase.pseSituationConcreteCaseGroupId
      };

      const pseUserConcreteCaseEntity = await tx.pseUserConcreteCase.upsert({
        where: {
          userId_pseSituationConcreteCaseGroupId: {
            userId: pseUserConcreteCaseData.userId,
            pseSituationConcreteCaseGroupId: pseUserConcreteCaseData.pseSituationConcreteCaseGroupId
          }
        },
        update: pseUserConcreteCaseData,
        create: pseUserConcreteCaseData
      });

      // -- add competences
      await Promise.all(userConcreteCase.grades.map(async gradeEvaluation => {
        const pseUserConcreteCaseCompetenceData = {
          pseUserConcreteCaseId: pseUserConcreteCaseEntity.id,
          pseCompetenceId: gradeEvaluation.pseCompetenceId,
          grade: gradeEvaluation.grade
        };

        return tx.pseUserConcreteCaseCompetence.upsert({
          where: {
            pseUserConcreteCaseId_pseCompetenceId: {
              pseUserConcreteCaseId: pseUserConcreteCaseCompetenceData.pseUserConcreteCaseId,
              pseCompetenceId: pseUserConcreteCaseCompetenceData.pseCompetenceId
            }
          },
          update: pseUserConcreteCaseCompetenceData,
          create: pseUserConcreteCaseCompetenceData
        });
      }));

      return tx.pseUserConcreteCase.findFirstOrThrow({
        where: {
          id: pseUserConcreteCaseEntity.id
        }
      });
    }));

  });
}