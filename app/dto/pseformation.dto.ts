import type { PlaceDto } from "./place.dto";
import type { UserDto } from "./user.dto";

export type PseFormationStateDtoEnum = "CREATED" | "DISABLED" | "ENABLED" | "ARCHIVED"

export interface PseFormationDto {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly state: PseFormationStateDtoEnum;
  readonly title: string;
  readonly from: string;
  readonly to: string;
  readonly place: PlaceDto;
  readonly placeId: string;
  readonly teachers: Array<UserDto>;
  readonly students: Array<UserDto>;
}

export interface PseFormationPostDto {
  readonly state: PseFormationStateDtoEnum;
  readonly title: string;
  readonly from: Date;
  readonly to: Date;
  readonly placeId: string;
}

export interface PseFormationPutDto {
  readonly state: PseFormationStateDtoEnum;
  readonly title: string;
  readonly from: Date;
  readonly to: Date;
  readonly placeId: string;
  readonly users: Array<UserDto>;
}