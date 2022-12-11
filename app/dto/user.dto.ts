import type { DateTime } from "~/constants/types";

type UserStateDtoEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'

export interface UserDto {
  id: string;
  state: UserStateDtoEnum;
  email: string;
  firstName: string;
  lastName: string;
  creationDate: DateTime;
  modificationDate: DateTime;
}

export interface UserPostDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserPutDto {
  state: UserStateDtoEnum;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserMeDto {
  id: String;
  email: String;
  state: UserStateDtoEnum;
  firstName: String;
  lastName: String;
  creationDate: DateTime;
  modificationDate: DateTime;
}


export interface UserAuthToken {
  token: string
  user: UserDto
}