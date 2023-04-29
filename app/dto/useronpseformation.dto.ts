import type { UserDto } from "./user.dto";

export type UserOnPseFormationRoleDtoEnum = "STUDENT" | "TEACHER"

export interface UserOnPseFormationDto {
  readonly formationId: string;
  readonly userId: string;
  readonly role: UserOnPseFormationRoleDtoEnum;
  readonly assignedAt: DateISOString;
  readonly user: UserDto;
}

export interface UserOnPseFormationPutDto {
  readonly userId: string;
  readonly role: UserOnPseFormationRoleDtoEnum;
  readonly assignedAt: Date;
}
