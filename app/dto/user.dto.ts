import type { DateTime } from "~/constants/types";

export type UserStateDtoEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'
export type UserRoleDtoEnum = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface UserDto {
  id: string;
  state: UserStateDtoEnum;
  role: UserRoleDtoEnum;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: DateTime;
  updatedAt: DateTime;

  isAdmin: boolean;
  isSuperAdmin: boolean;

  // isAdmin or isSuperAdmin
  hasAdminPermission: boolean;
}

export interface UserPostDto {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserPutDto {
  state: UserStateDtoEnum;
  role: UserRoleDtoEnum;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserMeDto {
  id: string;
  email: string;
  state: UserStateDtoEnum;
  role: UserRoleDtoEnum;
  firstName: string;
  lastName: string;
  createdAt: DateTime;
  updatedAt: DateTime;

  isAdmin: boolean;
  isSuperAdmin: boolean;

  // isAdmin or isSuperAdmin
  hasAdminPermission: boolean;
}

