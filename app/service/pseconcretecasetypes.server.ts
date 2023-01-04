import { findPseConcreteCaseTypes } from '~/repository/pseconcretecasetypes.repository';
import type { PseConcreteCaseTypeApiObject } from '../apiobject/pseconcretecasetype.apiobject';
import { pseConcreteCaseTypeEntityToApiObject } from '~/mapper/pseconcretecasetype.mapper';


export async function getPseConcreteCaseTypes(): Promise<Array<PseConcreteCaseTypeApiObject>> {
	const entities = await findPseConcreteCaseTypes()

	return entities.map(pseConcreteCaseTypeEntityToApiObject)
}