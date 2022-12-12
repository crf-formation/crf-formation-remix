
export type UserOnPseFormationRoleApiEnum = 'STUDENT'

export interface UserOnPseFormationApiObject {
	formationId: string;
	userId: string;
	role: UserOnPseFormationRoleApiEnum;
	assignedAt: Date;
}