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

	pseConcreteCaseGroups: Array<PseConcreteCaseGroupDto>;
	pseConcreteCaseSituations: Array<PseConcreteCaseSituationDto>;

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

//
//
//

export interface  PseConcreteCaseSessionGroupOrderSituationDto {
  pseConcreteCaseSituation: PseConcreteCaseSituationDto;
  position: number;
}

export interface  PseConcreteCaseSessionGroupOrderDto {
  pseConcreteCaseGroup: PseConcreteCaseGroupDto;

  groupOrderSituations: Array<PseConcreteCaseSessionGroupOrderSituationDto>;

  duplicatedPositions: Array<PseConcreteCaseSessionGroupOrderSituationDto>;
  situationsWithoutPosition: Array<PseConcreteCaseSituationDto>;

	hasNoPositions: boolean
	hasSomeSituationsWithoutPosition: boolean
}