import type { PseConcreteCaseSituationApiObject } from "./psesituation.apiobject";
import type { PseConcreteCaseGroupApiObject } from './pseuserconcretecasegroup.apiobject';


export type PseConcreteCaseSessionStateEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

export interface PseConcreteCaseSessionApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	name: string;
	state: PseConcreteCaseSessionStateEnum;

	groups: Array<PseConcreteCaseGroupApiObject>;
	situations: Array<PseConcreteCaseSituationApiObject>;

	// not on database

	/**
	 * requires situations, so we consider it as not configured if there no situations, nor groups.
	 */
	isConfigured: boolean;
}