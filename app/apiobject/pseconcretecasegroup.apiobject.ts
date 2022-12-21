import type { UserApiObject } from './user.apiobject';

// TODO:
export interface PseConcreteCaseGroupApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;

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


export interface PseConcreteCaseGroupPostApiObject {
	pseConcreteCaseSessionId: string;
	name: string;
	/*state *
	 * array of user id
	 */ 
	students: Array<string>
}

export interface PseConcreteCaseGroupPutApiObject {
	pseConcreteCaseSessionId: string;
	name: string;
	/**
	 * array of user id
	 */ 
	students: Array<string>
}