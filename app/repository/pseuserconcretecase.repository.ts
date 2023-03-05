import type { PseUserConcreteCaseCompetenceEntity, PseUserConcreteCaseEntity } from '~/entity';
import { prisma } from '~/entity/db.server';
import type { PseUserConcreteCasePostEntity } from '~/entity/pseuserconcretecase.entity';

const includeForUser = {
	user: false,
	pseSituationConcreteCaseGroup: true,
}

const includeForGroup = {
	user: false,
	pseSituationConcreteCaseGroup: false,
}


export async function getPseUserConcreteCasesEntities(formationId: string, userId: string): Promise<PseUserConcreteCaseEntity[]>  {

	return await prisma.pseUserConcreteCase.findMany({
    where: {
      userId,
      pseSituationConcreteCaseGroup: {
        pseConcreteCaseSession: {
          formationId,
        },
      },
    },
    include: includeForUser,
  });
}


export async function getSelectedPseUserConcreteCaseEntities(formationId: string, userId: string): Promise<PseUserConcreteCaseEntity[]>  {

	return await prisma.pseUserConcreteCase.findMany({
		where: {
			userId,
			selected: true,
			pseSituationConcreteCaseGroup: {
        pseConcreteCaseSession: {
          formationId,
        },
      },
		},
		include: includeForUser
	})
}


export async function getPseUserConcreteCasesForGroupAndSituation(
	formationId: string, 
	concreteCaseGroupId: string,
	concreteCaseSituationId: string
): Promise<PseUserConcreteCaseEntity[]> {
	return await prisma.pseUserConcreteCase.findMany({
    where: {
      pseSituationConcreteCaseGroup: {
        id: concreteCaseGroupId,

        where: {
            concreteCaseSession: {
              formationId,
          },
        },
      },
    },
    include: includeForGroup,
  });
}

export async function createOrUpdatePseUserConcreteCases(
	userConcreteCases: Array<PseUserConcreteCasePostEntity>,
): Promise<PseUserConcreteCaseEntity> {

  return await prisma.$transaction<PseUserConcreteCaseEntity>(async (tx) => {
		return Promise.all(userConcreteCases.map(async userConcreteCase => {
			const pseUserConcreteCase: PseUserConcreteCaseCompetenceEntity = {
				role: userConcreteCase.role,
				selected: true,
				competences: userConcreteCase.grades.map(gradeEvaluation => ({
					pseCompetenceId: gradeEvaluation.pseCompetenceId,
					grade: gradeEvaluation.grade,
				}))
			}

			await tx.pseUserConcreteCase.upsert({
				where: {
					userId: userConcreteCase.userId,
					concreteCaseTypeId: userConcreteCase.pseConcreteCaseTypeId,
					concreteCaseGroupId: userConcreteCase.pseConcreteCaseGroupId,
				},
				update: pseUserConcreteCase,
				create: pseUserConcreteCase,
			});
		}))
  })
}