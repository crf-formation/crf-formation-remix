import type { UserDto } from './user.dto';

export type PseConcreteCaseGroupDtoEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

// TODO:
export interface PseConcreteCaseGroupDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;
	name: string;
	state: PseConcreteCaseGroupDtoEnum

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
	students: Array<String>
}