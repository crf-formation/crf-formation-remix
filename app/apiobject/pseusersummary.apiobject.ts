import type { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';
import type { PseUserPreparatoryWorkApiObject } from "./pseformationpreparatorywork.apiobject";
import type { PseUserConcreteCaseApiObject } from './pseuserconcretecase.apiobject';
import type { PseUserTechniqueApiObject } from "./pseusertechnique.apiobject";

export interface PseUserSummaryApiObject {
  readonly formationId: string;
  readonly userId: string;

  readonly technique: PseUserSummaryTechniqueApiObject;
  readonly preparatoryWork: PseUserSummaryPreparatoryWorkApiObject;
  readonly concreteCase: PseUserSummaryConcreteCaseApiObject;

  readonly pseCompetences: Array<PseCompetenceApiObject>;

  readonly hasValidatedPse: boolean;
  readonly hasValidatedPse1: boolean;
}

export interface PseUserSummaryPreparatoryWorkApiObject {
  /**
   * Should be true to validate the PSE.
   */
  readonly hasRealisedAllModules: boolean;

  readonly preparatoryWorks: PseUserPreparatoryWorkApiObject[];
}

export interface PseUserSummaryTechniqueApiObject {
  /**
   * Must be true to validate the PSE.
   */
  readonly hasAcquiredAllTechniques: boolean;
  /**
   * When the PSE is not validated, we can validate a PSE1, must be true to validate the PSE1.
   */
  readonly hasAcquiredAllTechniquesToValidatePse1: boolean;

  readonly userTechniques: Array<PseUserTechniqueApiObject>;

  readonly nbAcquired: number;
  readonly nbNotAcquired: number;

  readonly nbAcquiredToValidatePse1: number;
  readonly nbNotAcquiredToValidatePse1: number;
}


export interface PseUserSummaryConcreteCaseApiObject {
  readonly userConcreteCases: Array<PseUserConcreteCaseApiObject>;

  readonly hasAcquiredAll: boolean;
  readonly hasAcquiredAllForPse1: boolean;

  // result of the competence for each modules
  readonly competencesSummary: Array<PseConcreteCaseCompetenceSummaryApiObject>;
}

export interface PseConcreteCaseCompetenceSummaryApiObject {
  readonly pseCompetenceId: string;
  readonly pseCompetence: PseCompetenceApiObject;

  readonly acquired: boolean
  readonly acquiredForPse1: boolean

	readonly nbA: number;
	readonly nbB: number;
	readonly nbC: number;
	readonly nbD: number;
	readonly nbNotEvalued: number;
	
	readonly nbAcquired: number; // nbA + nbB
	readonly nbNotAcquired: number; // nbC + nbD
	readonly nbTotal: number; // nbSucceed + nbFailed, we do not take nbNotEvalued

	readonly isInDifficulty: boolean;
}