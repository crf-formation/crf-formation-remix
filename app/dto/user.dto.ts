import type { DateTime } from "~/constants/types";

type UserStateDtoEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'

export interface UserDto {
  id: string;
  storesGroupId: string;
  state: UserStateDtoEnum;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  creationDate: DateTime;
  modificationDate: DateTime;
}

export interface UserPostDto {
  storesGroupId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserPutDto {
  storesGroupId: string;
  state: UserStateDtoEnum;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UserMeDto {
  id: String;
  email: String;
  state: UserStateDtoEnum;
  firstName: String;
  lastName: String;
  phoneNumber: String;
  creationDate: DateTime;
  modificationDate: DateTime;
}