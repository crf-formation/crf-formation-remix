import { AuthorityDtoEnum } from "./permission.dto";

export type UserStateDtoEnum = "CREATED" | "DISABLED" | "ENABLED" | "ARCHIVED"
export type UserRoleDtoEnum = "USER" | "ADMIN" | "SUPER_ADMIN"

export interface UserDto {
  readonly id: string;
  readonly state: UserStateDtoEnum;
  readonly role: UserRoleDtoEnum;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly createdAt: DateISOString;
  readonly updatedAt: DateISOString;
}

export interface UserPostDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

export interface UserPutDto {
  readonly state: UserStateDtoEnum;
  readonly role: UserRoleDtoEnum;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface UserPasswordPutDto {
  readonly passwordVerification: string;
  readonly password: string;
  readonly currentPassword: string;
}

export interface UserMeDto {
  readonly id: string;
  readonly email: string;
  readonly role: UserRoleDtoEnum;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly createdAt: DateISOString;
  readonly updatedAt: DateISOString;
  readonly permissions: Array<PermissionDto>;
}

export interface PermissionDto {
  id: string;
  identifier: AuthorityDtoEnum;
  technicalName: string;
  technicalDescription: string;
}

export interface PasswordCreateDto {
  readonly email: string;
  readonly token: string;
  readonly password: string;
  readonly passwordVerification: string;
}

export interface PasswordResetDto {
  readonly email: string;
  readonly token: string;
  readonly password: string;
  readonly passwordVerification: string;
}

export interface PasswordAskResetDto {
  readonly email: string;
}