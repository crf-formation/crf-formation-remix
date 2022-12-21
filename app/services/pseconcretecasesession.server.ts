import type { PseConcreteCaseSessionApiObject, PseConcreteCaseSessionPostApiObject, PseConcreteCaseSessionPutApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
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
  const pseConcreteCaseSessionEntity =
    await findPseConcreteCaseSessionsEntityById(id);
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
