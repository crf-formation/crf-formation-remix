import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';
import type { PseConcreteCaseSituationApiObject } from './pseconcretecasesituation.apiobject';


export type PseConcreteCaseSessionStateApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

export interface PseConcreteCaseSessionApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	name: string;
	state: PseConcreteCaseSessionStateApiEnum;

	pseConcreteCaseGroups: Array<PseConcreteCaseGroupApiObject>;
	pseConcreteCaseSituations: Array<PseConcreteCaseSituationApiObject>;

	// not on database

	/**
	 * requires situations, so we consider it as not configured if there no situations, nor groups.
	 */
	isConfigured: boolean;
}

export interface PseConcreteCaseSessionPostApiObject {
	name: string;
	state: PseConcreteCaseSessionStateApiEnum;
	formationId: string;
}

export interface PseConcreteCaseSessionPutApiObject {
	name: string;
	state: PseConcreteCaseSessionStateApiEnum;
}

//
//
//

export interface PseConcreteCaseSessionGroupOrderApiObject {
  pseConcreteCaseGroup: PseConcreteCaseGroupApiObject;

  groupOrderSituations: Array<PseConcreteCaseSessionGroupOrderSituationApiObject>;

  duplicatedPositions: Array<PseConcreteCaseSessionGroupOrderSituationApiObject>;
  situationsWithoutPosition: Array<PseConcreteCaseSituationApiObject>;

	hasNoPositions: boolean
	hasSomeSituationsWithoutPosition: boolean
}

export interface PseConcreteCaseSessionGroupOrderSituationApiObject {
  pseConcreteCaseSituation: PseConcreteCaseSituationApiObject;
  position: number;
}
