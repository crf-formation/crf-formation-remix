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
  PseUserSummaryApiObject,
  PseUserSummaryConcreteCaseApiObject,
  PseUserSummaryPreparatoryWorkApiObject,
  PseUserSummaryTechniqueApiObject
} from "~/apiobject/pseusersummary.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import { loadAndBuildPseUserSummary } from "~/helper/pseusersummary.hepler";
import type { PseFormationApiObject } from "../apiobject/pseformation.apiobject";

export async function loadAndBuildPseSummary(
  formation: PseFormationApiObject
): Promise<PseSummaryApiObject> {
  const pseUserSummaries: Array<PseUserSummaryApiObject> = await Promise.all(formation.students.map(student =>
    loadAndBuildPseUserSummary(formation.id, student.id)
  ));

  const concreteCaseSummary = buildPseConcreteCaseSummary(
    formation.students,
    pseUserSummaries
  );

  const techniqueSummary = buildTechniqueSummary(
    formation.students,
    pseUserSummaries
  );

  const preparatoryWorkSummary = buildPeparatoryWorkSummary(
    formation.students,
    pseUserSummaries
  );

  const resultSummary = buildResultSummary(
    formation.students,
    pseUserSummaries
  );

  return {
    resultSummary,
    techniqueSummary,
    preparatoryWorkSummary,
    concreteCaseSummary
  };
}

function buildResultSummary(
  students: Array<UserApiObject>,
  pseUserSummaries: Array<PseUserSummaryApiObject>
): PseResultSummaryApiObject {
  const usersSummary = students.map((user) => {
    const pseUserSummary = pseUserSummaries.find(pseUserSummary => pseUserSummary.userId === user.id);

    if (!pseUserSummary) {
      throw new Error(`User summary not found for ${user.id}`);
    }

    return buildResultUserSummaryApiObject(
      user,
      pseUserSummary
    );
  });

  return {
    usersSummary
  };
}

function buildResultUserSummaryApiObject(
  user: UserApiObject,
  pseUserSummary: PseUserSummaryApiObject
): PseResultUserSummaryApiObject {
  return {
    user,
    hasValidatedPse: pseUserSummary.hasValidatedPse,
    hasValidatedPse1: pseUserSummary.hasValidatedPse1,
    hasValidatedTechniquesPse: pseUserSummary.technique.hasAcquiredAllTechniques,
    hasValidatedTechniquesPse1: pseUserSummary.technique.hasAcquiredAllTechniquesToValidatePse1,
    hasValidatedPrepratoryWork: pseUserSummary.preparatoryWork.hasRealisedAllModules
  };

}

function buildTechniqueSummary(
  students: Array<UserApiObject>,
  pseUserSummaries: Array<PseUserSummaryApiObject>
): PseTechniqueSummaryApiObject {
  const usersSummary = students.map((user) => {
    const pseUserSummary = pseUserSummaries.find(pseUserSummary => pseUserSummary.userId === user.id);

    if (!pseUserSummary) {
      throw new Error(`User summary not found for ${user.id}`);
    }

    return buildPseTechniqueUserSummaryApiObject(
      user,
      pseUserSummary.technique
    );
  });

  return {
    usersSummary
  };
}

function buildPseTechniqueUserSummaryApiObject(
  user: UserApiObject,
  technique: PseUserSummaryTechniqueApiObject
): PseTechniqueUserSummaryApiObject {
  return {
    user,
    technique: technique
  };
}

function buildPeparatoryWorkSummary(
  students: Array<UserApiObject>,
  pseUserSummaries: Array<PseUserSummaryApiObject>
): PsePreparatoryWorkSummaryApiObject {
  const usersSummary = students.map((user) => {
    const pseUserSummary = pseUserSummaries.find(pseUserSummary => pseUserSummary.userId === user.id);

    if (!pseUserSummary) {
      throw new Error(`User summary not found for ${user.id}`);
    }

    return buildPsePreparatoryWorkUserSummaryApiObject(
      user,
      pseUserSummary.preparatoryWork
    );
  });

  return {
    usersSummary
  };
}

function buildPsePreparatoryWorkUserSummaryApiObject(
  user: UserApiObject,
  preparatoryWork: PseUserSummaryPreparatoryWorkApiObject
): PsePreparatoryWorkUserSummaryApiObject {
  return {
    user,
    preparatoryWork: preparatoryWork
  };
}

function buildPseConcreteCaseSummary(
  students: Array<UserApiObject>,
  pseUserSummaries: Array<PseUserSummaryApiObject>
): PseConcreteCaseSummaryApiObject {
  const usersSummary = students.map((user) => {
    const pseUserSummary = pseUserSummaries.find(pseUserSummary => pseUserSummary.userId === user.id);

    if (!pseUserSummary) {
      throw new Error(`User summary not found for ${user.id}`);
    }

    return buildPseConcreteCaseUserSummaryApiObject(
      user,
      pseUserSummary.concreteCase
    );
  });

  return {
    usersSummary
  };
}

function buildPseConcreteCaseUserSummaryApiObject(
  user: UserApiObject,
  pseUserSummaryConcreteCase: PseUserSummaryConcreteCaseApiObject
): PseConcreteCaseUserSummaryApiObject {
  return {
    user,
    competencesSummary: pseUserSummaryConcreteCase.competencesSummary,
    hasAcquiredAll: pseUserSummaryConcreteCase.hasAcquiredAll,
    hasAcquiredAllForPse1: pseUserSummaryConcreteCase.hasAcquiredAllForPse1
  };
}
