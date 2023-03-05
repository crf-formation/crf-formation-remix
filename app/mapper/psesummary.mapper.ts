import type { PseConcreteCaseSummaryApiObject, PseConcreteCaseUserSummaryApiObject, PseSummaryApiObject } from '~/apiobject/psesummary.apiobject';
import type { PseConcreteCaseSummaryDto, PseConcreteCaseUserSummaryDto } from '~/dto/psesummary.dto';
import { pseConcreteCaseCompetenceSummaryDtoToApiObject } from '~/mapper/pseusersummary.mapper';
import { userApiObjectToDto } from '~/mapper/user.mapper';

export function pseSummaryApiObjectToDto(apiObject: PseSummaryApiObject): PseSummaryDto {
	return {
		concreteCaseSummary: pseConcreteCaseSummaryApiObjectToDto(apiObject.concreteCaseSummary),
	}
}

export interface PseSummaryDto {
	concreteCaseSummary: PseConcreteCaseSummaryDto;
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
