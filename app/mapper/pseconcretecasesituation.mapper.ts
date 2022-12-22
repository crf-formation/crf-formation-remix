import type { PseConcreteCaseSituationApiObject, PseConcreteCaseSituationPostApiObject, PseConcreteCaseSituationPutApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseConcreteCaseSituationDto, PseConcreteCaseSituationPostDto, PseConcreteCaseSituationPutDto } from "~/dto/pseconcretecasesituation.dto";
import type { PseConcreteCaseSituationEntity } from "~/entity";
import { pseConcreteCaseGroupApiObjectToDto, pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";
import { pseConcreteCaseTypeApiObjectToDto, pseConcreteCaseTypeEntityToApiObject } from "./pseconcretecasetype.mapper";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";


export function pseConcreteCaseSituationEntityToApiObject(entity: PseConcreteCaseSituationEntity): PseConcreteCaseSituationApiObject {
	console.log({ entity })
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		teacherId: entity.teacherId,
		pseConcreteCaseTypeId: entity.pseConcreteCaseTypeId,
		pseConcreteCaseSessionId: entity.pseConcreteCaseSessionId,
		teacher: entity.teacher && userEntityToApiObject(entity.teacher),
		pseConcreteCaseType: pseConcreteCaseTypeEntityToApiObject(entity.pseConcreteCaseType),
		pseConcreteCaseGroups: entity.pseConcreteCaseGroups?.map(pseConcreteCaseGroupEntityToApiObject),
	}
}

export function pseConcreteCaseSituationApiObjectToDto(apiObject: PseConcreteCaseSituationApiObject): PseConcreteCaseSituationDto {
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt.toISOString(),
		updatedAt: apiObject.updatedAt.toISOString(),
		teacherId: apiObject.teacherId,
		teacher: apiObject.teacher && userApiObjectToDto(apiObject.teacher),
		pseConcreteCaseType: pseConcreteCaseTypeApiObjectToDto(apiObject.pseConcreteCaseType),
		pseConcreteCaseGroups: apiObject.pseConcreteCaseGroups?.map(pseConcreteCaseGroupApiObjectToDto),
	}
}

export function pseConcreteCaseSituationPostDtoToApiObject(postDto: PseConcreteCaseSituationPostDto): PseConcreteCaseSituationPostApiObject {
	return {
		pseConcreteCaseSessionId: postDto.pseConcreteCaseSessionId,
		pseConcreteCaseTypeId: postDto.pseConcreteCaseTypeId,
		teacherId: postDto.teacherId,
		// TODO: pseConcreteCaseGroups
	}
}

export function pseConcreteCaseSituationPutDtoToApiObject(putDto: PseConcreteCaseSituationPutDto, pseConcreteCaseSessionId): PseConcreteCaseSituationPutApiObject {
	return {
		pseConcreteCaseSessionId,
		pseConcreteCaseTypeId: putDto.pseConcreteCaseTypeId,
		teacherId: putDto.teacherId,
		// TODO: pseConcreteCaseGroups
	}
}