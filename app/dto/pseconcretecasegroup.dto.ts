import type { UserDto } from './user.dto';

// TODO:
export interface PseConcreteCaseGroupDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;
	name: string;

	pseConcreteCaseSessionId: string
	// pseConcreteCaseSession?: Optional<> TODO:

	students: Array<PseUserConcreteCaseGroupStudentDto>
}

export interface PseUserConcreteCaseGroupStudentDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;
	userId: string;
	user?: Optional<UserDto>;
}

export interface PseConcreteCaseGroupPostDto {
	pseConcreteCaseSessionId: string;
	name: string;
	/**
	 * array of user id
	 */ 
	students: Array<string>
}

export interface PseConcreteCaseGroupPutDto {
	pseConcreteCaseSessionId: string;
	name: string;
	/**
	 * array of user id
	 */ 
	students: Array<string>
}