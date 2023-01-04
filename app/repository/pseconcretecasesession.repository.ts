import type { PseConcreteCaseSessionPostApiObject, PseConcreteCaseSessionPutApiObject } from "~/apiobject/pseconcretecasesession.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constant/types";
import { prisma } from "~/db.server";
import type { PseConcreteCaseSessionEntity } from "~/entity";
import { createPaginateObject } from "./abstract.repository";

const includeForSingleItem = {
  groups: { include: { students: { include: { user: true } } } },
  situations: {
    include: {
      pseSituationConcreteCaseGroups: { include: { pseConcreteCaseGroup: true } },
      teacher: true,
      pseConcreteCaseType: true,
    },
  },
}

const includeForMultipleItem = {
  groups: { include: { students: { include: { user: true } } } },
  situations: {
    include: {
      teacher: true,
      pseConcreteCaseType: true,
    },
  },
}



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
    include: includeForMultipleItem,
  });
}

export async function findPseConcreteCaseSessionsEntityById(
  id: string
): Promise<Optional<PseConcreteCaseSessionEntity>> {
  return await prisma.pseConcreteCaseSession.findUnique({
    where: { id },
    include: includeForSingleItem,
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
    include: includeForSingleItem,
  });
}

export async function updatePseConcreteCaseSessionsEntity(
  id: string,
  pseConcreteCaseSessionPutApiObject: PseConcreteCaseSessionPutApiObject
): Promise<PseConcreteCaseSessionEntity> {
  return await prisma.pseConcreteCaseSession.update({
    data: {
      ...pseConcreteCaseSessionPutApiObject,
    },
    where: {
      id,
    },
    include: includeForSingleItem,
  });
}
