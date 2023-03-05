import type { PseConcreteCaseCompetenceSummaryApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from '~/apiobject/pseusersummary.apiobject';
import type { UserApiObject } from './user.apiobject';

export interface PseSummaryApiObject {
	concreteCaseSummary: PseConcreteCaseSummaryApiObject;
	techniqueSummary: PseTechniqueSummaryApiObject,
	preparatoryWorkSummary: PsePreparatoryWorkSummaryApiObject,
}

export interface PseTechniqueSummaryApiObject {
	usersSummary: Array<PseTechniqueUserSummaryApiObject>
}

export interface PseTechniqueUserSummaryApiObject {
	user: UserApiObject;
	technique: PseUserSummaryTechniqueApiObject
}


export interface PsePreparatoryWorkSummaryApiObject {
	usersSummary: Array<PsePreparatoryWorkUserSummaryApiObject>
}

export interface PsePreparatoryWorkUserSummaryApiObject {
	user: UserApiObject;
	preparatoryWork: PseUserSummaryPreparatoryWorkApiObject;
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
