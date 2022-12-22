import type { PseUserConcreteCaseApiObject, PseUserConcreteCaseCompetenceApiObject, PseUserConcreteCaseCompetenceGradeApiEnum, PseUserConcreteCaseRoleApiEnum, PseUserConcreteCaseStateApiEnum } from "~/apiobject/pseuserconcretecase.apiobject";
import type { PseUserConcreteCaseCompetenceDto, PseUserConcreteCaseCompetenceGradeDtoEnum, PseUserConcreteCaseDto, PseUserConcreteCaseStateDtoEnum } from "~/dto/pseuserconcretecase.dto";
import type { PseUserConcreteCaseCompetenceEntity, PseUserConcreteCaseEntity } from "~/entity";
import { pseCompetenceApiObjectToDto, pseCompetenceEntityToApiObject } from "./psecompetence.mapper";
import { pseConcreteCaseGroupApiObjectToDto, pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";
import { pseConcreteCaseTypeApiObjectToDto, pseConcreteCaseTypeEntityToApiObject } from "./pseconcretecasetype.mapper";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";

export function PseUserConcreteCaseEntityToApiObject(entity: PseUserConcreteCaseEntity): PseUserConcreteCaseApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		userId: entity.userId,
		user: entity.user && userEntityToApiObject(entity.user),

		// TODO: rename pseConcreteCaseGroup
		concreteCaseGroup: entity.concreteCaseGroup && pseConcreteCaseGroupEntityToApiObject(entity.concreteCaseGroup),
				// TODO: rename pseConcreteCaseType
		concreteCaseType: entity.concreteCaseType && pseConcreteCaseTypeEntityToApiObject(entity.concreteCaseType),

		state: pseUserConcreteCaseStateStringToApiEnum(entity.state),
		selected: entity.selected,

		competences: entity.competences?.map(pseUserConcreteCaseCompetenceEntityToApiObject),

		role: pseUserConcreteCaseRoleStringToApiEnum(entity.role),
	}
}

function pseUserConcreteCaseStateStringToApiEnum(state: string): PseUserConcreteCaseStateApiEnum {
	return state as PseUserConcreteCaseStateApiEnum
}

function pseUserConcreteCaseRoleStringToApiEnum(role: string): PseUserConcreteCaseRoleApiEnum {
	return role as PseUserConcreteCaseRoleApiEnum
}

function pseUserConcreteCaseCompetenceEntityToApiObject(entity: PseUserConcreteCaseCompetenceEntity): PseUserConcreteCaseCompetenceApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		pseCompetenceId: entity.pseCompetenceId,
		pseCompetence: pseCompetenceEntityToApiObject(entity.pseCompetence),
		grade: pseUserConcreteCaseCompetenceGradeStringToApiEnum(entity.grade),
	}
}

function pseUserConcreteCaseCompetenceGradeStringToApiEnum(grade: string): PseUserConcreteCaseCompetenceGradeApiEnum {
	return grade as PseUserConcreteCaseCompetenceGradeApiEnum
}

export function PseUserConcreteCaseApiObjectToDto(apiObject: PseUserConcreteCaseApiObject): PseUserConcreteCaseDto {
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt.toISOString(),
		updatedAt: apiObject.updatedAt.toISOString(),
		userId: apiObject.userId,
		user: apiObject.user && userApiObjectToDto(apiObject.user),
		concreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(apiObject.concreteCaseGroup),
		concreteCaseType: pseConcreteCaseTypeApiObjectToDto(apiObject.concreteCaseType),
		state: pseUserConcreteCaseStateApiEnumToDto(apiObject.state),
		selected: apiObject.selected,
		competences: apiObject.competences.map(pseUserConcreteCaseCompetenceApiObjectToDto),
		role: pseUserConcreteCaseRoleApiEnumToDtoEnum(apiObject.role),
	}
}

function pseUserConcreteCaseRoleApiEnumToDtoEnum(role: PseUserConcreteCaseRoleApiEnum): PseUserConcreteCaseRoleApiEnum {
	return role as PseUserConcreteCaseRoleApiEnum
}

function pseUserConcreteCaseStateApiEnumToDto(state: PseUserConcreteCaseStateApiEnum): PseUserConcreteCaseStateDtoEnum {
	return state as PseUserConcreteCaseStateApiEnum
}

function pseUserConcreteCaseCompetenceApiObjectToDto(dto: PseUserConcreteCaseCompetenceApiObject): PseUserConcreteCaseCompetenceDto {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt.toISOString(),
		pseCompetenceId: dto.pseCompetenceId,
		pseCompetence: pseCompetenceApiObjectToDto(dto.pseCompetence),
		grade: pseUserConcreteCaseCompetenceGradeApiEnumToDto(dto.grade),
	}
}

function pseUserConcreteCaseCompetenceGradeApiEnumToDto(grade: PseUserConcreteCaseCompetenceGradeApiEnum): PseUserConcreteCaseCompetenceGradeDtoEnum {
	return grade as PseUserConcreteCaseCompetenceGradeDtoEnum
}