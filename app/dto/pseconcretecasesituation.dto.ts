import type { PseConcreteCaseGroupDto } from './pseconcretecasegroup.dto';
import type { PseConcreteCaseTypeDto } from './pseconcretecasetype.dto';
import type { UserDto } from './user.dto';


export interface PseConcreteCaseSituationDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;

	teacherId: string;
	teacher: UserDto;

	name: string; // dto only

	pseConcreteCaseType: PseConcreteCaseTypeDto;

	pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupDto>
}

export interface PseSituationConcreteCaseGroupDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;

	pseConcreteCaseGroupId: string;
	pseConcreteCaseGroup: PseConcreteCaseGroupDto;

	/**
	 * Position of the group in the situation, to order them.
	 */
	position: number;
}

export interface PseConcreteCaseSituationPostDto {
	pseConcreteCaseSessionId: string;
	pseConcreteCaseTypeId: string;
	teacherId: string;
	pseSituationConcreteCaseGroups?: Array<PseSituationConcreteCaseGroupPutDto>
}

export interface PseConcreteCaseSituationPutDto {
	pseConcreteCaseTypeId: string;
	teacherId: string;
	pseSituationConcreteCaseGroups: Array<PseSituationConcreteCaseGroupPutDto>
}

export interface PseSituationConcreteCaseGroupPutDto {
	id?: string; // null if creation, non-null if already exists.
	pseConcreteCaseGroupId: string;
	position: number;
}

export interface PseSituationConcreteCaseGroupPostDto {
	pseConcreteCaseGroupId: string;
	position: number;
}
