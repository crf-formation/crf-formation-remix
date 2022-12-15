import type { PseCompetenceApiObject } from './psecompetence.apiobject';
import type { PseConcreteCaseTypeApiObject } from './pseconcretecasetype.apiobject';
import type { PseConcreteCaseGroupApiObject } from './pseconcretecasegroup.apiobject';
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