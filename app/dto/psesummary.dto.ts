import type { PseConcreteCaseCompetenceSummaryDto, PseUserSummaryPreparatoryWorkDto, PseUserSummaryTechniqueDto } from '~/dto/pseusersummary.dto';
import type { UserDto } from './user.dto';

export interface PseSummaryDto {
	concreteCaseSummary: PseConcreteCaseSummaryDto;
	techniqueSummary: PseTechniqueSummaryDto,
	preparatoryWorkSummary: PsePreparatoryWorkSummaryDto,
}

export interface PseTechniqueSummaryDto {
	usersSummary: Array<PseTechniqueUserSummaryDto>
}

export interface PseTechniqueUserSummaryDto {
	user: UserDto;
	technique: PseUserSummaryTechniqueDto
}

export interface PsePreparatoryWorkSummaryDto {
	usersSummary: Array<PsePreparatoryWorkUserSummaryDto>
}

export interface PsePreparatoryWorkUserSummaryDto {
	user: UserDto;
	preparatoryWork: PseUserSummaryPreparatoryWorkDto;
}

export interface PseConcreteCaseSummaryDto {
	usersSummary: Array<PseConcreteCaseUserSummaryDto>
}

export interface PseConcreteCaseUserSummaryDto {
	user: UserDto;
	competencesSummary: Array<PseConcreteCaseCompetenceSummaryDto>;
	hasAcquiredAll: boolean;
  hasAcquiredAllForPse1: boolean;
}
