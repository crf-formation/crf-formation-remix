import type {
  PseConcreteCaseCompetenceSummaryDto,
  PseUserSummaryPreparatoryWorkDto,
  PseUserSummaryTechniqueDto
} from "~/dto/pseusersummary.dto";
import type { UserDto } from "./user.dto";

export interface PseSummaryDto {
  readonly resultSummary: PseResultSummaryDto;
  readonly concreteCaseSummary: PseConcreteCaseSummaryDto;
  readonly techniqueSummary: PseTechniqueSummaryDto,
  readonly preparatoryWorkSummary: PsePreparatoryWorkSummaryDto,
}

export interface PseResultSummaryDto {
  readonly usersSummary: Array<PseResultUserSummaryDto>;
}

export interface PseResultUserSummaryDto {
  readonly user: UserDto;
  readonly hasValidatedPse: boolean;
  readonly hasValidatedPse1: boolean;
  readonly hasValidatedTechniquesPse: boolean;
  readonly hasValidatedTechniquesPse1: boolean;
  readonly hasValidatedConcreteCasePse: boolean;
  readonly hasValidatedConcreteCasePse1: boolean;
  readonly hasValidatedPrepratoryWork: boolean;
}

export interface PseTechniqueSummaryDto {
  readonly usersSummary: Array<PseTechniqueUserSummaryDto>;
}

export interface PseTechniqueUserSummaryDto {
  readonly user: UserDto;
  readonly technique: PseUserSummaryTechniqueDto;
}

export interface PsePreparatoryWorkSummaryDto {
  readonly usersSummary: Array<PsePreparatoryWorkUserSummaryDto>;
}

export interface PsePreparatoryWorkUserSummaryDto {
  readonly user: UserDto;
  readonly preparatoryWork: PseUserSummaryPreparatoryWorkDto;
}

export interface PseConcreteCaseSummaryDto {
  readonly usersSummary: Array<PseConcreteCaseUserSummaryDto>;
}

export interface PseConcreteCaseUserSummaryDto {
  readonly user: UserDto;
  readonly competencesSummary: Array<PseConcreteCaseCompetenceSummaryDto>;
  readonly hasAcquiredAll: boolean;
  readonly hasAcquiredAllForPse1: boolean;
}
