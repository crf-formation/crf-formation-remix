import type { PseConcreteCaseTypeEntity } from "~/entity";
import type { PseConcreteCaseTypeApiObject } from "~/apiobject/pseconcretecasetype.apiobject";
import type { PseConcreteCaseTypeDto } from "~/dto/pseconcretecasetype.dto";
import { pseCompetenceApiObjectToDto } from "./psecompetence.mapper";


export function pseConcreteCaseTypeEntityToApiObject(entity: PseConcreteCaseTypeEntity): PseConcreteCaseTypeApiObject {
	return {
    id: entity.id,
    name: entity.name,
    competencesToEvaluate: entity.competencesToEvaluate.map(
      pseConcreteCaseTypeEntityToApiObject
    ),
  };
}

export function pseConcreteCaseTypeApiObjectToDto(apiObject: PseConcreteCaseTypeApiObject): PseConcreteCaseTypeDto {
	return {
		id: apiObject.id,
		name: apiObject.name,
		competencesToEvaluate: apiObject.competencesToEvaluate.map(pseCompetenceApiObjectToDto)
	}
}
