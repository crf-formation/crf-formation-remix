import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { PlaceApiObject } from "./place.apiobject";
import type { UserOnPseFormationApiObject, UserOnPseFormationPutApiObject } from "./useronpseformation.apiobject";

export type PseFormationStateApiEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'

export interface PseFormationApiObject {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  state: PseFormationStateApiEnum;
  title: string;
	from: Date;
	to: Date;
	place: PlaceApiObject;
	users: Array<UserOnPseFormationApiObject>;

	teachers: Array<UserApiObject>;
	students: Array<UserApiObject>;
}

export interface PseFormationPostApiObject {
	state: PseFormationStateApiEnum;
  title: string;
	from: Date;
	to: Date;
	placeId: string;
}

export interface PseFormationPutApiObject {
  state: PseFormationStateApiEnum;
  title: string;
	from: Date;
	to: Date;
	placeId: string;
	users: Array<UserOnPseFormationPutApiObject>;
}
