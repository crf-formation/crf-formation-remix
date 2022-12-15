import type { PseConcreteCaseTypeApiObject } from './pseconcretecase';
import type { PseConcreteCaseSessionApiObject } from './pseconcretecasesession.apiobject';
import type { PseConcreteCaseGroupApiObject } from './pseuserconcretecasegroup.apiobject';
import type { UserApiObject } from './user.apiobject';


export interface PseConcreteCaseSituationApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	teacherId: string;
	teacher: UserApiObject;

	pseConcreteCaseType: PseConcreteCaseTypeApiObject;

	pseConcreteCaseSession: PseConcreteCaseSessionApiObject;

	pseConcreteCaseGroups: Array<PseSituationConcreteCaseGroupApiObject>

}

export interface PseSituationConcreteCaseGroupApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;

	groupId: string;
	group: PseConcreteCaseGroupApiObject;

	/**
	 * Position of the group in the situation, to order them.
	 */
	position: number;
}