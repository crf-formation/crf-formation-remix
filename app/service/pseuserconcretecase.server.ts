import { PseCompetenceApiObject } from '~/apiobject/psecompetence.apiobject';
import { PseConcreteCaseGroupApiObject } from '~/apiobject/pseconcretecasegroup.apiobject';
import { PseConcreteCaseSessionApiObject } from '~/apiobject/pseconcretecasesession.apiobject';
import { PseConcreteCaseSituationApiObject, PseSituationConcreteCaseGroupApiObject } from '~/apiobject/pseconcretecasesituation.apiobject';
import { PseFormationApiObject } from '~/apiobject/pseformation.apiobject';
import { buildPseUserConcreteCaseGroupEvaluation } from '~/helper/pseuserconcretecase.helper';
import { createOrUpdatePseUserConcreteCases, getPseUserConcreteCasesEntities, getSelectedPseUserConcreteCaseEntities } from '~/repository/pseuserconcretecase.repository';
import type { PseUserConcreteCaseApiObject, PseUserConcreteCaseGroupEvaluationPostApiObject } from '../apiobject/pseuserconcretecase.apiobject';
import { mapPseUserConcreteCaseGroupEvaluationPostApiObjectToPseUserConcreteCasePostEntities, pseUserConcreteCaseEntityToApiObject } from '../mapper/pseuserconcretecase.mapper';

export async function getSelectedPseUserConcreteCases(formationId: string, userId: string): Promise<Array<PseUserConcreteCaseApiObject>> {
	const entities = await getSelectedPseUserConcreteCaseEntities(formationId, userId)
	return entities.map(pseUserConcreteCaseEntityToApiObject)
}


export async function getPseUserConcreteCases(formationId: string, userId: string): Promise<Array<PseUserConcreteCaseApiObject>> {
	const entities = await getPseUserConcreteCasesEntities(formationId, userId)
	return entities.map(pseUserConcreteCaseEntityToApiObject)
}

export async function updatePseUserConcreteCaseGroupEvaluation(pseUserConcreteCaseGroupEvaluationPostApiObject: PseUserConcreteCaseGroupEvaluationPostApiObject) {

	console.log('updatePseUserConcreteCaseGroupPost ->')
	console.log(JSON.stringify(pseUserConcreteCaseGroupEvaluationPostApiObject))

	return await createOrUpdatePseUserConcreteCases(
		mapPseUserConcreteCaseGroupEvaluationPostApiObjectToPseUserConcreteCasePostEntities(pseUserConcreteCaseGroupEvaluationPostApiObject)
  );
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
		throw new Error(`PseSituationConcreteCaseGroupApiObject not found for group ${pseConcreteCaseGroup.id}`)
	}

	return buildPseUserConcreteCaseGroupEvaluation(
		pseFormation,
		pseConcreteCaseSession,
		pseConcreteCaseSituation,
		pseConcreteCaseGroup,
		pseSituationConcreteCaseGroup,
		pseCompetences,
  )
}
