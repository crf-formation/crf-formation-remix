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
  createdAt: DateTime;
  updatedAt: DateTime;
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
  id: String;
  email: String;
  state: UserStateDtoEnum;
  role: UserRoleDtoEnum;
  firstName: String;
  lastName: String;
  createdAt: DateTime;
  updatedAt: DateTime;
}

