import { prisma } from "~/db.server";
import type { PseConcreteCaseSessionEntity } from "~/entity";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { createPaginateObject } from "./abstract.repository";
import { PseConcreteCaseSessionPostApiObject } from "~/apiobject/pseconcretecasesession.apiobject";


export async function getPseConcreteCaseSessionEntitiesByFormationId(
  formationId: string,
  page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection
): Promise<PaginateObject<PseConcreteCaseSessionEntity>> {
  return await createPaginateObject<PseConcreteCaseSessionEntity>({
    model: prisma.pseConcreteCaseSession,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {
      formationId,
    },
    include: { groups: true, situations: true },
  });
}

export async function findPseConcreteCaseSessionsEntityById(
  id: string,
): Promise<Optional<PseConcreteCaseSessionEntity>> {
  return await prisma.pseConcreteCaseSession.findUnique({
    where: { id },
		include: { groups: true, situations: true },
  });
}

export async function createPseConcreteCaseSessionsEntity(
	pseConcreteCaseSessionApiObject: PseConcreteCaseSessionPostApiObject
): Promise<PseConcreteCaseSessionEntity> {
  return await prisma.pseConcreteCaseSession.create({
    data: {
      ...pseConcreteCaseSessionApiObject,
    },
    // will be empty
    include: { groups: true, situations: true },
  }); 
}