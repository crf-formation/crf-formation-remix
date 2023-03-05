import { sample } from 'lodash';
import type { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';
import type { PseUserPreparatoryWorkApiObject } from '~/apiobject/pseformationpreparatorywork.apiobject';
import type { PseUserConcreteCaseApiObject, PseUserConcreteCaseCompetenceApiObject } from '~/apiobject/pseuserconcretecase.apiobject';
import type { PseUserTechniqueApiObject } from '~/apiobject/pseusertechnique.apiobject';
import { getPseCompetences } from '~/service/psecompetence.server';
import { getPreparatoryWorksForUser } from '~/service/pseformationpreparatorywork.server';
import { getPseModules } from '~/service/psemodule.server';
import { getSelectedPseUserConcreteCases } from '~/service/pseuserconcretecase.server';
import { getPseUserTechniquesForUser } from '~/service/pseusertechniques.server';
import type { PseModuleApiObject } from '../apiobject/psemodule.apiobject';
import type { PseConcreteCaseCompetenceSummaryApiObject, PseUserSummaryApiObject, PseUserSummaryConcreteCaseApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from '../apiobject/pseusersummary.apiobject';

/**
 * Load the data and build the PseUserSummaryApiObject data.
 */
export async function loadAndBuildPseUserSummary(
	formationId: string,
	userId: string
): Promise<PseUserSummaryApiObject> {
	const preparatoryWorks: Array<PseUserPreparatoryWorkApiObject> = await getPreparatoryWorksForUser(formationId, userId);
	const userTechniques: Array<PseUserTechniqueApiObject> = await getPseUserTechniquesForUser(formationId, userId);
	const pseModules: Array<PseModuleApiObject> = await getPseModules()
	const pseCompetences: Array<PseCompetenceApiObject> = await getPseCompetences();
	const pseConcreateCases: Array<PseUserConcreteCaseApiObject> = await getSelectedPseUserConcreteCases(formationId, userId)

	return buildPseUserSummary(
		formationId,
		userId,
		preparatoryWorks,
		userTechniques,
		pseModules,
		pseCompetences,
		pseConcreateCases,
	)
}

/**
 * Build the PseUserSummaryApiObject data.
 */
export async function buildPseUserSummary(
	formationId: string,
	userId: string,
	preparatoryWorks: Array<PseUserPreparatoryWorkApiObject>,
	userTechniques: Array<PseUserTechniqueApiObject>,
	pseModules: Array<PseModuleApiObject>,
	pseCompetences: Array<PseCompetenceApiObject>,
	pseConcreateCases: Array<PseUserConcreteCaseApiObject>
): Promise<PseUserSummaryApiObject> {
	const technique: PseUserSummaryTechniqueApiObject = buildPseUserSummaryTechnique(userTechniques);

	const preparatoryWork: PseUserSummaryPreparatoryWorkApiObject = buildPseUserPreparatoryWork(preparatoryWorks);

	const concreteCase: PseUserSummaryConcreteCaseApiObject = buildPseUserSummaryConcreteCase(pseCompetences, pseConcreateCases)

	return {
		formationId,
		userId,

		technique,
		preparatoryWork,
		concreteCase,

		pseCompetences,

		hasValidatePse: sample([true, false]), // TODO:
		hasValidatePse1: sample([true, false]), // TODO:
	}

}

function buildPseUserSummaryTechnique(
	userTechniques: Array<PseUserTechniqueApiObject>
): PseUserSummaryTechniqueApiObject {
	const hasAcquiredAllTechniques = userTechniques.every(userTechnique => userTechnique.acquired)

	const hasAcquiredAllTechniquesToValidatePse1 = userTechniques.every(userTechnique => userTechnique.acquired && userTechnique.technique.requiredForPse1)

	return {
		hasAcquiredAllTechniques,
		hasAcquiredAllTechniquesToValidatePse1,
		userTechniques,
		nbAcquired: userTechniques.filter(userTechnique => userTechnique.acquired).length,
		nbNotAcquired: userTechniques.filter(userTechnique => !userTechnique.acquired).length,
		nbAcquiredToValidatePse1: userTechniques.filter(userTechnique => userTechnique.acquired && userTechnique.technique.requiredForPse1).length,
		nbNotAcquiredToValidatePse1: userTechniques.filter(userTechnique => !!userTechnique.acquired && userTechnique.technique.requiredForPse1).length,
	}
}

function buildPseUserPreparatoryWork(
	preparatoryWorks: Array<PseUserPreparatoryWorkApiObject>,
): PseUserSummaryPreparatoryWorkApiObject {
	const hasRealisedAllModules = preparatoryWorks.every(preparatoryWork => preparatoryWork.realised)

	return {
		hasRealisedAllModules,
		preparatoryWorks,
	}
}

export function buildPseUserSummaryConcreteCase(
	pseCompetences: Array<PseCompetenceApiObject>, 
	pseConcreateCases: Array<PseUserConcreteCaseApiObject>
): PseUserSummaryConcreteCaseApiObject {
	return {
		userConcreteCases: pseConcreateCases,

		// TODO:
		hasAcquiredAll: false,
		hasAcquiredAllForPse1: false,

		competencesSummary: buildConcreteCaseCompetenceSummaryForAllModules(pseCompetences, pseConcreateCases),
	}
}

function buildConcreteCaseCompetenceSummaryForAllModules(
	pseCompetences: Array<PseCompetenceApiObject>, 
	pseUserConcreateCases: Array<PseUserConcreteCaseApiObject>
): Array<PseConcreteCaseCompetenceSummaryApiObject> {
	const pseUserConcreteCaseCompetences = pseUserConcreateCases
		.map((userConcreteCase) => userConcreteCase.competences)
		.flat();

	return pseCompetences.map((pseCompetence) => {
		return buildConcreteCaseCompetenceSummaryApiObject(
			pseCompetence,
			pseUserConcreteCaseCompetences.filter(
				(pseUserConcreteCaseCompetence) =>
					pseUserConcreteCaseCompetence.pseCompetenceId === pseCompetence.id
			)
		)
	});
}

function buildConcreteCaseCompetenceSummaryApiObject(
	pseCompetence: PseCompetenceApiObject,
	pseUserConcreteCaseCompetences: Array<PseUserConcreteCaseCompetenceApiObject>,
): PseConcreteCaseCompetenceSummaryApiObject {
	const nbA = pseUserConcreteCaseCompetences.filter(c => c.grade === 'A').length
	const nbB = pseUserConcreteCaseCompetences.filter(c => c.grade === 'B').length
	const nbC = pseUserConcreteCaseCompetences.filter(c => c.grade === 'C').length
	const nbD = pseUserConcreteCaseCompetences.filter(c => c.grade === 'D').length
	const nbNotEvalued = pseUserConcreteCaseCompetences.filter(c => c.grade === 'NOT_EVALUATED').length
	const nbAcquired = nbA + nbB;
	const nbNotAcquired = nbC + nbD;
	const nbTotal = nbAcquired + nbNotAcquired

	const isInDifficulty = checkIsInDifficulty(nbAcquired, nbNotAcquired)
		
	return {
		pseCompetenceId: pseCompetence.id,
		pseCompetence: pseCompetence,

		acquired: nbAcquired >= pseCompetence.requiredCountToValidatePseGlobal,
		acquiredForPse1: nbNotAcquired >= pseCompetence.requiredCountToValidatePse1,

		nbA,
		nbB,
		nbC,
		nbD,
		nbNotEvalued,
		
		nbAcquired,
		nbNotAcquired,
		nbTotal,
		
		isInDifficulty,
	};
}


/**
 * Very simple for the moment. We consider it is in difficulty if he did not succeed yet and has failed more than once.
 */
function checkIsInDifficulty(nbAcquired: number, nbNotAcquired: number) {
	return nbNotAcquired > 1 && nbAcquired === 0
}