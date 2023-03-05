import type { PseConcreteCaseTypeApiObject } from "~/apiobject/pseconcretecasetype.apiobject";
import type { PseConcreteCaseTypeDto } from "~/dto/pseconcretecasetype.dto";
import type { PseConcreteCaseTypeEntity } from "~/entity";
import { pseCompetenceApiObjectToDto, pseCompetenceEntityToApiObject } from "./psecompetence.mapper";


export function pseConcreteCaseTypeEntityToApiObject(entity: PseConcreteCaseTypeEntity): PseConcreteCaseTypeApiObject {
	return {
    id: entity.id,
    name: entity.name,
		// put directly the competence
    competencesToEvaluate: entity.competencesToEvaluate?.map(competenceToEvaluate => pseCompetenceEntityToApiObject(competenceToEvaluate.pseCompetence)),
  };
}

export function pseConcreteCaseTypeApiObjectToDto(apiObject: PseConcreteCaseTypeApiObject): PseConcreteCaseTypeDto {
	return {
		id: apiObject.id,
		name: apiObject.name,
		competencesToEvaluate: apiObject.competencesToEvaluate?.map(pseCompetenceApiObjectToDto)
	}
}
