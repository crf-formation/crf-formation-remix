import type { PseConcreteCaseSituationEntity } from "~/entity";
import type { PseConcreteCaseSituationApiObject, PseConcreteCaseSituationPostApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseConcreteCaseSituationDto, PseConcreteCaseSituationPostDto } from "~/dto/pseconcretecasesituation.dto";
import { pseConcreteCaseGroupApiObjectToDto, pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";
import { pseConcreteCaseTypeEntityToApiObject, pseConcreteCaseTypeApiObjectToDto } from "./pseconcretecasetype.mapper";


export function pseConcreteCaseSituationEntityToApiObject(entity: PseConcreteCaseSituationEntity): PseConcreteCaseSituationApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		teacherId: entity.teacherId,
		teacher: entity.teacher && userEntityToApiObject(entity.teacher),
		pseConcreteCaseType: entity.pseConcreteCaseType && pseConcreteCaseTypeEntityToApiObject(entity.pseConcreteCaseType),
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
		pseConcreteCaseType: apiObject.pseConcreteCaseType && pseConcreteCaseTypeApiObjectToDto(apiObject.pseConcreteCaseType),
		pseConcreteCaseGroups: apiObject.pseConcreteCaseGroups?.map(pseConcreteCaseGroupApiObjectToDto),
	}
}

export function pseConcreteCaseSituationPostDtoToApiObject(postDto: PseConcreteCaseSituationPostDto): PseConcreteCaseSituationPostApiObject {
	return {
		pseConcreteCaseSessionId: postDto.pseConcreteCaseSessionId,
		pseConcreteCaseTypeId: postDto.pseConcreteCaseTypeId,
		teacherId: postDto.teacherId,
	}
}