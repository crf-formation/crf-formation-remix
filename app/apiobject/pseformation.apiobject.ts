import type { PlaceApiObject } from "./place.apiobject";
import type { UserOnPseFormationApiObject } from "./useronpseformation.apiobject";

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
}
