import { prisma } from "~/db.server";
import type { PseFormationEntity } from "~/apiobject/entity";
import type { PseFormationPostApiObject, PseFormationPutApiObject } from "~/apiobject/pseformation.apiobject";
import type { OrderByDirection, PaginateObject } from "~/constants/types";
import { createPaginateObject, prepareChildrenRequest } from "./abstract.repository";
import { UserOnPseFormationPutApiObject } from "~/apiobject/useronpseformation.apiobject";

export async function createPseFormationEntity(pseFormationPostApiObject: PseFormationPostApiObject): Promise<PseFormationEntity> {
  return await prisma.pseFormation.create({
    data: {
      ...pseFormationPostApiObject,
    },
		include: {
			place: true,
      UserOnPseFormation: {
        include: { 
          user: true
        }
      }, 
		},
  });
}

export async function updatePseFormationEntity(id: string, pseFormationPutApiObject: PseFormationPutApiObject): Promise<PseFormationEntity> {
  const { users, ...data } = pseFormationPutApiObject

  console.log({ users, id, data })

  // TODO: transaction
  // await prisma.$transaction(async (tx) => {

    // createMany is not supported by SQLite.
    // first delete existing
    await prisma.userOnPseFormation.deleteMany({ where: { formationId: id } });

    // create new
    // await Promise.all(users.map(async (user) => {
    //   // remove null id from the create
    //   const { id, ...data } = user
    //   return prisma.userOnPseFormation.create({ data: { ...data, } }) 
    // }));

    await prisma.userOnPseFormation.create({ data: users[0] }) 

    // update
    return await prisma.pseFormation.update({
      data: {
        ...data,
        // UserOnPseFormation: {
        //   // createMany is not supported by SQLite.
        //   createMany: { data: users }
        // },
      },
      where: {
        id,
      },
      include: {
        place: true,
        UserOnPseFormation: {
          include: {
            user: true,
          },
        },
      },
    });
  // });
}

export async function findPseFormationEntityById(id: string): Promise<Optional<PseFormationEntity>> {
	const pseFormationEntity = await prisma.pseFormation.findUnique({
    where: { id },
    include: {
      place: true,
      UserOnPseFormation: {
        include: { 
          user: true
        }
      }, 
    },
  });
  if (!pseFormationEntity) {
    return null;
  }
  return pseFormationEntity;
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
      UserOnPseFormation: { some: { userId } }
    },
		include: {
      place: true,
    },
  });
}

