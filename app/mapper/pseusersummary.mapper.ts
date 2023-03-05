import type { ConcreteCaseCompetenceResultApiObject, PseUserSummaryApiObject, PseUserSummaryConcreteCaseApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from "~/apiobject/pseusesummary.apiobject";
import type { ConcreteCaseCompetenceResultDto, PseUserSummaryConcreteCaseDto, PseUserSummaryDto, PseUserSummaryPreparatoryWorkDto, PseUserSummaryTechniqueDto } from "~/dto/pseusesummary.dto";
import { pseCompetenceApiObjectToDto } from "./psecompetence.mapper";
import { pseUserPreparatoryWorkApiObjectToDto } from './pseformationpreparatorywork.mapper';
import { pseUserConcreteCaseApiObjectToDto } from "./pseuserconcretecase.mapper";
import { pseUserTechniqueApiObjectToDto } from './pseusertechnique.mapper';

export function pseUserSummaryApiObjectToDto(apiObject: PseUserSummaryApiObject): PseUserSummaryDto {
	return {
		formationId: apiObject.formationId,
		userId: apiObject.userId,
		technique: techniqueApiObjectToDto(apiObject.technique),
		preparatoryWork: preparatoryWorkApiObjectToDto(apiObject.preparatoryWork),
		concreteCase: pseUserSummaryConcreteCaseApiObjectToDto(apiObject.concreteCase),
		pseCompetences: apiObject.pseCompetences.map(pseCompetenceApiObjectToDto),
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

export function pseUserSummaryConcreteCaseApiObjectToDto(apiObject: PseUserSummaryConcreteCaseApiObject): PseUserSummaryConcreteCaseDto {
	return {
		userConcreteCases: apiObject.userConcreteCases.map(pseUserConcreteCaseApiObjectToDto),
		hasAcquiredAllModules: apiObject.hasAcquiredAllModules,
		hasAcquiredAllModulesForPse1: apiObject.hasAcquiredAllModulesForPse1,
		competenceResults: apiObject.competenceResults.map(pseUserSummaryConcreteCaseTechniqueApiObjectToDto),
	}
}

function pseUserSummaryConcreteCaseTechniqueApiObjectToDto(apiObject: ConcreteCaseCompetenceResultApiObject): ConcreteCaseCompetenceResultDto {
	return {
		pseCompetenceId: apiObject.pseCompetenceId,
		pseCompetence: pseCompetenceApiObjectToDto(apiObject.pseCompetence),
		acquired: apiObject.acquired,
		acquiredForPse1: apiObject.acquiredForPse1,
	}

}
