import type { UserApiObject } from './user.apiobject';

export type PseConcreteCaseGroupApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

// TODO:
export interface PseConcreteCaseGroupApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	state: PseConcreteCaseGroupApiEnum

	pseConcreteCaseSessionId: string
	// pseConcreteCaseSession?: Optional<> TODO:

	students: Array<PseUserConcreteCaseGroupStudentApiObject>
}

export interface PseUserConcreteCaseGroupStudentApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	user?: Optional<UserApiObject>;
}
