import type { PseUserConcreteCaseApiObject, PseUserConcreteCaseGroupEvaluationPostApiObject } from '../apiobject/pseuserconcretecase.apiobject';

export async function getSelectedPseUserConcreteCases(formationId: string, userId: string): Promise<Array<PseUserConcreteCaseApiObject>> {
	return [
	]
}


export async function getPseUserConcreteCases(formationId: string, userId: string): Promise<Array<PseUserConcreteCaseApiObject>> {
	return [
	]
}


export async function updatePseUserConcreteCaseGroupEvaluation(pseUserConcreteCaseGroupEvaluationPostApiObject: PseUserConcreteCaseGroupEvaluationPostApiObject) {

	console.log('updatePseUserConcreteCaseGroupPost ->')
	console.log(JSON.stringify(pseUserConcreteCaseGroupEvaluationPostApiObject))

}