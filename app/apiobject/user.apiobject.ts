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

export interface UserMeApiObject {
  readonly id: string;
  readonly role: UserRoleApiEnum;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly isAdmin: boolean;
  readonly isSuperAdmin: boolean;

  // isAdmin or isSuperAdmin
  readonly hasAdminPermission: boolean;
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
