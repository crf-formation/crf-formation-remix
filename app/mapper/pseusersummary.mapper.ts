import type { PseConcreteCaseCompetenceSummaryApiObject, PseUserSummaryApiObject, PseUserSummaryConcreteCaseApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from "~/apiobject/pseusersummary.apiobject";
import type { PseConcreteCaseCompetenceSummaryDto, PseUserSummaryConcreteCaseDto, PseUserSummaryDto, PseUserSummaryPreparatoryWorkDto, PseUserSummaryTechniqueDto } from "~/dto/pseusersummary.dto";
import { pseCompetenceApiObjectToDto } from "./psecompetence.mapper";
import { pseUserPreparatoryWorkApiObjectToDto } from './pseformationpreparatorywork.mapper';
import { pseUserConcreteCaseApiObjectToDto } from "./pseuserconcretecase.mapper";
import { pseUserTechniqueApiObjectToDto } from './pseusertechnique.mapper';

export function pseUserSummaryApiObjectToDto(apiObject: PseUserSummaryApiObject): PseUserSummaryDto {
	return {
		formationId: apiObject.formationId,
		userId: apiObject.userId,
		technique: pseUserSummaryTechniqueApiObjectToDto(apiObject.technique),
		preparatoryWork: pseUserSummaryPreparatoryWorkApiObjectToDto(apiObject.preparatoryWork),
		concreteCase: pseUserSummaryConcreteCaseApiObjectToDto(apiObject.concreteCase),
		pseCompetences: apiObject.pseCompetences.map(pseCompetenceApiObjectToDto),
		hasValidatePse: apiObject.hasValidatePse,
		hasValidatePse1: apiObject.hasValidatePse1,
	}
}

export function pseUserSummaryTechniqueApiObjectToDto(apiObject: PseUserSummaryTechniqueApiObject): PseUserSummaryTechniqueDto {
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

export function pseUserSummaryPreparatoryWorkApiObjectToDto(apiObject: PseUserSummaryPreparatoryWorkApiObject): PseUserSummaryPreparatoryWorkDto {
	const preparatoryWorks = apiObject.preparatoryWorks.map(pseUserPreparatoryWorkApiObjectToDto)
	return {
    hasRealisedAllModules: apiObject.hasRealisedAllModules,
    preparatoryWorks,
  };
}

export function pseUserSummaryConcreteCaseApiObjectToDto(apiObject: PseUserSummaryConcreteCaseApiObject): PseUserSummaryConcreteCaseDto {
	return {
		userConcreteCases: apiObject.userConcreteCases.map(pseUserConcreteCaseApiObjectToDto),
		hasAcquiredAll: apiObject.hasAcquiredAll,
		hasAcquiredAllForPse1: apiObject.hasAcquiredAllForPse1,
		competencesSummary: apiObject.competencesSummary.map(pseConcreteCaseCompetenceSummaryDtoToApiObject),
	}
}

export function pseConcreteCaseCompetenceSummaryDtoToApiObject(apiObject: PseConcreteCaseCompetenceSummaryApiObject): PseConcreteCaseCompetenceSummaryDto {
	return {
		pseCompetenceId: apiObject.pseCompetenceId,
		pseCompetence: pseCompetenceApiObjectToDto(apiObject.pseCompetence),
		acquired: apiObject.acquired,
		acquiredForPse1: apiObject.acquiredForPse1,

		nbA: apiObject.nbA,
		nbB: apiObject.nbB,
		nbC: apiObject.nbC,
		nbD: apiObject.nbD,
		nbNotEvalued: apiObject.nbNotEvalued,
		nbAcquired: apiObject.nbAcquired,
		nbNotAcquired: apiObject.nbNotAcquired,
		nbTotal: apiObject.nbTotal,
		isInDifficulty: apiObject.isInDifficulty,
	}

}
