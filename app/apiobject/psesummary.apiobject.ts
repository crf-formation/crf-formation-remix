import type { PseConcreteCaseCompetenceSummaryApiObject } from '~/apiobject/pseusersummary.apiobject';
import type { UserApiObject } from './user.apiobject';

export interface PseSummaryApiObject {
	concreteCaseSummary: PseConcreteCaseSummaryApiObject;
}

export interface PseConcreteCaseSummaryApiObject {

	usersSummary: Array<PseConcreteCaseUserSummaryApiObject>

}

export interface PseConcreteCaseUserSummaryApiObject {
	user: UserApiObject;
	competencesSummary: Array<PseConcreteCaseCompetenceSummaryApiObject>;
	hasAcquiredAll: boolean;
  hasAcquiredAllForPse1: boolean;
}
