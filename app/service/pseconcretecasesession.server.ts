import type { PseConcreteCaseGroupApiObject } from "~/apiobject/pseconcretecasegroup.apiobject";
import type { PseConcreteCaseSessionApiObject, PseConcreteCaseSessionGroupOrderApiObject, PseConcreteCaseSessionPostApiObject, PseConcreteCaseSessionPutApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { PseConcreteCaseSituationApiObject } from "~/apiobject/pseconcretecasesituation.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constant/types";
import { buildPseConcreteCaseSituationsGroupsOrder } from "~/helper/pseconcretecasegrouporder.helper";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { pseConcreteCaseSessionEntityToApiObject } from "~/mapper/pseconcretecasesession.mapper";
import { createPseConcreteCaseSessionsEntity, findPseConcreteCaseSessionsEntityById, getPseConcreteCaseSessionEntitiesByFormationId, updatePseConcreteCaseSessionsEntity } from "~/repository/pseconcretecasesession.repository";

export async function getPseFormationConcreteCaseSessions(
	formationId: string,
	page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
	): Promise<PaginateObject<PseConcreteCaseSessionApiObject>> {
	const pseConcreteCaseSessionPaginateObjectEntities = await getPseConcreteCaseSessionEntitiesByFormationId(
		formationId,
		page,
		pageSize,
		orderBy,
		orderByDirection,
	)

	return paginateEntityToApiObject(pseConcreteCaseSessionPaginateObjectEntities, pseConcreteCaseSessionEntityToApiObject);
}

export async function getPseConcreteCaseSessionById(
  id: string
): Promise<PseConcreteCaseSessionApiObject> {
  const pseConcreteCaseSessionEntity = await findPseConcreteCaseSessionsEntityById(id);
  if (!pseConcreteCaseSessionEntity) {
    throw new Error(`Session not found: ${id}`);
  }
  return pseConcreteCaseSessionEntityToApiObject(pseConcreteCaseSessionEntity);
}


export async function createPseConcreteCaseSession(
	pseConcreteCaseSessionPostApiObject: PseConcreteCaseSessionPostApiObject
): Promise<PseConcreteCaseSessionApiObject> {
	// TODO: check a session does not exists with this name. 
	// TODO: make it unique per formation in database?

  const pseConcreteCaseSessionEntity = await createPseConcreteCaseSessionsEntity(pseConcreteCaseSessionPostApiObject);
  return pseConcreteCaseSessionEntityToApiObject(pseConcreteCaseSessionEntity);
}

export async function updatePseConcreteCaseSession(
	id: string,
	pseConcreteCaseSessionPutApiObject: PseConcreteCaseSessionPutApiObject
): Promise<PseConcreteCaseSessionApiObject> {
	// TODO: check a session does not exists with this name. 
	// TODO: make it unique per formation in database?

  const pseConcreteCaseSessionEntity = await updatePseConcreteCaseSessionsEntity(id, pseConcreteCaseSessionPutApiObject);
  return pseConcreteCaseSessionEntityToApiObject(pseConcreteCaseSessionEntity);
}

export function getPseConcreteCaseSituationsGroupsOrder(
	pseConcreteCaseGroups: Array<PseConcreteCaseGroupApiObject>, 
	pseConcreteCaseSituations: Array<PseConcreteCaseSituationApiObject>
): Array<PseConcreteCaseSessionGroupOrderApiObject> {
	return buildPseConcreteCaseSituationsGroupsOrder(pseConcreteCaseGroups, pseConcreteCaseSituations)
}