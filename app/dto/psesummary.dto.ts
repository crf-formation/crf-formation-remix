import type { PseConcreteCaseCompetenceSummaryDto, PseUserSummaryPreparatoryWorkDto, PseUserSummaryTechniqueDto } from '~/dto/pseusersummary.dto';
import type { UserDto } from './user.dto';

export interface PseSummaryDto {
	resultSummary: PseResultSummaryDto;
	concreteCaseSummary: PseConcreteCaseSummaryDto;
	techniqueSummary: PseTechniqueSummaryDto,
	preparatoryWorkSummary: PsePreparatoryWorkSummaryDto,
}

export interface PseResultSummaryDto {
	usersSummary: Array<PseResultUserSummaryDto>
}

export interface PseResultUserSummaryDto {
	user: UserDto;
	hasValidatedPse: boolean;
	hasValidatedPse1: boolean;
	hasValidatedTechniquesPse: boolean;
	hasValidatedTechniquesPse1: boolean;
	hasValidatedConcreteCasePse: boolean;
	hasValidatedConcreteCasePse1: boolean;
	hasValidatedPrepratoryWork: boolean;
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
