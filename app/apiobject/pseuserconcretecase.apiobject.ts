import type { PseConcreteCaseSituationApiObject } from '~/apiobject/pseconcretecasesituation.apiobject';
import type { PseCompetenceApiObject } from './psecompetence.apiobject';
import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';
import type { UserApiObject } from './user.apiobject';

export type PseUserConcreteCaseStateApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';
export type PseUserConcreteCaseCompetenceGradeApiEnum = 'A' | 'B' | 'C' | 'D' | 'NOT_EVALUATED';
export type PseUserConcreteCaseRoleApiEnum = 'LEADER' | 'MINION' | 'WATCHER' | 'UNKNOWN';

export interface PseUserConcreteCaseApiObject {
	readonly id: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly userId: string;
	// optionally loaded
	readonly user?: UserApiObject;
	readonly pseConcreteCaseGroup: PseConcreteCaseGroupApiObject;
	readonly pseConcreteCaseSituation: PseConcreteCaseSituationApiObject;
	readonly state: PseUserConcreteCaseStateApiEnum;
	readonly selected: boolean;
	readonly competences: Array<PseUserConcreteCaseCompetenceApiObject>
	readonly role: PseUserConcreteCaseRoleApiEnum;
}

export interface PseUserConcreteCaseCompetenceApiObject {
	readonly id: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
	readonly pseCompetenceId: string;
	readonly pseCompetence: PseCompetenceApiObject;
	readonly grade: PseUserConcreteCaseCompetenceGradeApiEnum;
}

// --

/**
 * conveniant data to evaluate a group of students for a concrete case.
 */

export interface PseUserConcreteCaseGroupEvaluationApiObject {
	readonly formationId: string;
	readonly pseConcreteCaseSituationId: string;
	readonly pseConcreteCaseGroupId: string;
	readonly pseConcreteCaseSessionId: string;
	readonly pseConcreteCaseTypeId: string;
	readonly pseSituationConcreteCaseGroupId: string;
	readonly competencesToEvaluate: Array<PseCompetenceApiObject>;
	readonly students: Array<UserApiObject>;
	readonly usersGrades: Array<PseUserEvaluationApiObject>;
}

export interface PseUserEvaluationApiObject {
	readonly userId: string;
	readonly role: PseUserConcreteCaseRoleApiEnum; // should default to UNKNOWN
	readonly grades: Array<PseEvaluationCompetenceGradeApiObject>;
}

export interface PseEvaluationCompetenceGradeApiObject {
	readonly pseCompetenceId: string;
	readonly shouldEvaluate: boolean; // shortcut data: calculated using pseConcreteCaseType.competencesToEvaluate.
	readonly grade: PseUserConcreteCaseCompetenceGradeApiEnum // should default to NOT_EVALUATED
}

// --

export interface PseUserConcreteCaseGroupEvaluationPostApiObject {
	readonly formationId: string;
	readonly pseConcreteCaseSituationId: string;
	readonly pseConcreteCaseGroupId: string;
	readonly pseConcreteCaseSessionId: string;
	readonly pseConcreteCaseTypeId: string;
	readonly pseSituationConcreteCaseGroupId: string;
	readonly usersGrades: Array<PseUserEvaluationPostApiObject>;
}

export interface PseUserEvaluationPostApiObject {
	readonly userId: string;
	readonly role: PseUserConcreteCaseRoleApiEnum;
	readonly grades: Array<PseEvaluationCompetenceGradePostApiObject>;
}

export interface PseEvaluationCompetenceGradePostApiObject {
	readonly pseCompetenceId: string;
	readonly grade: PseUserConcreteCaseCompetenceGradeApiEnum // should default to NOT_EVALUATED
}
