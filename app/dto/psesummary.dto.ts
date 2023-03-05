import type { PseConcreteCaseCompetenceSummaryDto } from '~/dto/pseusersummary.dto';
import type { UserDto } from './user.dto';

export interface PseSummaryDto {
	concreteCaseSummary: PseConcreteCaseSummaryDto;
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
