export type UserStateApiEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'
export type UserRoleApiEnum = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface UserApiObject {
  id: string;
  state: UserStateApiEnum;
  role: UserRoleApiEnum;
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
  role: UserRoleApiEnum;
}

export interface UserPutApiObject {
  state: UserStateApiEnum;
  role: UserRoleApiEnum;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserAuthTokenApiObject {
  user: UserApiObject
}
