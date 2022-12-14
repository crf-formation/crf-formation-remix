import type { PseUserPreparatoryWorkApiObject } from "./pseformationpreparatorywork.apiobject";
import type { PseModuleApiObject } from "./psemodule.apiobject";
import type { PseUserTechniqueApiObject } from "./pseusertechnique.apiobject";
import type { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';

export interface PseUserSummaryApiObject {
  formationId: string;
  userId: string;

  technique: PseUserSummaryTechniqueApiObject;
  preparatoryWork: PseUserSummaryPreparatoryWorkApiObject;
  concreteCase: PseUserSummaryConcreteCaseApiObject;

  pseCompetences: Array<PseCompetenceApiObject>;

  hasValidatePse: boolean;
  hasValidatePse1: boolean;
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
  concreteCaseModules: Array<PseUserSummaryConcreteCaseModuleApiObject>;
  // TODO: list of selected concreate cases
  hasAcquiredAllModules: boolean;
  hasAcquiredAllModulesForPse1: boolean;

  // result of the competence for each modules
  competenceResults: Array<ConcreteCaseCompetenceResultApiObject>;
}

export interface PseUserSummaryConcreteCaseModuleApiObject {
  pseModuleId: string;
  pseModule: PseModuleApiObject;

  // result of the competence for the current module
	competenceResults: Array<ConcreteCaseCompetenceResultApiObject>;

  hasAcquiredAllCompetences: boolean;
  hasAcquiredAllCompetencesForPse1: boolean;
  // TODO: list of selected concreate cases for module
}

export interface ConcreteCaseCompetenceResultApiObject {
  pseCompetenceId: string;
  pseCompetence: PseCompetenceApiObject;

  acquired: boolean
  acquiredForPse1: boolean
}