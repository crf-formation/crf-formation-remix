import type {
  PseConcreteCaseSummaryApiObject,
  PseConcreteCaseUserSummaryApiObject,
  PsePreparatoryWorkSummaryApiObject,
  PsePreparatoryWorkUserSummaryApiObject,
  PseResultSummaryApiObject,
  PseResultUserSummaryApiObject,
  PseSummaryApiObject,
  PseTechniqueSummaryApiObject,
  PseTechniqueUserSummaryApiObject
} from "~/apiobject/psesummary.apiobject";
import type {
  PseConcreteCaseSummaryDto,
  PseConcreteCaseUserSummaryDto,
  PsePreparatoryWorkSummaryDto,
  PsePreparatoryWorkUserSummaryDto,
  PseResultSummaryDto,
  PseResultUserSummaryDto,
  PseSummaryDto,
  PseTechniqueSummaryDto,
  PseTechniqueUserSummaryDto
} from "~/dto/psesummary.dto";
import {
  pseConcreteCaseCompetenceSummaryApiObjectToDto,
  pseUserSummaryPreparatoryWorkApiObjectToDto,
  pseUserSummaryTechniqueApiObjectToDto
} from "~/mapper/pseusersummary.mapper";
import { userApiObjectToDto } from "~/mapper/user.mapper";

export function pseSummaryApiObjectToDto(pseSummaryApiObject: PseSummaryApiObject): PseSummaryDto {
  return {
    resultSummary: pseResultSummaryApiObjectToDto(pseSummaryApiObject.resultSummary),
    concreteCaseSummary: pseConcreteCaseSummaryApiObjectToDto(pseSummaryApiObject.concreteCaseSummary),
    techniqueSummary: pseTechniqueSummaryApiObjectToDto(pseSummaryApiObject.techniqueSummary),
    preparatoryWorkSummary: psePreparatoryWorkSummaryApiObjectToDto(pseSummaryApiObject.preparatoryWorkSummary)
  };
}

export function pseResultSummaryApiObjectToDto(pseResultSummaryApiObject: PseResultSummaryApiObject): PseResultSummaryDto {
  return {
    usersSummary: pseResultSummaryApiObject.usersSummary.map(pseResultUserSummaryApiObjectToDto)
  };
}

export function pseResultUserSummaryApiObjectToDto(pseResultUserSummaryApiObject: PseResultUserSummaryApiObject): PseResultUserSummaryDto {
  return {
    user: userApiObjectToDto(pseResultUserSummaryApiObject.user),
    hasValidatedPse: pseResultUserSummaryApiObject.hasValidatedPse,
    hasValidatedPse1: pseResultUserSummaryApiObject.hasValidatedPse1,
    hasValidatedTechniquesPse: pseResultUserSummaryApiObject.hasValidatedTechniquesPse,
    hasValidatedTechniquesPse1: pseResultUserSummaryApiObject.hasValidatedTechniquesPse1,
    hasValidatedConcreteCasePse: pseResultUserSummaryApiObject.hasValidatedConcreteCasePse,
    hasValidatedConcreteCasePse1: pseResultUserSummaryApiObject.hasValidatedConcreteCasePse1,
    hasValidatedPrepratoryWork: pseResultUserSummaryApiObject.hasValidatedPrepratoryWork
  };
}

export function pseTechniqueSummaryApiObjectToDto(pseTechniqueSummaryApiObject: PseTechniqueSummaryApiObject): PseTechniqueSummaryDto {
  return {
    usersSummary: pseTechniqueSummaryApiObject.usersSummary.map(pseTechniqueUserSummaryApiObjectToDto)
  };
}

export function pseTechniqueUserSummaryApiObjectToDto(pseTechniqueUserSummaryApiObject: PseTechniqueUserSummaryApiObject): PseTechniqueUserSummaryDto {
  return {
    user: userApiObjectToDto(pseTechniqueUserSummaryApiObject.user),
    technique: pseUserSummaryTechniqueApiObjectToDto(pseTechniqueUserSummaryApiObject.technique)
  };
}

export function psePreparatoryWorkSummaryApiObjectToDto(psePreparatoryWorkSummaryApiObject: PsePreparatoryWorkSummaryApiObject): PsePreparatoryWorkSummaryDto {
  return {
    usersSummary: psePreparatoryWorkSummaryApiObject.usersSummary.map(psePreparatoryWorkUserSummaryApiObjectToDto)
  };
}

export function psePreparatoryWorkUserSummaryApiObjectToDto(psePreparatoryWorkUserSummaryApiObject: PsePreparatoryWorkUserSummaryApiObject): PsePreparatoryWorkUserSummaryDto {
  return {
    user: userApiObjectToDto(psePreparatoryWorkUserSummaryApiObject.user),
    preparatoryWork: pseUserSummaryPreparatoryWorkApiObjectToDto(psePreparatoryWorkUserSummaryApiObject.preparatoryWork)
  };
}

export function pseConcreteCaseSummaryApiObjectToDto(pseConcreteCaseSummaryApiObject: PseConcreteCaseSummaryApiObject): PseConcreteCaseSummaryDto {
  return {
    usersSummary: pseConcreteCaseSummaryApiObject.usersSummary.map(pseConcreteCaseUserSummaryApiObjectToDto)
  };
}

export function pseConcreteCaseUserSummaryApiObjectToDto(pseConcreteCaseUserSummaryApiObject: PseConcreteCaseUserSummaryApiObject): PseConcreteCaseUserSummaryDto {
  return {
    user: userApiObjectToDto(pseConcreteCaseUserSummaryApiObject.user),
    competencesSummary: pseConcreteCaseUserSummaryApiObject.competencesSummary.map(pseConcreteCaseCompetenceSummaryApiObjectToDto),
    hasAcquiredAll: pseConcreteCaseUserSummaryApiObject.hasAcquiredAll,
    hasAcquiredAllForPse1: pseConcreteCaseUserSummaryApiObject.hasAcquiredAllForPse1
  };
}
