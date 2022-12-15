import type { PseConcreteCaseSituationDto } from "./psesituation.dto";
import type { PseConcreteCaseGroupDto } from './pseconcretecasegroup.dto';


export type PseConcreteCaseSessionStateDtoEnum = 'CREATED' | 'RUNNING' | 'CLOSED';

export interface PseConcreteCaseSessionDto {
	id: string;
	createdAt: DateISOString;
	updatedAt: DateISOString;

	name: string;
	state: PseConcreteCaseSessionStateDtoEnum;

	groups: Array<PseConcreteCaseGroupDto>;
	situations: Array<PseConcreteCaseSituationDto>;

	// not on database

	/**
	 * requires situations, so we consider it as not configured if there no situations, nor groups.
	 */
	isConfigured: boolean;
}