import type { PseConcreteCaseSituationEntity } from "~/entity";
import type { PseConcreteCaseSituationApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseConcreteCaseSituationDto } from "~/dto/pseconcretecasesituation.dto";
import { pseConcreteCaseGroupEntityToApiObject } from "./pseconcretecasegroup.mapper";
import { userApiObjectToDto, userEntityToApiObject } from "./user.mapper";


export function pseConcreteCaseSituationEntityToApiObject(entity: PseConcreteCaseSituationEntity): PseConcreteCaseSituationApiObject {
	return {
		id: entity.id,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
		teacherId: entity.teacherId,
		teacher: userEntityToApiObject(entity.teacher),
		pseConcreteCaseType: pseConcreteCaseTypeEntityToApiObject(entity.pseConcreteCaseType),
		pseConcreteCaseGroups: entity.pseConcreteCaseGroups.map(pseConcreteCaseGroupEntityToApiObject),
	}
}

export function pseConcreteCaseSituationApiObjectToDto(entity: PseConcreteCaseSituationApiObject): PseConcreteCaseSituationDto {
	return {
		id: entity.id,
		createdAt: entity.createdAt.toISOString(),
		updatedAt: entity.updatedAt.toISOString(),
		teacherId: entity.teacherId,
		teacher: userApiObjectToDto(entity.teacher),
		pseConcreteCaseType: pseConcreteCaseTypeApiObjectToDto(entity.pseConcreteCaseType),
		pseConcreteCaseGroups: entity.pseConcreteCaseGroups.map(pseConcreteCaseGroupApiObjectToDto),
	}
}