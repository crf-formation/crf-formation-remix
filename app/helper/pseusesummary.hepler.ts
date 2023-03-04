import { sample } from 'lodash';
import type { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';
import type { PseUserPreparatoryWorkApiObject } from '~/apiobject/pseformationpreparatorywork.apiobject';
import type { PseUserTechniqueApiObject } from '~/apiobject/pseusertechnique.apiobject';
import { getPseCompetences } from '~/service/psecompetence.server';
import { getPreparatoryWorksForUser } from '~/service/pseformationpreparatorywork.server';
import { getPseModules } from '~/service/psemodule.server';
import { getPseUserTechniquesForUser } from '~/service/pseusertechniques.server';
import type { PseModuleApiObject } from '../apiobject/psemodule.apiobject';
import type { ConcreteCaseCompetenceResultApiObject, PseUserSummaryApiObject, PseUserSummaryConcreteCaseApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from '../apiobject/pseusesummary.apiobject';
import type { PseUserConcreteCaseApiObject } from '~/apiobject/pseuserconcretecase.apiobject';
import { getSelectedPseUserConcreteCases } from '~/service/pseuserconcretecase.server';

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

	const concreteCase: PseUserSummaryConcreteCaseApiObject = buildPseUserSummaryConcreteCase(pseModules, pseCompetences, pseConcreateCases)

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

function buildPseUserSummaryConcreteCase(
	pseModules: Array<PseModuleApiObject>, 
	pseCompetences: Array<PseCompetenceApiObject>, 
	pseConcreateCases: Array<PseUserConcreteCaseApiObject>
): PseUserSummaryConcreteCaseApiObject {
	return {
		userConcreteCases: pseConcreateCases,

		// TODO:
		hasAcquiredAllModules: false,
		hasAcquiredAllModulesForPse1: false,

		competenceResults: buildConcreteCaseCompetenceResultForAllModules(pseModules, pseCompetences, pseConcreateCases),
	}
}

function buildConcreteCaseCompetenceResultForAllModules(
	pseModules: Array<PseModuleApiObject>, 
	pseCompetences: Array<PseCompetenceApiObject>, 
	pseConcreateCases: Array<PseUserConcreteCaseApiObject>
): Array<ConcreteCaseCompetenceResultApiObject> {
	return pseCompetences.map((pseCompetence) => {
		const nbAcquired = pseConcreateCases
			.filter(pseConcreateCase => pseConcreateCase.competences.find(v => v.pseCompetence.id === pseCompetence.id && (v.grade === 'A' || v.grade === 'B')))
			.length

		const nbNotAcquired = pseConcreateCases
			.filter(pseConcreateCase => pseConcreateCase.competences.find(v => v.pseCompetence.id === pseCompetence.id && (v.grade === 'C' || v.grade === 'D')))
			.length
			
		return {
			pseCompetenceId: pseCompetence.id,
			pseCompetence: pseCompetence,

			acquired: nbAcquired >= pseCompetence.requiredCountToValidatePseGlobal,
			acquiredForPse1: nbNotAcquired >= pseCompetence.requiredCountToValidatePse1,
		};
	});
}