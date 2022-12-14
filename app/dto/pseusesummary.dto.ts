import type { PseUserPreparatoryWorkDto } from "./pseformationpreparatorywork.dto";
import type { PseModuleDto } from "./psemodule.dto";
import type { PseUserTechniqueDto } from "./pseusertechnique.dto";
import type { PseCompetenceDto } from './psecompetence.dto';

export interface PseUserSummaryDto {
  formationId: string;
  userId: string;

  technique: PseUserSummaryTechniqueDto;
  preparatoryWork: PseUserSummaryPreparatoryWorkDto;
  concreteCase: PseUserSummaryConcreteCaseDto;

  hasValidatePse: boolean;
  hasValidatePse1: boolean;
}

export interface PseUserSummaryPreparatoryWorkDto {
  /**
   * Should be true to validate the PSE.
   */
  hasRealisedAllModules: boolean;

  preparatoryWorks: PseUserPreparatoryWorkDto[];
}

export interface PseUserSummaryTechniqueDto {
  /**
   * Must be true to validate the PSE.
   */
  hasAcquiredAllTechniques: boolean;
  /**
   * When the PSE is not validated, we can validate a PSE1, must be true to validate the PSE1.
   */
  hasAcquiredAllTechniquesToValidatePse1: boolean;

  userTechniques: Array<PseUserTechniqueDto>;

  nbAcquired: number;
  nbNotAcquired: number;

  nbAcquiredToValidatePse1: number;
  nbNotAcquiredToValidatePse1: number;
}

export interface PseUserSummaryConcreteCaseDto {
  concreteCaseModules: Array<PseUserSummaryConcreteCaseModuleDto>;
  // TODO: list of selected concreate cases
  hasAcquiredAllModules: boolean;
  hasAcquiredAllModulesForPse1: boolean;
}

export interface PseUserSummaryConcreteCaseModuleDto {
  pseModuleId: string;
  pseModule: PseModuleDto;

	competences: Array<PseUserSummaryConcreteCaseCompetenceDto>;

  hasAcquiredAllCompetences: boolean;
  hasAcquiredAllCompetencesForPse1: boolean;
  // TODO: list of selected concreate cases for module
}

export interface PseUserSummaryConcreteCaseCompetenceDto {
  pseCompetenceId: string;
  pseCompetence: PseCompetenceDto;
  acquired: boolean
  acquiredForPse1: boolean
}