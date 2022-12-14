import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseCompetenceDto } from "~/dto/psecompetence.dto";

export function pseCompetenceApiObjectToDto(apiObject: PseCompetenceApiObject): PseCompetenceDto {
	return {
		id: apiObject.id,
	}
}