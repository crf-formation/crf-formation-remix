import type { PseCompetenceEntity } from "~/apiobject/entity";
import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";

export function pseCompetenceEntityToApiObject(apiObject: PseCompetenceEntity): PseCompetenceApiObject {
	return {
		id: apiObject.id,
	}
}

export function pseCompetenceApiObjectToDto(apiObject: PseCompetenceApiObject): PseCompetenceDto {
	return {
		id: apiObject.id,
	}
}