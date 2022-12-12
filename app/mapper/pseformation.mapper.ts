import type { PseFormationEntity } from "~/apiobject/entity";
import type { PseFormationApiObject, PseFormationPutApiObject, PseFormationStateApiEnum } from "~/apiobject/pseformation.apiobject";
import type { PseFormationDto, PseFormationPutDto } from "~/dto/pseformation.dto";
import { placeApiObjectToPlaceDto } from "./place.mapper";

export function dataToPseFormationPutDto(data: any): PseFormationPutDto {
	return {
    state: data.state,
    title: data.title,
    from: data.from,
    to: data.to,
    placeId: data.placeId
  };
}

export function pseFormationApiObjectToDto(apiObject: PseFormationApiObject): PseFormationDto {
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt,
		updatedAt: apiObject.updatedAt,
		state: apiObject.state,
		title: apiObject.title,
		from: apiObject.from,
		to: apiObject.to,
		place: placeApiObjectToPlaceDto(apiObject.place),
	}
}

export function pseFormationPutDtoToApiObject(putDto: PseFormationPutDto): PseFormationPutApiObject {
	return {
		state: putDto.state,
		title: putDto.title,
		from: putDto.from,
		to: putDto.to,
		placeId: putDto.placeId
	}
}

export function pseFormationEntityToApiObject(entity: PseFormationEntity): PseFormationApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		state: stringToPseFormationStateApiEnum(entity.state),
		title: entity.title,
		from: entity.from,
		to: entity.to,
		place: entity.place,
	}
}

function stringToPseFormationStateApiEnum(state: string): PseFormationStateApiEnum {
	// TODO: enforce validity
	return state as PseFormationStateApiEnum
}
