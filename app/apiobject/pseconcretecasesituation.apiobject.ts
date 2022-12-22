import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';
import type { PseConcreteCaseTypeApiObject } from './pseconcretecasetype.apiobject';
import type { UserApiObject } from './user.apiobject';


export interface PseConcreteCaseSituationApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	teacherId: string;
	teacher: UserApiObject;

	pseConcreteCaseSessionId: string;
	pseConcreteCaseTypeId: string;

	pseConcreteCaseType: PseConcreteCaseTypeApiObject;

	pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupApiObject>
}

export interface PseSituationConcreteCaseGroupApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	pseConcreteCaseGroupId: string;
	pseConcreteCaseGroup: PseConcreteCaseGroupApiObject;

	/**
	 * Position of the group in the situation, to order them.
	 */
	position: number;
}

export interface PseConcreteCaseSituationPostApiObject {
	pseConcreteCaseSessionId: string;
	pseConcreteCaseTypeId: string;
	teacherId: string;
	pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupPutApiObject>
}

export interface PseConcreteCaseSituationPutApiObject {
	pseConcreteCaseSessionId: string;
	pseConcreteCaseTypeId: string;
	teacherId: string;
	pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupPutApiObject>
}

export interface PseSituationConcreteCaseGroupPutApiObject {
	id?: string; // null if creation, non-null if already exists.
	pseConcreteCaseGroupId: string;
	position: number;
}