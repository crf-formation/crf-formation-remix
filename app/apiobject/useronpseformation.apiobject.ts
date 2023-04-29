import type { UserApiObject } from "./user.apiobject";

export type UserOnPseFormationRoleApiEnum = "STUDENT" | "TEACHER"

export interface UserOnPseFormationApiObject {
  readonly id: string;
  readonly formationId: string;
  readonly userId: string;
  readonly role: UserOnPseFormationRoleApiEnum;
  readonly assignedAt: Date;
  readonly user: UserApiObject;
}

export interface UserOnPseFormationPutApiObject {
  readonly id: Optional<string>;
  readonly userId: string;
  readonly formationId: string;
  readonly role: UserOnPseFormationRoleApiEnum;
  readonly assignedAt: Date;
}