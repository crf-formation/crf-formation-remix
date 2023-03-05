import type { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';
import type { PseUserPreparatoryWorkApiObject } from "./pseformationpreparatorywork.apiobject";
import type { PseUserConcreteCaseApiObject } from './pseuserconcretecase.apiobject';
import type { PseUserTechniqueApiObject } from "./pseusertechnique.apiobject";

export interface PseUserSummaryApiObject {
  formationId: string;
  userId: string;

  technique: PseUserSummaryTechniqueApiObject;
  preparatoryWork: PseUserSummaryPreparatoryWorkApiObject;
  concreteCase: PseUserSummaryConcreteCaseApiObject;

  pseCompetences: Array<PseCompetenceApiObject>;

  hasValidatedPse: boolean;
  hasValidatedPse1: boolean;
}

export interface PseUserSummaryPreparatoryWorkApiObject {
  /**
   * Should be true to validate the PSE.
   */
  hasRealisedAllModules: boolean;

  preparatoryWorks: PseUserPreparatoryWorkApiObject[];
}

export interface PseUserSummaryTechniqueApiObject {
  /**
   * Must be true to validate the PSE.
   */
  hasAcquiredAllTechniques: boolean;
  /**
   * When the PSE is not validated, we can validate a PSE1, must be true to validate the PSE1.
   */
  hasAcquiredAllTechniquesToValidatePse1: boolean;

  userTechniques: Array<PseUserTechniqueApiObject>;

  nbAcquired: number;
  nbNotAcquired: number;

  nbAcquiredToValidatePse1: number;
  nbNotAcquiredToValidatePse1: number;
}


export interface PseUserSummaryConcreteCaseApiObject {
  userConcreteCases: Array<PseUserConcreteCaseApiObject>;

  hasAcquiredAll: boolean;
  hasAcquiredAllForPse1: boolean;

  // result of the competence for each modules
  competencesSummary: Array<PseConcreteCaseCompetenceSummaryApiObject>;
}

export interface PseConcreteCaseCompetenceSummaryApiObject {
  pseCompetenceId: string;
  pseCompetence: PseCompetenceApiObject;

  acquired: boolean
  acquiredForPse1: boolean

	nbA: number;
	nbB: number;
	nbC: number;
	nbD: number;
	nbNotEvalued: number;
	
	nbAcquired: number; // nbA + nbB
	nbNotAcquired: number; // nbC + nbD
	nbTotal: number; // nbSucceed + nbFailed, we do not take nbNotEvalued

	isInDifficulty: boolean;
}