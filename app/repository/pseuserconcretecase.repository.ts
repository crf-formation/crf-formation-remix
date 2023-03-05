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
	console.log({ userConcreteCases
	})
  return await prisma.$transaction<PseUserConcreteCaseEntity>(async (tx) => {
		return Promise.all(userConcreteCases.map(async userConcreteCase => {
			const pseUserConcreteCaseData: PseUserConcreteCaseCompetenceEntity = {
				role: userConcreteCase.role,
				selected: true,
				
				userId: userConcreteCase.userId,
				pseSituationConcreteCaseGroupId : userConcreteCase.pseSituationConcreteCaseGroupId,
			}

			const pseUserConcreteCaseEntity = await tx.pseUserConcreteCase.upsert({
				where: {
					userId_pseSituationConcreteCaseGroupId: {
						userId: pseUserConcreteCaseData.userId,
						pseSituationConcreteCaseGroupId: pseUserConcreteCaseData.pseSituationConcreteCaseGroupId,
					}
				},
				update: pseUserConcreteCaseData,
				create: pseUserConcreteCaseData,
			});

			// -- add competences
			return Promise.all(userConcreteCase.grades.map(async gradeEvaluation => {
				const pseUserConcreteCaseCompetenceData = {
					pseUserConcreteCaseId: pseUserConcreteCaseEntity.id,
					pseCompetenceId: gradeEvaluation.pseCompetenceId,
					grade: gradeEvaluation.grade
				}

				console.log({
					pseUserConcreteCaseCompetenceData
				})

				const pseUserConcreteCaseCompetenceEntity = await tx.pseUserConcreteCaseCompetence.upsert({
					where: {
						pseUserConcreteCaseId_pseCompetenceId: {
							pseUserConcreteCaseId: pseUserConcreteCaseCompetenceData.pseUserConcreteCaseId,
							pseCompetenceId: pseUserConcreteCaseCompetenceData.pseCompetenceId
						}
					},
					update: pseUserConcreteCaseCompetenceData,
					create: pseUserConcreteCaseCompetenceData,
				})

				console.log({ pseUserConcreteCaseCompetenceEntity })

			}));
			
		}))
  })
}