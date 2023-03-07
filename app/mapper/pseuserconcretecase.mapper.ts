import type { PseEvaluationCompetenceGradeApiObject, PseEvaluationCompetenceGradePostApiObject, PseUserConcreteCaseApiObject, PseUserConcreteCaseCompetenceApiObject, PseUserConcreteCaseCompetenceGradeApiEnum, PseUserConcreteCaseGroupEvaluationApiObject, PseUserConcreteCaseRoleApiEnum, PseUserConcreteCaseStateApiEnum, PseUserEvaluationApiObject, PseUserEvaluationPostApiObject } from "~/apiobject/pseuserconcretecase.apiobject";
import type { PseEvaluationCompetenceGradeDto, PseEvaluationCompetenceGradePostDto, PseUserConcreteCaseCompetenceDto, PseUserConcreteCaseCompetenceGradeDtoEnum, PseUserConcreteCaseDto, PseUserConcreteCaseGroupEvaluationDto, PseUserConcreteCaseGroupEvaluationPostDto, PseUserConcreteCaseRoleDtoEnum, PseUserConcreteCaseStateDtoEnum, PseUserEvaluationDto, PseUserEvaluationPostDto } from "~/dto/pseuserconcretecase.dto";
import type { PseUserConcreteCaseCompetenceEntity, PseUserConcreteCaseEntity } from "~/entity";
import type { PseUserConcreteCasePostEntity } from "~/entity/pseuserconcretecase.entity";
import type { PseUserConcreteCaseGroupEvaluationPostApiObject } from '../apiobject/pseuserconcretecase.apiobject';
import { pseCompetenceApiObjectToDto, pseCompetenceEntityToApiObject } from "./psecompetence.mapper";
import { pseConcreteCaseGroupApiObjectToDto, pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";
import { pseConcreteCaseSituationApiObjectToDto, pseConcreteCaseSituationEntityToApiObject } from './pseconcretecasesituation.mapper';
import { userApiObjectToDto, userEntityToApiObject } from './user.mapper';

export function pseUserConcreteCaseEntityToApiObject(entity: PseUserConcreteCaseEntity): PseUserConcreteCaseApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		userId: entity.userId,
		user: entity.user && userEntityToApiObject(entity.user),

		// we do not want to keep pseSituationConcreteCaseGroup that is juste here to link
		// with the group and situation
		pseConcreteCaseGroup: entity.pseSituationConcreteCaseGroup?.pseConcreteCaseGroup && pseConcreteCaseGroupEntityToApiObject(entity.pseSituationConcreteCaseGroup.pseConcreteCaseGroup),
		pseConcreteCaseSituation: entity.pseSituationConcreteCaseGroup?.pseConcreteCaseSituation && pseConcreteCaseSituationEntityToApiObject(entity.pseSituationConcreteCaseGroup.pseConcreteCaseSituation),

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

export function pseUserConcreteCaseApiObjectToDto(apiObject: PseUserConcreteCaseApiObject): PseUserConcreteCaseDto {
	return {
		id: apiObject.id,
		createdAt: apiObject.createdAt.toISOString(),
		updatedAt: apiObject.updatedAt.toISOString(),
		userId: apiObject.userId,
		user: apiObject.user && userApiObjectToDto(apiObject.user),
		pseConcreteCaseGroup: pseConcreteCaseGroupApiObjectToDto(apiObject.pseConcreteCaseGroup),
		pseConcreteCaseSituation: pseConcreteCaseSituationApiObjectToDto(apiObject.pseConcreteCaseSituation),
		state: pseUserConcreteCaseStateApiEnumToDto(apiObject.state),
		selected: apiObject.selected,
		competences: apiObject.competences.map(pseUserConcreteCaseCompetenceApiObjectToDto),
		role: pseUserConcreteCaseRoleApiEnumToDtoEnum(apiObject.role),
	}
}

function pseUserConcreteCaseRoleApiEnumToDtoEnum(role: PseUserConcreteCaseRoleApiEnum): PseUserConcreteCaseRoleDtoEnum {
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

// --

export function pseUserConcreteCaseGroupEvaluationApiObjectToDto(pseUserConcreteCaseGroupEvaluationApiObject: PseUserConcreteCaseGroupEvaluationApiObject): PseUserConcreteCaseGroupEvaluationDto {
	return {
		formationId: pseUserConcreteCaseGroupEvaluationApiObject.formationId,
		pseConcreteCaseSituationId: pseUserConcreteCaseGroupEvaluationApiObject.pseConcreteCaseSituationId,
		pseConcreteCaseGroupId: pseUserConcreteCaseGroupEvaluationApiObject.pseConcreteCaseGroupId,
		pseConcreteCaseSessionId: pseUserConcreteCaseGroupEvaluationApiObject.pseConcreteCaseSessionId,
		pseConcreteCaseTypeId: pseUserConcreteCaseGroupEvaluationApiObject.pseConcreteCaseTypeId,
		pseSituationConcreteCaseGroupId: pseUserConcreteCaseGroupEvaluationApiObject.pseSituationConcreteCaseGroupId,
		competencesToEvaluate: pseUserConcreteCaseGroupEvaluationApiObject.competencesToEvaluate,
		usersGrades: pseUserConcreteCaseGroupEvaluationApiObject.usersGrades.map(pseUserConcreteCaseUserGradesApiObjectToDto),
		students: pseUserConcreteCaseGroupEvaluationApiObject.students.map(userApiObjectToDto),
	}
}

function pseUserConcreteCaseUserGradesApiObjectToDto(pseUserConcreteCaseUserGradesApiObject: PseUserEvaluationApiObject): PseUserEvaluationDto {
	return {
		userId: pseUserConcreteCaseUserGradesApiObject.userId,
		role:  pseUserConcreteCaseUserGradesApiObject.role,
		grades: pseUserConcreteCaseUserGradesApiObject.grades.map(pseUserConcreteCaseGradeApiObjectToDto),
	}
}

function pseUserConcreteCaseGradeApiObjectToDto(pseUserConcreteCaseGradeApiObject: PseEvaluationCompetenceGradeApiObject): PseEvaluationCompetenceGradeDto {
	return {
		pseCompetenceId: pseUserConcreteCaseGradeApiObject.pseCompetenceId,
		grade: pseUserConcreteCaseGradeApiObject.grade,
		shouldEvaluate: pseUserConcreteCaseGradeApiObject.shouldEvaluate
	}
}

// --

export function pseUserConcreteCaseGroupEvaluationPostDtoToApiObject(pseUserConcreteCaseGroupEvaluationPostDto: PseUserConcreteCaseGroupEvaluationPostDto): PseUserConcreteCaseGroupEvaluationPostApiObject {
	return {
		formationId: pseUserConcreteCaseGroupEvaluationPostDto.formationId,
		pseConcreteCaseSituationId: pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseSituationId,
		pseConcreteCaseGroupId: pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseGroupId,
		pseConcreteCaseSessionId: pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseSessionId,
		pseConcreteCaseTypeId: pseUserConcreteCaseGroupEvaluationPostDto.pseConcreteCaseTypeId,
		pseSituationConcreteCaseGroupId: pseUserConcreteCaseGroupEvaluationPostDto.pseSituationConcreteCaseGroupId,
		usersGrades: pseUserConcreteCaseGroupEvaluationPostDto.usersGrades.map(pseUserGradesEvaluationPostApiObjectToDto),
	}

}

function pseUserGradesEvaluationPostApiObjectToDto(pseUserGradesEvaluationPostApiObject: PseUserEvaluationPostApiObject): PseUserEvaluationPostDto {
	return {
		userId: pseUserGradesEvaluationPostApiObject.userId,
		role:  pseUserGradesEvaluationPostApiObject.role,
		grades: pseUserGradesEvaluationPostApiObject.grades.map(PseEvaluationCompetenceGradePostApiObjectToDto),
	}
}

function PseEvaluationCompetenceGradePostApiObjectToDto(pseEvaluationCompetenceGradePostApiObject: PseEvaluationCompetenceGradePostApiObject): PseEvaluationCompetenceGradePostDto {
	return {
		pseCompetenceId: pseEvaluationCompetenceGradePostApiObject.pseCompetenceId,
		grade: pseEvaluationCompetenceGradePostApiObject.grade,
	}
}

// -- 

export function pseUserConcreteCaseGroupEvaluationPostApiObjectToPseUserConcreteCasePostEntities(
	pseUserConcreteCaseGroupEvaluationPostApiObject: PseUserConcreteCaseGroupEvaluationPostApiObject
) {
	return pseUserConcreteCaseGroupEvaluationPostApiObject.usersGrades.map(
		(userGrades) =>
			toPseUserConcreteCasePostEntity(
				pseUserConcreteCaseGroupEvaluationPostApiObject.pseSituationConcreteCaseGroupId,
				userGrades
			)
	)
}

function toPseUserConcreteCasePostEntity(
	pseSituationConcreteCaseGroupId: string,
	userEvaluation: PseUserEvaluationPostApiObject
): PseUserConcreteCasePostEntity {
	return {
		userId: userEvaluation.userId,
		pseSituationConcreteCaseGroupId: pseSituationConcreteCaseGroupId,
		role: userEvaluation.role,
		grades: userEvaluation.grades.map(competenceGrade => ({
			grade: competenceGrade.grade,
			pseCompetenceId: competenceGrade.pseCompetenceId,
		}))
	}
}