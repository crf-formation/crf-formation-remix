import { parse, parseISO } from "date-fns";
import type { PseFormationEntity } from "~/apiobject/entity";
import type { PseFormationApiObject, PseFormationPostApiObject, PseFormationPutApiObject, PseFormationStateApiEnum } from "~/apiobject/pseformation.apiobject";
import type { PseFormationDto, PseFormationPostDto, PseFormationPutDto } from "~/dto/pseformation.dto";
import { placeApiObjectToDto } from "./place.mapper";

export function dataToPseFormationPostDto(data: any): PseFormationPostDto {
	return {
    state: data.state,
    title: data.title.trim(),
    from: parse(data.from, "yyyy-MM-dd", new Date()),
    to: parse(data.to, "yyyy-MM-dd", new Date()),
    placeId: data.placeId
  };
}


export function dataToPseFormationPutDto(data: any): PseFormationPutDto {
	return {
    state: data.state,
    title: data.title.trim(),
    from: parseISO(data.from),
    to: parseISO(data.to),
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
		place: placeApiObjectToDto(apiObject.place),
		placeId: apiObject.place?.id,
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

export function pseFormationPostDtoToApiObject(postDto: PseFormationPostDto): PseFormationPostApiObject {
	return {
		state: postDto.state,
		title: postDto.title,
		from: postDto.from,
		to: postDto.to,
		placeId: postDto.placeId
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
