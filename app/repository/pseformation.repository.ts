import { prisma } from "~/db.server";
import type { PseFormationEntity } from "~/apiobject/entity";
import type { PseFormationPostApiObject, PseFormationPutApiObject } from "~/apiobject/pseformation.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { createPaginateObject } from "./abstract.repository";

export async function createPseFormationEntity(pseFormationPostApiObject: PseFormationPostApiObject): Promise<PseFormationEntity> {
  return await prisma.pseFormation.create({
    data: {
      ...pseFormationPostApiObject,
    },
		include: {
			place: true,
      userOnPseFormations: {
        include: { 
          user: true
        }
      }, 
		},
  });
}

export async function updatePseFormationEntity(id: string, pseFormationPutApiObject: PseFormationPutApiObject): Promise<PseFormationEntity> {
  const { users, ...data } = pseFormationPutApiObject

  // TODO: transaction
  // await prisma.$transaction(async (tx) => {

    // createMany is not supported by SQLite.
    // first delete existing
    await prisma.userOnPseFormation.deleteMany({ where: { formationId: id } });

    // create new
    await Promise.all(users.map(async (user) => {
      return prisma.userOnPseFormation.create({ data: user }) 
    }));

    // update
    return await prisma.pseFormation.update({
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
      include: {
        place: true,
        userOnPseFormations: {
          include: {
            user: true,
          },
        },
      },
    });
  // });
}

export async function findPseFormationEntityById(id: string): Promise<Optional<PseFormationEntity>> {
  return await prisma.pseFormation.findUnique({
    where: { id },
    include: {
      place: true,
      userOnPseFormations: {
        include: {
          user: true,
        },
      },
    },
  });
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
		include: {
      place: true,
    },
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
		include: {
      place: true,
    },
  });
}

// TODO: feature - do not take the first one found but the one chosen by the user
export async function findCurrentPseFormationEntityForUser(userId: string) {
  const pseFormationPaginateObjectEntities = await findPseFormationForUserEntities(userId, 0, 1, "from", "desc");

  if (pseFormationPaginateObjectEntities.page.totalElements === 0) {
    return null
  }

  return pseFormationPaginateObjectEntities.data[0]
}