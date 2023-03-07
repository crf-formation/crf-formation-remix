import type { UserApiObject } from './user.apiobject';

// TODO:
export interface PseConcreteCaseGroupApiObject {
	readonly id: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly name: string;

	readonly pseConcreteCaseSessionId: string
	// readonly pseConcreteCaseSession?: Optional<> TODO:

	readonly students: Array<PseUserConcreteCaseGroupStudentApiObject>
}

export interface PseUserConcreteCaseGroupStudentApiObject {
	readonly id: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly userId: string;
	readonly user?: Optional<UserApiObject>;
}


export interface PseConcreteCaseGroupPostApiObject {
	readonly pseConcreteCaseSessionId: string;
	readonly name: string;
	/*state *
	 * array of user id
	 */ 
	readonly students: Array<string>
}

export interface PseConcreteCaseGroupPutApiObject {
	readonly pseConcreteCaseSessionId: string;
	readonly name: string;
	/**
	 * array of user id
	 */ 
	readonly students: Array<string>
}