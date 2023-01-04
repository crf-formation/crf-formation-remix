import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";
import type { PseCompetenceEntity } from "~/entity";

export function pseCompetenceEntityToApiObject(entity: PseCompetenceEntity): PseCompetenceApiObject {
	return {
		id: entity.id,
		description: entity.description,
	}
}

export function pseCompetenceApiObjectToDto(apiObject: PseCompetenceApiObject): PseCompetenceDto {
	return {
		id: apiObject.id,
		description: apiObject.description,
	}
}
