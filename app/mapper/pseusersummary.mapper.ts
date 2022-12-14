import type { PseUserSummaryApiObject, PseUserSummaryConcreteCaseApiObject, PseUserSummaryConcreteCaseModuleApiObject, PseUserSummaryConcreteCaseCompetenceApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from "~/apiobject/pseusesummary.apiobject";
import type { PseUserSummaryConcreteCaseDto, PseUserSummaryConcreteCaseModuleDto, PseUserSummaryConcreteCaseCompetenceDto, PseUserSummaryDto, PseUserSummaryPreparatoryWorkDto, PseUserSummaryTechniqueDto } from "~/dto/pseusesummary.dto";
import { pseCompetenceApiObjectToDto } from "./psecompetence.mapper";
import { pseUserPreparatoryWorkApiObjectToDto } from './pseformationpreparatorywork.mapper';
import { pseModuleApiObjectToDto } from "./psemodule.mapper";
import { pseUserTechniqueApiObjectToDto } from './pseusertechnique.mapper';

export function pseUserSummaryApiObjectToDto(apiObject: PseUserSummaryApiObject): PseUserSummaryDto {
	return {
		formationId: apiObject.formationId,
		userId: apiObject.userId,
		technique: techniqueApiObjectToDto(apiObject.technique),
		preparatoryWork: preparatoryWorkApiObjectToDto(apiObject.preparatoryWork),
		concreteCase: pseUserSummaryConcreteCaseApiObjectToDto(apiObject.concreteCase),
		hasValidatePse: apiObject.hasValidatePse,
		hasValidatePse1: apiObject.hasValidatePse1,
	}
}

function techniqueApiObjectToDto(apiObject: PseUserSummaryTechniqueApiObject): PseUserSummaryTechniqueDto {
	return {
		hasAcquiredAllTechniques: apiObject.hasAcquiredAllTechniques,
		hasAcquiredAllTechniquesToValidatePse1: apiObject.hasAcquiredAllTechniquesToValidatePse1,
		userTechniques: apiObject.userTechniques.map(pseUserTechniqueApiObjectToDto),
		nbAcquired: apiObject.nbAcquired,
		nbNotAcquired: apiObject.nbNotAcquired,
		nbAcquiredToValidatePse1: apiObject.nbAcquiredToValidatePse1,
		nbNotAcquiredToValidatePse1: apiObject.nbNotAcquiredToValidatePse1,
	}
}

function preparatoryWorkApiObjectToDto(apiObject: PseUserSummaryPreparatoryWorkApiObject): PseUserSummaryPreparatoryWorkDto {
	const preparatoryWorks = apiObject.preparatoryWorks.map(pseUserPreparatoryWorkApiObjectToDto)
	return {
    hasRealisedAllModules: apiObject.hasRealisedAllModules,
    preparatoryWorks,
  };
}

function pseUserSummaryConcreteCaseApiObjectToDto(apiObject: PseUserSummaryConcreteCaseApiObject): PseUserSummaryConcreteCaseDto {
	return {
		concreteCaseModules: apiObject.concreteCaseModules.map(pseUserSummaryConcreteCaseModuleApiObjectToDto),
		hasAcquiredAllModules: apiObject.hasAcquiredAllModules,
		hasAcquiredAllModulesForPse1: apiObject.hasAcquiredAllModulesForPse1,
	}
}

function pseUserSummaryConcreteCaseModuleApiObjectToDto(apiObject: PseUserSummaryConcreteCaseModuleApiObject): PseUserSummaryConcreteCaseModuleDto {
	return {
		pseModuleId: apiObject.pseModuleId,
		pseModule: pseModuleApiObjectToDto(apiObject.pseModule),

		competences: apiObject.competences.map(pseUserSummaryConcreteCaseTechniqueApiObjectToDto),

		hasAcquiredAllCompetences: apiObject.hasAcquiredAllCompetences,
		hasAcquiredAllCompetencesForPse1: apiObject.hasAcquiredAllCompetencesForPse1,
	}
}

function pseUserSummaryConcreteCaseTechniqueApiObjectToDto(apiObject: PseUserSummaryConcreteCaseCompetenceApiObject): PseUserSummaryConcreteCaseCompetenceDto {
	return {
		pseCompetenceId: apiObject.pseCompetenceId,
		pseCompetence: pseCompetenceApiObjectToDto(apiObject.pseCompetence),
		acquired: apiObject.acquired,
		acquiredForPse1: apiObject.acquiredForPse1,
	}

}
