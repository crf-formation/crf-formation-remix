import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';
import type { PseConcreteCaseTypeApiObject } from './pseconcretecasetype.apiobject';
import type { UserApiObject } from './user.apiobject';


export interface PseConcreteCaseSituationApiObject {
	readonly id: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	readonly teacherId: string;
	readonly teacher: UserApiObject;

	readonly pseConcreteCaseSessionId: string;
	readonly pseConcreteCaseTypeId: string;

	readonly pseConcreteCaseType: PseConcreteCaseTypeApiObject;

	readonly pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupApiObject>
}

export interface PseSituationConcreteCaseGroupApiObject {
	readonly id: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;

	readonly pseConcreteCaseGroupId: string;
	readonly pseConcreteCaseGroup: PseConcreteCaseGroupApiObject;

	/**
	 * Position of the group in the situation, to order them.
	 */
	readonly position: number;
}

export interface PseConcreteCaseSituationPostApiObject {
	readonly pseConcreteCaseSessionId: string;
	readonly pseConcreteCaseTypeId: string;
	readonly teacherId: string;
	readonly pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupPutApiObject>
}

export interface PseConcreteCaseSituationPutApiObject {
	readonly pseConcreteCaseSessionId: string;
	readonly pseConcreteCaseTypeId: string;
	readonly teacherId: string;
	readonly pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupPutApiObject>
}

export interface PseSituationConcreteCaseGroupPutApiObject {
	readonly id?: string; // null if creation, non-null if already exists.
	readonly pseConcreteCaseGroupId: string;
	readonly position: number;
}