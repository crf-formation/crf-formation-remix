import type { PlaceDto } from "./place.dto";
import type { UserOnPseFormationDto } from "./useronpseformation.dto";

export type FormationStateDtoEnum = 'CREATED' | 'DISABLED' | 'ENABLED' | 'ARCHIVED'

export interface PseFormationDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  state: FormationStateDtoEnum;
  title: string;
	from: Date;
	to: Date;
	place: PlaceDto;
	placeId: string;
	users: Array<UserOnPseFormationDto>;
}

export interface PseFormationPostDto {
	state: FormationStateDtoEnum;
  title: string;
	from: Date;
	to: Date;
	placeId: string;
}

export interface PseFormationPutDto {
	state: FormationStateDtoEnum;
  title: string;
	from: Date;
	to: Date;
	placeId: string;
}