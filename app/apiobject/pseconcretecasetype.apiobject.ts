import type { PseCompetenceApiObject } from "./psecompetence.apiobject";

// TODO: seed (cf ConcreteCaseType)
export interface PseConcreteCaseTypeApiObject {
	id: string;
	name: string;

	/**
	 * Not all competences can be evaluated. This list the competences to evaluate for 
	 * the concrete case type.
	 */
	competencesToEvaluate: Array<PseCompetenceApiObject>
}