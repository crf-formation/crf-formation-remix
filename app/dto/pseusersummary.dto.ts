import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseCompetenceDto } from "./psecompetence.dto";
import type { PseModuleDto } from "./psemodule.dto";
import type { PseUserConcreteCaseDto } from "./pseuserconcretecase.dto";
import type { PseUserPreparatoryWorkDto } from "./pseuserpreparatorywork.dto";
import type { PseUserTechniqueDto } from "./pseusertechnique.dto";

export interface PseUserSummaryDto {
  readonly formationId: string;
  readonly userId: string;

  readonly technique: PseUserSummaryTechniqueDto;
  readonly preparatoryWork: PseUserSummaryPreparatoryWorkDto;
  readonly concreteCase: PseUserSummaryConcreteCaseDto;

  readonly pseCompetences: Array<PseCompetenceDto>;

  readonly hasValidatedPse: boolean;
  readonly hasValidatedPse1: boolean;
}

export interface PseUserSummaryPreparatoryWorkDto {
  readonly hasRealisedAllModules: boolean;

  readonly preparatoryWorks: PseUserPreparatoryWorkDto[];
}

export interface PseUserSummaryTechniqueDto {
  readonly hasAcquiredAllTechniques: boolean;
  readonly hasAcquiredAllTechniquesToValidatePse1: boolean;

  readonly userTechniques: Array<PseUserTechniqueDto>;

  readonly nbAcquired: number;
  readonly nbNotAcquired: number;

  readonly nbAcquiredToValidatePse1: number;
  readonly nbNotAcquiredToValidatePse1: number;
}

export interface PseUserSummaryConcreteCaseDto {
  readonly userConcreteCases: Array<PseUserConcreteCaseDto>;

  // TODO: list of selected concreate cases
  readonly hasAcquiredAll: boolean;
  readonly hasAcquiredAllForPse1: boolean;

  readonly competencesSummary: Array<PseConcreteCaseCompetenceSummaryDto>;
}

export interface PseUserSummaryConcreteCaseModuleDto {
  readonly pseModuleId: string;
  readonly pseModule: PseModuleDto;

  readonly competencesSummary: Array<PseConcreteCaseCompetenceSummaryDto>;

  readonly hasAcquiredAllCompetences: boolean;
  readonly hasAcquiredAllCompetencesForPse1: boolean;
  // TODO: list of selected concreate cases for module
}

export interface PseConcreteCaseCompetenceSummaryDto {
  readonly pseCompetenceId: string;
  readonly pseCompetence: PseCompetenceApiObject;

  readonly acquired: boolean;
  readonly acquiredForPse1: boolean;

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