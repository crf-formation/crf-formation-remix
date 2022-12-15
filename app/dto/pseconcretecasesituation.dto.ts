import type { PseConcreteCaseTypeDto } from './pseconcretecasetype.dto';
import type { PseConcreteCaseGroupDto } from './pseconcretecasegroup.dto';
import type { UserDto } from './user.dto';


export interface PseConcreteCaseSituationDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;

	teacherId: string;
	teacher: UserDto;

	pseConcreteCaseType: PseConcreteCaseTypeDto;

	pseConcreteCaseGroups: Array<PseSituationConcreteCaseGroupDto>
}

export interface PseSituationConcreteCaseGroupDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;

	groupId: string;
	group: PseConcreteCaseGroupDto;

	/**
	 * Position of the group in the situation, to order them.
	 */
	position: number;
}