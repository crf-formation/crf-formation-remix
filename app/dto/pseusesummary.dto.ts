import type { PseCompetenceDto } from './psecompetence.dto';
import type { PseUserPreparatoryWorkDto } from "./pseformationpreparatorywork.dto";
import type { PseModuleDto } from "./psemodule.dto";
import type { PseUserConcreteCaseDto } from './pseuserconcretecase.dto';
import type { PseUserTechniqueDto } from "./pseusertechnique.dto";

export interface PseUserSummaryDto {
  formationId: string;
  userId: string;

  technique: PseUserSummaryTechniqueDto;
  preparatoryWork: PseUserSummaryPreparatoryWorkDto;
  concreteCase: PseUserSummaryConcreteCaseDto;

  pseCompetences: Array<PseCompetenceDto>;

  hasValidatePse: boolean;
  hasValidatePse1: boolean;
}

export interface PseUserSummaryPreparatoryWorkDto {
  hasRealisedAllModules: boolean;

  preparatoryWorks: PseUserPreparatoryWorkDto[];
}

export interface PseUserSummaryTechniqueDto {
  hasAcquiredAllTechniques: boolean;
  hasAcquiredAllTechniquesToValidatePse1: boolean;

  userTechniques: Array<PseUserTechniqueDto>;

  nbAcquired: number;
  nbNotAcquired: number;

  nbAcquiredToValidatePse1: number;
  nbNotAcquiredToValidatePse1: number;
}

export interface PseUserSummaryConcreteCaseDto {
  userConcreteCases: Array<PseUserConcreteCaseDto>;

  // TODO: list of selected concreate cases
  hasAcquiredAllModules: boolean;
  hasAcquiredAllModulesForPse1: boolean;

  competenceResults: Array<ConcreteCaseCompetenceResultDto>;
}

export interface PseUserSummaryConcreteCaseModuleDto {
  pseModuleId: string;
  pseModule: PseModuleDto;

	competenceResults: Array<ConcreteCaseCompetenceResultDto>;

  hasAcquiredAllCompetences: boolean;
  hasAcquiredAllCompetencesForPse1: boolean;
  // TODO: list of selected concreate cases for module
}

export interface ConcreteCaseCompetenceResultDto {
  pseCompetenceId: string;
  pseCompetence: PseCompetenceDto;
  acquired: boolean
  acquiredForPse1: boolean
}