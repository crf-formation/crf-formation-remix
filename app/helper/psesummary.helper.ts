import type { PseCompetenceApiObject } from "~/apiobject/psecompetence.apiobject";
import type { PseConcreteCaseSummaryApiObject, PseConcreteCaseUserSummaryApiObject, PseSummaryApiObject } from "~/apiobject/psesummary.apiobject";
import type { PseUserConcreteCaseApiObject } from "~/apiobject/pseuserconcretecase.apiobject";
import type { UserApiObject } from "~/apiobject/user.apiobject";
import { buildPseUserSummaryConcreteCase } from "~/helper/pseusersummary.hepler";
import { getPseCompetences } from "~/service/psecompetence.server";
import { getPseUserConcreteCases } from "~/service/pseuserconcretecase.server";
import type { PseFormationApiObject } from '../apiobject/pseformation.apiobject';

export async function loadAndBuildPseSummary(
	formation: PseFormationApiObject,
): Promise<PseSummaryApiObject> {
	const pseCompetences: Array<PseCompetenceApiObject> = await getPseCompetences();
	
	const concreteCaseSummary = await buildPseConcreteCaseSummary(
		formation.id, 
		formation.students, 
		pseCompetences
	)
	
	return {
		concreteCaseSummary
	}
}

async function buildPseConcreteCaseSummary(
	formationId: string,
	users: Array<UserApiObject>,
	pseCompetences: Array<PseCompetenceApiObject>, 
): Promise<PseConcreteCaseSummaryApiObject> {

	const usersSummary = await Promise.all(users.map(async (user) => {
		return buildPseConcreteCaseUserSummaryApiObject(formationId, user, pseCompetences)
  }));

	return {
		usersSummary
	}
}

async function buildPseConcreteCaseUserSummaryApiObject(
  formationId: string,
  user: UserApiObject,
	pseCompetences: Array<PseCompetenceApiObject>, 
): Promise<PseConcreteCaseUserSummaryApiObject> {
  // TODO: or getSelectedPseUserConcreteCases?
  const pseUserConcreateCases: Array<PseUserConcreteCaseApiObject> =await getPseUserConcreteCases(formationId, user.id);

  const pseUserSummaryConcreteCase = buildPseUserSummaryConcreteCase(pseCompetences, pseUserConcreateCases);

  return {
    user,
    competencesSummary: pseUserSummaryConcreteCase.competencesSummary,
		hasAcquiredAll: pseUserSummaryConcreteCase.hasAcquiredAll,
		hasAcquiredAllForPse1: pseUserSummaryConcreteCase.hasAcquiredAllForPse1,
  };
}
