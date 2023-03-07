import type { UserDto } from './user.dto';

// TODO:
export interface PseConcreteCaseGroupDto {
	readonly id: string;
	readonly createdAt: DateISOString;
	readonly updatedAt: DateISOString;
	readonly name: string;

	readonly pseConcreteCaseSessionId: string
	// readonly pseConcreteCaseSession?: Optional<> TODO:

	readonly students: Array<PseUserConcreteCaseGroupStudentDto>
}

export interface PseUserConcreteCaseGroupStudentDto {
	readonly id: string;
	readonly createdAt: DateISOString;
	readonly updatedAt: DateISOString;
	readonly userId: string;
	readonly user: UserDto;
}

export interface PseConcreteCaseGroupPostDto {
	readonly pseConcreteCaseSessionId: string;
	readonly name: string;
	/**
	 * array of user id
	 */ 
	readonly students: Array<string>
}

export interface PseConcreteCaseGroupPutDto {
	readonly pseConcreteCaseSessionId: string;
	readonly name: string;
	/**
	 * array of user id
	 */ 
	readonly students: Array<string>
}