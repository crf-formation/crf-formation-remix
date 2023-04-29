import type { UserApiObject } from "~/apiobject/user.apiobject";
import type { PlaceApiObject } from "./place.apiobject";
import type { UserOnPseFormationApiObject, UserOnPseFormationPutApiObject } from "./useronpseformation.apiobject";

export type PseFormationStateApiEnum = "CREATED" | "DISABLED" | "ENABLED" | "ARCHIVED"

export interface PseFormationApiObject {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly state: PseFormationStateApiEnum;
  readonly title: string;
  readonly from: Date;
  readonly to: Date;
  readonly place: PlaceApiObject;
  readonly users: Array<UserOnPseFormationApiObject>;

  readonly teachers: Array<UserApiObject>;
  readonly students: Array<UserApiObject>;
}

export interface PseFormationPostApiObject {
  readonly state: PseFormationStateApiEnum;
  readonly title: string;
  readonly from: Date;
  readonly to: Date;
  readonly placeId: string;
}

export interface PseFormationPutApiObject {
  readonly state: PseFormationStateApiEnum;
  readonly title: string;
  readonly from: Date;
  readonly to: Date;
  readonly placeId: string;
  readonly users: Array<UserOnPseFormationPutApiObject>;
}
