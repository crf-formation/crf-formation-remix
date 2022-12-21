import { prisma } from "~/db.server";
import type { PseConcreteCaseSessionEntity } from "~/entity";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { createPaginateObject } from "./abstract.repository";
import type { PseConcreteCaseSessionPostApiObject, PseConcreteCaseSessionPutApiObject } from "~/apiobject/pseconcretecasesession.apiobject";

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
    include: {
      groups: { include: { 
        students: { include: { user: true } } } 
      },
      situations: {
        include: {
          pseConcreteCaseGroups: { include: { pseConcreteCaseGroup: true } },
          teacher: true,
                    pseConcreteCaseType: true
        },
      },
    },
  });
}

export async function findPseConcreteCaseSessionsEntityById(
  id: string
): Promise<Optional<PseConcreteCaseSessionEntity>> {
  return await prisma.pseConcreteCaseSession.findUnique({
    where: { id },
    include: {
      groups: { include: { students: { include: { user: true } } } },
      situations: {
        include: {
          pseConcreteCaseGroups: { include: { pseConcreteCaseGroup: true } },
          teacher: true,
          pseConcreteCaseType: true,
        },
      },
    },
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
    include: {
      groups: { include: { students: { include: { user: true } } } },
      situations: {
        include: {
          pseConcreteCaseGroups: { include: { pseConcreteCaseGroup: true } },
          teacher: true,
          pseConcreteCaseType: true,
        },
      },
    },
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
    include: {
      groups: { include: { students: { include: { user: true } } } },
      situations: {
        include: {
          pseConcreteCaseGroups: { include: { pseConcreteCaseGroup: true } },
          teacher: true,
          pseConcreteCaseType: true
        },
      },
    },
  });
}
