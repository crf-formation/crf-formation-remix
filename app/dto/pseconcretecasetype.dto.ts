import type { PseCompetenceDto } from "./psecompetence.dto";

// TODO: seed (cf ConcreteCaseType)
export interface PseConcreteCaseTypeDto {
	id: string;
	name: string;

	/**
	 * Not all competences can be evaluated. This list the competences to evaluate for 
	 * the concrete case type.
	 */
	competencesToEvaluate: Array<PseCompetenceDto>
}