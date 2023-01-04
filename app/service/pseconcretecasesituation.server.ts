import type { PseConcreteCaseSituationApiObject, PseConcreteCaseSituationPostApiObject, PseConcreteCaseSituationPutApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import { pseConcreteCaseSituationEntityToApiObject } from "~/mapper/pseconcretecasesituation.mapper";
import { createPseConcreteCaseSituationEntity, findPseConcreteCaseSituationEntity, getPseConcreteCaseSituationEntitiesForPseConcreteCaseSessionId, updatePseConcreteCaseSituationEntity } from "~/repository/pseconcretecasesituation.repository";
import { NotFoundException } from "./api.error";

export async function getPseConcreteCaseSituation(id: string): Promise<PseConcreteCaseSituationApiObject> {
	const entity = await findPseConcreteCaseSituationEntity(id)
	if (entity == null) {
		throw new NotFoundException('PseConcreteCaseSituationEntity', id)
  }
	return pseConcreteCaseSituationEntityToApiObject(entity)
}

export async function createPseConcreteCaseSituation(apiObject: PseConcreteCaseSituationPostApiObject): Promise<PseConcreteCaseSituationApiObject> {
	// TODO: check teacher is ok
	const entity = await createPseConcreteCaseSituationEntity(apiObject)
	return pseConcreteCaseSituationEntityToApiObject(entity)
}

export async function updatePseConcreteCaseSituation(id: string, apiObject: PseConcreteCaseSituationPutApiObject): Promise<PseConcreteCaseSituationApiObject> {
	// TODO: check teacher is ok
	const entity = await updatePseConcreteCaseSituationEntity(id, apiObject)
	return pseConcreteCaseSituationEntityToApiObject(entity)
}

export async function getPseConcreteCaseSituationsForPseConcreteCaseSessionId(pseConcreteCaseSessionId: string): Promise<Array<PseConcreteCaseSituationApiObject>> {
	const entities = await getPseConcreteCaseSituationEntitiesForPseConcreteCaseSessionId(pseConcreteCaseSessionId)
	return entities.map(pseConcreteCaseSituationEntityToApiObject)
}
