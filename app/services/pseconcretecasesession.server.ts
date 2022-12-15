import type { PseConcreteCaseSessionApiObject, PseConcreteCaseSessionPostApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { paginateEntityToApiObject } from "~/mapper/abstract.mapper";
import { pseConcreteCaseSessionEntityToApiObject } from "~/mapper/pseconcretecasesession.mapper";
import { createPseConcreteCaseSessionsEntity, findPseConcreteCaseSessionsEntityById, getPseConcreteCaseSessionEntitiesByFormationId } from "~/repository/pseconcretecasesession.repository";

export async function getFormationConcreteCaseSessions(
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

export async function findConcreteCaseSession(
  id: string
): Promise<Optional<PseConcreteCaseSessionApiObject>> {
  const pseConcreteCaseSessionEntity = await findPseConcreteCaseSessionsEntityById(id);
  if (!pseConcreteCaseSessionEntity) {
    return null;
  }
  return pseConcreteCaseSessionEntityToApiObject(pseConcreteCaseSessionEntity);
}


export async function createConcreteCaseSession(
	pseConcreteCaseSessionApiObject: PseConcreteCaseSessionPostApiObject
): Promise<PseConcreteCaseSessionApiObject> {
	// TODO: check a session does not exists with this name. 
	// TODO: make it unique per formation in database?

  const pseConcreteCaseSessionEntity = await createPseConcreteCaseSessionsEntity(pseConcreteCaseSessionApiObject);
  return pseConcreteCaseSessionEntityToApiObject(pseConcreteCaseSessionEntity);
}
