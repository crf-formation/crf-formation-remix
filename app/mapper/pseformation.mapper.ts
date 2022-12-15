import { parse, parseISO } from "date-fns";
import type { PseFormationEntity } from "~/apiobject/entity";
import type { PseFormationApiObject, PseFormationPostApiObject, PseFormationPutApiObject, PseFormationStateApiEnum } from "~/apiobject/pseformation.apiobject";
import type { PseFormationDto, PseFormationPostDto, PseFormationPutDto } from "~/dto/pseformation.dto";
import { placeApiObjectToDto, placeEntityToApiObject } from "./place.mapper";
import { userOnPseFormationApiObjectToDto, userOnPseFormationDataPutDtoToApiObject, userOnPseFormationDataToPutDto, userOnPseFormationEntityToApiObject } from "./useronpseformation.mapper";

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
    placeId: data.placeId,
    users: [
      ...(data.teachers || []).map((userOnPseFormationData: any) =>
        userOnPseFormationDataToPutDto(userOnPseFormationData, "TEACHER")
      ),
      ...(data.students || []).map((userOnPseFormationData: any) =>
        userOnPseFormationDataToPutDto(userOnPseFormationData, "STUDENT")
      ),
    ],
  };
}

export function pseFormationApiObjectToDto(apiObject: PseFormationApiObject): PseFormationDto {
	const users = apiObject.users?.map(userOnPseFormationApiObjectToDto)
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt,
		updatedAt: apiObject.updatedAt,
		state: apiObject.state,
		title: apiObject.title,
		from: apiObject.from.toISOString(),
		to: apiObject.to.toISOString(),
		place: placeApiObjectToDto(apiObject.place),
		placeId: apiObject.place?.id,
		// /!\ is not loaded for lists.
		teachers: users.filter(user => user.role === 'TEACHER').map(user => user.user),
		students: users.filter(user => user.role === 'STUDENT').map(user => user.user),
	}
}

export function pseFormationPutDtoToApiObject(putDto: PseFormationPutDto, current: PseFormationApiObject): PseFormationPutApiObject {
	return {
		state: putDto.state,
		title: putDto.title,
		from: putDto.from,
		to: putDto.to,
		placeId: putDto.placeId,
		users: putDto.users.map(user => userOnPseFormationDataPutDtoToApiObject(user, current.users.find(u => user.userId === u.userId), current.id))
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
		// TODO: how to make typescript PseFormationEntity with place / UserOnPseFormation etc?
		place: placeEntityToApiObject(entity.place),
		// can be null when loading list
		users: (entity.userOnPseFormations || []).map(userOnPseFormationEntityToApiObject)
	}
}

function stringToPseFormationStateApiEnum(state: string): PseFormationStateApiEnum {
	// TODO: enforce validity
	return state as PseFormationStateApiEnum
}
