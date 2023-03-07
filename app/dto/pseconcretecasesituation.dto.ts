import type { PseConcreteCaseGroupDto } from './pseconcretecasegroup.dto';
import type { PseConcreteCaseTypeDto } from './pseconcretecasetype.dto';
import type { UserDto } from './user.dto';


export interface PseConcreteCaseSituationDto {
	readonly id: string;
	readonly createdAt: DateISOString;
	readonly updatedAt: DateISOString;

	readonly teacherId: string;
	readonly teacher: UserDto;

	readonly name: string; // dto only

	readonly pseConcreteCaseType: PseConcreteCaseTypeDto;

	readonly pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupDto>
}

export interface PseSituationConcreteCaseGroupDto {
	readonly id: string;
	readonly createdAt: DateISOString;
	readonly updatedAt: DateISOString;

	readonly pseConcreteCaseGroupId: string;
	readonly pseConcreteCaseGroup: PseConcreteCaseGroupDto;

	/**
	 * Position of the group in the situation, to order them.
	 */
	readonly position: number;
}

export interface PseConcreteCaseSituationPostDto {
	readonly pseConcreteCaseSessionId: string;
	readonly pseConcreteCaseTypeId: string;
	readonly teacherId: string;
	readonly pseSituationConcreteCaseGroups?: Array<PseSituationConcreteCaseGroupPutDto>
}

export interface PseConcreteCaseSituationPutDto {
	readonly pseConcreteCaseTypeId: string;
	readonly teacherId: string;
	readonly pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupPutDto>
}

export interface PseSituationConcreteCaseGroupPutDto {
	readonly id?: string; // null if creation, non-null if already exists
	readonly pseConcreteCaseGroupId: string;
	readonly position: number;
}

export interface PseSituationConcreteCaseGroupPostDto {
	readonly pseConcreteCaseGroupId: string;
	readonly position: number;
}
