import type { PseConcreteCaseGroupEntity, PseUserConcreteCaseGroupStudentEntity } from "~/apiobject/entity";
import type { PseConcreteCaseGroupApiEnum, PseConcreteCaseGroupApiObject, PseUserConcreteCaseGroupStudentApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseGroupDto, PseConcreteCaseGroupDtoEnum, PseUserConcreteCaseGroupStudentDto } from "~/dto/pseconcretecasegroup.dto";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";

export function pseConcreteCaseGroupEntityToApiObject(entity: PseConcreteCaseGroupEntity): PseConcreteCaseGroupApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		name: entity.name,
		state: pseConcreteCaseGroupStringToApiEnum(entity.state),
		pseConcreteCaseSessionId: entity.pseConcreteCaseSessionId,
		students: entity.students.map(pseUserConcreteCaseGroupStudentEntityToApiObject),
	}
}

function pseConcreteCaseGroupStringToApiEnum(state: string): PseConcreteCaseGroupApiEnum {
	return state as PseConcreteCaseGroupApiEnum
}

function pseUserConcreteCaseGroupStudentEntityToApiObject(entity: PseUserConcreteCaseGroupStudentEntity): PseUserConcreteCaseGroupStudentApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		userId: entity.userId,
		user: entity.user && userEntityToApiObject(entity.user),
	}
}

export function pseConcreteCaseGroupApiObjectToDto(apiObject: PseConcreteCaseGroupApiObject): PseConcreteCaseGroupDto {
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt.toISOString(),
		updatedAt: apiObject.updatedAt.toISOString(),
		name: apiObject.name,
		state: pseConcreteCaseGroupApiEnumToDto(apiObject.state),
		pseConcreteCaseSessionId: apiObject.pseConcreteCaseSessionId,
		students: apiObject.students.map(pseUserConcreteCaseGroupStudentApiObjectToDto),
	}
}

function pseConcreteCaseGroupApiEnumToDto(state: string): PseConcreteCaseGroupDtoEnum {
	return state as PseConcreteCaseGroupDtoEnum
}

function pseUserConcreteCaseGroupStudentApiObjectToDto(apiObject: PseUserConcreteCaseGroupStudentApiObject): PseUserConcreteCaseGroupStudentDto {
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt.toISOString(),
		updatedAt: apiObject.updatedAt.toISOString(),
		userId: apiObject.userId,
		user: apiObject.user && userApiObjectToDto(apiObject.user),
	}
}