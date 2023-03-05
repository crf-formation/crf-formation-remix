import { z } from 'zod';
import type { PseCompetenceDto } from './psecompetence.dto';
import type { PseConcreteCaseGroupDto } from './pseconcretecasegroup.dto';
import type { PseConcreteCaseTypeDto } from './pseconcretecasetype.dto';
import type { UserDto } from './user.dto';

export type PseUserConcreteCaseStateDtoEnum = 'CREATED' | 'RUNNING' | 'CLOSED';
export type PseUserConcreteCaseRoleApi = 'LEADER' | 'MINION' | 'WATCHER'

// TODO: no zod on dtos?
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


// --

export interface PseUserConcreteCaseGroupEvaluationDto {
	formationId: string;
	pseConcreteCaseSituationId: string;
	pseConcreteCaseGroupId: string;
	pseConcreteCaseSessionId: string;

	usersGrades: Array<PseUserGradesEvaluationDto>;

	// utility data
	competencesToEvaluate: Array<PseCompetenceDto>;
	students: Array<UserDto>;
}

export interface PseUserGradesEvaluationDto {
	userId: string;
	grades: Array<PseEvaluationCompetenceGradeDto>;
}

export interface PseEvaluationCompetenceGradeDto {
	pseCompetenceId: string;
	shouldEvaluate: boolean;
	grade: PseUserConcreteCaseCompetenceGradeDtoEnum // should default to NOT_EVALUATED
}

// --

export interface PseUserConcreteCaseGroupEvaluationPostDto {
	formationId: string;
	pseConcreteCaseSituationId: string;
	pseConcreteCaseGroupId: string;
	pseConcreteCaseSessionId: string;

	usersGrades: Array<PseUserGradesEvaluationPostDto>;
}

export interface PseUserGradesEvaluationPostDto {
	userId: string;
	grades: Array<PseEvaluationCompetenceGradePostDto>;
}

export interface PseEvaluationCompetenceGradePostDto {
	pseCompetenceId: string;
	grade: PseUserConcreteCaseCompetenceGradeDtoEnum // should default to NOT_EVALUATED
}