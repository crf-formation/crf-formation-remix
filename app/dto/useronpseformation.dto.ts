import type { UserDto } from "./user.dto";

export type UserOnPseFormationRoleDtoEnum = 'STUDENT' | 'TEACHER'

export interface UserOnPseFormationDto {
	formationId: string;
	userId: string;
	role: UserOnPseFormationRoleDtoEnum;
	assignedAt: DateISOString;
	user: UserDto;
}

export interface UserOnPseFormationPutDto {
	userId: string;
	role: UserOnPseFormationRoleDtoEnum;
	assignedAt: Date;
}
