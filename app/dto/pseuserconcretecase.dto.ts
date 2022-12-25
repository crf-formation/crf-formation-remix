import { z } from 'zod';
import type { PseCompetenceDto } from './psecompetence.dto';
import type { PseConcreteCaseGroupDto } from './pseconcretecasegroup.dto';
import type { PseConcreteCaseTypeDto } from './pseconcretecasetype.dto';
import type { UserDto } from './user.dto';

export type PseUserConcreteCaseStateDtoEnum = 'CREATED' | 'RUNNING' | 'CLOSED';
export type PseUserConcreteCaseRoleApi = 'LEADER' | 'MINION' | 'WATCHER'

export const PseUserConcreteCaseCompetenceGradeZEnum = z.enum(['A', 'B', 'C', 'D', 'NOT_EVALUATED'])
export type PseUserConcreteCaseCompetenceGradeDtoEnum = z.infer<typeof PseUserConcreteCaseCompetenceGradeZEnum>

export interface PseUserConcreteCaseDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;
	userId: string;
	// optionally loaded
	user?: UserDto;
	concreteCaseGroup: PseConcreteCaseGroupDto;
	concreteCaseType: PseConcreteCaseTypeDto;
	state: PseUserConcreteCaseStateDtoEnum;
	selected: boolean;
	competences: Array<PseUserConcreteCaseCompetenceDto>
	role: PseUserConcreteCaseRoleApi;
}

export interface PseUserConcreteCaseCompetenceDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;
	pseCompetenceId: string;
	pseCompetence: PseCompetenceDto;
	grade: PseUserConcreteCaseCompetenceGradeDtoEnum;
}