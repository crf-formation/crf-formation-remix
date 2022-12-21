import type { PseConcreteCaseSituationApiObject, PseConcreteCaseSituationPostApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import { pseConcreteCaseSituationEntityToApiObject } from "~/mapper/pseconcretecasesituation.mapper";
import { createPseConcreteCaseSituationEntity } from "~/repository/pseconcretecasesituation.repository";

export async function createPseConcreteCaseSituation(apiObject: PseConcreteCaseSituationPostApiObject): Promise<PseConcreteCaseSituationApiObject> {
	const entity = await createPseConcreteCaseSituationEntity(apiObject)
	return pseConcreteCaseSituationEntityToApiObject(entity)
}
