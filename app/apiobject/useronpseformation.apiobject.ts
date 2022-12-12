import type { UserApiObject } from "./user.apiobject";

export type UserOnPseFormationRoleApiEnum = 'STUDENT' | 'TEACHER'

export interface UserOnPseFormationApiObject {
	id: string;
	formationId: string;
	userId: string;
	role: UserOnPseFormationRoleApiEnum;
	assignedAt: Date;
	user: UserApiObject;
}

export interface UserOnPseFormationPutApiObject {
	id: Optional<string>;
	userId: string;
	formationId: string;
	role: UserOnPseFormationRoleApiEnum;
	assignedAt: Date;
}