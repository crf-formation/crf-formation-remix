import type { PseUserPreparatoryWorkApiObject } from '~/apiobject/pseformationpreparatorywork.apiobject';
import type { PseUserTechniqueApiObject } from '~/apiobject/pseusertechnique.apiobject';
import { getPreparatoryWorksForUser } from '~/services/pseformationpreparatorywork.server';
import { getPseUserTechniquesForUser } from '~/services/pseusertechniques.server';
import type { PseUserSummaryApiObject, PseUserSummaryConcreteCaseApiObject, PseUserSummaryConcreteCaseModuleApiObject, ConcreteCaseCompetenceResultApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from '../apiobject/pseusesummary.apiobject';
import type { PseModuleApiObject } from '../apiobject/psemodule.apiobject';
import { getPseModules } from '~/services/psemodule.server';
import type { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';
import { getPseCompetences } from '~/services/psecompetence.server';
import { sample } from 'lodash';

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

	return buildPseUserSummary(
		formationId,
		userId,
		preparatoryWorks,
		userTechniques,
		pseModules,
		pseCompetences,
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
	pseCompetences: Array<PseCompetenceApiObject>
): Promise<PseUserSummaryApiObject> {
	const technique: PseUserSummaryTechniqueApiObject = buildPseUserSummaryTechnique(userTechniques);

	const preparatoryWork: PseUserSummaryPreparatoryWorkApiObject = buildPseUserPreparatoryWork(preparatoryWorks);

	const concreteCase: PseUserSummaryConcreteCaseApiObject = buildPseUserSummaryConcreteCase(pseModules, pseCompetences)

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

function buildPseUserSummaryConcreteCase(pseModules: Array<PseModuleApiObject>, pseCompetences: Array<PseCompetenceApiObject>): PseUserSummaryConcreteCaseApiObject {
	const concreteCaseModules = pseModules.map(pseModule => buildPseUserSummaryConcreteCaseModule(pseModule, pseCompetences))
	return {
		concreteCaseModules,

		hasAcquiredAllModules: concreteCaseModules.every(pseUserSummaryConcreteCaseModule => pseUserSummaryConcreteCaseModule.hasAcquiredAllCompetences),
		hasAcquiredAllModulesForPse1: concreteCaseModules.every(pseUserSummaryConcreteCaseModule => pseUserSummaryConcreteCaseModule.hasAcquiredAllCompetencesForPse1),

		competenceResults: buildConcreteCaseCompetenceResultForAllModules(pseCompetences, concreteCaseModules),
	}
}

function buildPseUserSummaryConcreteCaseModule(pseModule: PseModuleApiObject, pseCompetences: Array<PseCompetenceApiObject>): PseUserSummaryConcreteCaseModuleApiObject {
	const competenceResults = pseCompetences.map(pseCompetence => buildConcreteCaseCompetenceResult(pseCompetence))
	return {
		pseModule,
		pseModuleId: pseModule.id,

		hasAcquiredAllCompetences: competenceResults.every(competence => competence.acquired),
		hasAcquiredAllCompetencesForPse1: competenceResults.every(competence => competence.acquiredForPse1),

		competenceResults,
	}
}

function buildConcreteCaseCompetenceResult(pseCompetence: PseCompetenceApiObject): ConcreteCaseCompetenceResultApiObject {
	return {
		pseCompetenceId: pseCompetence.id,
		pseCompetence: pseCompetence,

		acquired: sample([true, false]) as boolean, // TODO:
		acquiredForPse1: sample([true, false]) as boolean, // TODO:
	}
}

function buildConcreteCaseCompetenceResultForAllModules(pseCompetences: Array<PseCompetenceApiObject>, concreteCaseModules: Array<PseUserSummaryConcreteCaseModuleApiObject>): Array<ConcreteCaseCompetenceResultApiObject> {
	return pseCompetences.map((pseCompetence) => {
		// TODO: build data
		return {
			pseCompetenceId: pseCompetence.id,
			pseCompetence: pseCompetence,

			acquired: sample([true, false]) as boolean, // TODO:
			acquiredForPse1: sample([true, false]) as boolean, // TODO:
		};
	});
}