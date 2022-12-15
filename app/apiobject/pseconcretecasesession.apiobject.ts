import type { PseConcreteCaseSituationApiObject } from './pseconcretecasesituation.apiobject';
import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';


export type PseConcreteCaseSessionStateApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

export interface PseConcreteCaseSessionApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	name: string;
	state: PseConcreteCaseSessionStateApiEnum;

	groups: Array<PseConcreteCaseGroupApiObject>;
	situations: Array<PseConcreteCaseSituationApiObject>;

	// not on database

	/**
	 * requires situations, so we consider it as not configured if there no situations, nor groups.
	 */
	isConfigured: boolean;
}