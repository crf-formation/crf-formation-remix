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
			place: true
		},
  });
}

export async function updatePseFormationEntity(id: string, pseFormationPutApiObject: PseFormationPutApiObject): Promise<PseFormationEntity> {
	return await prisma.pseFormation.update({
    data: pseFormationPutApiObject,
    where: {
      id,
    },
    include: {
      place: true,
    },
  });
}

export async function findPseFormationEntityById(id: string): Promise<Optional<PseFormationEntity>> {
	const pseFormationEntity = await prisma.pseFormation.findUnique({
    where: { id },
    include: {
      place: true,
    },
  });
  if (!pseFormationEntity) {
    return null;
  }
  return pseFormationEntity;
}

export async function findPseFormations(
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
