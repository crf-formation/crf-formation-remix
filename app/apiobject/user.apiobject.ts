import type { AuthorityApiEnum } from "~/apiobject/permission.apiobject";

export type UserStateApiEnum = "CREATED" | "DISABLED" | "ENABLED" | "ARCHIVED"
export type UserRoleApiEnum = "USER" | "ADMIN" | "SUPER_ADMIN"

export interface UserApiObject {
  readonly id: string;
  readonly state: UserStateApiEnum;
  readonly role: UserRoleApiEnum;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UserMeApiObject extends UserApiObject {
  readonly permissions: Array<PermissionApiObject>;
}

export interface PermissionApiObject {
  id: string;
  identifier: AuthorityApiEnum;
  technicalName: string;
  technicalDescription: string;
}

export interface UserPostApiObject {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly state: UserStateApiEnum;
  readonly role: UserRoleApiEnum;
}

export interface UserPutApiObject {
  readonly state: UserStateApiEnum;
  readonly role: UserRoleApiEnum;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface UserAuthTokenApiObject {
  readonly user: UserApiObject;
}
