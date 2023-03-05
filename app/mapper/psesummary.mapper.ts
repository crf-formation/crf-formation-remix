import type { PseConcreteCaseSummaryApiObject, PseConcreteCaseUserSummaryApiObject, PsePreparatoryWorkSummaryApiObject, PsePreparatoryWorkUserSummaryApiObject, PseResultSummaryApiObject, PseResultUserSummaryApiObject, PseSummaryApiObject, PseTechniqueSummaryApiObject, PseTechniqueUserSummaryApiObject } from '~/apiobject/psesummary.apiobject';
import type { PseConcreteCaseSummaryDto, PseConcreteCaseUserSummaryDto, PsePreparatoryWorkSummaryDto, PsePreparatoryWorkUserSummaryDto, PseResultSummaryDto, PseResultUserSummaryDto, PseSummaryDto, PseTechniqueSummaryDto, PseTechniqueUserSummaryDto } from '~/dto/psesummary.dto';
import { pseConcreteCaseCompetenceSummaryDtoToApiObject, pseUserSummaryPreparatoryWorkApiObjectToDto, pseUserSummaryTechniqueApiObjectToDto } from '~/mapper/pseusersummary.mapper';
import { userApiObjectToDto } from '~/mapper/user.mapper';

export function pseSummaryApiObjectToDto(apiObject: PseSummaryApiObject): PseSummaryDto {
	return {
		resultSummary: pseResultSummaryApiObjectToDto(apiObject.resultSummary),
		concreteCaseSummary: pseConcreteCaseSummaryApiObjectToDto(apiObject.concreteCaseSummary),
		techniqueSummary: pseTechniqueSummaryApiObjectToDto(apiObject.techniqueSummary),
		preparatoryWorkSummary: psePreparatoryWorkSummaryApiObjectToDto(apiObject.preparatoryWorkSummary),
	}
}

function pseResultSummaryApiObjectToDto(apiObject: PseResultSummaryApiObject): PseResultSummaryDto {
	return {
		usersSummary: apiObject.usersSummary.map(pseResultUserSummaryApiObjectToDto)
	}
}

function pseResultUserSummaryApiObjectToDto(apiObject: PseResultUserSummaryApiObject): PseResultUserSummaryDto {
	return {
		user: userApiObjectToDto(apiObject.user),
		hasValidatedPse: apiObject.hasValidatedPse,
		hasValidatedPse1: apiObject.hasValidatedPse1,
		hasValidatedTechniquesPse: apiObject.hasValidatedTechniquesPse,
		hasValidatedTechniquesPse1: apiObject.hasValidatedTechniquesPse1,
		hasValidatedConcreteCasePse: apiObject.hasValidatedConcreteCasePse,
		hasValidatedConcreteCasePse1: apiObject.hasValidatedConcreteCasePse1,
		hasValidatedPrepratoryWork: apiObject.hasValidatedPrepratoryWork,
	}
}

function pseTechniqueSummaryApiObjectToDto(apiObject: PseTechniqueSummaryApiObject): PseTechniqueSummaryDto {
	return {
		usersSummary: apiObject.usersSummary.map(pseTechniqueUserSummaryApiObjectToDto)
	}
}

function pseTechniqueUserSummaryApiObjectToDto(apiObject: PseTechniqueUserSummaryApiObject): PseTechniqueUserSummaryDto {
	return {
		user: userApiObjectToDto(apiObject.user),	
		technique: pseUserSummaryTechniqueApiObjectToDto(apiObject.technique),
	}
}

function psePreparatoryWorkSummaryApiObjectToDto(apiObject: PsePreparatoryWorkSummaryApiObject): PsePreparatoryWorkSummaryDto {
	return {
		usersSummary: apiObject.usersSummary.map(psePreparatoryWorkUserSummaryApiObjectToDto)
	}
}

function psePreparatoryWorkUserSummaryApiObjectToDto(apiObject: PsePreparatoryWorkUserSummaryApiObject): PsePreparatoryWorkUserSummaryDto {
	return {
		user: userApiObjectToDto(apiObject.user),
		preparatoryWork: pseUserSummaryPreparatoryWorkApiObjectToDto(apiObject.preparatoryWork)
	}
}

function pseConcreteCaseSummaryApiObjectToDto(apiObject: PseConcreteCaseSummaryApiObject): PseConcreteCaseSummaryDto {
	return {
		usersSummary: apiObject.usersSummary.map(pseConcreteCaseUserSummaryApiObjectDto)
	}
}

function pseConcreteCaseUserSummaryApiObjectDto(apiObject: PseConcreteCaseUserSummaryApiObject): PseConcreteCaseUserSummaryDto {
	return {
		user: userApiObjectToDto(apiObject.user),
		competencesSummary: apiObject.competencesSummary.map(pseConcreteCaseCompetenceSummaryDtoToApiObject),
		hasAcquiredAll: apiObject.hasAcquiredAll,
		hasAcquiredAllForPse1: apiObject.hasAcquiredAllForPse1,
	}
}
