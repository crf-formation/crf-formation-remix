import type { UserDto } from "./user.dto";

export type UserOnPseFormationRoleDtoEnum = 'STUDENT'

export interface UserOnPseFormationDto {
	formationId: string;
	userId: string;
	role: UserOnPseFormationRoleDtoEnum;
	assignedAt: Date;
	user: UserDto;
}