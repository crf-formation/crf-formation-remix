import type { PseCompetenceApiObject } from "./psecompetence.apiobject";

// TODO: seed (cf ConcreteCaseType)
export interface PseConcreteCaseTypeApiObject {
	readonly id: string;
	readonly name: string;

	/**
	 * Not all competences can be evaluated. This list the competences to evaluate for 
	 * the concrete case type.
	 */
	readonly competencesToEvaluate: Array<PseCompetenceApiObject>
}