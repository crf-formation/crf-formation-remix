import type { PseConcreteCaseSummaryApiObject, PseConcreteCaseUserSummaryApiObject, PsePreparatoryWorkSummaryApiObject, PsePreparatoryWorkUserSummaryApiObject, PseSummaryApiObject, PseTechniqueSummaryApiObject, PseTechniqueUserSummaryApiObject } from '~/apiobject/psesummary.apiobject';
import type { PseConcreteCaseSummaryDto, PseConcreteCaseUserSummaryDto, PsePreparatoryWorkSummaryDto, PsePreparatoryWorkUserSummaryDto, PseSummaryDto, PseTechniqueSummaryDto, PseTechniqueUserSummaryDto } from '~/dto/psesummary.dto';
import { pseConcreteCaseCompetenceSummaryDtoToApiObject, pseUserSummaryPreparatoryWorkApiObjectToDto, pseUserSummaryTechniqueApiObjectToDto } from '~/mapper/pseusersummary.mapper';
import { userApiObjectToDto } from '~/mapper/user.mapper';

export function pseSummaryApiObjectToDto(apiObject: PseSummaryApiObject): PseSummaryDto {
	return {
		concreteCaseSummary: pseConcreteCaseSummaryApiObjectToDto(apiObject.concreteCaseSummary),
		techniqueSummary: pseTechniqueSummaryApiObjectToDto(apiObject.techniqueSummary),
		preparatoryWorkSummary: psePreparatoryWorkSummaryApiObjectToDto(apiObject.preparatoryWorkSummary),
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
