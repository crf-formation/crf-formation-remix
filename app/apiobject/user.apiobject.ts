export type UserStateApiEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'

export interface UserApiObject {
  id: string;
  state: UserStateApiEnum;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPostApiObject {
	firstName: string;
  lastName: string;
  email: string;
	state: UserStateApiEnum;
  password: string;
}

export interface UserPutApiObject {
  state: UserStateApiEnum;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserAuthTokenApiObject {
  user: UserApiObject
}
