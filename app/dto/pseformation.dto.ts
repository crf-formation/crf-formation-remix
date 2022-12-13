import type { PlaceDto } from "./place.dto";
import type { UserDto } from "./user.dto";
import type { UserOnPseFormationDto, UserOnPseFormationPutDto } from "./useronpseformation.dto";

export type PseFormationStateDtoEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'

export interface PseFormationDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  state: PseFormationStateDtoEnum;
  title: string;
	from: string;
	to: string;
	place: PlaceDto;
	placeId: string;
	users: Array<UserOnPseFormationDto>;
	teachers: Array<UserDto>;
	students: Array<UserDto>;
}

export interface PseFormationPostDto {
	state: PseFormationStateDtoEnum;
  title: string;
	from: Date;
	to: Date;
	placeId: string;
}

export interface PseFormationPutDto {
	state: PseFormationStateDtoEnum;
  title: string;
	from: Date;
	to: Date;
	placeId: string;
	users: Array<UserOnPseFormationPutDto>;
}