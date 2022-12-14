import type { UserApiObject } from './user.apiobject';

type PseUserConcreteCaseGroupApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

// TODO:
export interface PseConcreteCaseGroupApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	state: PseUserConcreteCaseGroupApiEnum

	pseConcreteCaseSituationId: string
	// pseConcreteCaseSituation?: Optional<> TODO:

	students: Array<PseUserConcreteCaseGroupStudentApiObject>
}

export interface PseUserConcreteCaseGroupStudentApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	user?: Optional<UserApiObject>;
}
