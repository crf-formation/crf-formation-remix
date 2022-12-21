import type { PseConcreteCaseGroupDto } from './pseconcretecasegroup.dto';
import type { PseConcreteCaseSituationDto } from './pseconcretecasesituation.dto';


export type PseConcreteCaseSessionStateDtoEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

export interface PseConcreteCaseSessionDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;

	name: string;
	state: PseConcreteCaseSessionStateDtoEnum;
	stateLabel: string;

	groups: Array<PseConcreteCaseGroupDto>;
	situations: Array<PseConcreteCaseSituationDto>;

	// not on database

	/**
	 * requires situations, so we consider it as not configured if there no situations, nor groups.
	 */
	isConfigured: boolean;
}

export interface PseConcreteCaseSessionPostDto {
	formationId: string;
	name: string;
}

export interface PseConcreteCaseSessionPutDto {
	name: string;
	state: PseConcreteCaseSessionStateDtoEnum;
}
