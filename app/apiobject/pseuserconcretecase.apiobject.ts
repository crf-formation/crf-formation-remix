import type { PseCompetenceApiObject } from './psecompetence.apiobject';
import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';
import type { PseConcreteCaseTypeApiObject } from './pseconcretecasetype.apiobject';
import type { UserApiObject } from './user.apiobject';

export type PseUserConcreteCaseStateApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';
export type PseUserConcreteCaseCompetenceGradeApiEnum = 'A' | 'B' | 'C' | 'D' | 'NOT_EVALUATED';
export type PseUserConcreteCaseRoleApiEnum = 'LEADER' | 'MINION' | 'WATCHER'

export interface PseUserConcreteCaseApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	// optionally loaded
	user?: UserApiObject;
	concreteCaseGroup: PseConcreteCaseGroupApiObject;
	concreteCaseType: PseConcreteCaseTypeApiObject;
	state: PseUserConcreteCaseStateApiEnum;
	selected: boolean;
	competences: Array<PseUserConcreteCaseCompetenceApiObject>
	role: PseUserConcreteCaseRoleApiEnum;
}

export interface PseUserConcreteCaseCompetenceApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	pseCompetenceId: string;
	pseCompetence: PseCompetenceApiObject;
	grade: PseUserConcreteCaseCompetenceGradeApiEnum;
}

// --

/**
 * conveniant data to evaluate a group of students for a concrete case.
 */

export interface PseUserConcreteCaseGroupEvaluationApiObject {
	formationId: string;
	pseConcreteCaseSituationId: string;
	pseConcreteCaseGroupId: string;
	pseConcreteCaseSessionId: string;
	pseConcreteCaseTypeId: string;
	competencesToEvaluate: Array<PseCompetenceApiObject>;
	students: Array<UserApiObject>;
	usersGrades: Array<PseUserEvaluationApiObject>;
}

export interface PseUserEvaluationApiObject {
	userId: string;
	grades: Array<PseEvaluationCompetenceGradeApiObject>;
}

export interface PseEvaluationCompetenceGradeApiObject {
	pseCompetenceId: string;
	shouldEvaluate: boolean;
	grade: PseUserConcreteCaseCompetenceGradeApiEnum // should default to NOT_EVALUATED
}

// --

export interface PseUserConcreteCaseGroupEvaluationPostApiObject {
	formationId: string;
	pseConcreteCaseSituationId: string;
	pseConcreteCaseGroupId: string;
	pseConcreteCaseSessionId: string;
	pseConcreteCaseTypeId: string;
	usersGrades: Array<PseUserEvaluationPostApiObject>;
}

export interface PseUserEvaluationPostApiObject {
	userId: string;
	role: string;
	grades: Array<PseEvaluationCompetenceGradePostApiObject>;
}

export interface PseEvaluationCompetenceGradePostApiObject {
	pseCompetenceId: string;
	grade: PseUserConcreteCaseCompetenceGradeApiEnum // should default to NOT_EVALUATED
}
