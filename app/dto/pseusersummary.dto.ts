import type { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';
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
  hasAcquiredAll: boolean;
  hasAcquiredAllForPse1: boolean;

  competencesSummary: Array<PseConcreteCaseCompetenceSummaryDto>;
}

export interface PseUserSummaryConcreteCaseModuleDto {
  pseModuleId: string;
  pseModule: PseModuleDto;

	competencesSummary: Array<PseConcreteCaseCompetenceSummaryDto>;

  hasAcquiredAllCompetences: boolean;
  hasAcquiredAllCompetencesForPse1: boolean;
  // TODO: list of selected concreate cases for module
}

export interface PseConcreteCaseCompetenceSummaryDto {
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