import { z } from "zod";
import type { PseConcreteCaseGroupDto } from "./pseconcretecasegroup.dto";
import type { PseConcreteCaseSituationDto } from "./pseconcretecasesituation.dto";

export const PseConcreteCaseSessionStateDtoZEnum = z.enum(["CREATED", "RUNNING", "CLOSED"]);

export type PseConcreteCaseSessionStateDtoEnum = z.infer<typeof PseConcreteCaseSessionStateDtoZEnum>

export interface PseConcreteCaseSessionDto {
  readonly id: string;
  readonly createdAt: DateISOString;
  readonly updatedAt: DateISOString;

  readonly name: string;
  readonly state: PseConcreteCaseSessionStateDtoEnum;
  readonly stateLabel: string;

  readonly pseConcreteCaseGroups: Array<PseConcreteCaseGroupDto>;
  readonly pseConcreteCaseSituations: Array<PseConcreteCaseSituationDto>;

  // not on database

  /**
   * requires situations, so we consider it as not configured if there no situations, nor groups.
   */
  readonly isConfigured: boolean;
}

export interface PseConcreteCaseSessionPostDto {
  readonly formationId: string;
  readonly name: string;
}

export interface PseConcreteCaseSessionPutDto {
  readonly name: string;
  readonly state: PseConcreteCaseSessionStateDtoEnum;
}

//
//
//

export interface PseConcreteCaseSessionGroupOrderSituationDto {
  readonly pseConcreteCaseSituation: PseConcreteCaseSituationDto;
  readonly position: number;
}

export interface PseConcreteCaseSessionGroupOrderDto {
  readonly pseConcreteCaseGroup: PseConcreteCaseGroupDto;

  readonly groupOrderSituations: Array<PseConcreteCaseSessionGroupOrderSituationDto>;

  readonly duplicatedPositions: Array<PseConcreteCaseSessionGroupOrderSituationDto>;
  readonly situationsWithoutPosition: Array<PseConcreteCaseSituationDto>;

  readonly hasNoPositions: boolean;
  readonly hasSomeSituationsWithoutPosition: boolean;
}