import type { PseFormationPostApiObject, PseFormationPutApiObject } from "~/apiobject/pseformation.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constant/types";
import { prisma } from "~/entity/db.server";
import type { PseFormationEntity } from "~/entity";
import { createPaginateObject } from "./abstract.repository";

const includeForSingleItem = {
  place: true,
  userOnPseFormations: {
    include: { 
      user: true
    }
  }, 
}

const includeForMultipleItem = {
  place: true,
}

export async function createPseFormationEntity(pseFormationPostApiObject: PseFormationPostApiObject): Promise<PseFormationEntity> {
  return await prisma.pseFormation.create({
    data: {
      ...pseFormationPostApiObject,
    },
		include: includeForSingleItem,
  });
}

export async function updatePseFormationEntity(
  id: string,
  pseFormationPutApiObject: PseFormationPutApiObject
): Promise<PseFormationEntity> {
  const { users, ...data } = pseFormationPutApiObject;

  return await prisma.$transaction<PseFormationEntity>(async (tx) => {
    // createMany is not supported by SQLite.
    // first delete existing
    await tx.userOnPseFormation.deleteMany({ where: { formationId: id } });

    // create new
    await Promise.all(
      users.map(async (user) => {
        return tx.userOnPseFormation.create({ data: user });
      })
    );

    // update
    return await tx.pseFormation.update({
      data: {
        ...data,
        // userOnPseFormations: {
        //   // createMany is not supported by SQLite.
        //   createMany: { data: users }
        // },
      },
      where: {
        id,
      },
      include: includeForSingleItem,
    });
  });
}

export async function findPseFormationEntityById(id: string): Promise<Optional<PseFormationEntity>> {
  return await prisma.pseFormation.findUnique({
    where: { id },
    include: includeForSingleItem,
  });
}

export async function findPseFormationEntityByPseConcreteCaseSessionId(pseConcreteCaseSessionId: string): Promise<Optional<PseFormationEntity>> {
  // TODO: better way?
  const pseConcreteCaseSessionEntity = await prisma.pseConcreteCaseSession.findUnique({
    where: {
      id: pseConcreteCaseSessionId
    },
    include: {
      formation: true
    }
  })

  if (!pseConcreteCaseSessionEntity) {
    return null;
  }

  // shortcut to load formation with the right includes
  return findPseFormationEntityById(pseConcreteCaseSessionEntity.formation.id);
  // return await prisma.pseFormation.findUnique({
  //   where: {
  //     pseConcreteCaseSessions: {
  //       select: {
  //         id: pseConcreteCaseSessionId
  //       }
  //     }
  //   },
  //   include: {
  //     place: true,
  //     userOnPseFormations: {
  //       include: {
  //         user: true,
  //       },
  //     },
  //   },
  // });
}

export async function findPseFormationEntities(
	page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection,
): Promise<PaginateObject<PseFormationEntity>> {
	return await createPaginateObject<PseFormationEntity>({
    model: prisma.pseFormation,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {},
		include: includeForMultipleItem,
  });
}

export async function findPseFormationForUserEntities(
  userId: string,
	page: number,
  pageSize: number,
  orderBy: string,
  orderByDirection: OrderByDirection,
): Promise<PaginateObject<PseFormationEntity>> {
	return await createPaginateObject<PseFormationEntity>({
    model: prisma.pseFormation,
    page,
    pageSize,
    orderBy,
    orderByDirection,
    where: {
      userOnPseFormations: { some: { userId } }
    },
		include: includeForMultipleItem,
  });
}

// TODO: feature - do not take the first one found but the one chosen by the user
export async function findCurrentPseFormationEntityForUser(userId: string): Promise<Optional<PseFormationEntity>> {
  const pseFormationPaginateObjectEntities = await findPseFormationForUserEntities(userId, 0, 1, "from", "desc");

  if (pseFormationPaginateObjectEntities.page.totalElements === 0) {
    return null
  }

  return pseFormationPaginateObjectEntities.data[0]
}
