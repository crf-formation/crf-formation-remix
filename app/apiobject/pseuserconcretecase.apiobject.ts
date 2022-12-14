import type { PseCompetenceApiObject } from './psecompetence.apiobject';
import type { PseConcreteCaseTypeApiObject } from './pseconcretecase';
import type { PseConcreteCaseGroupApiObject } from './pseuserconcretecasegroup.apiobject';
import type { UserApiObject } from './user.apiobject';

type PseUserConcreteCaseStateApiEnum = 'CREATED' | 'RUNNING' | 'CLOSED';
type PseUserConcreteCaseCompetenceGradeApiEnum = 'A' | 'B' | 'C' | 'D' | 'NOT_EVALUATED';
type PseUserConcreteCaseRoleApi = 'LEADER' | 'MINION' | 'WATCHER'

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
	role: PseUserConcreteCaseRoleApi;
}

export interface PseUserConcreteCaseCompetenceApiObject {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	pseCompetenceId: string;
	pseCompetence: PseCompetenceApiObject;
	grade: PseUserConcreteCaseCompetenceGradeApiEnum;
}