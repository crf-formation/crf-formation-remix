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
