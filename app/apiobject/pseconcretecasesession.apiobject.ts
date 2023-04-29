import type { PseConcreteCaseGroupApiObject } from "./pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSituationApiObject } from "./pseconcretecasesituation.apiobject";


export type PseConcreteCaseSessionStateApiEnum = "CREATED" | "RUNNING" | "CLOSED";

export interface PseConcreteCaseSessionApiObject {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly name: string;
  readonly state: PseConcreteCaseSessionStateApiEnum;

  readonly pseConcreteCaseGroups: Array<PseConcreteCaseGroupApiObject>;
  readonly pseConcreteCaseSituations: Array<PseConcreteCaseSituationApiObject>;

  // not on database

  /**
   * requires situations, so we consider it as not configured if there no situations, nor groups.
   */
  readonly isConfigured: boolean;
}

export interface PseConcreteCaseSessionPostApiObject {
  readonly name: string;
  readonly state: PseConcreteCaseSessionStateApiEnum;
  readonly formationId: string;
}

export interface PseConcreteCaseSessionPutApiObject {
  readonly name: string;
  readonly state: PseConcreteCaseSessionStateApiEnum;
}

//
//
//

export interface PseConcreteCaseSessionGroupOrderApiObject {
  readonly pseConcreteCaseGroup: PseConcreteCaseGroupApiObject;

  readonly groupOrderSituations: Array<PseConcreteCaseSessionGroupOrderSituationApiObject>;

  readonly duplicatedPositions: Array<PseConcreteCaseSessionGroupOrderSituationApiObject>;
  readonly situationsWithoutPosition: Array<PseConcreteCaseSituationApiObject>;

  readonly hasNoPositions: boolean;
  readonly hasSomeSituationsWithoutPosition: boolean;
}

export interface PseConcreteCaseSessionGroupOrderSituationApiObject {
  readonly pseConcreteCaseSituation: PseConcreteCaseSituationApiObject;
  readonly position: number;
}
