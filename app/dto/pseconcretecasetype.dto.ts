import type { PseCompetenceDto } from "./psecompetence.dto";

// TODO: seed (cf ConcreteCaseType)
export interface PseConcreteCaseTypeDto {
	readonly id: string;
	readonly name: string;

	/**
	 * Not all competences can be evaluated. This list the competences to evaluate for 
	 * the concrete case type.
	 */
	readonly competencesToEvaluate: Array<PseCompetenceDto>
}