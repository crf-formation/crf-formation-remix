import type { PseConcreteCaseCompetenceSummaryApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from '~/apiobject/pseusersummary.apiobject';
import type { UserApiObject } from './user.apiobject';

export interface PseSummaryApiObject {
	resultSummary: PseResultSummaryApiObject;
	concreteCaseSummary: PseConcreteCaseSummaryApiObject;
	techniqueSummary: PseTechniqueSummaryApiObject,
	preparatoryWorkSummary: PsePreparatoryWorkSummaryApiObject,
}

export interface PseResultSummaryApiObject {
	usersSummary: Array<PseResultUserSummaryApiObject>
}

export interface PseResultUserSummaryApiObject {
	user: UserApiObject;
	hasValidatedPse: boolean;
	hasValidatedPse1: boolean;
	hasValidatedTechniquesPse: boolean;
	hasValidatedTechniquesPse1: boolean;
	hasValidatedConcreteCasePse: boolean;
	hasValidatedConcreteCasePse1: boolean;
	hasValidatedPrepratoryWork: boolean;
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
