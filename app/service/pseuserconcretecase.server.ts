import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type {
  PseConcreteCaseSituationApiObject,
  PseSituationConcreteCaseGroupApiObject
} from "~/apiobject/pseconcretecasesituation.apiobject";
import type { PseFormationApiObject } from "~/apiobject/pseformation.apiobject";
import type { PseUserSummaryConcreteCaseApiObject } from "~/apiobject/pseusersummary.apiobject";
import { buildPseUserConcreteCaseGroupEvaluation } from "~/helper/pseuserconcretecase.helper";
import { buildPseUserSummaryConcreteCase } from "~/helper/pseusersummary.hepler";
import {
  createOrUpdatePseUserConcreteCases,
  getPseUserConcreteCasesEntities,
  getPseUserConcreteCasesForGroupAndSituationEntities,
  getSelectedPseUserConcreteCaseEntities
} from "~/repository/pseuserconcretecase.repository";
import { getPseCompetences } from "~/service/psecompetence.server";
import type {
  PseUserConcreteCaseApiObject,
  PseUserConcreteCaseGroupEvaluationPostApiObject
} from "../apiobject/pseuserconcretecase.apiobject";
import {
  pseUserConcreteCaseEntityToApiObject,
  pseUserConcreteCaseGroupEvaluationPostApiObjectToPseUserConcreteCasePostEntities
} from "../mapper/pseuserconcretecase.mapper";

export async function getSelectedPseUserConcreteCases(formationId: string, userId: string): Promise<Array<PseUserConcreteCaseApiObject>> {
  const entities = await getSelectedPseUserConcreteCaseEntities(formationId, userId);
  return entities.map(pseUserConcreteCaseEntityToApiObject);
}

export async function getPseUserConcreteCases(formationId: string, userId: string): Promise<Array<PseUserConcreteCaseApiObject>> {
  const entities = await getPseUserConcreteCasesEntities(formationId, userId);
  return entities.map(pseUserConcreteCaseEntityToApiObject);
}

export async function getPseUserConcreteCasesResume(formationId: string, userId: string): Promise<PseUserSummaryConcreteCaseApiObject> {
  const pseUserConcreteCasesApiObject = await getPseUserConcreteCases(formationId, userId);
  const pseCompetences: Array<PseCompetenceApiObject> = await getPseCompetences();

  return buildPseUserSummaryConcreteCase(
    pseCompetences,
    pseUserConcreteCasesApiObject
  );
}

export async function updatePseUserConcreteCaseGroupEvaluation(pseUserConcreteCaseGroupEvaluationPostApiObject: PseUserConcreteCaseGroupEvaluationPostApiObject) {
  return await createOrUpdatePseUserConcreteCases(
    pseUserConcreteCaseGroupEvaluationPostApiObjectToPseUserConcreteCasePostEntities(pseUserConcreteCaseGroupEvaluationPostApiObject)
  );
}

export async function getPseUserConcreteCasesForGroupAndSituation(
  pseConcreteCaseGroupId: string,
  pseConcreteCaseSituationId: string
) {
  const pseUserConcreteCaseEntities = await getPseUserConcreteCasesForGroupAndSituationEntities(
    pseConcreteCaseGroupId,
    pseConcreteCaseSituationId
  );

  const pseUserConcreteCaseApiObjects: Array<PseUserConcreteCaseApiObject> = pseUserConcreteCaseEntities.map(pseUserConcreteCaseEntityToApiObject);

  console.log({
    pseUserConcreteCaseEntities
  });

  return pseUserConcreteCaseApiObjects;
}

export async function getPseUserConcreteCaseGroupEvaluation(
  pseFormation: PseFormationApiObject,
  pseConcreteCaseSession: PseConcreteCaseSessionApiObject,
  pseConcreteCaseSituation: PseConcreteCaseSituationApiObject,
  pseConcreteCaseGroup: PseConcreteCaseGroupApiObject,
  pseCompetences: Array<PseCompetenceApiObject>
) {
  const pseSituationConcreteCaseGroup:
    | PseSituationConcreteCaseGroupApiObject
    | undefined = pseConcreteCaseSituation.pseSituationConcreteCaseGroups.find(
    (obj) => obj.pseConcreteCaseGroupId === pseConcreteCaseGroup.id
  );

  if (!pseSituationConcreteCaseGroup) {
    throw new Error(`PseSituationConcreteCaseGroupApiObject not found for group ${pseConcreteCaseGroup.id}`);
  }

  const pseUserConcreteCaseApiObjects = await getPseUserConcreteCasesForGroupAndSituation(
    pseConcreteCaseGroup.id,
    pseConcreteCaseSituation.id
  );

  return buildPseUserConcreteCaseGroupEvaluation(
    pseFormation,
    pseConcreteCaseSession,
    pseConcreteCaseSituation,
    pseConcreteCaseGroup,
    pseSituationConcreteCaseGroup,
    pseUserConcreteCaseApiObjects,
    pseCompetences
  );
}
