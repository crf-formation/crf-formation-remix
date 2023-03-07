import type { PseConcreteCaseCompetenceSummaryApiObject, PseUserSummaryPreparatoryWorkApiObject, PseUserSummaryTechniqueApiObject } from '~/apiobject/pseusersummary.apiobject';
import type { UserApiObject } from './user.apiobject';

export interface PseSummaryApiObject {
	readonly resultSummary: PseResultSummaryApiObject;
	readonly concreteCaseSummary: PseConcreteCaseSummaryApiObject;
	readonly techniqueSummary: PseTechniqueSummaryApiObject,
	readonly preparatoryWorkSummary: PsePreparatoryWorkSummaryApiObject,
}

export interface PseResultSummaryApiObject {
	readonly usersSummary: Array<PseResultUserSummaryApiObject>
}

export interface PseResultUserSummaryApiObject {
	readonly user: UserApiObject;
	readonly hasValidatedPse: boolean;
	readonly hasValidatedPse1: boolean;
	readonly hasValidatedTechniquesPse: boolean;
	readonly hasValidatedTechniquesPse1: boolean;
	readonly hasValidatedConcreteCasePse: boolean;
	readonly hasValidatedConcreteCasePse1: boolean;
	readonly hasValidatedPrepratoryWork: boolean;
}

export interface PseTechniqueSummaryApiObject {
	readonly usersSummary: Array<PseTechniqueUserSummaryApiObject>
}

export interface PseTechniqueUserSummaryApiObject {
	readonly user: UserApiObject;
	readonly technique: PseUserSummaryTechniqueApiObject
}


export interface PsePreparatoryWorkSummaryApiObject {
	readonly usersSummary: Array<PsePreparatoryWorkUserSummaryApiObject>
}

export interface PsePreparatoryWorkUserSummaryApiObject {
	readonly user: UserApiObject;
	readonly preparatoryWork: PseUserSummaryPreparatoryWorkApiObject;
}

export interface PseConcreteCaseSummaryApiObject {
	readonly usersSummary: Array<PseConcreteCaseUserSummaryApiObject>
}

export interface PseConcreteCaseUserSummaryApiObject {
	readonly user: UserApiObject;
	readonly competencesSummary: Array<PseConcreteCaseCompetenceSummaryApiObject>;
	readonly hasAcquiredAll: boolean;
  readonly hasAcquiredAllForPse1: boolean;
}
