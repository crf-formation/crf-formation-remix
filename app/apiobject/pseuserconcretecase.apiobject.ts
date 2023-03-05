import type { PseConcreteCaseSituationApiObject } from '~/apiobject/pseconcretecasesituation.apiobject';
import type { PseCompetenceApiObject } from './psecompetence.apiobject';
import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';
import type { UserApiObject } from './user.apiobject';

export type PseUserConcreteCaseStateApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';
export type PseUserConcreteCaseCompetenceGradeApiEnum = 'A' | 'B' | 'C' | 'D' | 'NOT_EVALUATED';
export type PseUserConcreteCaseRoleApiEnum = 'LEADER' | 'MINION' | 'WATCHER' | 'UNKNOWN';

export interface PseUserConcreteCaseApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	// optionally loaded
	user?: UserApiObject;
	pseConcreteCaseGroup: PseConcreteCaseGroupApiObject;
	pseConcreteCaseSituation: PseConcreteCaseSituationApiObject;
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
	pseSituationConcreteCaseGroupId: string;
	competencesToEvaluate: Array<PseCompetenceApiObject>;
	students: Array<UserApiObject>;
	usersGrades: Array<PseUserEvaluationApiObject>;
}

export interface PseUserEvaluationApiObject {
	userId: string;
	role: PseUserConcreteCaseRoleApiEnum; // should default to UNKNOWN
	grades: Array<PseEvaluationCompetenceGradeApiObject>;
}

export interface PseEvaluationCompetenceGradeApiObject {
	pseCompetenceId: string;
	shouldEvaluate: boolean; // shortcut data: calculated using pseConcreteCaseType.competencesToEvaluate.
	grade: PseUserConcreteCaseCompetenceGradeApiEnum // should default to NOT_EVALUATED
}

// --

export interface PseUserConcreteCaseGroupEvaluationPostApiObject {
	formationId: string;
	pseConcreteCaseSituationId: string;
	pseConcreteCaseGroupId: string;
	pseConcreteCaseSessionId: string;
	pseConcreteCaseTypeId: string;
	pseSituationConcreteCaseGroupId: string;
	usersGrades: Array<PseUserEvaluationPostApiObject>;
}

export interface PseUserEvaluationPostApiObject {
	userId: string;
	role: PseUserConcreteCaseRoleApiEnum;
	grades: Array<PseEvaluationCompetenceGradePostApiObject>;
}

export interface PseEvaluationCompetenceGradePostApiObject {
	pseCompetenceId: string;
	grade: PseUserConcreteCaseCompetenceGradeApiEnum // should default to NOT_EVALUATED
}
